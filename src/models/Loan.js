import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema(
  {
    beneficiary: {
      type: String,
      required: [true, "Please provide beneficiary name"],
    },
    amount: {
      type: Number,
      required: [true, "Please provide a loan amount"],
    },
    type: {
      type: String,
      enum: ["receivable", "payable"],
      required: [true, "Please specify if loan is given or taken"],
    },
    status: {
      type: String,
      enum: ["returned", "not-returned"],
      required: [true, "Please specify the loan status"],
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

export default mongoose.models.Loan || mongoose.model("Loan", LoanSchema);
