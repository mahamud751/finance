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
import { SubmitButton } from "../atoms/SubmitButton";
import { InputField } from "../dynamics/InputFiled";
import { SelectField } from "../dynamics/SelectField";

interface FormData {
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface Props {
  transaction?: Transaction;
}

export default function TransactionForm({ transaction }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    description: transaction?.description || "",
    amount: transaction?.amount || 0,
    category: transaction?.category || "Food",
    date: transaction?.date || new Date().toISOString().split("T")[0],
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): string | null => {
    if (!formData.description.trim()) return "Description is required";
    if (formData.amount === 0) return "Amount cannot be zero";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    setIsLoading(true);
    try {
      if (transaction) {
        if (!transaction.id) throw new Error("Transaction ID is missing");
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "amount" ? parseFloat(value) || 0 : value,
    }));
    setFormError(null);
  };

  const categories = [
    "Food",
    "Salary",
    "Rent",
    "Entertainment",
    "Utilities",
    "Other",
  ];

  return (
    <div className="p-6 bg-background-light dark:bg-background-dark rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
        {transaction ? "Edit Transaction" : "Add Transaction"}
      </h1>
      {formError && (
        <p className="text-red-500 dark:text-red-400 mb-4">{formError}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Description"
          name="description"
          value={formData.description}
          onChange={(value) => handleChange("description", value)}
          required
        />
        <InputField
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={(value) => handleChange("amount", value)}
          required
        />
        <SelectField
          label="Category"
          name="category"
          value={formData.category}
          onChange={(value) => handleChange("category", value)}
          options={categories}
        />
        <InputField
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={(value) => handleChange("date", value)}
          required
        />
        <SubmitButton label="Save" isLoading={isLoading} />
      </form>
    </div>
  );
}
