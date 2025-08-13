import { useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { alpha } from "@mui/material/styles";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";

// helpers
const fmtDate = (d) => (d ? dayjs(d).format("YYYY-MM-DD") : "—");
const fmtNum = (v) => {
  if (v == null) return "—";
  const n = typeof v === "string" ? Number(v.replace(/,/g, "")) : Number(v);
  return Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—";
};

export default function DailyJobsGrid({ jobs }) {
  // Build rows safely and name them gridRows (not "rows")
  const gridRows = useMemo(() => {
    const arr = Array.isArray(jobs) ? jobs : [];
    return arr
      .slice()
      .sort((a, b) => new Date(b.businessDate) - new Date(a.businessDate))
      .map((j, i) => ({
        id: i,
        businessDate: j.businessDate ?? null,
        resultCode: j.resultCode ?? null,
        rtpTotalInterest: j.rtpTotalInterest ?? null,
        _raw: j,
      }));
  }, [jobs]);

  // optional: debug safely
  useEffect(() => {
    // comment out when done
    // console.table(gridRows);
  }, [gridRows]);

  const columns = [
    {
      field: "businessDate",
      headerName: "Business Date",
      flex: 1,
      minWidth: 140,
      valueFormatter: (params) => fmtDate(params?.value ?? params?.row?.businessDate),
    },
    {
      field: "resultCode",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => {
        const ok = (params?.value ?? params?.row?.resultCode) === 0;
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
      valueFormatter: (params) => fmtNum(params?.value ?? params?.row?.rtpTotalInterest),
    },
  ];

  return (
    <Box
      sx={{
        height: 280,
        width: "100%",
        "& .row-error": {
          backgroundColor: (t) => alpha(t.palette.error.light, 0.12),
          "&:hover": { backgroundColor: (t) => alpha(t.palette.error.light, 0.18) },
        },
        [`& .${gridClasses.cell}`]: { outline: "none" },
      }}
    >
      <DataGrid
        rows={gridRows} // <-- use gridRows here
        columns={columns}
        pageSizeOptions={[5, 10]}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        disableRowSelectionOnClick
        getRowClassName={(p) => (p.row.resultCode === 0 ? "" : "row-error")}
        slots={{
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              <Typography color="text.disabled">No jobs to display</Typography>
            </Stack>
          ),
        }}
      />
    </Box>
  );
}
