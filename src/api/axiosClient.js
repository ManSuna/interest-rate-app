public final class Sqls {
private Sqls() {}

// Accounts: filter once, union-all, distinct once
public static final String FETCH_ACCOUNTS_SQL = """
WITH F AS (
SELECT INSTRUCTING_ACCOUNT_REF, INSTRUCTED_ACCOUNT_REF
FROM IPS_DW.T_TRANSACTION
WHERE SWITCH_COMPLETED_TSTMP >= ? AND SWITCH_COMPLETED_TSTMP < ?
)
SELECT DISTINCT ACCOUNT_REF
FROM (
SELECT INSTRUCTING_ACCOUNT_REF AS ACCOUNT_REF FROM F
UNION ALL
SELECT INSTRUCTED_ACCOUNT_REF AS ACCOUNT_REF FROM F
) X
WHERE ACCOUNT_REF IS NOT NULL
""";

// Routing: filter once, union-all, distinct once
public static final String FETCH_ROUTING_SQL = """
WITH F AS (
SELECT
INSTRUCTING_INSTITUTION_REF,
INSTRUCTED_INSTITUTION_REF,
SETTLING_DEBTOR_BANK_CODE,
SETTLING_CREDITOR_BANK_CODE
FROM IPS_DW.T_TRANSACTION
WHERE SWITCH_COMPLETED_TSTMP >= ? AND SWITCH_COMPLETED_TSTMP < ?
)
SELECT DISTINCT ROUTING_ID
FROM (
SELECT INSTRUCTING_INSTITUTION_REF AS ROUTING_ID FROM F
UNION ALL
SELECT INSTRUCTED_INSTITUTION_REF AS ROUTING_ID FROM F
UNION ALL
SELECT SETTLING_DEBTOR_BANK_CODE AS ROUTING_ID FROM F
UNION ALL
SELECT SETTLING_CREDITOR_BANK_CODE AS ROUTING_ID FROM F
) X
WHERE ROUTING_ID IS NOT NULL
""";

// Fast insert (requires UNIQUE index on key to avoid duplicates)
public static final String INSERT_ENC_ACCOUNT = """
INSERT INTO IPS_DW.T_ENC_ACCOUNT (ACCOUNT_REF, ENCRYPTED_ACCOUNT_REF, CREATED_DATE)
VALUES (?, ?, CURRENT_TIMESTAMP)
""";

public static final String INSERT_ENC_ROUTING = """
INSERT INTO IPS_DW.T_ENC_ROUTING (ROUTING_REF, ENCRYPTED_ROUTING_REF, CREATED_DATE)
VALUES (?, ?, CURRENT_TIMESTAMP)
""";
}


import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class BulkEncryptLoadRepository {

private final JdbcTemplate jdbcTemplate;
private final FastAesEncryptor encryptor;

// Tune these
private final int fetchSize = 10_000; // DB2 fetch size
private final int batchSize = 10_000; // insert batch size

public BulkEncryptLoadRepository(JdbcTemplate jdbcTemplate, FastAesEncryptor encryptor) {
this.jdbcTemplate = jdbcTemplate;
this.encryptor = encryptor;
this.jdbcTemplate.setFetchSize(fetchSize);
}

public long loadAccountsChunk(Timestamp fromTs, Timestamp toTs) {
return streamEncryptAndBatchInsert(
Sqls.FETCH_ACCOUNTS_SQL,
fromTs, toTs,
Sqls.INSERT_ENC_ACCOUNT,
"ACCOUNT_REF"
);
}

public long loadRoutingChunk(Timestamp fromTs, Timestamp toTs) {
return streamEncryptAndBatchInsert(
Sqls.FETCH_ROUTING_SQL,
fromTs, toTs,
Sqls.INSERT_ENC_ROUTING,
"ROUTING_ID"
);
}

private long streamEncryptAndBatchInsert(
String fetchSql,
Timestamp fromTs,
Timestamp toTs,
String insertSql,
String colName
) {
List<String> refs = new ArrayList<>(batchSize);
List<String> encs = new ArrayList<>(batchSize);

final long[] processed = {0};

jdbcTemplate.query(con -> {
PreparedStatement ps = con.prepareStatement(
fetchSql,
ResultSet.TYPE_FORWARD_ONLY,
ResultSet.CONCUR_READ_ONLY
);
ps.setFetchSize(fetchSize);
ps.setTimestamp(1, fromTs);
ps.setTimestamp(2, toTs);
return ps;
}, rs -> {
while (rs.next()) {
String ref = rs.getString(colName);
if (ref == null || ref.isBlank()) continue;

String enc = encryptor.encrypt(ref);

refs.add(ref);
encs.add(enc);
processed[0]++;

if (refs.size() >= batchSize) {
batchInsert(insertSql, refs, encs);
refs.clear();
encs.clear();
}
}
});

if (!refs.isEmpty()) {
batchInsert(insertSql, refs, encs);
}

return processed[0];
}

private void batchInsert(String sql, List<String> refs, List<String> encs) {
jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
@Override
public void setValues(PreparedStatement ps, int i) throws SQLException {
ps.setString(1, refs.get(i));
ps.setString(2, encs.get(i));
}

@Override
public int getBatchSize() {
return refs.size();
}
});
}
}
