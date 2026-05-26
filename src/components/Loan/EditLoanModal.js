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
  MenuItem,
  Alert,
} from "@mui/material";
import { updateLoan, fetchLoans, fetchLoanStats } from "../../store/loansSlice";
import { LOAN_TYPES } from "./LoanTable";

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

export default function EditLoanModal({ open, handleClose, loan, setAlert }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { pagination, filters } = useSelector((state) => state.loans);
  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("given");
  const [date, setDate] = useState("");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !loan) return;
    if (loan) {
      setBeneficiary(loan.beneficiary);
      setAmount(loan.amount);
      setType(loan.type);
      const d = new Date(loan.date);
      const isoDate = d.toISOString().split("T")[0];
      setDate(isoDate);
      setError("");
    }
  }, [loan]);

  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
    router.push("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");

    try {
      await dispatch(
        updateLoan({
          id: loan._id,
          beneficiary,
          amount: parseFloat(amount),
          type,
          date: new Date(date).toISOString(),
        }),
      ).unwrap();

      setAlert({
        open: true,
        type: "success",
        message: "Loan updated successfully!",
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
      window.scrollTo({ top: 0, behavior: "smooth" });
      handleClose();
    } catch (err) {
      if (err?.message === "Unauthorized") {
        handleUnauthorized();
        return;
      }
      setError(err?.message || "Failed to update loan");
      setAlert({
        open: true,
        type: "error",
        message: err?.message || "Failed to update loan",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="edit-loan-modal">
      <Box sx={modalStyle}>
        <Typography
          id="edit-loan-modal"
          variant="h6"
          component="h2"
          mb={2}
          fontWeight="bold"
        >
          Edit Loan
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            fullWidth
            label="Beneficiary Name"
            variant="outlined"
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
            required
          />
          <TextField
            select
            fullWidth
            label="Loan Type"
            variant="outlined"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            {LOAN_TYPES.slice(1).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
            {/* </TextField> */}
            {/* <MenuItem value="receivable">Receivable</MenuItem>} */}
            {/* <MenuItem value="payable">Payable</MenuItem> */}
          </TextField>
          <TextField
            fullWidth
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
            fullWidth
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
          >
            <Button onClick={handleClose} color="inherit" disabled={updating}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={updating}
            >
              {updating ? "Updating..." : "Update"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
