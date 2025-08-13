function normalizeDashboardResponse(raw) {
  if (!raw) return null;

  const toCard = (obj, label) => ({
    label,
    startDate: obj.cycle?.start ?? null,
    endDate: obj.cycle?.end ?? null,
    interestRates: Array.isArray(obj.rates) ? obj.rates : [],
    dailyJobs: Array.isArray(obj.dailyJobs) ? obj.dailyJobs : [], // ✅ force array
    completedCycleJob: obj.completedCycleJob ?? null
  });

  const out = [];
  if (raw.currentCycle) out.push(toCard(raw.currentCycle, "Current Cycle"));
  if (raw.lastCycle) out.push(toCard(raw.lastCycle, "Last Cycle"));
  return out;
}


<Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
  Daily Jobs
</Typography>

{(data.dailyJobs ?? []).length > 0 ? (
  <Table size="small" sx={{ mt: 1, width: "100%" }}>
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: 600 }}>Business Date</TableCell>
        <TableCell align="right" sx={{ fontWeight: 600 }}>Rate</TableCell>
        <TableCell align="right" sx={{ fontWeight: 600 }}>Executions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.dailyJobs.map((job, idx) => (
        <TableRow key={idx}>
          <TableCell>{fmt(job.businessDate)}</TableCell>
          <TableCell align="right">{Number(job.rate).toFixed(2)}</TableCell>
          <TableCell align="right">{job.executionTs ? 1 : 0}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
) : (
  <Typography variant="body2" color="text.disabled">No jobs to display</Typography>
)}