import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE = "/api/expenses";

const parseResponse = async (response) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMessage = data?.error || data?.message || "Server error";
    throw new Error(errorMessage);
  }
  return data;
};

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async ({ month = "all", type = "all", page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const monthQuery = month === "all" ? "" : `month=${month}&`;
      const typeQuery = type === "all" || !type ? "" : `type=${encodeURIComponent(type)}&`;
      const response = await fetch(
        `${API_BASE}?${monthQuery}${typeQuery}page=${page}&limit=${limit}`,
      );
      const data = await parseResponse(response);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async (expense, { rejectWithValue }) => {
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      });
      const data = await parseResponse(response);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async (expense, { rejectWithValue }) => {
    try {
      const response = await fetch(API_BASE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      });
      const data = await parseResponse(response);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
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

export const fetchExpenseStats = createAsyncThunk(
  "expenses/fetchExpenseStats",
  async (_, { rejectWithValue }) => {
    try {
      const currentMonth = new Date().getMonth();
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const [currentRes, previousRes] = await Promise.all([
        fetch(`/api/expenses/stats?month=${currentMonth}`),
        fetch(`/api/expenses/stats?month=${previousMonth}`),
      ]);

      const currentData = await parseResponse(currentRes);
      const previousData = await parseResponse(previousRes);

      return {
        monthlyTotal: currentData.monthlyTotal || 0,
        yearlyTotal: currentData.yearlyTotal || 0,
        prevMonthTotal: currentData.prevMonthTotal || 0,
        previousMonthTotal: previousData.monthlyTotal || 0,
        monthWiseTotal: currentData.monthWiseTotal || [],
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
export const totalMonthlyFilteredExpenses = createAsyncThunk(
  "expenses/totalMonthlyFilteredExpenses",
  async (payload, { rejectWithValue }) => {
    try {
      let month = "all";
      let type = "all";

      if (typeof payload === "object" && payload !== null) {
        if (payload.filterType === "month") {
          month = payload.value;
        } else if (payload.filterType === "type") {
          type = payload.value;
        } else {
          month = payload.month ?? payload.value ?? "all";
          type = payload.type ?? "all";
        }
      } else if (typeof payload === "string" || typeof payload === "number") {
        month = payload;
      }

      if (month === "all") {
        return {
          monthlyTotal: 0,
          yearlyTotal: 0,
        };
      }

      const typeQuery = type && type !== "all" ? `&type=${encodeURIComponent(type)}` : "";
      const response = await fetch(`/api/expenses/stats?month=${month}${typeQuery}`);
      const currentData = await parseResponse(response);
      return {
        monthlyTotal: currentData.monthlyTotal || 0,
        yearlyTotal: currentData.yearlyTotal || 0,
      };
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
    month: new Date().getMonth().toString(),
    type: "all",
  },
  loading: false,
  error: null,
  stats: {
    monthlyTotal: 0,
    yearlyTotal: 0,
    prevMonthTotal: 0,
    previousMonthTotal: 0,
    loading: false,
    error: null,
  },
  filteredMonthlyTotal: {
    monthlyTotal: 0,
    yearlyTotal: 0,
    previousMonthTotal: 0,
    loading: false,
    error: null,
  },
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setExpenseMonthFilter(state, action) {
      state.filters.month = action.payload;
    },
    setExpenseFilterType(state, action) {
      state.filters.type = action.payload;
    },
    setExpensePage(state, action) {
      state.pagination.currentPage = action.payload;
    },
    setExpenseLimit(state, action) {
      state.pagination.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addExpense.pending, (state) => {
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(updateExpense.pending, (state) => {
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.items = state.items.map((expense) =>
          expense._id === action.payload._id ? action.payload : expense,
        );
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteExpense.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (expense) => expense._id !== action.payload,
        );
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchExpenseStats.pending, (state) => {
        state.stats.loading = true;
        state.stats.error = null;
      })
      .addCase(fetchExpenseStats.fulfilled, (state, action) => {
        state.stats.loading = false;
        state.stats = {
          ...state.stats,
          ...action.payload,
        };
      })
      .addCase(fetchExpenseStats.rejected, (state, action) => {
        state.stats.loading = false;
        state.stats.error = action.payload || action.error.message;
      })
      .addCase(totalMonthlyFilteredExpenses.pending, (state) => {
        state.filteredMonthlyTotal.loading = true;
        state.filteredMonthlyTotal.error = null;
      })
      .addCase(totalMonthlyFilteredExpenses.fulfilled, (state, action) => {
        state.filteredMonthlyTotal.loading = false;
        state.filteredMonthlyTotal.monthlyTotal = action.payload.monthlyTotal || 0;
        state.filteredMonthlyTotal.yearlyTotal = action.payload.yearlyTotal || 0;
      })
      .addCase(totalMonthlyFilteredExpenses.rejected, (state, action) => {
        state.filteredMonthlyTotal.loading = false;
        state.filteredMonthlyTotal.error =
          action.payload || action.error.message;
      });
  },
});

export const { setExpenseMonthFilter, setExpensePage, setExpenseLimit, setExpenseFilterType } =
  expensesSlice.actions;
export default expensesSlice.reducer;
