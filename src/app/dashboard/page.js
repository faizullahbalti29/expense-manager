"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import ExpenseForm from "../../components/Expense/ExpenseForm";
import ExpenseStats from "../../components/Expense/ExpenseStats";
import ExpenseTable from "../../components/Expense/ExpenseTable";
import { fetchExpenses, fetchExpenseStats } from "../../store/expensesSlice";
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
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LockResetIcon from "@mui/icons-material/LockReset";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const isClient = typeof window !== "undefined";
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    router.replace("/");
  }, []);

  return (
    // <Box sx={{ flexGrow: 1 }}>
    //   <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
    //     <ExpenseStats />
    //   </Container>

    //   <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
    //     <ExpenseForm />
    //   </Container>
    //   <Container maxWidth={false} sx={{ mt: 2, mb: 4 }}>
    //     <ExpenseTable />
    //   </Container>
    // </Box>
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
