function normalizeDashboardResponse(raw) {
  if (!raw) return null;

  const toCard = (obj, label) => ({
    label,
    startDate: obj.cycle?.start ?? null,
    endDate: obj.cycle?.end ?? null,
    interestRates: obj.rates ?? [],
    completedCycleJob: obj.completedCycleJob ?? null,
    dailyJobs: obj.dailyJobs ?? []
  });

  const out = [];
  if (raw.currentCycle) out.push(toCard(raw.currentCycle, "Current Cycle"));
  if (raw.lastCycle) out.push(toCard(raw.lastCycle, "Last Cycle"));

  return out;
}