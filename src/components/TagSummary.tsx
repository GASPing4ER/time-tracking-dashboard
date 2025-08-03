// src/components/TagSummary.tsx
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
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

interface CustomTickProps {
  x: number;
  y: number;
  payload: {
    value: string;
    offset: number;
    index: number;
  };
}

const TagSummary: React.FC = () => {
  const { timeEntries, tags } = useTimeTrackingStore();
  const theme = useTheme();

  // Custom tick component for vertical labels
  const CustomizedAxisTick = (props: CustomTickProps) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill={theme.palette.text.secondary}
          transform="rotate(-45)"
          fontSize={12}
        >
          {payload.value}
        </text>
      </g>
    );
  };

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
        {" "}
        {/* Increased height for rotated labels */}
        {tagData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={tagData}
              margin={{
                bottom: 20,
                top: 20,
                right: 20,
                left: -20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={(props) => <CustomizedAxisTick {...props} />}
                interval={0}
                height={70}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} hours`, "Duration"]}
                labelFormatter={(label) => `Tag: ${label}`}
              />
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
