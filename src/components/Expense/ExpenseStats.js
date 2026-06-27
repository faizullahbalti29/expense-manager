"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, CardContent, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import StatsTableSkeleton from "../UI/StatsTableSkeleton";
import { fetchExpenseStats } from "../../store/expensesSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

const MONTH_NAMES = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const BAR_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#c084fc",
  "#ec4899",
  "#f97316",
  "#fb923c",
  "#facc15",
  "#34d399",
  "#22d3ee",
  "#38bdf8",
  "#818cf8",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          background: "rgba(20,20,28,0.95)",
          border: "1px solid rgba(99,102,241,0.35)",
          borderRadius: "8px",
          px: 2,
          py: 1.2,
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography
          sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.3 }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "0.9rem",
            background: "linear-gradient(to right, #6366f1, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Rs. {payload[0].value.toFixed(2)}
        </Typography>
      </Box>
    );
  }
  return null;
};

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
  }, [dispatch, handleUnauthorized]);

  if (statsLoading) {
    return (
      <StatsTableSkeleton
        showStats
        statsCount={4}
        showChart
        showTable={false}
      />
    );
  }

  const today = new Date();
  const dayOfMonth = today.getDate();
  const currentMonthName = today.toLocaleDateString("en-US", { month: "long" });
  const prevMonthName = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1,
  ).toLocaleDateString("en-US", { month: "long" });
  const currentMonthIndex = today.getMonth() + 1;

  const chartData = Array.from({ length: 12 }, (_, index) => ({
    monthIndex: index + 1,
    month: MONTH_NAMES[index + 1],
    total: 0,
  }));

  (stats?.monthWiseTotal ?? []).forEach((item) => {
    const monthIndex = Number(item._id);
    if (monthIndex >= 1 && monthIndex <= 12) {
      chartData[monthIndex - 1].total = item.total ?? 0;
    }
  });

  const getBarColor = (monthIndex) => {
    return BAR_COLORS[monthIndex] || "rgba(139,92,246,0.15)";
  };

  const renderCurrency = (amount, fontSize = "2rem") => (
    <Typography
      component="span"
      sx={{ display: "inline-flex", alignItems: "baseline", gap: 0.5 }}
    >
      <Box
        component="span"
        sx={{ fontSize: "0.7em", color: "#71717a", fontWeight: 400 }}
      >
        Rs.
      </Box>
      <Box
        component="span"
        sx={{ fontWeight: 700, fontSize, color: "#f8fafc" }}
      >
        {amount}
      </Box>
    </Typography>
  );
  const cardSx = {
    background: "#18181b",
    backdropFilter: "blur(10px)",
    border: "1px solid #27272a",
    borderRadius: "8px",
  };

  const statCardSx = {
    ...cardSx,
    minHeight: 128,
  };

  const statContentSx = {
    py: 2,
    px: 2.25,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 0.75,
    minHeight: 128,
    color: "#f8fafc",
  };

  return (
    <Box sx={{ display: "grid", gap: 2, mb: 4 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        <Card sx={statCardSx}>
          <CardContent sx={statContentSx}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <DateRangeIcon sx={{ fontSize: "0.95rem", color: "#8b5cf6" }} />
              <Typography
                sx={{ fontSize: "0.95rem", color: "#94a3b8", lineHeight: 1 }}
              >
                This Year
              </Typography>
            </Box>
            {renderCurrency(stats?.yearlyTotal?.toFixed(2) ?? "0.00", "2rem")}
          </CardContent>
        </Card>
        <Card sx={statCardSx}>
          <CardContent sx={statContentSx}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <CalendarMonthIcon
                sx={{ fontSize: "0.95rem", color: "#8b5cf6" }}
              />
              <Typography
                sx={{ fontSize: "0.95rem", color: "#94a3b8", lineHeight: 1 }}
              >
                This Month
              </Typography>
            </Box>
            {renderCurrency(stats?.monthlyTotal?.toFixed(2) ?? "0.00", "2rem")}
          </CardContent>
        </Card>
        <Card sx={statCardSx}>
          <CardContent sx={statContentSx}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <KeyboardArrowLeftIcon
                sx={{ fontSize: "0.95rem", color: "#8b5cf6" }}
              />
              <Typography
                sx={{ fontSize: "0.95rem", color: "#94a3b8", lineHeight: 1 }}
              >
                Previous Month
              </Typography>
            </Box>
            {renderCurrency(
              stats?.previousMonthTotal?.toFixed(2) ?? "0.00",
              "2rem",
            )}
          </CardContent>
        </Card>

        <Card sx={statCardSx}>
          <CardContent sx={statContentSx}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <CompareArrowsIcon
                sx={{ fontSize: "0.95rem", color: "#8b5cf6" }}
              />
              <Typography
                sx={{ fontSize: "0.95rem", color: "#94a3b8", lineHeight: 1 }}
              >
                Month-to-Date
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{ fontSize: "0.72rem", color: "#71717a", mb: 0.5 }}
                >
                  {prevMonthName} (upto {dayOfMonth})
                </Typography>
                {renderCurrency(
                  stats?.prevMonthTotal?.toFixed(2) ?? "0.00",
                  "1rem",
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{ fontSize: "0.72rem", color: "#71717a", mb: 0.5 }}
                >
                  {currentMonthName} (upto {dayOfMonth})
                </Typography>
                {renderCurrency(
                  stats?.monthlyTotal?.toFixed(2) ?? "0.00",
                  "1rem",
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ ...cardSx, minHeight: 360 }}>
        <CardContent
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            "&:last-child": { pb: 2 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#8b5cf6",
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{ fontSize: "0.95rem", color: "#94a3b8", fontWeight: 500 }}
            >
              Monthly Expense Distribution
            </Typography>
          </Box>

          {chartData.length === 0 ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ color: "#71717a", fontSize: "0.9rem" }}>
                No monthly data available
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                flex: 1,
                minHeight: 320,
                height: 320,
                overflowX: "auto",
                overflowY: "hidden",
              }}
            >
              <Box sx={{ minWidth: { xs: 420, sm: 560 }, height: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 6, right: 12, left: 0, bottom: 0 }}
                    barCategoryGap="28%"
                  >
                    <CartesianGrid
                      stroke="rgba(148,163,184,0.08)"
                      vertical={false}
                      strokeDasharray="2 2"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#cbd5e1", fontSize: 11 }}
                      axisLine={{ stroke: "#334155" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#cbd5e1", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) =>
                        value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
                      }
                      width={40}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "rgba(139,92,246,0.08)" }}
                    />
                    <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={42}>
                      <LabelList
                        dataKey="total"
                        position="top"
                        formatter={(value) =>
                          value >= 1000
                            ? `${(value / 1000).toFixed(2)}k`
                            : value
                        }
                        style={{
                          fill: "#e2e8f0",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      />
                      {chartData.map((entry) => (
                        <Cell
                          key={`cell-${entry.monthIndex}`}
                          fill={getBarColor(entry.monthIndex)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
