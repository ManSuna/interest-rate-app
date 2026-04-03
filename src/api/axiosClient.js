public class FedNowBalanceMessageProcessService {

    private static final String REPORT_TYPE_ABAR = "ABAR";

    private static final String RECORD_TYPE_EOD = "EOD";
    private static final String BALANCE_TYPE_OBFL = "OBFL";
    private static final String BALANCE_TYPE_ABAL = "ABAL";

    private static final String ENTRY_TYPE_FDNF = "FDNF";
    private static final String ENTRY_TYPE_FDFW = "FDFW";

    public void process(Map<String, Object> map, String message)
            throws FfsMessageProcessorException, MessageParserException {

        log.info("Processing FedNow ABAR Balance Report...");

        FedBalance fedBalance = buildBaseFedBalance(map);

        if (RecordType.EOD.equals(fedBalance.getRecordType())) {
            processEodRecord(fedBalance, map);
            insertFedBalance(fedBalance);
        } else {
            FedBalance existingFedBalance = loadIntradayRecord(fedBalance);
            processIntradayRecord(existingFedBalance, map);
            updateFedBalance(existingFedBalance);
        }

        log.info("Fed Balance report saved");
    }

    private FedBalance buildBaseFedBalance(Map<String, Object> map) throws MessageParserException {
        String reportType = TransformUtil.getValue(
                "FedNowOutgoingMessage/FedNowAccountBalanceReport/Document/BkToCstmrAcctRpt/GrpHdr/MsgId",
                map
        );

        if (!StringUtils.equalsIgnoreCase(reportType, REPORT_TYPE_ABAR)) {
            throw new MessageParserException(ErrorMessage.MessageParserErrorMessage.MPE005);
        }

        String orgMsgId = TransflowUtil.getValue(
                "FedNowOutgoingMessage/FedNowAccountBalanceReport/Document/BkToCstmrAcctRpt/GrpHdr/OrgnlBizQry/MsgId",
                map
        );

        String recordTypeValue = orgMsgId.substring(orgMsgId.length() - 3);

        Date cycleDate = parseCycleDate(orgMsgId);

        FedBalance fedBalance = new FedBalance();
        fedBalance.setCycleDate(cycleDate);
        fedBalance.setCreateDate(currentTimestamp());
        fedBalance.setUpdateDate(currentTimestamp());

        if (RECORD_TYPE_EOD.equalsIgnoreCase(recordTypeValue)) {
            fedBalance.setRecordType(RecordType.EOD);
        } else {
            fedBalance.setRecordType(RecordType.INTRADAY);
            applicationStatus.setFedNowAccountBalanceReportReceived(true);
        }

        return fedBalance;
    }

    private Date parseCycleDate(String orgMsgId) throws MessageParserException {
        try {
            String cycleDateStr = orgMsgId.substring(0, 8);
            return FwMessageUtil.convertStringToDate(cycleDateStr);
        } catch (FwMessageUtilException e) {
            log.error("Balance Report's cycleDate parsing failed", e);
            throw new MessageParserException(ErrorMessage.MessageParserErrorMessage.MPE005);
        }
    }

    private void processEodRecord(FedBalance fedBalance, Map<String, Object> map)
            throws MessageParserException {

        ArrayList<Object> balanceList = TransformUtil.getValueList(
                "FedNowOutgoingMessage/FedNowAccountBalanceReport/Document/BkToCstmrAcctRpt/Rpt/Bal",
                map
        );

        Map<String, Object> closingBalance = findBalanceByCode(balanceList, BALANCE_TYPE_OBFL);
        if (closingBalance != null) {
            fedBalance.setClosingBalance(parseDoubleField(closingBalance, "Amt/", "Invalid OBFL Closing Balance Response"));
        }

        Map<String, Object> availableBalance = findBalanceByCode(balanceList, BALANCE_TYPE_ABAL);
        if (availableBalance != null) {
            fedBalance.setAvailableBalance(parseDoubleField(availableBalance, "Amt/", "Invalid ABAL Available Balance Response"));
        }
    }

    private FedBalance loadIntradayRecord(FedBalance probe) throws MessageParserException {
        List<FedBalance> result = fedBalanceRepository.findByRecordTypeAndCycleDate(
                probe.getRecordType().toString(),
                probe.getCycleDate()
        );

        if (result.isEmpty()) {
            log.error("INTRADAY record not found for the day: {}", probe.getCycleDate());
            throw new MessageParserException(ErrorMessage.MessageParserErrorMessage.MPE006);
        }

        return result.get(0);
    }

    private void processIntradayRecord(FedBalance fedBalance, Map<String, Object> map)
            throws MessageParserException {

        ArrayList<Object> balanceList = TransflowUtil.getValueList(
                "FedNowOutgoingMessage/FedNowAccountBalanceReport/Document/BkToCstmrAcctRpt/Rpt/Bal",
                map
        );

        Map<String, Object> availableBalance = findBalanceByCode(balanceList, BALANCE_TYPE_ABAL);
        if (availableBalance != null) {
            fedBalance.setAvailableBalance(parseDoubleField(
                    availableBalance,
                    "Amt/",
                    "Invalid ABAL Available Balance Response"
            ));
        }

        ArrayList<Object> txSummaryList = TransflowUtil.getValueList(
                "FedNowOutgoingMessage/FedNowAccountBalanceReport/Document/BkToCstmrAcctRpt/Rpt/TxsSummry/TtlNtriesPerBkTxCd",
                map
        );

        populateTotalsForEntryType(fedBalance, txSummaryList, ENTRY_TYPE_FDNF, true);
        populateTotalsForEntryType(fedBalance, txSummaryList, ENTRY_TYPE_FDFW, false);

        applicationStatus.setFedNowAccountBalanceReportProcessed(true);
        applicationStatus.setResultFedBalance(fedBalance);
        fedBalance.setUpdateDate(currentTimestamp());
    }

    private void populateTotalsForEntryType(FedBalance fedBalance,
                                            ArrayList<Object> txSummaryList,
                                            String entryType,
                                            boolean addToExisting)
            throws MessageParserException {

        Map<String, Object> detail = findTxnSummaryByCode(txSummaryList, entryType);
        if (detail == null) {
            return;
        }

        try {
            double creditAmount = getDefaultDoubleIfNull(
                    TransflowUtil.getValue("CdtNtries/Sum", detail),
                    "CdtNtries/Sum"
            );

            int creditCount = getDefaultIntegerIfNull(
                    TransflowUtil.getValue("CdtNtries/NbOfNtries", detail),
                    "CdtNtries/NbOfNtries"
            );

            double debitAmount = getDefaultDoubleIfNull(
                    TransflowUtil.getValue("DbtNtries/Sum", detail),
                    "DbtNtries/Sum"
            );

            int debitCount = getDefaultIntegerIfNull(
                    TransflowUtil.getValue("DbtNtries/NbOfNtries", detail),
                    "DbtNtries/NbOfNtries"
            );

            if (addToExisting) {
                fedBalance.setCreditsAmount(fedBalance.getCreditsAmount() + creditAmount);
                fedBalance.setCreditsCount(fedBalance.getCreditsCount() + creditCount);
                fedBalance.setDebitsAmount(fedBalance.getDebitsAmount() + debitAmount);
                fedBalance.setDebitsCount(fedBalance.getDebitsCount() + debitCount);
            } else {
                fedBalance.setCreditsAmount(creditAmount);
                fedBalance.setCreditsCount(creditCount);
                fedBalance.setDebitsAmount(debitAmount);
                fedBalance.setDebitsCount(debitCount);
            }
        } catch (Exception e) {
            log.error("Parsing Number Error for FedNow Credits or Debits Amounts/Counts", e);
            throw new MessageParserException("Parsing Number Error for FedNow Credits or Debits Amounts/Counts");
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> findBalanceByCode(ArrayList<Object> balanceList, String code) {
        return balanceList.stream()
                .map(obj -> (Map<String, Object>) obj)
                .filter(balance -> code.equals(TransformUtil.getValue("Tp/CdOrPrtry/Prtry", balance)))
                .findFirst()
                .orElse(null);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> findTxnSummaryByCode(ArrayList<Object> txSummaryList, String code) {
        return txSummaryList.stream()
                .map(obj -> (Map<String, Object>) obj)
                .filter(item -> code.equals(TransformUtil.getValue("BkTxCd/Prtry/Cd", item)))
                .findFirst()
                .orElse(null);
    }

    private double parseDoubleField(Map<String, Object> source, String fieldName, String errorMessage)
            throws MessageParserException {
        try {
            String value = TransformUtil.getValue(fieldName, source);
            return Double.parseDouble(value.trim());
        } catch (Exception e) {
            log.error(errorMessage, e);
            throw new MessageParserException(ErrorMessage.MessageParserErrorMessage.MPE006);
        }
    }

    private void insertFedBalance(FedBalance fedBalance) {
        int result = fedBalanceRepository.insertFedNowAccountBalance(fedBalance);
        log.debug("Inserted FedBalance Record, result={}", result);
    }

    private void updateFedBalance(FedBalance fedBalance) {
        int result = fedBalanceRepository.updateFedBalance(fedBalance);
        log.debug("Updated FedBalance Record, result={}", result);
    }

    private Timestamp currentTimestamp() {
        return Timestamp.from(Instant.now());
    }

    private double getDefaultDoubleIfNull(String input, String field) {
        if (input == null || input.isEmpty()) {
            return 0.0;
        }

        try {
            return Double.parseDouble(input);
        } catch (NumberFormatException e) {
            log.error("Parsing Number Error at field {}", field, e);
            throw new NumberFormatException(input);
        }
    }

    private int getDefaultIntegerIfNull(String input, String field) {
        if (input == null || input.isEmpty()) {
            return 0;
        }

        try {
            return Integer.parseInt(input);
        } catch (NumberFormatException e) {
            log.error("Parsing Number Error at field {}", field, e);
            throw new NumberFormatException(input);
        }
    }
}
