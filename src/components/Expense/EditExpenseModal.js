"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import {
  updateExpense,
  fetchExpenses,
  fetchExpenseStats,
} from "../../store/expensesSlice";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: "24px",
  borderRadius: 2,
};

export default function EditExpenseModal({
  open,
  handleClose,
  expense,
  setAlert,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { pagination, filters } = useSelector((state) => state.expenses);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [updatingExpense, setUpdatingExpense] = useState(false);
  // const [alert, setAlert] = useState({ open: false, type: "", message: "" });

  useEffect(() => {
    if (expense) {
      setName(expense.name);
      setAmount(expense.amount);
      setDescription(expense.description || "");
      // Format date for input type="date"
      const d = new Date(expense.date);
      const isoDate = d.toISOString().split("T")[0];
      setDate(isoDate);
    }
  }, [expense]);
  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
    router.push("/login");
  };

  const updateExpenseHandler = async (updatedExpense) => {
    setUpdatingExpense(true);
    try {
      await dispatch(updateExpense(updatedExpense)).unwrap();
      setAlert({
        open: true,
        type: "success",
        message: "Expense updated successfully!",
      });
      dispatch(
        fetchExpenses({
          month: filters.month,
          page: pagination.currentPage,
          limit: pagination.limit,
        }),
      );
      dispatch(fetchExpenseStats());
      // window.scrollTo({ top: 0, behavior: "smooth" });
      handleClose();
    } catch (error) {
      if (error?.message === "Unauthorized") {
        handleUnauthorized();
        return;
      }
      setAlert({
        open: true,
        type: "error",
        message: error?.message || "Failed to update expense",
      });
      // window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setUpdatingExpense(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateExpenseHandler({
      id: expense._id,
      ...expense,
      name,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
      description,
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableScrollLock
    >
      <Box sx={modalStyle}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          mb={2}
          // fontWeight="bold"
        >
          Edit Expense
        </Typography>
        {/* {alert.open && (
          <Alert
            severity={alert.type}
            sx={{ mb: 2, borderRadius: 2 }}
            onClose={() => setAlert({ open: false, type: "", message: "" })}
          >
            {alert.message}
          </Alert>
        )} */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Expense Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Amount"
            type="number"
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            inputProps={{ step: "0.01" }}
          />
          <TextField
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
          >
            <Button
              onClick={handleClose}
              color="error"
              disabled={updatingExpense}
              size="medium"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="medium"
              color="primary"
              disabled={updatingExpense}
            >
              {updatingExpense ? "Updating..." : "Update"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
