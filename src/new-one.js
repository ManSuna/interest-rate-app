// src/utils/statusUtils.js
import { Chip, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

export const renderStatusChip = (resultCode, options = {}) => {
  switch (resultCode) {
    case -1:
      return (
        <Chip
          size="small"
          label="In Progress"
          color="warning"
          icon={
            options.spinner ? (
              <CircularProgress size={14} />
            ) : (
              <HourglassEmptyIcon />
            )
          }
        />
      );
    case 0:
      return (
        <Chip
          size="small"
          label="Success"
          color="success"
          icon={<CheckCircleIcon />}
        />
      );
    default:
      return (
        <Chip
          size="small"
          label="Failed"
          color="error"
          icon={<ErrorIcon />}
        />
      );
  }
};