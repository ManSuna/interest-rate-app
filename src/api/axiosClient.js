package org.tch.fraud.accountproxy.export;

import com.opencsv.CSVWriter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Objects;

/**
* Streams transactions from DB2 using DW_TRANSACTION_ID keyset pagination
* and writes one CSV per batchSize rows (default 1,000,000).
*
* No loading 1M rows into memory.
*/
@Component
public class DwTransactionJdbcExporter {

private final JdbcTemplate jdbcTemplate;

public DwTransactionJdbcExporter(JdbcTemplate jdbcTemplate) {
this.jdbcTemplate = Objects.requireNonNull(jdbcTemplate);
}

/**
* Export rows into multiple CSV files, each containing up to batchSize rows.
*
* @return total rows written across all files
*/
public long exportInChunksByDwTransactionId(
Instant fromSwitchCompletedTs,
Instant toSwitchCompletedTs,
long startingDwTransactionId,
int batchSize,
Path exportDir
) throws IOException {

if (batchSize <= 0) throw new IllegalArgumentException("batchSize must be > 0");
Files.createDirectories(exportDir);

long lastId = startingDwTransactionId;
long grandTotal = 0;
int fileNum = 1;

while (true) {
ExportBatchResult result = exportOneFile(
fromSwitchCompletedTs,
toSwitchCompletedTs,
lastId,
batchSize,
exportDir,
fileNum
);

if (result.rowsWritten == 0) {
// delete empty file (optional)
if (result.filePath != null) Files.deleteIfExists(result.filePath);
break;
}

grandTotal += result.rowsWritten;
lastId = result.maxDwTransactionId;
fileNum++;
}

return grandTotal;
}

private ExportBatchResult exportOneFile(
Instant fromTs,
Instant toTs,
long lastId,
int batchSize,
Path exportDir,
int fileNum
) throws IOException {

final long startId = lastId + 1;

// temp file name first; we’ll rename after we know endId
Path tmpFile = exportDir.resolve(String.format("txn_%03d_after_%d.tmp.csv", fileNum, lastId));

final long[] count = {0};
final long[] maxId = {lastId};

try (BufferedWriter bw = Files.newBufferedWriter(
tmpFile,
StandardCharsets.UTF_8,
StandardOpenOption.CREATE,
StandardOpenOption.TRUNCATE_EXISTING
);
CSVWriter writer = new CSVWriter(bw)) {

// header
writer.writeNext(new String[] {
"DW_TRANSACTION_ID",
"SWITCH_COMPLETED_TMSP",
"INSTRUCTING_ACCOUNT_REF"
// add other columns you want here
});

jdbcTemplate.query(con -> {
PreparedStatement ps = con.prepareStatement("""
SELECT
t.DW_TRANSACTION_ID,
t.SWITCH_COMPLETED_TMSP,
t.INSTRUCTING_ACCOUNT_REF
FROM IPS_DW.T_TRANSACTION t
WHERE t.SWITCH_COMPLETED_TMSP BETWEEN ? AND ?
AND t.DW_TRANSACTION_ID > ?
ORDER BY t.DW_TRANSACTION_ID
FETCH FIRST ? ROWS ONLY
""");

ps.setTimestamp(1, Timestamp.from(fromTs));
ps.setTimestamp(2, Timestamp.from(toTs));
ps.setLong(3, lastId);
ps.setInt(4, batchSize);

// Helps DB2 streaming behavior (safe to leave)
ps.setFetchSize(10_000);
return ps;
}, (ResultSet rs) -> {
long id = rs.getLong(1);
Timestamp ts = rs.getTimestamp(2);
String acct = rs.getString(3);

writer.writeNext(new String[] {
String.valueOf(id),
String.valueOf(ts),
acct
});

count[0]++;
maxId[0] = id;

// optional: flush periodically so file grows during long runs
if (count[0] % 50_000 == 0) {
writer.flushQuietly();
}
});
}

if (count[0] == 0) {
return new ExportBatchResult(0, lastId, tmpFile);
}

// rename final file to include start/end id range
Path finalFile = exportDir.resolve(
String.format("txn_%03d_%d_%d.csv", fileNum, startId, maxId[0])
);
Files.move(tmpFile, finalFile, StandardCopyOption.REPLACE_EXISTING);

return new ExportBatchResult(count[0], maxId[0], finalFile);
}

private static class ExportBatchResult {
final long rowsWritten;
final long maxDwTransactionId;
final Path filePath;

private ExportBatchResult(long rowsWritten, long maxDwTransactionId, Path filePath) {
this.rowsWritten = rowsWritten;
this.maxDwTransactionId = maxDwTransactionId;
this.filePath = filePath;
}
}
}


  @Autowired
private DwTransactionJdbcExporter exporter;

public long runExport(Instant from, Instant to) throws IOException {
Path dir = Paths.get(appProperties.getCsvExportPath());

return exporter.exportInChunksByDwTransactionId(
from,
to,
0L, // starting dw_transaction_id
1_000_000, // batch size per file
dir
);
}
