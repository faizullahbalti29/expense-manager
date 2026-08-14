import dbConnect from "../../../../lib/db";
import Expense from "../../../../models/Expense";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Helper to get user from token
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
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    if (!month) {
      return NextResponse.json(
        { error: "Month parameter is required" },
        { status: 400 },
      );
    }

    const monthNum = parseInt(month);
    const now = new Date();
    const year = now.getFullYear();
    const userId = new mongoose.Types.ObjectId(user.userId);

    const monthStartDate = new Date(year, monthNum, 1);
    const monthEndDate = new Date(year, monthNum + 1, 0, 23, 59, 59, 999);

    const previousMonthStartDate = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    // Previous month same day as today
    const previousMonthTodayDate = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const monthTotal = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: monthStartDate, $lte: monthEndDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const prevMonthTotal = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: previousMonthStartDate, $lte: previousMonthTodayDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    // Yearly expense sum (all expenses for the user)
    const yearlyTotal = await Expense.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const monthlyTotal = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lt: new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`)
          }
        }
      },
      {
        $group: {
          _id: {
            $month: "$date"
          },
          total: {
            $sum: "$amount"
          }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ]);
    return NextResponse.json({
      monthlyTotal: monthTotal[0]?.total || 0,
      yearlyTotal: yearlyTotal[0]?.total || 0,
      prevMonthTotal: prevMonthTotal[0]?.total || 0,
      monthWiseTotal: monthlyTotal
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
