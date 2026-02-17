public long exportMillionChunksStreamed(Instant from, Instant to) throws IOException {
final int batchSize = 1_000_000;
BigInteger lastId = BigInteger.ZERO;

int fileNum = 1;
long total = 0;

while (true) {
BigInteger[] maxIdInThisFile = new BigInteger[]{null};
long[] count = new long[]{0};

Path file = Paths.get(appProperties.getCsvExportPath(),
String.format("txn_%02d_after_%s.csv", fileNum, lastId));

try (BufferedWriter bw = Files.newBufferedWriter(file, StandardCharsets.UTF_8);
CSVWriter writer = new CSVWriter(bw)) {

writer.writeNext(new String[]{"DW_TRANSACTION_ID", "ACCOUNT_REF"});

jdbcTemplate.query(con -> {
PreparedStatement ps = con.prepareStatement("""
SELECT t.DW_TRANSACTION_ID, t.INSTRUCTING_ACCOUNT_REF
FROM IPS_DW.T_TRANSACTION t
WHERE t.SWITCH_COMPLETED_TMSP BETWEEN ? AND ?
AND t.DW_TRANSACTION_ID > ?
ORDER BY t.DW_TRANSACTION_ID
FETCH FIRST ? ROWS ONLY
""");
ps.setTimestamp(1, Timestamp.from(from));
ps.setTimestamp(2, Timestamp.from(to));
ps.setBigDecimal(3, new java.math.BigDecimal(lastId)); // DB2 often likes BigDecimal
ps.setInt(4, batchSize);
ps.setFetchSize(10_000);
return ps;
}, rs -> {
BigInteger id = ((java.math.BigDecimal) rs.getObject(1)).toBigInteger();
String acct = rs.getString(2);

writer.writeNext(new String[]{id.toString(), acct});
maxIdInThisFile[0] = id;
count[0]++;
});
}

if (count[0] == 0) {
Files.deleteIfExists(file); // no rows -> delete empty file
break;
}

lastId = maxIdInThisFile[0];
total += count[0];
fileNum++;
}

return total;
}
