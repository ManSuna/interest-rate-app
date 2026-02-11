final String mergeSql = """

MERGE INTO IPS_DW.T_ENC_ACCOUNT tgt
USING (
SELECT
? AS ACCOUNT_REF,
? AS ENCRYPTED_ACCOUNT_REF
FROM SYSIBM.SYSDUMMY1
) src
ON tgt.ACCOUNT_REF = src.ACCOUNT_REF
WHEN MATCHED THEN
UPDATE SET tgt.ENCRYPTED_ACCOUNT_REF = src.ENCRYPTED_ACCOUNT_REF
WHEN NOT MATCHED THEN
INSERT (ACCOUNT_REF, ENCRYPTED_ACCOUNT_REF)
VALUES (src.ACCOUNT_REF, src.ENCRYPTED_ACCOUNT_REF)
""";
catch (Exception e) {
Throwable t = e;
while (t != null) {
t.printStackTrace();
t = (t instanceof java.sql.BatchUpdateException b) ? b.getNextException() : t.getCause();
}
throw e;
}
