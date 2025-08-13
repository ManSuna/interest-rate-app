// DashboardCycles.js
import React, { useEffect, useState } from "react";
import {
  Box, Card, CardContent, CardHeader, Chip, Divider, Grid, List, ListItem,
  ListItemIcon, ListItemText, Stack, Typography, Tooltip, Alert, LinearProgress
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import dayjs from "dayjs";

function normalizeDashboardResponse(raw) {
  if (Array.isArray(raw)) {
    return raw.map((r) => ({
      label: (r.type || r.cycle || r.label || "").toString().toLowerCase().includes("last")
        ? "Last Cycle"
        : "Current Cycle",
      startDate: r.startDate ?? r.cycleStart ?? r.start,
      endDate: r.endDate ?? r.cycleEnd ?? r.end,
      interestRates: r.interestRates ?? r.rates ?? [],
      completedCycleJob: r.completedCycleJob ?? r.completedJob ?? null,
      dailyJobs: r.dailyJobs ?? r.jobs ?? [],
    }));
  }

  if (raw?.current || raw?.last) {
    const toCard = (obj, label) => ({
      label,
      startDate: obj?.startDate ?? obj?.cycleStart ?? obj?.start,
      endDate: obj?.endDate ?? obj?.cycleEnd ?? obj?.end,
      interestRates: obj?.interestRates ?? obj?.rates ?? [],
      completedCycleJob: obj?.completedCycleJob ?? obj?.completedJob ?? null,
      dailyJobs: obj?.dailyJobs ?? obj?.jobs ?? [],
    });
    const out = [];
    if (raw.current) out.push(toCard(raw.current, "Current Cycle"));
    if (raw.last) out.push(toCard(raw.last, "Last Cycle"));
    return out;
  }

  return [
    {
      label: "Current Cycle",
      startDate: raw?.startDate ?? raw?.cycleStart ?? raw?.start,
      endDate: raw?.endDate ?? raw?.cycleEnd ?? raw?.end,
      interestRates: raw?.interestRates ?? raw?.rates ?? [],
      completedCycleJob: raw?.completedCycleJob ?? raw?.completedJob ?? null,
      dailyJobs: raw?.dailyJobs ?? raw?.jobs ?? [],
    },
  ];
}

const StatusIcon = ({ status }) => {
  if (status === "SUCCESS") return <CheckCircleIcon fontSize="small" color="success" />;
  if (status === "FAILED") return <CancelIcon fontSize="small" color="error" />;
  return <HelpOutlineIcon fontSize="small" color="disabled" />;
};

const FieldRow = ({ label, value }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.5 }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body2" fontWeight={500}>{value ?? "—"}</Typography>
  </Stack>
);

const CycleCard = ({ data }) => {
  const fmt = (d) => (d ? dayjs(d).format("YYYY-MM-DD") : "—");
  const hasJobs = (data.dailyJobs?.length ?? 0) > 0;

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
      <CardHeader
        title={data.label}
        sx={{ pb: 0, "& .MuiCardHeader-title": { fontWeight: 700 } }}
      />
      <CardContent>
        <FieldRow label="Start" value={fmt(data.startDate)} />
        <FieldRow label="End" value={fmt(data.endDate)} />

        <Divider sx={{ my: 1.5 }} />

        <Typography variant="caption" color="text.secondary">Interest Rates</Typography>
        <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 0.5, mb: 1.5 }}>
          {(data.interestRates ?? []).length > 0 ? (
            (data.interestRates ?? []).map((r, idx) => (
              <Chip key={idx} size="small" label={String(r)} />
            ))
          ) : (
            <Typography variant="body2">—</Typography>
          )}
        </Stack>

        {data.completedCycleJob && (
          <>
            <Typography variant="caption" color="text.secondary">Completed Cycle Job</Typography>
            <List dense sx={{ mt: 0.5 }}>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <StatusIcon status={data.completedCycleJob.status} />
                </ListItemIcon>
                <ListItemText
                  primary={data.completedCycleJob.name}
                  secondary={data.completedCycleJob.date ? dayjs(data.completedCycleJob.date).format("YYYY-MM-DD") : undefined}
                  primaryTypographyProps={{ variant: "body2" }}
                />
              </ListItem>
            </List>
          </>
        )}

        <Typography variant="caption" color="text.secondary">
          {data.label === "Current Cycle" ? "All Jobs (incl. failed)" : "Daily Jobs"}
        </Typography>

        {!hasJobs ? (
          <Box sx={{ mt: 0.75 }}>
            <Alert severity="info" variant="outlined">No jobs to display.</Alert>
          </Box>
        ) : (
          <List dense sx={{ mt: 0.5, maxHeight: 260, overflowY: "auto" }}>
            {data.dailyJobs.map((j, i) => (
              <ListItem key={j.id ?? i} divider disableGutters>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <Tooltip title={j.status ?? "UNKNOWN"}>
                    <span><StatusIcon status={j.status} /></span>
                  </Tooltip>
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="body2">{j.name}</Typography>}
                  secondary={
                    j.date ? dayjs(j.date).format("YYYY-MM-DD") :
                    (j.details ? <Typography variant="caption">{j.details}</Typography> : undefined)
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export const DashboardCycles = ({
  baseUrl,
  username,
  password,
  path = "/services/ui/dashboard",
}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${baseUrl.replace(/\/+$/, "")}${path}`, {
          method: "GET",
          headers: {
            Authorization: "Basic " + btoa(`${username}:${password}`),
            Accept: "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const raw = await res.json();
        const normalized = normalizeDashboardResponse(raw);
        if (alive) setData(normalized);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load dashboard");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [baseUrl, path, username, password]);

  return (
    <Box sx={{ width: "100%" }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Could not load dashboard: {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {(data ?? []).length === 0 && !loading && !error && (
          <Grid item xs={12}>
            <Alert severity="info">No cycle data available.</Alert>
          </Grid>
        )}

        {(data ?? []).map((cycle, idx) => (
          <Grid key={idx} item xs={12} md={6}>
            <CycleCard data={cycle} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};