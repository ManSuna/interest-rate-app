// utils.js
import dayjs from "dayjs";

export function mergeDailyAndLedger(card, fallbackDate) {
  const dailyPart = (card.dailyJobs ?? []).map((j, i) => ({
    id: `d-${i}-${j.id ?? i}`,
    type: "Daily",
    businessDate: j.businessDate ?? fallbackDate ?? null,
    ...j,
  }));
  const ledgerPart = (card.ledgerJobs ?? []).map((j, i) => ({
    id: `l-${i}-${j.id ?? i}`,
    type: "Ledger",
    businessDate: j.businessDate ?? fallbackDate ?? null,
    ...j,
  }));

  return [...dailyPart, ...ledgerPart].filter(r => !!r.businessDate);
}

export function groupByBusinessDate(rows) {
  const map = new Map();
  rows.forEach(r => {
    const key = dayjs(r.businessDate).format("YYYY-MM-DD");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(r);
  });

  // newest date first
  return [...map.entries()]
    .sort((a, b) => dayjs(b[0]).valueOf() - dayjs(a[0]).valueOf());
}
