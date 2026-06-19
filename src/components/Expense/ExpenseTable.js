"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Pagination,
  Alert,
} from "@mui/material";
import StatsTableSkeleton from "../UI/StatsTableSkeleton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditExpenseModal from "./EditExpenseModal";
import ConfirmDialog from "../UI/ConfirmDialog";
import {
  deleteExpense,
  fetchExpenses,
  fetchExpenseStats,
  setExpenseMonthFilter,
  setExpensePage,
  setExpenseLimit,
  totalMonthlyFilteredExpenses,
} from "../../store/expensesSlice";

const MONTHS = [
  { label: "All Months", value: "all" },
  { label: "January", value: "0" },
  { label: "February", value: "1" },
  { label: "March", value: "2" },
  { label: "April", value: "3" },
  { label: "May", value: "4" },
  { label: "June", value: "5" },
  { label: "July", value: "6" },
  { label: "August", value: "7" },
  { label: "September", value: "8" },
  { label: "October", value: "9" },
  { label: "November", value: "10" },
  { label: "December", value: "11" },
];

export default function ExpenseTable() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    items: filteredExpenses,
    pagination,
    filters,
    loading,
    error,
    filteredMonthlyTotal,
  } = useSelector((state) => state.expenses);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });
  const [deletingExpense, setDeletingExpense] = useState(false);
  const [updatingExpense, setUpdatingExpense] = useState(false);

  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
    router.push("/login");
  };

  useEffect(() => {
    dispatch(
      fetchExpenses({
        month: filters.month,
        page: pagination.currentPage,
        limit: pagination.limit,
      }),
    );
    if (filters.month !== "all") {
      dispatch(totalMonthlyFilteredExpenses(filters.month));
    }
  }, [dispatch, filters.month, pagination.currentPage, pagination.limit]);
  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    setEditModalOpen(true);
  };
  const openDeleteConfirm = (expense) => {
    setExpenseToDelete(expense);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;

    setDeletingExpense(true);
    try {
      await dispatch(
        deleteExpense(expenseToDelete._id || expenseToDelete.id),
      ).unwrap();
      setAlert({
        open: true,
        type: "success",
        message: "Expense deleted successfully!",
      });
      dispatch(
        fetchExpenses({
          month: filters.month,
          page: pagination.currentPage,
          limit: pagination.limit,
        }),
      );
      dispatch(fetchExpenseStats());
      dispatch(totalMonthlyFilteredExpenses(filters.month))
      setConfirmOpen(false);
      setExpenseToDelete(null);
    } catch (error) {
      if (error?.message === "Unauthorized") {
        handleUnauthorized();
        return;
      }
      setAlert({
        open: true,
        type: "error",
        message: error?.message || "Failed to delete expense",
      });
    } finally {
      setDeletingExpense(false);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmOpen(false);
    setExpenseToDelete(null);
  };

  const getMonthLabel = (monthValue) => {
    const month = MONTHS.find((m) => m.value === monthValue);
    return month ? month.label : "";
  };
  if (loading) {
    return (
      <StatsTableSkeleton
        showStats={false}
        showTable
        tableColumns={6}
        rows={5}
      />
    );
  }

  return (
    <>
      <Card
        sx={{
          background: "rgba(30,30,35,0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.08)",
          width: "100%",
        }}
      >
        <CardContent>
          {alert.open && (
            <Alert
              severity={alert.type}
              sx={{ mb: 1, borderRadius: 2 }}
              onClose={() => setAlert({ open: false, type: "", message: "" })}
            >
              {alert.message}
            </Alert>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Your Expenses
            </Typography>
            <TextField
              select
              value={filters.month}
              onChange={(e) => {
                dispatch(setExpenseMonthFilter(e.target.value));
                dispatch(setExpensePage(1));
              }}
              size="small"
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      "& .MuiMenuItem-root": {
                        fontSize: "14px",
                      },
                      maxHeight: 250,
                    },
                  },
                  disableScrollLock: true,
                },
              }}
              sx={{
                width: {
                  xs: "100%",
                  md: "300px",
                },
              }}
              label="Filter by Month"
            >
              {MONTHS.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              boxShadow: "none",
              background: "transparent",
              width: "100%",
              maxWidth: "100%",
              maxHeight: 500,
              overflowY: "auto",
              overflowX: "auto",
            }}
          >
            <Table
              sx={{
                width: "100%",
                minWidth: 800,
                tableLayout: "auto",
                "& td, & th": {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
              aria-label="expense table"
            >
              <TableHead
                sx={{
                  position: "sticky",
                  top: 0,
                  background: "rgba(30,30,35,1)",
                  zIndex: 2,
                }}
              >
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell>Expense</TableCell>
                  <TableCell sx={{ width: "25%" }}>Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell sx={{ width: 120 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <TableRow
                      key={expense._id || expense.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.02)",
                        },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {new Date(expense.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString("en-US", {
                          month: "long",
                        })}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {expense.name}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {expense.description || "Not Provided"}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ fontWeight: "bold" }}
                      >{`Rs. ${expense.amount.toFixed(2)}`}</TableCell>
                      <TableCell align="left">
                        <Tooltip title="Edit Expense">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(expense)}
                            size="small"
                            sx={{ mr: 0.5 }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Expense">
                          <IconButton
                            color="error"
                            onClick={() => openDeleteConfirm(expense)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ py: 4, color: "text.secondary" }}
                    >
                      No expenses found for this period.
                    </TableCell>
                  </TableRow>
                )}
                {filters.month !== "all" && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      sx={{
                        color: "text.secondary",
                        position: "sticky",
                        bottom: 0,
                        background: "rgba(30,30,35,1)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: "primary.main",
                            fontsize: "16px",
                          }}
                        >
                          Expense in {getMonthLabel(filters.month)} - Total:
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: "primary.main",
                            fontsize: "16px",
                            marginLeft: "auto",
                          }}
                        >
                          Rs. {filteredMonthlyTotal.monthlyTotal.toFixed(2)}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              mt: 3,
            }}
          >
            <TextField
              value={pagination.limit}
              select
              onChange={(e) => {
                dispatch(setExpenseLimit(parseInt(e.target.value)));
                dispatch(setExpensePage(1));
              }}
              size="small"
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      maxHeight: 250,
                      "& .MuiMenuItem-root": {
                        fontSize: "14px",
                      },
                    },
                  },
                  disableScrollLock: true,
                },
              }}
              sx={{ width: { xs: "100%", sm: 160 } }}
              label="Rows per Page"
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </TextField>

            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={(e, page) => dispatch(setExpensePage(page))}
              color="primary"
              sx={{
                width: { xs: "100%", sm: "auto" },
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-end" },
              }}
            />
          </Box>
        </CardContent>
      </Card>
      <EditExpenseModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        expense={selectedExpense}
        setAlert={setAlert}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete expense?"
        description={
          expenseToDelete
            ? `Are you sure you want to delete "${expenseToDelete.name}" for Rs. ${expenseToDelete.amount.toFixed(2)}? This action cannot be undone.`
            : "Are you sure you want to delete this expense?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deletingExpense}
      />
    </>
  );
}
