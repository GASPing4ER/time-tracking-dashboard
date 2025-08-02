// src/components/WeeklySummary.tsx
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
  subDays,
  parseISO,
  eachDayOfInterval,
  differenceInMinutes,
} from "date-fns";
import useTimeTrackingStore from "../store/timeTrackingStore";

const WeeklySummary: React.FC = () => {
  const { timeEntries, filters } = useTimeTrackingStore();

  const filteredEntries = timeEntries.filter((entry) => {
    // Filter by project
    if (filters.project && entry.projectId !== filters.project) return false;

    // Filter by tag
    if (filters.tag && entry.tag !== filters.tag) return false;

    // Filter by time range
    const entryDate = parseISO(entry.startTime);
    const now = new Date();

    if (filters.timeRange === "today") {
      return (
        entryDate.getDate() === now.getDate() &&
        entryDate.getMonth() === now.getMonth() &&
        entryDate.getFullYear() === now.getFullYear()
      );
    }

    if (filters.timeRange === "week") {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      return entryDate >= startOfWeek;
    }

    if (filters.timeRange === "month") {
      return (
        entryDate.getMonth() === now.getMonth() &&
        entryDate.getFullYear() === now.getFullYear()
      );
    }

    return true;
  });

  // Generate data for the last 7 days
  const today = new Date();
  const lastWeek = subDays(today, 6);
  const days = eachDayOfInterval({ start: lastWeek, end: today });

  const data = days.map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const dayEntries = filteredEntries.filter(
      (entry) => format(parseISO(entry.startTime), "yyyy-MM-dd") === dayStr
    );

    const totalMinutes = dayEntries.reduce((sum, entry) => {
      return (
        sum +
        differenceInMinutes(parseISO(entry.endTime), parseISO(entry.startTime))
      );
    }, 0);

    const totalHours = (totalMinutes / 60).toFixed(1);

    return {
      name: format(day, "EEE"),
      date: format(day, "MMM d"),
      hours: parseFloat(totalHours),
    };
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Weekly Summary (Hours)
      </Typography>

      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} hours`, "Duration"]}
              labelFormatter={(label) =>
                data.find((d) => d.name === label)?.date || label
              }
            />
            <Legend />
            <Bar
              dataKey="hours"
              fill="#45B7D1"
              name="Hours Tracked"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default WeeklySummary;
