// DailyJobsGrid.jsx
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { alpha } from "@mui/material/styles";
import {
  Box, Chip, Drawer, Divider, Grid, Typography, Stack,
} from "@mui/material";
import {
  DataGrid,
  gridClasses
} from "@mui/x-data-grid";

// utils
const fmtDate = (d) => (d ? dayjs(d).format("YYYY-MM-DD") : "—");
const fmtTs = (d) => (d ? dayjs(d).format("YYYY-MM-DD HH:mm:ss") : "—");
const fmtNum = (n) => (n ?? n === 0 ? Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—");

export default function DailyJobsGrid({ jobs = [] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null); // store raw row for drawer

  // rows for the grid (keep raw for details)
  const rows = useMemo(() => {
    const arr = Array.isArray(jobs) ? jobs : [];
    return arr
      .slice()
      .sort((a, b) => new Date(b.businessDate) - new Date(a.businessDate))
      .map((j, i) => ({
        id: i,
        businessDate: j.businessDate,
        resultCode: j.resultCode,
        rtpTotalInterest: j.rtpTotalInterest,
        _raw: j,
      }));
  }, [jobs]);

  const columns = [
    {
      field: "businessDate",
      headerName: "Business Date",
      flex: 1,
      minWidth: 140,
      valueFormatter: ({ value }) => fmtDate(value),
    },
    {
      field: "resultCode",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => {
        const ok = params.value === 0;
        return (
          <Chip
            size="small"
            label={ok ? "Success" : "Failed"}
            color={ok ? "success" : "error"}
            variant={ok ? "outlined" : "filled"}
          />
        );
      },
    },
    {
      field: "rtpTotalInterest",
      headerName: "Calculated Interest",
      flex: 1,
      minWidth: 170,
      align: "right",
      headerAlign: "right",
      valueFormatter: ({ value }) => fmtNum(value),
    },
  ];

  return (
    <>
      <Box
        sx={{
          height: 280,
          width: "100%",
          "& .row-error": {
            backgroundColor: (theme) => alpha(theme.palette.error.light, 0.12),
            "&:hover": {
              backgroundColor: (theme) => alpha(theme.palette.error.light, 0.18),
            },
          },
          [`& .${gridClasses.cell}`]: { outline: "none" }
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          disableRowSelectionOnClick
          getRowClassName={(params) =>
            params.row.resultCode === 0 ? "" : "row-error"
          }
          onRowClick={(params) => {
            setActive(params.row._raw);
            setOpen(true);
          }}
          slots={{
            noRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                <Typography color="text.disabled">No jobs to display</Typography>
              </Stack>
            ),
          }}
        />
      </Box>

      {/* SECOND STAGE: details drawer */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 380, p: 2 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Job Details
          </Typography>
          {active ? (
            <Stack spacing={2}>
              <Grid container columnSpacing={2} rowSpacing={1}>
                <Grid item xs={6}><Typography color="text.secondary">Business Date</Typography></Grid>
                <Grid item xs={6}><Typography>{fmtDate(active.businessDate)}</Typography></Grid>

                <Grid item xs={6}><Typography color="text.secondary">Status</Typography></Grid>
                <Grid item xs={6}>
                  <Chip
                    size="small"
                    label={active.resultCode === 0 ? "Success" : "Failed"}
                    color={active.resultCode === 0 ? "success" : "error"}
                  />
                </Grid>

                <Grid item xs={12}><Divider /></Grid>

                <Grid item xs={6}><Typography color="text.secondary">Calculated Interest</Typography></Grid>
                <Grid item xs={6}><Typography>{fmtNum(active.rtpTotalInterest)}</Typography></Grid>

                <Grid item xs={6}><Typography color="text.secondary">RTP Total Position</Typography></Grid>
                <Grid item xs={6}><Typography>{fmtNum(active.rtpTotalPosition)}</Typography></Grid>

                <Grid item xs={6}><Typography color="text.secondary">Rate</Typography></Grid>
                <Grid item xs={6}><Typography>{fmtNum(active.rate)}</Typography></Grid>

                <Grid item xs={6}><Typography color="text.secondary">Exec Timestamp</Typography></Grid>
                <Grid item xs={6}><Typography>{fmtTs(active.executionTs)}</Typography></Grid>

                <Grid item xs={6}><Typography color="text.secondary">FED Close Time</Typography></Grid>
                <Grid item xs={6}><Typography>{fmtTs(active.fedCloseTime)}</Typography></Grid>

                <Grid item xs={6}><Typography color="text.secondary">FED Balance</Typography></Grid>
                <Grid item xs={6}><Typography>{fmtNum(active.fedBalance)}</Typography></Grid>

                <Grid item xs={12}><Divider /></Grid>

                <Grid item xs={6}><Typography color="text.secondary">Result Code</Typography></Grid>
                <Grid item xs={6}><Typography>{active.resultCode ?? "—"}</Typography></Grid>

                <Grid item xs={6}><Typography color="text.secondary">Error Message</Typography></Grid>
                <Grid item xs={6}><Typography>{active.errorMessage || "—"}</Typography></Grid>
              </Grid>
            </Stack>
          ) : (
            <Typography color="text.disabled">Select a job to see details</Typography>
          )}
        </Box>
      </Drawer>
    </>
  );
}