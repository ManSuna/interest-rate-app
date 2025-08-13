// CompletedCycleJobTable.js
import { useMemo, useState } from "react";
import {
  Box, Button, Chip, Dialog, DialogTitle, DialogContent,
  Grid, Stack, Table, TableHead, TableRow, TableCell, TableBody, Typography
} from "@mui/material";

export default function CompletedCycleJobTable({ job }) {
  const [open, setOpen] = useState(false);

  // Build a single table row if job exists
  const row = useMemo(() => {
    if (!job) return null;
    return {
      executionTs: job.executionTs ?? "",
      resultCode: job.resultCode ?? null,
      // same field as Daily Jobs style, prefer rtp*, fallback to fed*
      calculatedInterestTotal:
        job.rtpInterestTotal ?? job.fedInterestTotal ?? job.rtpTotalInterest ?? "",
      _raw: job,
    };
  }, [job]);

  if (!row) {
    return (
      <Typography variant="body2" color="text.disabled">No completed cycle job</Typography>
    );
  }

  const ok = row.resultCode === 0;

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Execution Timestamp</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Calculated Interest Total
              </TableCell>
              <TableCell sx={{ width: 96 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{row.executionTs}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={ok ? "Success" : "Failed"}
                  color={ok ? "success" : "error"}
                />
              </TableCell>
              <TableCell align="right">{row.calculatedInterestTotal}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setOpen(true)}
                >
                  More
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      {/* Details dialog with the rest of the fields */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Completed Cycle Job — Details</DialogTitle>
        <DialogContent dividers>
          <DetailsGrid data={row._raw} omitKeys={[
            "executionTs",
            "resultCode",
            "rtpInterestTotal",
            "fedInterestTotal",
            "rtpTotalInterest" // in case backend uses this name
          ]}/>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Renders key/value pairs as a compact grid (raw values, no formatting) */
function DetailsGrid({ data, omitKeys = [] }) {
  if (!data) return null;
  const entries = Object.entries(data).filter(([k]) => !omitKeys.includes(k));
  return (
    <Stack spacing={1}>
      <Grid container columnSpacing={2} rowSpacing={0.5}>
        {entries.map(([k, v]) => (
          <Grid container item xs={12} key={k}>
            <Grid item xs={6}>
              <Typography color="text.secondary">{k}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ wordBreak: "break-word" }}>
                {v === null || v === undefined ? "" : String(v)}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
