"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ExpenseForm from "../../components/Expense/ExpenseForm";
import ExpenseTable from "../../components/Expense/ExpenseTable";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LockResetIcon from "@mui/icons-material/LockReset";

export default function Dashboard() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingExpense, setAddingExpense] = useState(false);
  const [updatingExpense, setUpdatingExpense] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Initial Auth Check and Data Load
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // 1. Basic client-side check (can be bypassed, but API will protect data)
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

    // 2. Fetch Expenses from API
    const fetchExpenses = async () => {
      try {
        const res = await fetch("/api/expenses");
        if (res.status === 401) {
          // Token expired or invalid
          handleLogout();
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setExpenses(data);
      } catch (error) {
        console.error("Error loading expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [isClient, router]);

  const addExpenseHandler = async (expenseData) => {
    setAddingExpense(true);
    try {

      console.log(expenseData)
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });

      if (res.ok) {
        const newExpense = await res.json();
        setExpenses((prev) => [newExpense, ...prev]);
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

      if (res.ok) {
        setExpenses((prev) => prev.filter((expense) => expense._id !== id));
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

      if (res.ok) {
        const data = await res.json();
        setExpenses((prev) =>
          prev.map((expense) => (expense._id === data._id ? data : expense)),
        );
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    } finally {
      setUpdatingExpense(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
    router.push("/login");
  };

  if (loading) {
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
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth={false} sx={{ mt: 4, mb: 4, }}>
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
