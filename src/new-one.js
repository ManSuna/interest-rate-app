import dayjs from "dayjs";

export function mergeDailyAndLedger(card, fallbackDate) {
  const withDate = (j, i, type) => ({
    id: `${type}-${i}-${j.id ?? i}`,
    type,
    businessDate: j.businessDate ?? fallbackDate ?? null,
    ...j,
  });

  const daily = (card?.dailyJobs ?? []).map((j, i) => withDate(j, i, "Daily"));
  const ledger = (card?.ledgerJobs ?? []).map((j, i) => withDate(j, i, "Ledger"));

  return [...daily, ...ledger].filter(r => !!r.businessDate);
}

export function groupByBusinessDate(rows) {
  const map = new Map();
  rows.forEach(r => {
    const key = dayjs(r.businessDate).format("YYYY-MM-DD");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(r);
  });
  return [...map.entries()].sort(
    (a, b) => dayjs(b[0]).valueOf() - dayjs(a[0]).valueOf()
  );
}
