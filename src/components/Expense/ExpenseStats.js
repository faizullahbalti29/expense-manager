"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { fetchExpenseStats } from "../../store/expensesSlice";

export default function ExpenseStats() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.expenses);
  const statsLoading = useSelector((state) => state.expenses.stats.loading);

  const handleUnauthorized = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
    router.push("/login");
  }, [router]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        await dispatch(fetchExpenseStats()).unwrap();
      } catch (error) {
        if (error?.message === "Unauthorized") {
          handleUnauthorized();
        }
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 60000);
    return () => clearInterval(interval);
  }, [dispatch, handleUnauthorized]);

  if (statsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
        gap: 2,
        mb: 4,
      }}
    >
      {/* Current Year Card */}
      <Card
        sx={{
          background: "rgba(30,30,35,0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <DateRangeIcon
                  sx={{ fontSize: "1.25rem", color: "primary.main" }}
                />
                <Typography color="textSecondary" sx={{ fontSize: "0.875rem" }}>
                  This Year
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(to right, #6366f1, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Rs. {stats?.yearlyTotal.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Previous Month Card */}
      <Card
        sx={{
          background: "rgba(30,30,35,0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <KeyboardArrowLeftIcon
                  sx={{ fontSize: "1.25rem", color: "primary.main" }}
                />
                <Typography color="textSecondary" sx={{ fontSize: "0.875rem" }}>
                  Previous Month
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(to right, #f97316, #fb923c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Rs. {stats?.previousMonthTotal.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Current Month Card */}
      <Card
        sx={{
          background: "rgba(30,30,35,0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <CalendarMonthIcon
                  sx={{ fontSize: "1.25rem", color: "primary.main" }}
                />
                <Typography color="textSecondary" sx={{ fontSize: "0.875rem" }}>
                  This Month
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(to right, #c084fc, #6366f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Rs. {stats?.monthlyTotal.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
