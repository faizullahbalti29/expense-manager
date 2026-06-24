import dbConnect from "@/lib/db";
import Loan from "@/models/Loan";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getUser(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function GET(req) {
  await dbConnect();
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = await Loan.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(user.userId),
        },
      },
      {
        $group: {
          _id: null,
          payable: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$type", "payable"] },
                    { $eq: ["$status", "not-returned"] },
                  ],
                },
                "$amount",
                0,
              ],
            },
          },
          receivable: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$type", "receivable"] },
                    { $eq: ["$status", "not-returned"] },
                  ],
                },
                "$amount",
                0,
              ],
            },
          },
          payableReturned: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$type", "payable"] },
                    { $eq: ["$status", "returned"] },
                  ],
                },
                "$amount",
                0,
              ],
            },
          },
          receivableReturned: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$type", "receivable"] },
                    { $eq: ["$status", "returned"] },
                  ],
                },
                "$amount",
                0,
              ],
            },
          },
        },
      },
    ]);

    return NextResponse.json({
      loanGiven: stats[0]?.receivable || 0,
      loanTaken: stats[0]?.payable || 0,
      loanGivenReturned: stats[0]?.receivableReturned || 0,
      loanTakenReturned: stats[0]?.payableReturned || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
