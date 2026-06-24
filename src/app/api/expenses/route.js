import dbConnect from "../../../lib/db";
import Expense from "../../../models/Expense";
import User from "../../../models/User"; // Ensure User model is compiled
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query = { user: user.userId };

    if (month && month !== "all") {
      const monthNum = parseInt(month);
      const now = new Date();
      const year = now.getFullYear();
      const startDate = new Date(year, monthNum, 1);
      const endDate = new Date(year, monthNum + 1, 0, 23, 59, 59, 999);

      query.date = { $gte: startDate, $lte: endDate };
    }

    const skip = (page - 1) * limit;
    const totalCount = await Expense.countDocuments(query);
    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: expenses,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  const user = await getUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!body.amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 },
      );
    }
    if (body.amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than zero" },
        { status: 400 },
      );
    }
    const expense = await Expense.create({
      ...body,
      user: user.userId,
    });
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense from the post method:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  await dbConnect();
  const user = await getUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedExpense = await Expense.findOneAndDelete({
      _id: id,
      user: user.userId,
    });

    if (!deletedExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Expense deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  await dbConnect();
  const user = await getUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, user: user.userId },
      updateData,
      { new: true },
    );

    if (!updatedExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(updatedExpense);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
