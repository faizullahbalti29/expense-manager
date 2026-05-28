"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { addLoan, fetchLoans, fetchLoanStats } from "../../store/loansSlice";
import LoanTable, { LOAN_TYPES } from "./LoanTable";

export default function LoanForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { pagination, filters } = useSelector((state) => state.loans);
  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });
  const [description, setDescription] = useState("");
  const [loanDate, setLoanDate] = useState("");

  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
    router.push("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!beneficiary || !amount) return;

    setLoading(true);
    try {
      await dispatch(
        addLoan({
          beneficiary,
          amount: parseFloat(amount),
          type,
          date: loanDate
            ? new Date(loanDate).toISOString()
            : new Date().toISOString(),
          status: "not-returned",
          description,
        }),
      ).unwrap();

      setAlert({
        open: true,
        type: "success",
        message: "Loan added successfully!",
      });

      dispatch(
        fetchLoans({
          type: filters.type,
          page: pagination.currentPage,
          limit: pagination.limit,
          status: filters.status,
        }),
      );
      dispatch(fetchLoanStats());

      setBeneficiary("");
      setAmount("");
      setType("");
      setDescription("");
      setLoanDate("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if (error?.message === "Unauthorized") {
        handleUnauthorized();
        return;
      }
      console.log(error);
      setAlert({
        open: true,
        type: "error",
        message: error?.message || error || "Failed to add loan",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        mb: 4,
        background: "rgba(30,30,35,0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.08)",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}
        >
          Add New Loan
        </Typography>
        {alert.open && (
          <Alert
            severity={alert.type}
            sx={{ mb: 2, borderRadius: 2 }}
            onClose={() => setAlert({ open: false, message: "", type: "" })}
          >
            {alert.message}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr 1fr",
              },
            }}
          >
            <Box>
              <TextField
                fullWidth
                label="Beneficiary Name"
                placeholder="e.g. John Doe"
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
                variant="outlined"
                required
              />
            </Box>

            <Box>
              <TextField
                select
                fullWidth
                value={type}
                onChange={(e) => setType(e.target.value)}
                label="Loan Type"
                variant="outlined"
                sx={{ flex: 1 }}
                SelectProps={{
                  MenuProps: {
                    disableScrollLock: true,
                  },
                }}
                required
              >
                {LOAN_TYPES.slice(1).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                required
              />
            </Box>
            <Box>
              <TextField
                type="date"
                fullWidth
                label="Date"
                InputLabelProps={{ shrink: true }}
                value={loanDate}
                onChange={(e) => setLoanDate(e.target.value)}
                required
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                variant="outlined"
                inputProps={{ step: "0.01" }}
                required
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading || !beneficiary || !amount}
              startIcon={<AddIcon />}
              // sx={{ px: 4, flex: 1 }}
            >
              {loading ? "Saving..." : "Save Loan"}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
