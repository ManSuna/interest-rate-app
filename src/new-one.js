<Chip
  size="small"
  label={
    row.resultCode === -1
      ? "In Progress"
      : row.resultCode === 0
      ? "Success"
      : "Failed"
  }
  color={
    row.resultCode === -1
      ? "warning"
      : row.resultCode === 0
      ? "success"
      : "error"
  }
/>