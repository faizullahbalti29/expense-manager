"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function EditExpenseModal({
  open,
  handleClose,
  expense,
  handleUpdate,
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate({
      ...expense,
      name,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
      description,
    });
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          mb={2}
          fontWeight="bold"
        >
          Edit Expense
        </Typography>
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
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
