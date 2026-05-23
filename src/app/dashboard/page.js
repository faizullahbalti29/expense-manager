"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ExpenseForm from "../../components/Expense/ExpenseForm";
import ExpenseStats from "../../components/Expense/ExpenseStats";
import ExpenseTable from "../../components/Expense/ExpenseTable";
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
  Alert,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LockResetIcon from "@mui/icons-material/LockReset";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Dashboard() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [addingExpense, setAddingExpense] = useState(false);
  const [updatingExpense, setUpdatingExpense] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });
  // Initial Auth Check and Data Load
  useEffect(() => {
    setIsClient(true);
  }, []);

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
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        handleUnauthorized();
      }
    };

    checkAuth();
  }, [isClient, router]);

  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
    router.push("/login");
  };

  const addExpenseHandler = async (expenseData) => {
    setAddingExpense(true);
    try {
      // console.log(expenseData);
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (res.ok) {
        const newExpense = await res.json();
        setExpenses((prev) => [newExpense, ...prev]);
        setStatsRefreshKey((prev) => prev + 1);
        setAlert({
          open: true,
          type: "success",
          message: "Expense added successfully!",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // console.log(await res.json());
        const parsedRes = await res.json();
        setAlert({
          open: true,
          type: "error",
          message: parsedRes?.error || "Failed to add expense",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setAddingExpense(false);
    }
  };

  const deleteExpenseHandler = async (id) => {
    setDeletingExpense(id);
    try {
      const res = await fetch(`/api/expenses?id=${id}`, {
        method: "DELETE",
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (res.ok) {
        setExpenses((prev) => prev.filter((expense) => expense._id !== id));
        setStatsRefreshKey((prev) => prev + 1);
        setAlert({
          open: true,
          type: "success",
          message: "Expense deleted successfully!",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const parsedRes = await res.json();
        setAlert({
          open: true,
          type: "error",
          message: parsedRes?.error || "Failed to delete expense",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    } finally {
      setDeletingExpense(null);
    }
  };

  const updateExpenseHandler = async (updatedExpense) => {
    setUpdatingExpense(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: updatedExpense._id,
          ...updatedExpense,
        }),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setExpenses((prev) =>
          prev.map((expense) => (expense._id === data._id ? data : expense)),
        );
        setStatsRefreshKey((prev) => prev + 1);
        setAlert({
          open: true,
          type: "success",
          message: "Expense updated successfully!",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const parsedRes = await res.json();
        setAlert({
          open: true,
          type: "error",
          message: parsedRes?.error || "Failed to update expense",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    } finally {
      setUpdatingExpense(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
    router.push("/login");
  };

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
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
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

      {alert.open && (
        <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
          <Alert
            severity={alert.type}
            sx={{ mb: 2, borderRadius: 2 }}
            onClose={() => setAlert({ open: false, message: "", type: "" })}
            open={alert.open}
          >
            {alert.message}
          </Alert>
        </Container>
      )}
      <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        <ExpenseStats statsRefreshKey={statsRefreshKey} />
      </Container>

      <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        <ExpenseForm onAddExpense={addExpenseHandler} loading={addingExpense} />
      </Container>
      <Container maxWidth={false} sx={{ mt: 2, mb: 4 }}>
        <ExpenseTable
          expenses={expenses}
          onDelete={deleteExpenseHandler}
          onUpdate={updateExpenseHandler}
          deletingExpense={deletingExpense}
          updatingExpense={updatingExpense}
        />
      </Container>
    </Box>
  );
}
