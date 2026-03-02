import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

@Service
public class BulkEncryptLoadService {

private static final Logger log = LoggerFactory.getLogger(BulkEncryptLoadService.class);

private final BulkEncryptLoadRepository repo;

// Tune
private final int threads = 6; // start with 4–8
private final Duration chunkSize = Duration.ofDays(14);

public BulkEncryptLoadService(BulkEncryptLoadRepository repo) {
this.repo = repo;
}

public void runFullLoad(LocalDateTime from, LocalDateTime to, boolean loadAccounts, boolean loadRouting) throws InterruptedException {
List<TimeChunk> chunks = splitIntoChunks(from, to, chunkSize);

ExecutorService pool = Executors.newFixedThreadPool(threads);
CompletionService<ChunkResult> cs = new ExecutorCompletionService<>(pool);

log.info("Starting load: chunks={}, threads={}, from={}, to={}", chunks.size(), threads, from, to);

int submitted = 0;
for (TimeChunk c : chunks) {
cs.submit(() -> processChunk(c, loadAccounts, loadRouting));
submitted++;
}

long totalAccounts = 0;
long totalRouting = 0;

for (int i = 0; i < submitted; i++) {
try {
ChunkResult r = cs.take().get();
totalAccounts += r.accounts;
totalRouting += r.routing;
log.info("Chunk done {} -> {} | accounts={}, routing={}, ms={}",
r.from, r.to, r.accounts, r.routing, r.millis);
} catch (ExecutionException e) {
pool.shutdownNow();
throw new RuntimeException("Chunk failed", e.getCause());
}
}

pool.shutdown();
pool.awaitTermination(1, TimeUnit.HOURS);

log.info("DONE. Total accounts={}, total routing={}", totalAccounts, totalRouting);
}

private ChunkResult processChunk(TimeChunk c, boolean loadAccounts, boolean loadRouting) {
long start = System.currentTimeMillis();

long accounts = 0;
long routing = 0;

Timestamp fromTs = Timestamp.valueOf(c.from);
Timestamp toTs = Timestamp.valueOf(c.to);

// Each chunk is independent; commits happen per batch in JDBC driver/DB
if (loadAccounts) accounts = repo.loadAccountsChunk(fromTs, toTs);
if (loadRouting) routing = repo.loadRoutingChunk(fromTs, toTs);

long ms = System.currentTimeMillis() - start;
return new ChunkResult(c.from, c.to, accounts, routing, ms);
}

private static List<TimeChunk> splitIntoChunks(LocalDateTime from, LocalDateTime to, Duration step) {
List<TimeChunk> out = new ArrayList<>();
LocalDateTime cur = from;
while (cur.isBefore(to)) {
LocalDateTime next = cur.plus(step);
if (next.isAfter(to)) next = to;
out.add(new TimeChunk(cur, next));
cur = next;
}
return out;
}

private record TimeChunk(LocalDateTime from, LocalDateTime to) {}
private record ChunkResult(LocalDateTime from, LocalDateTime to, long accounts, long routing, long millis) {}
}
