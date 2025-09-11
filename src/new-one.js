<TableCell align="right">
  {Number.isInteger(r.rate)
    ? Number(r.rate).toFixed(2)   // pad with .00
    : r.rate}                     // keep as-is
</TableCell>


<strong>Rate(%):</strong>{" "}
{Number.isInteger(Number(selectedRow?.rate))
  ? Number(selectedRow?.rate).toFixed(2)
  : selectedRow?.rate}
<br/>