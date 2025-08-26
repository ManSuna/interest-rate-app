import React, { useMemo } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
import { mergeDailyAndLedger, groupByBusinessDate } from "./utils";

export default function DailySectionGroupedTable({ card }) {
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
            <Typography
              variant="body2"
              sx={{ ml: 1, color: "text.secondary" }}
            >
              ({rows.length} jobs)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Processed Accounts</TableCell>
                    <TableCell>Result Code</TableCell>
                    <TableCell>Selector</TableCell>
                    <TableCell>Updated At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.message}</TableCell>
                      <TableCell>{row.processedAccountsCount}</TableCell>
                      <TableCell>{row.resultCode}</TableCell>
                      <TableCell>{row.selector}</TableCell>
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
