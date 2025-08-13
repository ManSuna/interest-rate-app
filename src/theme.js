<Table size="small" sx={{ mt: 1, width: "100%" }}>
  <TableHead>
    <TableRow>
      <TableCell align="right" sx={{ fontWeight: 600 }}>Rate (%)</TableCell>
      <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {[...data.interestRates].sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .map((r, idx) => (
        <TableRow key={idx}>
          <TableCell align="right">{Number(r.rate).toFixed(2)}</TableCell>
          <TableCell>{fmt(r.startDate)}</TableCell>
        </TableRow>
    ))}
  </TableBody>
</Table>
