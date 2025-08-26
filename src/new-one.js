import dayjs from "dayjs";

export function mergeDailyAndLedger(card) {
  const asRow = (j, i, type) => ({
    id: `${type}-${i}-${j.id ?? i}`,
    type,
    businessDate: j.businessDate ?? null,
    ...j,
  });

  const daily  = (card?.dailyJobs  ?? []).map((j, i) => asRow(j, i, "Daily"));
  const ledger = (card?.ledgerJobs ?? []).map((j, i) => asRow(j, i, "Ledger"));

  // keep rows even if businessDate is null; we’ll group them under “Unknown”
  return [...daily, ...ledger];
}

export function groupByBusinessDate(rows) {
  const map = new Map();
  rows.forEach(r => {
    const key = r.businessDate ? dayjs(r.businessDate).format("YYYY-MM-DD") : "Unknown";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(r);
  });

  // put real dates first (newest → oldest), then “Unknown”
  return [...map.entries()].sort((a, b) => {
    if (a[0] === "Unknown") return 1;
    if (b[0] === "Unknown") return -1;
    return dayjs(b[0]).valueOf() - dayjs(a[0]).valueOf();
  });
}
