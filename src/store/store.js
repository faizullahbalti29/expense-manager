import { configureStore } from "@reduxjs/toolkit";
import expensesReducer from "./expensesSlice";
import loansReducer from "./loansSlice";

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    loans: loansReducer,
  },
});
