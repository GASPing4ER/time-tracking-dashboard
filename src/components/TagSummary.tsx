// src/components/TagSummary.tsx
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
import { differenceInMinutes, parseISO } from "date-fns";
import useTimeTrackingStore from "../store/timeTrackingStore";

const TagSummary: React.FC = () => {
  const { timeEntries, tags } = useTimeTrackingStore();

  const tagData = tags
    .map((tag) => {
      const tagEntries = timeEntries.filter((entry) => entry.tag === tag);

      const totalMinutes = tagEntries.reduce((sum, entry) => {
        return (
          sum +
          differenceInMinutes(
            parseISO(entry.endTime),
            parseISO(entry.startTime)
          )
        );
      }, 0);

      return {
        name: tag,
        hours: parseFloat((totalMinutes / 60).toFixed(1)),
      };
    })
    .filter((item) => item.hours > 0);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Time by Tag
      </Typography>

      <Box sx={{ height: 300 }}>
        {tagData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tagData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} hours`, "Duration"]} />
              <Legend />
              <Bar
                dataKey="hours"
                fill="#FF6B6B"
                name="Hours"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body1" align="center" sx={{ mt: 8 }}>
            No tag data available
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TagSummary;
