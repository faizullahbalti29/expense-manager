"use client";

import { useState } from "react";
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
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Assuming icons-material is installed
import AddIcon from "@mui/icons-material/Add";
const EXPENSE_CATEGORIES = [
  { label: "Hostel Fees", value: "Hostel Fees" },
  { label: "Metro Charge", value: "Metro Charge" },
  { label: "Food", value: "Food" },
  { label: "Travel", value: "Travel" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Shopping", value: "Shopping" },
  { label: "Other", value: "Other" },
];

export default function ExpenseForm({ onAddExpense, loading = false }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isCustomName, setIsCustomName] = useState(false);
  const [customName, setCustomName] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    onAddExpense({
      id: Date.now().toString(),
      name: isCustomName ? customName : name,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
      description,
    });

    setName("");
    setAmount("");
    setDescription("");
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
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                value={name}
                onChange={handleNameChange}
                variant="outlined"
                placeholder="Select Expense Type.."
                label="Select Expense Type"
                sx={{ minWidth: 300 }}
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
            </Grid>
            {isCustomName && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Expense Name"
                  placeholder="e.g. Lunch"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  variant="outlined"
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description"
                type="text"
                placeholder="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
            >
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
                sx={{ px: 4 }}
              >
                {loading ? "Saving..." : "Add Expense"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
