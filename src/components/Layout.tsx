// src/components/Layout.tsx
import React, { type ReactNode } from "react";
import { Box } from "@mui/material";
import AppBar from "./AppBar";
import Drawer from "./Drawer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar />
      <Drawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          mt: "60px",
          ml: { sm: "240px" },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
