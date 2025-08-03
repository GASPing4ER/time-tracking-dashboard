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
  const { timeEntries } = useTimeTrackingStore();

  // Get current week (Monday to Sunday)
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const data = weekDays.map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const dayEntries = timeEntries.filter(
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
      name: format(day, "EEE"), // Day abbreviation (Mon, Tue, etc.)
      date: format(day, "MMM d"), // Date (Aug 1, Aug 2, etc.)
      fullDate: format(day, "yyyy-MM-dd"), // For reference
      hours: parseFloat(totalHours),
    };
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Weekly Summary (Hours) - {format(weekStart, "MMM d")} to{" "}
        {format(weekEnd, "MMM d")}
      </Typography>

      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} hours`, "Duration"]}
              labelFormatter={(label) => {
                const dayData = data.find((d) => d.name === label);
                return dayData
                  ? format(new Date(dayData.fullDate), "EEEE, MMM d")
                  : label;
              }}
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
