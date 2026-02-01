import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide an expense name"],
    },
    description: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: [true, "Please provide an amount"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Expense ||
  mongoose.model("Expense", ExpenseSchema);
