const columns = [
  {
    field: "businessDate",
    headerName: "Business Date",
    flex: 1,
    minWidth: 140,
    // was: valueFormatter: ({ value }) => fmtDate(value),
    valueFormatter: (params) => {
      const v = params?.value;
      return v ? fmtDate(v) : "—";
    },
  },
  {
    field: "resultCode",
    headerName: "Status",
    flex: 1,
    minWidth: 120,
    sortable: false,
    renderCell: (params) => {
      const ok = params?.value === 0;
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
    // was: valueFormatter: ({ value }) => fmtNum(value),
    valueFormatter: (params) => {
      const v = params?.value;
      return v == null ? "—" : fmtNum(v);
    },
  },
];