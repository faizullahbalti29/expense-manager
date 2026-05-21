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
                placeholder="Select Expense Type.."
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
              <Box sx={{ flex: 1, mt: 2 }}>
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
              sx={{ px: 4, flex: 1 }}
            >
              {loading ? "Saving..." : "Add Expense"}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
