import { Transaction } from "@/utils/types";

const API_BASE_URL = "http://localhost:3000/api/transactions";

export async function getTransactions({
  category,
  startDate,
  endDate,
  page = 1,
  limit = 10,
}: {
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(category && { category }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    const response = await fetch(`${API_BASE_URL}?${params}`);
    if (!response.ok) throw new Error("Failed to fetch transactions");
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getTransaction(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}?id=${id}`);
    if (!response.ok) throw new Error("Transaction not found");
    const transaction = await response.json();
    return transaction;
  } catch (error) {
    throw error;
  }
}

export async function createTransaction(data: Omit<Transaction, "id">) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create transaction");
    const newTransaction = await response.json();
    return newTransaction;
  } catch (error) {
    throw error;
  }
}

export async function updateTransaction(
  id: string,
  data: Partial<Transaction>
) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    if (!response.ok) throw new Error("Failed to update transaction");
    const updatedTransaction = await response.json();
    return updatedTransaction;
  } catch (error) {
    throw error;
  }
}

export async function deleteTransaction(id: string) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error("Failed to delete transaction");
  } catch (error) {
    throw error;
  }
}

export async function getSummary() {
  return { totalIncome: 0, totalExpenses: 0, balance: 0 };
}
