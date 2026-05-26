"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Box, Tabs, Tab, Container } from "@mui/material";
import ExpenseForm from "../components/Expense/ExpenseForm";
import ExpenseStats from "../components/Expense/ExpenseStats";
import ExpenseTable from "../components/Expense/ExpenseTable";
import LoanForm from "../components/Loan/LoanForm";
import LoanStats from "../components/Loan/LoanStats";
import LoanTable from "../components/Loan/LoanTable";
import { fetchExpenses, fetchExpenseStats } from "../store/expensesSlice";
import { fetchLoans, fetchLoanStats } from "../store/loansSlice";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DashboardTabs() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const isClient = typeof window !== "undefined";

  const handleUnauthorized = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
    router.push("/login");
  }, [router]);

  useEffect(() => {
    if (!isClient) return;

    const checkAuth = async () => {
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

      try {
        const res = await fetch("/api/expenses?limit=1");
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }
        if (res.ok) {
          setAuthChecked(true);
          setLoading(false);
          dispatch(fetchExpenses({ month: "all", page: 1, limit: 10 }));
          dispatch(fetchExpenseStats());
          // dispatch(fetchLoans({ type: "all", page: 1, limit: 10 }));
          // dispatch(fetchLoanStats());
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        handleUnauthorized();
      }
    };

    checkAuth();
  }, [isClient, router, dispatch, handleUnauthorized]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (loading || !authChecked) {
    return null;
  }

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="dashboard tabs"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "rgba(30,30,35,0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Tab label="Expense" id="tab-0" aria-controls="tabpanel-0" />
        <Tab label="Loan" id="tab-1" aria-controls="tabpanel-1" />
      </Tabs>

      <TabPanel value={currentTab} index={0}>
        <Container maxWidth={false} sx={{ mt: 2, mb: 4 }}>
          <ExpenseStats />
        </Container>
        <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
          <ExpenseForm />
        </Container>
        <Container maxWidth={false} sx={{ mt: 2, mb: 4 }}>
          <ExpenseTable />
        </Container>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <Container maxWidth={false} sx={{ mt: 2, mb: 4 }}>
          <LoanStats />
        </Container>
        <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
          <LoanForm />
        </Container>
        <Container maxWidth={false} sx={{ mt: 2, mb: 4 }}>
          <LoanTable />
        </Container>
      </TabPanel>
    </Box>
  );
}
