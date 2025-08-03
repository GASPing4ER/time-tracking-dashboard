// src/components/TimeTracker.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Stack,
  Typography,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  InputAdornment,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { differenceInSeconds, parseISO } from "date-fns";
import useTimeTrackingStore from "../store/timeTrackingStore";

const TimeTracker: React.FC = () => {
  const { activeTimer, startTimer, stopTimer, projects, tags, addTimeEntry } =
    useTimeTrackingStore();
  const [projectId, setProjectId] = useState<number>(1);
  const [taskName, setTaskName] = useState<string>("");
  const [tag, setTag] = useState<string>(tags[0]);
  const [tabValue, setTabValue] = useState<"timer" | "manual">("timer");
  const [manualStart, setManualStart] = useState<Dayjs | null>(dayjs());
  const [manualEnd, setManualEnd] = useState<Dayjs | null>(dayjs());
  const [openManualDialog, setOpenManualDialog] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (activeTimer) {
      setElapsedSeconds(
        differenceInSeconds(new Date(), parseISO(activeTimer.startTime))
      );

      interval = setInterval(() => {
        setElapsedSeconds(
          differenceInSeconds(new Date(), parseISO(activeTimer.startTime))
        );
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  const handleStart = () => {
    if (taskName.trim()) {
      startTimer(projectId, taskName, tag);
    }
  };

  const handleStop = () => {
    stopTimer();
    setTaskName("");
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleManualSubmit = async () => {
    if (manualStart && manualEnd && taskName.trim()) {
      await addTimeEntry({
        projectId,
        taskName,
        tag,
        startTime: manualStart.toISOString(),
        endTime: manualEnd.toISOString(),
      });
      setOpenManualDialog(false);
      setTaskName("");
      setManualStart(dayjs());
      setManualEnd(dayjs());
    }
  };

  const calculateDuration = () => {
    if (manualStart && manualEnd) {
      const startDate = manualStart.toDate();
      const endDate = manualEnd.toDate();
      return differenceInSeconds(endDate, startDate);
    }
    return 0;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Track Time
        </Typography>

        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
        >
          <Tab label="Timer" value="timer" />
          <Tab label="Manual Entry" value="manual" />
        </Tabs>

        {tabValue === "timer" ? (
          <Stack spacing={2} sx={{ mt: 2 }}>
            {activeTimer && (
              <Box
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "primary.main",
                  borderRadius: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h4">
                  {formatTime(elapsedSeconds)}
                </Typography>
                <Typography variant="body2">
                  Tracking: {activeTimer.taskName}
                </Typography>
              </Box>
            )}

            <FormControl fullWidth>
              <InputLabel id="project-select-label">Project</InputLabel>
              <Select
                labelId="project-select-label"
                value={projectId}
                label="Project"
                onChange={(e) => setProjectId(Number(e.target.value))}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />

            <FormControl fullWidth>
              <InputLabel id="tag-select-label">Tag</InputLabel>
              <Select
                labelId="tag-select-label"
                value={tag}
                label="Tag"
                onChange={(e) => setTag(e.target.value as string)}
              >
                {tags.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {activeTimer ? (
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={handleStop}
              >
                Stop Timer
              </Button>
            ) : (
              <Button
                fullWidth
                variant="contained"
                onClick={handleStart}
                disabled={!taskName.trim()}
              >
                Start Timer
              </Button>
            )}
          </Stack>
        ) : (
          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="manual-project-select-label">Project</InputLabel>
              <Select
                labelId="manual-project-select-label"
                value={projectId}
                label="Project"
                onChange={(e) => setProjectId(Number(e.target.value))}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />

            <FormControl fullWidth>
              <InputLabel id="manual-tag-select-label">Tag</InputLabel>
              <Select
                labelId="manual-tag-select-label"
                value={tag}
                label="Tag"
                onChange={(e) => setTag(e.target.value as string)}
              >
                {tags.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              fullWidth
              variant="contained"
              onClick={() => setOpenManualDialog(true)}
              disabled={!taskName.trim()}
            >
              Add Time Entry
            </Button>
          </Stack>
        )}

        {/* Manual Entry Dialog */}
        <Dialog
          open={openManualDialog}
          onClose={() => setOpenManualDialog(false)}
        >
          <DialogTitle>Add Manual Time Entry</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TimePicker
                  label="Start Time"
                  value={manualStart}
                  sx={{ width: "100%" }}
                  onChange={(newValue) => setManualStart(newValue)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TimePicker
                  label="End Time"
                  value={manualEnd}
                  sx={{ width: "100%" }}
                  onChange={(newValue) => setManualEnd(newValue)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Duration"
                  value={formatTime(calculateDuration())}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">hh:mm:ss</InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenManualDialog(false)}>Cancel</Button>
            <Button
              onClick={handleManualSubmit}
              variant="contained"
              disabled={!manualStart || !manualEnd}
            >
              Save Entry
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default TimeTracker;
