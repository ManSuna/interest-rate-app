@Autowired
private JdbcTemplate jdbcTemplate;

public void process(Timestamp from, Timestamp toExclusive) {

jdbcTemplate.setFetchSize(5000);

jdbcTemplate.query("""
SELECT t.INSTRUCTING_ACCOUNT_REF AS ACCOUNT_REF
FROM IPS_DW.T_TRANSACTION t
WHERE t.SWITCH_COMPLETED_TMSTMP >= ?
AND t.SWITCH_COMPLETED_TMSTMP < ?

UNION ALL

SELECT t.INSTRUCTED_ACCOUNT_REF AS ACCOUNT_REF
FROM IPS_DW.T_TRANSACTION t
WHERE t.SWITCH_COMPLETED_TMSTMP >= ?
AND t.SWITCH_COMPLETED_TMSTMP < ?
""",
ps -> {
ps.setTimestamp(1, from);
ps.setTimestamp(2, toExclusive);
ps.setTimestamp(3, from);
ps.setTimestamp(4, toExclusive);
},
rs -> {
String accountRef = rs.getString("ACCOUNT_REF");
// encrypt + batch insert
});
}
