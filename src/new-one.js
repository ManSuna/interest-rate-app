import CircularProgress from "@mui/material/CircularProgress";

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
  icon={
    row.resultCode === -1 ? (
      <CircularProgress size={14} />
    ) : undefined
  }
/>