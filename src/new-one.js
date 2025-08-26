export function mergeDailyAndLedger(card) {
  const wrap = (job, i, type) => {
    return {
      id: job?.id ?? `${type}-${i}`,   // ✅ always generate something
      type,
      businessDate: job?.businessDate ?? null,
      message: job?.message ?? "",
      processedAccountsCount: job?.processedAccountsCount ?? null,
      resultCode: job?.resultCode ?? "",
      selector: job?.selector ?? "",
      updatedTs: job?.updatedTs ?? null,
      raw: job,                        // keep full raw
    };
  };

  const daily  = (card?.dailyJobs  ?? []).map((j, i) => wrap(j, i, "Daily"));
  const ledger = (card?.ledgerJobs ?? []).map((j, i) => wrap(j, i, "Ledger"));

  return [...daily, ...ledger];
}




{rows.map((row, idx) => (
  <TableRow key={row.id ?? `row-${idx}`}>
    ...
  </TableRow>
))}
