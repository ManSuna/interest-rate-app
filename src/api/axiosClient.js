import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.concurrent.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class Db2DeadlockReproService {

private final JdbcTemplate jdbcTemplate;

// Use fixed thread pool for reproducibility
private final ExecutorService exec = Executors.newFixedThreadPool(10);

// Query A: date range style (uses view currency like your prod)
private static final String SQL_A =
"""
SELECT txn.transaction_id, ccy.iso_character_code
FROM ips_dw_transaction txn
LEFT JOIN currency ccy ON ccy.code = txn.settling_currency_code
WHERE txn.switch_completed_tmstmp BETWEEN ? AND ?
AND (txn.instructing_bank_code = ? OR txn.instructed_bank_code = ?)
ORDER BY txn.dw_transaction_id
FETCH FIRST 200 ROWS ONLY
WITH UR
""";

// Query B: transaction id style
private static final String SQL_B =
"""
SELECT txn.transaction_id, ccy.iso_character_code
FROM ips_dw_transaction txn
LEFT JOIN currency ccy ON ccy.code = txn.settling_currency_code
WHERE txn.transaction_id = ?
WITH UR
""";

public void reproduce(int loops) {
Timestamp from = Timestamp.valueOf("2025-05-13 00:00:00");
Timestamp to = Timestamp.valueOf("2025-05-13 23:59:59");

String participantA = "0000000002A1";
String participantB = "0000000001A1";
String sampleTxnId = "20250513000000001A1B0070000002263262";

int deadlocks = 0;

for (int i = 1; i <= loops; i++) {
CompletableFuture<List<?>> f1 = CompletableFuture.supplyAsync(() ->
jdbcTemplate.queryForList(SQL_A, from, to, participantA, participantA), exec);

CompletableFuture<List<?>> f2 = CompletableFuture.supplyAsync(() ->
jdbcTemplate.queryForList(SQL_B, sampleTxnId), exec);

try {
CompletableFuture.allOf(f1, f2).join();
} catch (CompletionException ce) {
Throwable cause = ce.getCause();
if (cause instanceof DataAccessException dae && Db2LockUtil.isDeadlock(dae)) {
deadlocks++;
log.warn("DEADLOCK hit on iteration {} -> {}", i, dae.getMessage());
} else {
log.error("Non-deadlock failure on iteration " + i, cause);
throw ce;
}
}

if (i % 100 == 0) {
log.info("progress={} deadlocks={}", i, deadlocks);
}
}

log.info("DONE loops={} deadlocks={}", loops, deadlocks);
}
}
