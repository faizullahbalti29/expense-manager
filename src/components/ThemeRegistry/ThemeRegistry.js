"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"; // Using v14 adapter which is compatible
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7c3aed", // Deep Purple
    },
    secondary: {
      main: "#2e2e38",
    },
    background: {
      default: "#0a0a0a",
      paper: "#1e1e24",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontSize: "14px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            fontSize:"14px"
          },
          "& .MuiInputLabel-root": {
            fontSize: "14px"
          },
          "& .MuiOutlinedInput-input::placeholder": {
            fontSize: "14px"
          },
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
