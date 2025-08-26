import React, { useMemo } from "react";
import {
  Accordion, AccordionSummary, AccordionDetails,
  Box, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Paper, Tooltip
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
import { mergeDailyAndLedger, groupByBusinessDate } from "./utils";

export default function DailySectionGroupedTable({ card }) {
  const merged = useMemo(() => mergeDailyAndLedger(card), [card]);
  const groups = useMemo(() => groupByBusinessDate(merged), [merged]);
  if (!groups.length) return null;

  // shared compact cell style
  const cellSx = { py: 0.5, px: 1 }; // tighter padding

  return (
    <Box>
      {groups.map(([dateKey, rows]) => (
        <Accordion key={dateKey} defaultExpanded={true}> {/* open by default */}
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" fontWeight={700}>
              Business Date: {dateKey}
            </Typography>
            <Typography variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
              ({rows.length} jobs)
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table
                size="small"                                  // compact rows
                stickyHeader                                   // optional: sticky header
                sx={{
                  "& th": { ...cellSx },
                  "& td": { ...cellSx, verticalAlign: "middle" },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell width={96}>Type</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell width={150}>Processed</TableCell>
                    <TableCell width={120}>Result</TableCell>
                    <TableCell width={120}>Selector</TableCell>
                    <TableCell width={180}>Updated At</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.type}</TableCell>

                      {/* compact with ellipsis + tooltip */}
                      <TableCell sx={{ maxWidth: 360 }}>
                        <Tooltip title={row.message || ""} placement="top" arrow>
                          <Box sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}>
                            {row.message}
                          </Box>
                        </Tooltip>
                      </TableCell>

                      <TableCell align="right">
                        {row.processedAccountsCount ?? ""}
                      </TableCell>
                      <TableCell>{row.resultCode ?? ""}</TableCell>
                      <TableCell>{row.selector ?? ""}</TableCell>
                      <TableCell>
                        {row.updatedTs
                          ? dayjs(row.updatedTs).format("YYYY-MM-DD HH:mm")
                          : ""}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
