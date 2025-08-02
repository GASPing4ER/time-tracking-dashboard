// src/pages/Dashboard.tsx
import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import TimeTracker from "../components/TimeTracker";
import FilterPanel from "../components/FilterPanel";
import TimeLogTable from "../components/TimeLogTable";
import WeeklySummary from "../components/WeeklySummary";

const Dashboard: React.FC = () => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h4" gutterBottom>
          Time Tracking Dashboard
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 2 }}>
          <TimeTracker />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={{ p: 2 }}>
          <FilterPanel />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 2 }}>
          <TimeLogTable />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 2 }}>
          <WeeklySummary />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
