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
import ThemeSwitcher from "./ThemeSwitcher";

const AppBar: React.FC = () => {
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

        <ThemeSwitcher />

        <Avatar sx={{ ml: 2 }}>G</Avatar>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
