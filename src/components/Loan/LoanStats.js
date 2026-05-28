"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, CardContent, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import StatsTableSkeleton from "../UI/StatsTableSkeleton";
import { fetchLoanStats } from "../../store/loansSlice";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DoneAllIcon from "@mui/icons-material/DoneAll";
export default function LoanStats() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.loans);
  const statsLoading = useSelector((state) => state.loans.stats.loading);

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
        await dispatch(fetchLoanStats()).unwrap();
      } catch (error) {
        if (error?.message === "Unauthorized") {
          handleUnauthorized();
        }
      }
    };

    loadStats();
  }, [dispatch, handleUnauthorized]);

  if (statsLoading) {
    return <StatsTableSkeleton showStats statsCount={4} showTable={false} />;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 2,
        mb: 4,
        width: 1,
      }}
    >
      {/* Loan Given Card */}
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
                <ArrowDownwardIcon
                  sx={{ fontSize: "1.25rem", color: "#10b981" }}
                />
                <Typography color="textSecondary" sx={{ fontSize: "0.875rem" }}>
                  Receivable
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(to right, #10b981, #34d399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Rs. {stats?.loanGiven.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Loan Taken Card */}
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
                <ArrowUpwardIcon
                  sx={{ fontSize: "1.25rem", color: "error.main" }}
                />
                <Typography color="textSecondary" sx={{ fontSize: "0.875rem" }}>
                  Payable
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "error.main",
                }}
              >
                Rs. {stats?.loanTaken.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      {/* Loan Payable Returned Card */}
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
                <TaskAltIcon
                  sx={{ fontSize: "1.25rem", color: "primary.main" }}
                />
                <Typography color="textSecondary" sx={{ fontSize: "0.875rem" }}>
                  Payable Returned
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
                Rs. {stats?.loanTakenReturned?.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      {/* Loan Receivable Returned Card */}
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
                <DoneAllIcon color="primary" />
                <Typography color="textSecondary" sx={{ fontSize: "0.875rem" }}>
                  Receivable Returned
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
                Rs. {stats?.loanGivenReturned?.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
