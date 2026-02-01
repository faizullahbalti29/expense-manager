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
    const expenses = await Expense.find({ user: user.userId }).sort({
      date: -1,
    });
    return NextResponse.json(expenses);
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
     console.log("expense from backend",body)
    const expense = await Expense.create({
      ...body,
      user: user.userId,
    });
    console.log("Created expense:", expense);
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
