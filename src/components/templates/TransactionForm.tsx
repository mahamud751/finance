"use client";

import { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import {
  createTransaction,
  updateTransaction as updateTransactionAPI,
} from "@/lib/api";
import {
  addTransaction,
  updateTransaction,
  setError,
} from "@/redux/store/slices/transactionsSlice";
import { Transaction } from "@/utils/types";
import { AppDispatch } from "@/redux/store";

interface Props {
  transaction?: Transaction;
}

export default function TransactionForm({ transaction }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: transaction?.description || "",
    amount: transaction?.amount || 0,
    category: transaction?.category || "Food",
    date: transaction?.date || new Date().toISOString().split("T")[0],
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      setFormError("Description is required");
      return;
    }
    if (formData.amount === 0) {
      setFormError("Amount cannot be zero");
      return;
    }
    try {
      if (transaction) {
        if (!transaction.id) {
          throw new Error("Transaction ID is missing");
        }
        const updated = await updateTransactionAPI(transaction.id, formData);
        dispatch(updateTransaction(updated));
      } else {
        const newTransaction = await createTransaction(formData);
        dispatch(addTransaction(newTransaction));
      }

      router.push(`/transactions?refreshKey=${Date.now()}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save transaction";
      dispatch(setError(errorMessage));
      setFormError(errorMessage);
    }
  };

  return (
    <div className="p-6 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        {transaction ? "Edit Transaction" : "Add Transaction"}
      </h1>
      {formError && (
        <p className="text-red-500 dark:text-red-400 mb-4">{formError}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        <div>
          <label className="block mb-1">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark focus:ring-primary-light dark:focus:ring-primary-dark"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Amount</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                amount: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark focus:ring-primary-light dark:focus:ring-primary-dark"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark focus:ring-primary-light dark:focus:ring-primary-dark"
          >
            {[
              "Food",
              "Salary",
              "Rent",
              "Entertainment",
              "Utilities",
              "Other",
            ].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark focus:ring-primary-light dark:focus:ring-primary-dark"
            required
          />
        </div>
        <button
          type="submit"
          className="p-2 bg-primary-light dark:bg-primary-dark text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          Save
        </button>
      </form>
    </div>
  );
}
