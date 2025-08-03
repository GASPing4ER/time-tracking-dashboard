import { IconButton } from "@mui/material";
import React from "react";
import useTimeTrackingStore from "../store/timeTrackingStore";

const ThemeSwitcher: React.FC = () => {
  const darkMode = useTimeTrackingStore((state) => state.darkMode);
  const toggleDarkMode = useTimeTrackingStore((state) => state.toggleDarkMode);
  return (
    <IconButton color="inherit" onClick={toggleDarkMode}>
      {darkMode ? "☀️" : "🌙"}
    </IconButton>
  );
};

export default ThemeSwitcher;
