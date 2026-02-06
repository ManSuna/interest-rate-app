package org.tch.fwi.messaging.listeners;

import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

class FfsStatementQueueListenerTest {

private final FfsStatementQueueListener listener = new FfsStatementQueueListener();

@Test
void receiveAckMessage_readsText_andDoesNotThrow() throws Exception {
// Arrange
TextMessage textMessage = mock(TextMessage.class);
when(textMessage.getText()).thenReturn("HELLO");

// Act + Assert
assertDoesNotThrow(() -> listener.receiveAckMessage(textMessage));

// Verify the important behavior
verify(textMessage, times(1)).getText();
verifyNoMoreInteractions(textMessage);
}

@Test
void receiveAckMessage_whenGetTextThrowsJmsException_doesNotThrow() throws Exception {
// Arrange
TextMessage textMessage = mock(TextMessage.class);
when(textMessage.getText()).thenThrow(new JMSException("boom"));

// Act + Assert (method should catch JMSException)
assertDoesNotThrow(() -> listener.receiveAckMessage(textMessage));

verify(textMessage, times(1)).getText();
verifyNoMoreInteractions(textMessage);
}
}
