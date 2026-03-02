public long streamEncryptAndBatchInsert(
String fetchSql,
String insertSql,
Timestamp fromTs,
Timestamp toTs,
String colName,
int fetchSize,
int batchSize
) {

List<String> refs = new ArrayList<>(batchSize);
List<String> encs = new ArrayList<>(batchSize);

final long[] processed = {0};

jdbcTemplate.query(connection -> {

PreparedStatement ps = connection.prepareStatement(
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

if (ref == null || ref.isBlank()) {
continue;
}

String enc;
try {
enc = encDecWithAES.encrypt(ref);
} catch (Exception e) {
throw new RuntimeException("Encryption failed", e);
}

refs.add(ref);
encs.add(enc);
processed[0]++;

if (refs.size() >= batchSize) {
flush(insertSql, refs, encs);
}
}
});

flush(insertSql, refs, encs);

return processed[0];
}

private void flush(String insertSql, List<String> refs, List<String> encs) {

if (refs.isEmpty()) return;

jdbcTemplate.batchUpdate(insertSql, new BatchPreparedStatementSetter() {

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

refs.clear();
encs.clear();
}







