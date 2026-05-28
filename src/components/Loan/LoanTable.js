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
import ConfirmDialog from "../UI/ConfirmDialog";
import EditLoanModal from "./EditLoanModal";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import {
  deleteLoan,
  fetchLoans,
  fetchLoanStats,
  setLoanTypeFilter,
  setLoanPage,
  setLoanLimit,
  updateLoan,
  setLoanStatusFilter,
} from "../../store/loansSlice";

export const LOAN_TYPES = [
  { label: "All", value: "all" },
  { label: "Receivable", value: "receivable" },
  { label: "Payable", value: "payable" },
];
export const LOAN_STATUSES = [
  { label: "All", value: "all" },
  { label: "Not Returned", value: "not-returned" },
  { label: "Returned", value: "returned" },
];

export default function LoanTable() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    items: loans,
    pagination,
    filters,
    loading,
    error,
  } = useSelector((state) => state.loans);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState(null);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });
  const [deletingLoan, setDeletingLoan] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [loanToUpdate, setLoanToUpdate] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
    router.push("/login");
  };

  useEffect(() => {
    if (
      !filters.type ||
      !filters.status ||
      !pagination.currentPage ||
      !pagination.limit
    ) {
      console.log("Returned");
      return;
    }
    dispatch(
      fetchLoans({
        type: filters.type,
        page: pagination.currentPage,
        limit: pagination.limit,
        status: filters.status,
      }),
    );
  }, [
    filters.type,
    filters.status,
    pagination.currentPage,
    pagination.limit,
    dispatch,
  ]);

  const handleEditClick = (loan) => {
    setSelectedLoan(loan);
    setEditModalOpen(true);
  };

  const openDeleteConfirm = (loan) => {
    setLoanToDelete(loan);
    setConfirmOpen(true);
  };
  const openUpdateConfirm = (loan) => {
    setLoanToUpdate(loan);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!loanToDelete) return;

    setDeletingLoan(true);
    try {
      await dispatch(deleteLoan(loanToDelete._id)).unwrap();
      setAlert({
        open: true,
        type: "success",
        message: "Loan deleted successfully!",
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
      setConfirmOpen(false);
      setLoanToDelete(null);
    } catch (error) {
      if (error?.message === "Unauthorized") {
        handleUnauthorized();
        return;
      }
      setAlert({
        open: true,
        type: "error",
        message: error?.message || "Failed to delete loan",
      });
    } finally {
      setDeletingLoan(false);
    }
  };
  const handleUpdateConfirm = async () => {
    if (!loanToUpdate) {
      setAlert({
        open: true,
        type: "error",
        message: "No loan selected for update",
      });
      return;
    }
    setUpdatingStatus(true);
    try {
      await dispatch(
        updateLoan({
          id: loanToUpdate._id,
          status: "returned",
        }),
      ).unwrap();

      setAlert({
        open: true,
        type: "success",
        message: "Loan Marked as Returned!",
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
      setConfirmOpen(false);
      setLoanToUpdate(null);
      // window.scrollTo({ top: 0, behavior: "smooth" });
      // handleClose();
    } catch (err) {
      if (err?.message === "Unauthorized") {
        handleUnauthorized();
        return;
      }
      // setError(err?.message || "Failed to update loan");
      setAlert({
        open: true,
        type: "error",
        message: err?.message || "Failed to update loan",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmOpen(false);
    setLoanToDelete(null);
  };

  const getLabelColors = (type = "", status = "") => {
    if (type === "receivable" || status === "returned") {
      return {
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        color: "#10b981",
      };
    } else {
      return {
        backgroundColor: "rgba(249, 115, 22, 0.2)",
        color: "#f97316",
      };
    }
  };

  if (loading) {
    return (
      <StatsTableSkeleton
        showStats={false}
        showTable
        tableColumns={7}
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
              Your Loans
            </Typography>
            <Box
              sx={{
                width: {
                  xs: "100%",
                  md: "50%",
                },
                display: "flex",
                gap: 1,
                alignItems: "center",
                flexWrap: { xs: "wrap", sm: "nowrap" },
              }}
            >
              <TextField
                select
                value={filters.type}
                onChange={(e) => {
                  dispatch(setLoanTypeFilter(e.target.value));
                  dispatch(setLoanPage(1));
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: { style: { maxHeight: 250 } },
                    disableScrollLock: true,
                  },
                }}
                sx={{
                  flex: { xs: "", sm: 1 },
                  width: { xs: "100%", sm: "auto" },
                  mb: { xs: 1, sm: 0 },
                }}
                label="Filter by Type"
              >
                {LOAN_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                value={filters.status}
                onChange={(e) => {
                  dispatch(setLoanStatusFilter(e.target.value));
                  dispatch(setLoanPage(1));
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: { style: { maxHeight: 250 } },
                    disableScrollLock: true,
                  },
                }}
                sx={{
                  flex: { xs: "", sm: 1 },
                  width: { xs: "100%", sm: "auto" },
                }}
                label="Filter by Status"
              >
                {LOAN_STATUSES.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
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
                minWidth: 700,
                tableLayout: "auto",
                "& td, & th": {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
              aria-label="loans table"
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
                  <TableCell>Beneficiary</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell sx={{ width: 120 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loans.length > 0 ? (
                  loans.map((loan) => (
                    <TableRow
                      onMouseEnter={() => setHoveredRow(loan._id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      key={loan._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.02)",
                        },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {new Date(loan.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          minWidth: 200,
                          color:
                            hoveredRow === loan._id
                              ? "text.primary"
                              : getLabelColors("payable", "").color,
                        }}
                      >
                        {hoveredRow === loan._id
                          ? loan.beneficiary
                          : "Hover to reveal name"}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {loan.description || "Not Provided"}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 9999,
                            // fontWeight: "bold",
                            display: "inline-block",
                            ...getLabelColors(loan.type, ""),
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {loan.type === "receivable"
                            ? "Receivable"
                            : "Payable"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 9999,
                            // fontWeight: "bold",
                            display: "inline-block",
                            ...getLabelColors("", loan.status),
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {loan.status === "returned"
                            ? "Returned"
                            : "Not Returned"}
                        </Typography>
                      </TableCell>
                      <TableCell align="left" sx={{ fontWeight: "bold" }}>
                        Rs. {loan.amount.toFixed(2)}
                      </TableCell>
                      <TableCell align="left">
                        <Tooltip
                          title={
                            loan.status === "returned"
                              ? "Already marked as returned"
                              : "Mark as Returned"
                          }
                        >
                          <span>
                            <IconButton
                              color="primary"
                              onClick={() => openUpdateConfirm(loan)}
                              size="small"
                              sx={{ mr: 0.5 }}
                              disabled={loan.status === "returned"}
                            >
                              <TaskAltIcon
                                sx={{
                                  color:
                                    loan.status === "returned"
                                      ? ""
                                      : getLabelColors("receivable", "returned")
                                          .color,
                                }}
                              />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip
                          title={
                            loan.status === "returned"
                              ? "Cannot edit returned loan"
                              : "Edit Loan"
                          }
                        >
                          <span>
                            <IconButton
                              color="primary"
                              onClick={() => handleEditClick(loan)}
                              size="small"
                              sx={{ mr: 0.5 }}
                              disabled={loan.status === "returned"}
                            >
                              <EditIcon />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="Delete Loan">
                          <IconButton
                            color="error"
                            onClick={() => openDeleteConfirm(loan)}
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
                      colSpan={7}
                      align="center"
                      sx={{ py: 4, color: "text.secondary" }}
                    >
                      No loans found.
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
                dispatch(setLoanLimit(parseInt(e.target.value)));
                dispatch(setLoanPage(1));
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: { style: { maxHeight: 250 } },
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
              onChange={(e, page) => dispatch(setLoanPage(page))}
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

      <EditLoanModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        loan={selectedLoan}
        setAlert={setAlert}
      />

      <ConfirmDialog
        open={confirmOpen}
        confirmButtonColor={loanToUpdate ? "primary" : "error"}
        title={loanToUpdate ? "Update loan status?" : "Delete loan?"}
        description={
          loanToDelete
            ? `Are you sure you want to delete the loan with ${loanToDelete.beneficiary} for Rs. ${loanToDelete.amount.toFixed(2)}? This action cannot be undone.`
            : loanToUpdate
              ? `Are you sure you want to Mark this loan as Returned?`
              : "Are you sure you want to delete this loan?"
        }
        confirmText={loanToUpdate ? "Update" : "Delete"}
        cancelText="Cancel"
        onConfirm={loanToUpdate ? handleUpdateConfirm : handleDeleteConfirm}
        onCancel={
          loanToUpdate
            ? () => {
                setConfirmOpen(false);
                setLoanToUpdate(null);
              }
            : handleDeleteCancel
        }
        loading={loanToUpdate ? updatingStatus : deletingLoan}
      />
    </>
  );
}
