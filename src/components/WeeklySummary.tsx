import React from "react";
import { Box, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  format,
  startOfWeek,
  endOfWeek,
  parseISO,
  eachDayOfInterval,
  differenceInMinutes,
} from "date-fns";
import useTimeTrackingStore from "../store/timeTrackingStore";

const WeeklySummary: React.FC = () => {
  const { timeEntries, projects } = useTimeTrackingStore();

  // Get current week (Monday to Sunday)
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Prepare data for stacked bar chart
  const data = weekDays.map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const dayEntries = timeEntries.filter(
      (entry) => format(parseISO(entry.startTime), "yyyy-MM-dd") === dayStr
    );

    // Calculate time per project for this day
    const projectData: Record<string, number> = {};

    projects.forEach((project) => {
      const projectEntries = dayEntries.filter(
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

      projectData[`project_${project.id}`] = parseFloat(
        (totalMinutes / 60).toFixed(1)
      );
    });

    return {
      name: format(day, "EEE"), // Day abbreviation (Mon, Tue, etc.)
      date: format(day, "MMM d"), // Date (Aug 1, Aug 2, etc.)
      fullDate: format(day, "yyyy-MM-dd"), // For reference
      ...projectData,
    };
  });

  // Create a Bar for each project
  const renderProjectBars = () => {
    return projects.map((project) => (
      <Bar
        key={`project_${project.id}`}
        dataKey={`project_${project.id}`}
        name={project.name}
        stackId="a"
        fill={project.color}
        radius={project.id === projects[0].id ? [4, 4, 0, 0] : 0} // Only round corners for first project
      />
    ));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Weekly Summary by Project (Hours) - {format(weekStart, "MMM d")} to{" "}
        {format(weekEnd, "MMM d")}
      </Typography>

      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => {
                const projectName = name.toString().replace("project_", "");
                const project = projects.find(
                  (p) => `project_${p.id}` === name
                );
                return [`${value} hours`, project?.name || projectName];
              }}
              labelFormatter={(label) => {
                const dayData = data.find((d) => d.name === label);
                return dayData
                  ? format(new Date(dayData.fullDate), "EEEE, MMM d")
                  : label;
              }}
            />
            <Legend />
            {renderProjectBars()}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default WeeklySummary;
