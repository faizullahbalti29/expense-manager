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
  Grid,
  CircularProgress,
  Container,
} from "@mui/material";
import { useSnackbar } from "notistack";
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Assuming icons-material is installed
import AddIcon from "@mui/icons-material/Add";
import {
  addExpense,
  fetchExpenses,
  fetchExpenseStats,
  totalMonthlyFilteredExpenses,
} from "../../store/expensesSlice";
const EXPENSE_CATEGORIES = [
  { label: "Hostel Fees", value: "Hostel Fees" },
  { label: "Metro Charge", value: "Metro Charge" },
  { label: "Food", value: "Food" },
  { label: "Travel", value: "Travel" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Shopping", value: "Shopping" },
  { label: "Other", value: "Other" },
];

export default function ExpenseForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { pagination, filters } = useSelector((state) => state.expenses);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isCustomName, setIsCustomName] = useState(false);
  const [customName, setCustomName] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
    router.push("/login");
  };

  const addExpenseHandler = async (expenseData) => {
    setLoading(true);
    try {
      const result = await dispatch(addExpense(expenseData)).unwrap();
      enqueueSnackbar("Expense added successfully!", { variant: "success" });
      dispatch(
        fetchExpenses({
          month: filters.month,
          page: pagination.currentPage,
          limit: pagination.limit,
        }),
      );
      dispatch(fetchExpenseStats());
      dispatch(totalMonthlyFilteredExpenses(filters.month));
      // window.scrollTo({ top: 0, behavior: "smooth" });
      return result;
    } catch (error) {
      if (error === "Unauthorized") {
        handleUnauthorized();
        return;
      }
      console.log(error)
      enqueueSnackbar(error || "Failed to add expense", { variant: "error" });
      // window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    await addExpenseHandler({
      name: isCustomName ? customName : name,
      amount: parseFloat(amount),
      date: expenseDate
        ? new Date(expenseDate).toISOString()
        : new Date().toISOString(),
      description,
    });

    setName("");
    setAmount("");
    setDescription("");
    setExpenseDate("");
    setCustomName("");
    setIsCustomName(false);
  };

  const handleNameChange = (e) => {
    const selectedName = e.target.value;
    if (selectedName === "Other") {
      setIsCustomName(true);
    } else {
      setIsCustomName(false);
    }
    setName(selectedName);
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
          Add New Expense
        </Typography>
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
                select
                fullWidth
                value={name}
                onChange={handleNameChange}
                variant="outlined"
                placeholder="Select Expense Type"
                label="Select Expense Type"
                sx={{ flex: 1 }}
                SelectProps={{
                  MenuProps: {
                    disableScrollLock: true,
                  },
                }}
              >
                {EXPENSE_CATEGORIES.map((option, index) => (
                  <MenuItem
                    key={index}
                    value={option.value}
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            {isCustomName && (
              <Box>
                <TextField
                  fullWidth
                  label="Expense Name"
                  placeholder="e.g. Lunch"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  variant="outlined"
                />
              </Box>
            )}

            <Box sx={{}}>
              <TextField
                fullWidth
                label="Description"
                type="text"
                placeholder="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
              />
            </Box>
            <Box sx={{}}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                variant="outlined"
              />
            </Box>
            <TextField
              type="date"
              fullWidth
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <AddIcon />
                )
              }
              disabled={!name || !amount || loading}
            // sx={{ px: 4, flex: 1 }}
            >
              {loading ? "Saving..." : "Add Expense"}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
