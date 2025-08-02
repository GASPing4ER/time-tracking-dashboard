// src/components/AppBar.tsx
import React from "react";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useTimeTrackingStore from "../store/timeTrackingStore";

const AppBar: React.FC = () => {
  const darkMode = useTimeTrackingStore((state) => state.darkMode);
  const toggleDarkMode = useTimeTrackingStore((state) => state.toggleDarkMode);
  const toggleMobileOpen = useTimeTrackingStore(
    (state) => state.toggleMobileOpen
  );

  return (
    <MuiAppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleMobileOpen}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Time Tracker
        </Typography>
        <IconButton color="inherit" onClick={toggleDarkMode}>
          {darkMode ? "☀️" : "🌙"}
        </IconButton>
        <Avatar sx={{ ml: 2 }}>U</Avatar>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
