import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

<Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
  Interest Rates
</Typography>

{(data.interestRates ?? []).length > 0 ? (
  <Table size="small" sx={{ mt: 1, width: "100%" }}>
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: 600 }}>Rate (%)</TableCell>
        <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.interestRates.map((r, idx) => (
        <TableRow key={idx}>
          <TableCell>{Number(r.rate).toFixed(2)}</TableCell>
          <TableCell>{fmt(r.startDate)}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
) : (
  <Typography variant="body2" color="text.disabled">
    No interest rates available
  </Typography>
)}