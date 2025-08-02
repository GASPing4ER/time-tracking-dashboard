// src/pages/Reports.tsx
import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import WeeklySummary from "../components/WeeklySummary";
import ProjectSummary from "../components/ProjectSummary";
import TagSummary from "../components/TagSummary";

const Reports: React.FC = () => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h4" gutterBottom>
          Reports
        </Typography>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 2 }}>
          <WeeklySummary />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 2 }}>
          <ProjectSummary />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 2 }}>
          <TagSummary />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Reports;
