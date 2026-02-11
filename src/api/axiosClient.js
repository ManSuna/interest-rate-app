@Transactional
public int processRangeByDay(Timestamp fromInclusive,
Timestamp toInclusive) {

int totalProcessed = 0;

LocalDate startDate = fromInclusive.toInstant()
.atZone(ZoneId.systemDefault())
.toLocalDate();

LocalDate endDate = toInclusive.toInstant()
.atZone(ZoneId.systemDefault())
.toLocalDate();

LocalDate current = startDate;

while (!current.isAfter(endDate)) {

Timestamp dayStart = Timestamp.valueOf(current.atStartOfDay());
Timestamp nextDayStart = Timestamp.valueOf(current.plusDays(1).atStartOfDay());

totalProcessed += processSingleDay(dayStart, nextDayStart);

current = current.plusDays(1);
}

return totalProcessed;
}





public int processSingleDay(Timestamp fromInclusive,
Timestamp toExclusive) {

final int fetchSize = 5000;
final int batchSize = 1000;

jdbcTemplate.setFetchSize(fetchSize);

List<EncryptedAccountsRow> buffer = new ArrayList<>(batchSize);
int[] total = new int[]{0};

jdbcTemplate.query(
"""
SELECT ACCOUNT_REF
FROM (
SELECT t.INSTRUCTING_ACCOUNT_REF AS ACCOUNT_REF
FROM IPS_DW.T_TRANSACTION t
WHERE t.SWITCH_COMPLETED_TMSTMP >= ?
AND t.SWITCH_COMPLETED_TMSTMP < ?

UNION ALL

SELECT t.INSTRUCTED_ACCOUNT_REF AS ACCOUNT_REF
FROM IPS_DW.T_TRANSACTION t
WHERE t.SWITCH_COMPLETED_TMSTMP >= ?
AND t.SWITCH_COMPLETED_TMSTMP < ?
) x
WHERE x.ACCOUNT_REF IS NOT NULL
""",
ps -> {
ps.setTimestamp(1, fromInclusive);
ps.setTimestamp(2, toExclusive);
ps.setTimestamp(3, fromInclusive);
ps.setTimestamp(4, toExclusive);
},
rs -> {

String accountRef = rs.getString("ACCOUNT_REF");
if (accountRef == null) return;

String encrypted = encDecWithAES.encrypt(accountRef);

buffer.add(new EncryptedAccountsRow(accountRef, encrypted));

if (buffer.size() >= batchSize) {
encryptedRepo.batchInsert(buffer);
total[0] += buffer.size();
buffer.clear();
}
});

if (!buffer.isEmpty()) {
encryptedRepo.batchInsert(buffer);
total[0] += buffer.size();
}

return total[0];
}








