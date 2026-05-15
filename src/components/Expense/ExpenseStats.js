"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

export default function ExpenseStats({ statsRefreshKey }) {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
    router.push("/login");
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const currentMonth = new Date().getMonth();
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

        // Fetch current month stats
        const currentRes = await fetch(
          `/api/expenses/stats?month=${currentMonth}`,
        );
        if (currentRes.status === 401) {
          handleUnauthorized();
          return;
        }
        const currentData = currentRes.ok ? await currentRes.json() : {};

        // Fetch previous month stats
        const previousRes = await fetch(
          `/api/expenses/stats?month=${previousMonth}`,
        );
        if (previousRes.status === 401) {
          handleUnauthorized();
          return;
        }
        const previousData = previousRes.ok ? await previousRes.json() : {};

        setStats({
          monthlyTotal: currentData.monthlyTotal || 0,
          yearlyTotal: currentData.yearlyTotal || 0,
          previousMonthTotal: previousData.monthlyTotal || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [statsRefreshKey]);

  if (loading) {
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
