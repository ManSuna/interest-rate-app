@RestController
@RequestMapping("/fraud")
public class FraudExportController {

private final FraudExportService service;

public FraudExportController(FraudExportService service) {
this.service = service;
}

@PostMapping("/export")
public ResponseEntity<String> export(
@RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
@RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
@RequestParam("chunkDays") int chunkDays,
@RequestParam(value = "threads", defaultValue = "4") int threads
) {
service.exportInChunksParallel(
Timestamp.valueOf(from),
Timestamp.valueOf(to),
chunkDays,
threads
);
return ResponseEntity.ok("Started export");
}
}


public record TimeRange(Timestamp from, Timestamp to) {}

public final class ChunkUtil {
private ChunkUtil() {}

public static List<TimeRange> split(Timestamp fromTs, Timestamp toTs, int chunkDays) {
if (chunkDays <= 0) throw new IllegalArgumentException("chunkDays must be > 0");
Instant start = fromTs.toInstant();
Instant end = toTs.toInstant();
if (!start.isBefore(end)) throw new IllegalArgumentException("from must be < to");

Duration chunk = Duration.ofDays(chunkDays);
List<TimeRange> out = new ArrayList<>();
Instant cur = start;

while (cur.isBefore(end)) {
Instant next = cur.plus(chunk);
if (next.isAfter(end)) next = end;
out.add(new TimeRange(Timestamp.from(cur), Timestamp.from(next)));
cur = next;
}
return out;
}
}



@Service
public class FraudExportService {

private final TransactionJdbcTemplateRepository repo;

public FraudExportService(TransactionJdbcTemplateRepository repo) {
this.repo = repo;
}

public void exportInChunksParallel(Timestamp fromTs, Timestamp toTs, int chunkDays, int threads) {
List<TimeRange> ranges = ChunkUtil.split(fromTs, toTs, chunkDays);

ExecutorService pool = Executors.newFixedThreadPool(threads);

try {
List<Callable<Void>> tasks = ranges.stream()
.map(r -> (Callable<Void>) () -> {
exportOneChunk(r);
return null;
})
.toList();

// blocks until all chunks finish (or throws if one fails)
List<Future<Void>> futures = pool.invokeAll(tasks);
for (Future<Void> f : futures) {
f.get(); // propagate exceptions
}
} catch (InterruptedException ie) {
Thread.currentThread().interrupt();
throw new RuntimeException("Export interrupted", ie);
} catch (ExecutionException ee) {
throw new RuntimeException("Chunk failed: " + ee.getCause().getMessage(), ee.getCause());
} finally {
pool.shutdownNow();
}
}

private void exportOneChunk(TimeRange r) {
// If you page by DW_TRANSACTION_ID within the chunk:
long lastId = 0L;

while (true) {
ExportBatchResult res = repo.exportOneFile(r.from(), r.to(), lastId);
if (res.rowsWritten() == 0) break;

lastId = res.lastDwTransactionId();
if (!res.hasMore()) break; // if you have this flag; otherwise rely on rowsWritten < pageSize
}
}
}



WHERE t.SWITCH_COMPLETED_TMSTMP >= ?
AND t.SWITCH_COMPLETED_TMSTMP < ?
AND t.DW_TRANSACTION_ID > ?
ORDER BY t.DW_TRANSACTION_ID
FETCH FIRST ? ROWS ONLY
