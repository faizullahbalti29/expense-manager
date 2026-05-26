"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Tab,
  Tabs,
  useTheme,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LockResetIcon from "@mui/icons-material/LockReset";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Dashboard from "./dashboard/page";
import React from "react";
import LoanDashboard from "@/components/Loan/LoanDashboard";
export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const isClient = typeof window !== "undefined";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [value, setValue] = useState(0);
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleUnauthorized = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
    router.push("/login");
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
    router.push("/login");
  };
  useEffect(() => {
    if (!isClient) return;

    const checkAuth = async () => {
      // 1. Basic client-side check
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser({ name: "User" });
      }

      // 2. Verify with API
      try {
        const res = await fetch("/api/expenses?limit=1");
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }
        if (res.ok) {
          setAuthChecked(true);
          setLoading(false);
          // dispatch(fetchExpenses({ month: "all", page: 1, limit: 10 }));
          // dispatch(fetchExpenseStats());
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        handleUnauthorized();
      }
    };

    checkAuth();
  }, [isClient, router, dispatch, handleUnauthorized]);

  if (loading || !authChecked) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              edge="start"
              sx={{ mr: 2, display: { xs: "block", md: "none" } }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: "bold",
                background: "linear-gradient(to right, #c084fc, #6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Expense Manager
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mr: 2,
                display: { xs: "none", sm: "block" },
                color: "text.secondary",
              }}
            >
              Welcome, {user?.name || "User"}
            </Typography>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button
                color="inherit"
                startIcon={<LockResetIcon />}
                onClick={() => router.push("/change-password")}
                sx={{ mr: 1 }}
              >
                Change Password
              </Button>
              <Button
                color="error"
                startIcon={<ExitToAppIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 320 }}>
          <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar>
              <IconButton
                color="inherit"
                onClick={() => setDrawerOpen(false)}
                edge="start"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
                Expense Manager
              </Typography>
            </Toolbar>
          </AppBar>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  router.push("/change-password");
                  setDrawerOpen(false);
                }}
              >
                <ListItemIcon>
                  <LockResetIcon />
                </ListItemIcon>
                <ListItemText primary="Change Password" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  handleLogout();
                  setDrawerOpen(false);
                }}
              >
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Container
        maxWidth={false}
        sx={{ mt: 4, mb: 4 }}
        // sx={{
        //   width: "100%",
        //   bgcolor: theme.palette.background.paper,
        //   borderRadius: 3,
        //   p: 0.5,
        // }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          TabIndicatorProps={{
            style: {
              display: "none",
            },
          }}
          sx={{
            minHeight: 48,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              // borderRadius: 2,
              minHeight: 48,
              color: theme.palette.text.secondary,
              transition: "all 0.25s ease",
            },

            "& .Mui-selected": {
              bgcolor: theme.palette.primary.main,
              color: `${theme.palette.primary.contrastText} !important`,
            },
            // "& .MuiTab-root:not(.Mui-selected)": {
            //   bgcolor: theme.palette.background.paper,
            //   // color: theme.palette.text.primary,
            // },
          }}
        >
          <Tab label="Expense" />
          <Tab label="Loan" />
        </Tabs>
      </Container>
      {value === 0 && <Dashboard />}
      {value === 1 && <LoanDashboard />}
    </>
  );
}
