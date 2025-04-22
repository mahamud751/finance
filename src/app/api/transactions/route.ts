import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import { Transaction, Summary } from "@/utils/types";

const dataFilePath = path.join(process.cwd(), "mockData.json");

function loadMockData() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading mock data:", error);
    return {
      transactions: [],
      summary: { totalIncome: 0, totalExpenses: 0, balance: 0 },
    };
  }
}

function saveMockData(data: { transactions: Transaction[]; summary: Summary }) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    console.log("Mock data saved:", data);
  } catch (error) {
    console.error("Error saving mock data:", error);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const category = searchParams.get("category") || undefined;
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const { transactions } = loadMockData();

  if (id) {
    const transaction = transactions.find((t: { id: string }) => t.id === id);
    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(transaction);
  }

  let filtered = [...transactions];
  if (category) {
    filtered = filtered.filter((t) => t.category === category);
  }
  if (startDate && endDate) {
    filtered = filtered.filter((t) => t.date >= startDate && t.date <= endDate);
  }
  const start = (page - 1) * limit;
  const end = start + limit;
  return NextResponse.json({
    data: filtered.slice(start, end),
    total: filtered.length,
    page,
    limit,
  });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const mockData = loadMockData();
    const newTransaction: Transaction = {
      id: String(mockData.transactions.length + 1),
      description: data.description || "",
      amount: Number(data.amount) || 0,
      category: data.category || "Other",
      date: data.date || new Date().toISOString().split("T")[0],
    };
    mockData.transactions.push(newTransaction);
    saveMockData(mockData);
    console.log("Created transaction:", newTransaction);
    return NextResponse.json(newTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const id = data.id;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const mockData = loadMockData();
    const index = mockData.transactions.findIndex(
      (t: { id: any }) => t.id === id
    );
    if (index === -1) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }
    const updatedTransaction: Transaction = {
      ...mockData.transactions[index],
      description: data.description ?? mockData.transactions[index].description,
      amount: Number(data.amount) ?? mockData.transactions[index].amount,
      category: data.category ?? mockData.transactions[index].category,
      date: data.date ?? mockData.transactions[index].date,
      id,
    };
    mockData.transactions[index] = updatedTransaction;
    saveMockData(mockData);
    console.log("Updated transaction:", updatedTransaction);
    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    const id = data.id;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const mockData = loadMockData();
    const index = mockData.transactions.findIndex(
      (t: { id: any }) => t.id === id
    );
    if (index === -1) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }
    mockData.transactions.splice(index, 1);
    saveMockData(mockData);
    console.log("Deleted transaction ID:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
