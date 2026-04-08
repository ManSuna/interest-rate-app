import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.EnumMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MultiAppHealthTracker {

    private static final long TIMEOUT_MS = 30_000;

    private final Map<ExternalApp, AppHealthState> states = new ConcurrentHashMap<>();
    private final Map<String, ExternalApp> correlationToApp = new ConcurrentHashMap<>();

    public MultiAppHealthTracker() {
        for (ExternalApp app : ExternalApp.values()) {
            states.put(app, new AppHealthState());
        }
    }

    public String markPingSent(ExternalApp app) {
        String correlationId = UUID.randomUUID().toString();

        AppHealthState state = states.get(app);
        state.setStatus(HealthStatus.PENDING);
        state.setLastPingSentAt(Instant.now());
        state.setLastCorrelationId(correlationId);
        state.setLastError(null);

        correlationToApp.put(correlationId, app);
        return correlationId;
    }

    public void markResponseReceived(String correlationId) {
        ExternalApp app = correlationToApp.remove(correlationId);
        if (app == null) {
            return;
        }

        AppHealthState state = states.get(app);
        state.setStatus(HealthStatus.UP);
        state.setLastResponseAt(Instant.now());
        state.setLastError(null);
    }

    public void markFailure(ExternalApp app, String error) {
        AppHealthState state = states.get(app);
        state.setStatus(HealthStatus.DOWN);
        state.setLastError(error);
    }

    public Map<ExternalApp, AppHealthState> getAllStates() {
        evaluateTimeouts();
        return new EnumMap<>(states);
    }

    public AppHealthState getState(ExternalApp app) {
        evaluateTimeouts();
        return states.get(app);
    }

    private void evaluateTimeouts() {
        Instant now = Instant.now();

        for (Map.Entry<ExternalApp, AppHealthState> entry : states.entrySet()) {
            AppHealthState state = entry.getValue();

            if (state.getStatus() == HealthStatus.PENDING
                    && state.getLastPingSentAt() != null
                    && Duration.between(state.getLastPingSentAt(), now).toMillis() > TIMEOUT_MS) {
                state.setStatus(HealthStatus.DOWN);
                state.setLastError("Health check timeout");
            }
        }
    }
}


import java.time.Instant;

public class AppHealthState {
    private HealthStatus status = HealthStatus.UNKNOWN;
    private Instant lastPingSentAt;
    private Instant lastResponseAt;
    private String lastCorrelationId;
    private String lastError;

    public HealthStatus getStatus() { return status; }
    public void setStatus(HealthStatus status) { this.status = status; }

    public Instant getLastPingSentAt() { return lastPingSentAt; }
    public void setLastPingSentAt(Instant lastPingSentAt) { this.lastPingSentAt = lastPingSentAt; }

    public Instant getLastResponseAt() { return lastResponseAt; }
    public void setLastResponseAt(Instant lastResponseAt) { this.lastResponseAt = lastResponseAt; }

    public String getLastCorrelationId() { return lastCorrelationId; }
    public void setLastCorrelationId(String lastCorrelationId) { this.lastCorrelationId = lastCorrelationId; }

    public String getLastError() { return lastError; }
    public void setLastError(String lastError) { this.lastError = lastError; }
}

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.EnumMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MultiAppHealthTracker {

    private static final long TIMEOUT_MS = 30_000;

    private final Map<ExternalApp, AppHealthState> states = new ConcurrentHashMap<>();
    private final Map<String, ExternalApp> correlationToApp = new ConcurrentHashMap<>();

    public MultiAppHealthTracker() {
        for (ExternalApp app : ExternalApp.values()) {
            states.put(app, new AppHealthState());
        }
    }

    public String markPingSent(ExternalApp app) {
        String correlationId = UUID.randomUUID().toString();

        AppHealthState state = states.get(app);
        state.setStatus(HealthStatus.PENDING);
        state.setLastPingSentAt(Instant.now());
        state.setLastCorrelationId(correlationId);
        state.setLastError(null);

        correlationToApp.put(correlationId, app);
        return correlationId;
    }

    public void markResponseReceived(String correlationId) {
        ExternalApp app = correlationToApp.remove(correlationId);
        if (app == null) {
            return;
        }

        AppHealthState state = states.get(app);
        state.setStatus(HealthStatus.UP);
        state.setLastResponseAt(Instant.now());
        state.setLastError(null);
    }

    public void markFailure(ExternalApp app, String error) {
        AppHealthState state = states.get(app);
        state.setStatus(HealthStatus.DOWN);
        state.setLastError(error);
    }

    public Map<ExternalApp, AppHealthState> getAllStates() {
        evaluateTimeouts();
        return new EnumMap<>(states);
    }

    public AppHealthState getState(ExternalApp app) {
        evaluateTimeouts();
        return states.get(app);
    }

    private void evaluateTimeouts() {
        Instant now = Instant.now();

        for (Map.Entry<ExternalApp, AppHealthState> entry : states.entrySet()) {
            AppHealthState state = entry.getValue();

            if (state.getStatus() == HealthStatus.PENDING
                    && state.getLastPingSentAt() != null
                    && Duration.between(state.getLastPingSentAt(), now).toMillis() > TIMEOUT_MS) {
                state.setStatus(HealthStatus.DOWN);
                state.setLastError("Health check timeout");
            }
        }
    }
}

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class HealthCheckScheduler {

    private final MultiAppHealthTracker tracker;
    private final HealthCheckSender sender;

    public HealthCheckScheduler(MultiAppHealthTracker tracker, HealthCheckSender sender) {
        this.tracker = tracker;
        this.sender = sender;
    }

    @Scheduled(fixedDelay = 300000, initialDelay = 10000)
    public void runHealthChecks() {
        sendOne(ExternalApp.APP1);
        sendOne(ExternalApp.APP2);
        sendOne(ExternalApp.APP3);
    }

    private void sendOne(ExternalApp app) {
        String correlationId = tracker.markPingSent(app);
        try {
            sender.sendHealthCheck(app, correlationId);
        } catch (Exception e) {
            tracker.markFailure(app, "Send failed: " + e.getMessage());
        }
    }
}

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    private final MultiAppHealthTracker tracker;

    public HealthController(MultiAppHealthTracker tracker) {
        this.tracker = tracker;
    }

    @GetMapping("/api/external-health")
    public Map<ExternalApp, AppHealthState> getHealth() {
        return tracker.getAllStates();
    }
}


import jakarta.jms.Message;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class IncomingMessageListener {

    private final MultiAppHealthTracker tracker;

    public IncomingMessageListener(MultiAppHealthTracker tracker) {
        this.tracker = tracker;
    }

    @JmsListener(destination = "INCOMING.RESPONSE.Q")
    public void onMessage(Message message) throws Exception {
        String messageType = message.getStringProperty("messageType");

        if ("HEALTH_CHECK_RESPONSE".equals(messageType)) {
            String correlationId = message.getJMSCorrelationID();
            tracker.markResponseReceived(correlationId);
            return;
        }

        // normal message handling here
    }
}

