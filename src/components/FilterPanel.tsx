// src/components/FilterPanel.tsx
import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import useTimeTrackingStore from "../store/timeTrackingStore";

const FilterPanel: React.FC = () => {
  const { projects, tags, filters, updateFilters } = useTimeTrackingStore();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Filter Time Entries
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl fullWidth>
          <InputLabel id="filter-project">Project</InputLabel>
          <Select
            labelId="filter-project"
            value={filters.project || ""}
            label="Project"
            onChange={(e) =>
              updateFilters({ project: e.target.value as number | null })
            }
          >
            <MenuItem value="">All Projects</MenuItem>
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="filter-tag">Tag</InputLabel>
          <Select
            labelId="filter-tag"
            value={filters.tag || ""}
            label="Tag"
            onChange={(e) =>
              updateFilters({ tag: e.target.value as string | null })
            }
          >
            <MenuItem value="">All Tags</MenuItem>
            {tags.map((tag) => (
              <MenuItem key={tag} value={tag}>
                {tag}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="filter-time-range">Time Range</InputLabel>
          <Select
            labelId="filter-time-range"
            value={filters.timeRange}
            label="Time Range"
            onChange={(e) => updateFilters({ timeRange: e.target.value })}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          onClick={() =>
            updateFilters({ project: null, tag: null, timeRange: "today" })
          }
          sx={{ alignSelf: "center" }}
        >
          Reset
        </Button>
      </Stack>
    </Box>
  );
};

export default FilterPanel;
