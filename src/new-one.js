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

export default function DailySectionGroupedTable(props) {
  const card = props.card;

  const merged = useMemo(() => mergeDailyAndLedger(card), [card]);
  const groups = useMemo(() => groupByBusinessDate(merged), [merged]);

  if (!groups.length) return null;

  return React.createElement(
    Box,
    null,
    groups.map(([dateKey, rows], idx) =>
      React.createElement(
        Accordion,
        { key: dateKey, defaultExpanded: idx === 0 },
        React.createElement(
          AccordionSummary,
          { expandIcon: React.createElement(ExpandMoreIcon, null) },
          React.createElement(
            Typography,
            { variant: "subtitle1", fontWeight: 700 },
            `Business Date: ${dateKey}`
          ),
          React.createElement(
            Typography,
            { variant: "body2", sx: { ml: 1, color: "text.secondary" } },
            ` (${rows.length} jobs)`
          )
        ),
        React.createElement(
          AccordionDetails,
          null,
          React.createElement(
            TableContainer,
            { component: Paper },
            React.createElement(
              Table,
              { size: "small" },
              React.createElement(
                TableHead,
                null,
                React.createElement(
                  TableRow,
                  null,
                  React.createElement(TableCell, null, "Type"),
                  React.createElement(TableCell, null, "Message"),
                  React.createElement(TableCell, null, "Processed Accounts"),
                  React.createElement(TableCell, null, "Result Code"),
                  React.createElement(TableCell, null, "Selector"),
                  React.createElement(TableCell, null, "Updated At")
                )
              ),
              React.createElement(
                TableBody,
                null,
                rows.map((row) =>
                  React.createElement(
                    TableRow,
                    { key: row.id },
                    React.createElement(TableCell, null, row.type || ""),
                    React.createElement(TableCell, null, row.message || ""),
                    React.createElement(
                      TableCell,
                      null,
                      row.processedAccountsCount ?? ""
                    ),
                    React.createElement(TableCell, null, row.resultCode ?? ""),
                    React.createElement(TableCell, null, row.selector || ""),
                    React.createElement(
                      TableCell,
                      null,
                      row.updatedTs
                        ? dayjs(row.updatedTs).format("YYYY-MM-DD HH:mm")
                        : ""
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}
