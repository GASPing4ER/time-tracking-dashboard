// src/pages/Settings.tsx
import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Chip,
  Box,
} from "@mui/material";
import useTimeTrackingStore from "../store/timeTrackingStore";

const Settings: React.FC = () => {
  const { projects, tags, addProject, addTag } = useTimeTrackingStore();
  const [newProject, setNewProject] = useState("");
  const [projectColor, setProjectColor] = useState("#45B7D1");
  const [newTag, setNewTag] = useState("");

  const handleAddProject = () => {
    if (newProject.trim()) {
      addProject({
        name: newProject.trim(),
        color: projectColor,
      });
      setNewProject("");
    }
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag("");
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Projects
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              label="New Project"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              fullWidth
            />
            <TextField
              type="color"
              value={projectColor}
              onChange={(e) => setProjectColor(e.target.value)}
              sx={{ width: 80 }}
            />
            <Button
              variant="contained"
              onClick={handleAddProject}
              disabled={!newProject.trim()}
            >
              Add
            </Button>
          </Stack>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {projects.map((project) => (
              <Chip
                key={project.id}
                label={project.name}
                sx={{
                  backgroundColor: project.color,
                  color: "white",
                  fontWeight: "bold",
                }}
              />
            ))}
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tags
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              label="New Tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleAddTag}
              disabled={!newTag.trim()}
            >
              Add
            </Button>
          </Stack>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {tags.map((tag) => (
              <Chip key={tag} label={tag} variant="outlined" />
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Settings;
