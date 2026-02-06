package org.tch.fwi.messaging.listeners;

import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

class FfsAcksQueueListenerTest {

private FfsAckMessageProcessor ffsAckMessageProcessor;
private FfsAcksQueueListener listener;

@BeforeEach
void setUp() {
ffsAckMessageProcessor = mock(FfsAckMessageProcessor.class);
listener = new FfsAcksQueueListener(ffsAckMessageProcessor);
}

@Test
void receiveAckMessage_success_callsProcessorWithMessage() throws Exception {
// Arrange
TextMessage textMessage = mock(TextMessage.class);
when(textMessage.getText()).thenReturn("ACK_MESSAGE");

// Act + Assert
assertDoesNotThrow(() -> listener.receiveAckMessage(textMessage));

// Verify
verify(textMessage, times(1)).getText();
verify(ffsAckMessageProcessor, times(1)).process("ACK_MESSAGE");
verifyNoMoreInteractions(ffsAckMessageProcessor);
}

@Test
void receiveAckMessage_whenProcessorThrowsFfsMessageProcessorException_doesNotThrow() throws Exception {
// Arrange
TextMessage textMessage = mock(TextMessage.class);
when(textMessage.getText()).thenReturn("ACK_MESSAGE");

doThrow(new FfsMessageProcessorException("boom"))
.when(ffsAckMessageProcessor)
.process("ACK_MESSAGE");

// Act + Assert (method should catch it)
assertDoesNotThrow(() -> listener.receiveAckMessage(textMessage));

// Verify it attempted processing
verify(textMessage, times(1)).getText();
verify(ffsAckMessageProcessor, times(1)).process("ACK_MESSAGE");
}

@Test
void receiveAckMessage_whenGetTextThrowsJmsException_doesNotCallProcessor_andDoesNotThrow() throws Exception {
// Arrange
TextMessage textMessage = mock(TextMessage.class);
when(textMessage.getText()).thenThrow(new JMSException("no text"));

// Act + Assert
assertDoesNotThrow(() -> listener.receiveAckMessage(textMessage));

// Verify processor never called because message couldn't be read
verify(textMessage, times(1)).getText();
verifyNoInteractions(ffsAckMessageProcessor);
}
}
