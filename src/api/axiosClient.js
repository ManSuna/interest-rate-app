package org.tch.fraud.accountproxy.repository;

import org.tch.fraud.accountproxy.service.RTPDataLoadService.EncryptedAccountsRow;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class EncryptedAccountsJdbcRepository {

private final JdbcTemplate jdbcTemplate;

public EncryptedAccountsJdbcRepository(JdbcTemplate jdbcTemplate) {
this.jdbcTemplate = jdbcTemplate;
}

/**
* DB2 MERGE: ensures ACCOUNT_REF remains unique.
* Requires a UNIQUE index on T_ENC_ACCOUNT(ACCOUNT_REF) for best protection.
*/
public int[] batchMerge(List<EncryptedAccountsRow> rows) {

final String mergeSql = """
MERGE INTO IPS_DW.T_ENC_ACCOUNT tgt
USING (VALUES (?, ?)) AS src (ACCOUNT_REF, ENCRYPTED_ACCOUNT_REF)
ON tgt.ACCOUNT_REF = src.ACCOUNT_REF
WHEN MATCHED THEN
UPDATE SET tgt.ENCRYPTED_ACCOUNT_REF = src.ENCRYPTED_ACCOUNT_REF
WHEN NOT MATCHED THEN
INSERT (ACCOUNT_REF, ENCRYPTED_ACCOUNT_REF)
VALUES (src.ACCOUNT_REF, src.ENCRYPTED_ACCOUNT_REF)
""";

return jdbcTemplate.batchUpdate(
mergeSql,
rows,
rows.size(),
(ps, row) -> {
ps.setString(1, row.accountRef());
ps.setString(2, row.encryptedAccountRef());
}
);
}
}
