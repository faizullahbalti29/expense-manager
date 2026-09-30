export const EXPENSE_CATEGORIES = [
  { label: "Hostel Fees", value: "Hostel Fees" },
  { label: "Metro Charge", value: "Metro Charge" },
  { label: "Food", value: "Food" },
  { label: "Travel", value: "Travel" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Shopping", value: "Shopping" },
  { label: "Other", value: "Other" },
];

export const PREDEFINED_EXPENSE_TYPES = EXPENSE_CATEGORIES
  .map((category) => category.value)
  .filter((value) => value !== "Other");
