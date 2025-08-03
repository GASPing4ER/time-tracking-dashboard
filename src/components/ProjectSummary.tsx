// src/components/ProjectSummary.tsx
import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { differenceInMinutes, parseISO } from "date-fns";
import useTimeTrackingStore from "../store/timeTrackingStore";

const ProjectSummary: React.FC = () => {
  const { timeEntries, projects } = useTimeTrackingStore();
  const theme = useTheme();
  const isMediumScreenUp = useMediaQuery(theme.breakpoints.up("lg"));

  const projectData = projects
    .map((project) => {
      const projectEntries = timeEntries.filter(
        (entry) => entry.projectId === project.id
      );

      const totalMinutes = projectEntries.reduce((sum, entry) => {
        return (
          sum +
          differenceInMinutes(
            parseISO(entry.endTime),
            parseISO(entry.startTime)
          )
        );
      }, 0);

      return {
        name: project.name,
        value: parseFloat((totalMinutes / 60).toFixed(1)),
        color: project.color,
      };
    })
    .filter((item) => item.value > 0);

  const renderCustomizedLabel = ({
    name,
    percent,
  }: {
    name: string;
    percent?: number;
  }) => {
    return `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Time by Project
      </Typography>

      <Box sx={{ height: 300 }}>
        {projectData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={projectData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={isMediumScreenUp ? renderCustomizedLabel : undefined}
              >
                {projectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value} hours`, "Duration"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body1" align="center" sx={{ mt: 8 }}>
            No project data available
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProjectSummary;
