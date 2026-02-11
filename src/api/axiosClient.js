import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;

public int processRangeByDay(...) {
AtomicLong totalProcessed = new AtomicLong(0);

ScheduledExecutorService progress = Executors.newSingleThreadScheduledExecutor();
progress.scheduleAtFixedRate(() -> {
long count = totalProcessed.get();
log.info("Progress: totalProcessed={}", count);
}, 2, 2, TimeUnit.SECONDS); // start after 2s, then every 2s

try {
// your main processing loop
while (/* loop days */) {
int processedThisDay = processSingleDay(...); // whatever returns int
totalProcessed.addAndGet(processedThisDay);

// current = current.plusDays(1);
}

return (int) totalProcessed.get();
} finally {
progress.shutdownNow(); // stop reporter thread
}
}
