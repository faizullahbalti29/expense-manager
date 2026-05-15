"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditExpenseModal from "./EditExpenseModal";

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

export default function ExpenseTable({ expenses, onDelete, onUpdate }) {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth().toString(),
  );
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
    router.push("/login");
  };
  // Fetch filtered expenses from backend when month, page, or rowsPerPage changes
  useEffect(() => {
    const fetchFilteredExpenses = async () => {
      try {
        const monthQuery =
          selectedMonth === "all" ? "" : `month=${selectedMonth}&`;
        const res = await fetch(
          `/api/expenses?${monthQuery}page=${currentPage}&limit=${rowsPerPage}`,
        );
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }
        if (res.ok) {
          const result = await res.json();
          setFilteredExpenses(result.data);
          setPagination(result.pagination);
        }
      } catch (error) {
        console.error("Error fetching filtered expenses:", error);
      }
    };
    fetchFilteredExpenses();
  }, [selectedMonth, currentPage, rowsPerPage, refreshKey, expenses]);
  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    await onDelete(id);
    setCurrentPage(1);
    setRefreshKey((prev) => prev + 1);
  };

  const handleUpdateSubmit = async (updatedExpense) => {
    await onUpdate(updatedExpense);
    // Refresh current page and data after update
    setCurrentPage(1);
    setRefreshKey((prev) => prev + 1);
  };
  const getMonthLabel = (monthValue) => {
    const month = MONTHS.find((m) => m.value === monthValue);
    return month ? month.label : "";
  };
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
              size="small"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setCurrentPage(1);
              }}
              sx={{ width: 200 }}
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
            }}
          >
            <Table
              sx={{ width: "100%", tableLayout: "fixed" }}
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
                            onClick={() =>
                              handleDelete(expense._id || expense.id)
                            }
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
              select
              size="small"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              sx={{ width: 160 }}
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
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>
      <EditExpenseModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        expense={selectedExpense}
        handleUpdate={handleUpdateSubmit}
      />
    </>
  );
}
