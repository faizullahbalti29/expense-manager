import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE = "/api/loans";

const parseResponse = async (response) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMessage = data?.error || data?.message || "Server error";
    throw new Error(errorMessage);
  }
  return data;
};

export const fetchLoans = createAsyncThunk(
  "loans/fetchLoans",
  async (
    { type = "all", page = 1, limit = 10, status = "all" } = {},
    { rejectWithValue },
  ) => {
    try {
      const typeQuery = type === "all" ? "" : `type=${type}&`;
      const statusQuery = status === "all" ? "" : `status=${status}&`;
      console.log(
        `${API_BASE}?${typeQuery}${statusQuery}page=${page}&limit=${limit}`,
      );
      const response = await fetch(
        `${API_BASE}?${typeQuery}${statusQuery}page=${page}&limit=${limit}`,
      );
      const data = await parseResponse(response);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addLoan = createAsyncThunk(
  "loans/addLoan",
  async (loan, { rejectWithValue }) => {
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loan),
      });
      const data = await parseResponse(response);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateLoan = createAsyncThunk(
  "loans/updateLoan",
  async (loan, { rejectWithValue }) => {
    try {
      const response = await fetch(API_BASE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loan),
      });
      const data = await parseResponse(response);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteLoan = createAsyncThunk(
  "loans/deleteLoan",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}?id=${id}`, {
        method: "DELETE",
      });
      await parseResponse(response);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchLoanStats = createAsyncThunk(
  "loans/fetchLoanStats",
  async (_, { rejectWithValue }) => {
    try {
      // const [givenRes, takenRes] = await Promise.all([
      //   fetch(`${API_BASE}?type=receivable&limit=1000&status=not-returned`),
      //   fetch(`${API_BASE}?type=payable&limit=1000&status=not-returned`),
      // ]);

      // const givenData = await parseResponse(givenRes);
      // const takenData = await parseResponse(takenRes);

      // const givenTotal = givenData.data.reduce(
      //   (sum, loan) => sum + loan.amount,
      //   0,
      // );
      // const takenTotal = takenData.data.reduce(
      //   (sum, loan) => sum + loan.amount,
      //   0,
      // );

      // return {
      //   loanGiven: givenTotal,
      //   loanTaken: takenTotal,
      // };
      const stats = await fetch(`${API_BASE}/stats`);
      // console.log("Stats response:", stats);
      const data = await parseResponse(stats);
      return data;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  items: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  },
  filters: {
    type: "all",
    status: "all",
  },
  loading: false,
  error: null,
  stats: {
    loanGiven: 0,
    loanTaken: 0,
    loading: false,
    error: null,
  },
};

const loansSlice = createSlice({
  name: "loans",
  initialState,
  reducers: {
    setLoanTypeFilter(state, action) {
      state.filters.type = action.payload;
    },
    setLoanStatusFilter(state, action) {
      state.filters.status = action.payload;
    },
    setLoanPage(state, action) {
      state.pagination.currentPage = action.payload;
    },
    setLoanLimit(state, action) {
      state.pagination.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addLoan.pending, (state) => {
        state.error = null;
      })
      .addCase(addLoan.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(addLoan.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(updateLoan.pending, (state) => {
        state.error = null;
      })
      .addCase(updateLoan.fulfilled, (state, action) => {
        state.items = state.items.map((loan) =>
          loan._id === action.payload._id ? action.payload : loan,
        );
      })
      .addCase(updateLoan.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteLoan.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteLoan.fulfilled, (state, action) => {
        state.items = state.items.filter((loan) => loan._id !== action.payload);
      })
      .addCase(deleteLoan.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchLoanStats.pending, (state) => {
        state.stats.loading = true;
        state.stats.error = null;
      })
      .addCase(fetchLoanStats.fulfilled, (state, action) => {
        state.stats.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchLoanStats.rejected, (state, action) => {
        state.stats.loading = false;
        state.stats.error = action.payload || action.error.message;
      });
  },
});

export const {
  setLoanTypeFilter,
  setLoanStatusFilter,
  setLoanPage,
  setLoanLimit,
} = loansSlice.actions;
export default loansSlice.reducer;
