import React, { useMemo } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { mergeDailyAndLedger, groupByBusinessDate } from "./utils";

const columns = [
  { field: "type", headerName: "Type", width: 110 },
  {
    field: "businessDate",
    headerName: "Business Date",
    flex: 1,
    valueFormatter: (p) => (p.value ? dayjs(p.value).format("YYYY-MM-DD") : ""),
    sortComparator: (v1, v2) => dayjs(v1).valueOf() - dayjs(v2).valueOf(),
  },
  { field: "message", headerName: "Message", flex: 2 },
  { field: "processedAccountsCount", headerName: "Processed Accounts", width: 170 },
  { field: "resultCode", headerName: "Result Code", width: 130 },
  { field: "selector", headerName: "Selector", width: 130 },
  { field: "updatedTs", headerName: "Updated At", flex: 1 },
];

export default function DailySectionGrouped({ card }) {
  const merged = useMemo(() => mergeDailyAndLedger(card), [card]);
  const groups = useMemo(() => groupByBusinessDate(merged), [merged]);

  if (!groups.length) return null;

  return (
    <Box>
      {groups.map(([dateKey, rows], idx) => (
        <Accordion key={dateKey} defaultExpanded={idx === 0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight={700}>
              Business Date: {dateKey}
            </Typography>
            <Typography variant="body2" sx={{ ml: 1, color: "text.secondary" }}>
              ({rows.length} jobs)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ height: 360, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                disableRowSelectionOnClick
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 25]}
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
