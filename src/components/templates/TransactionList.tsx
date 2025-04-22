"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { AppDispatch, RootState } from "@/redux/store";
import {
  getTransactions,
  deleteTransaction as deleteTransactionAPI,
} from "@/lib/api";
import {
  setTransactions,
  deleteTransaction,
  setLoading,
  setError,
} from "@/redux/store/slices/transactionsSlice";

export default function TransactionList() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { transactions, loading, error } = useSelector(
    (state: RootState) => state.transactions
  );
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [filters, setFilters] = useState({
    category: "",
    startDate: "",
    endDate: "",
  });
  const limit = 10;

  const refreshKey = searchParams.get("refreshKey");

  useEffect(() => {
    async function fetchTransactions() {
      dispatch(setLoading(true));
      try {
        const { data } = await getTransactions({ ...filters, page, limit });
        dispatch(setTransactions(data));
      } catch (err) {
        dispatch(setError("Failed to fetch transactions"));
      } finally {
        dispatch(setLoading(false));
      }
    }
    fetchTransactions();
  }, [dispatch, page, filters, refresh, refreshKey]);

  const handleDelete = async (id: string) => {
    try {
      await deleteTransactionAPI(id);
      dispatch(deleteTransaction(id));
      setRefresh((r) => r + 1);
    } catch (err) {
      dispatch(setError("Failed to delete transaction"));
    }
  };

  return (
    <div className="p-6 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <div className="mb-4 space-y-4 text-white">
        <div>
          <label className="block mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark focus:ring-primary-light dark:focus:ring-primary-dark"
          >
            <option value="">All</option>
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
          <label className="block mb-1">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className="p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark focus:ring-primary-light dark:focus:ring-primary-dark"
          />
        </div>
        <div>
          <label className="block mb-1">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className="p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark focus:ring-primary-light dark:focus:ring-primary-dark"
          />
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
      <table className="w-full border-collapse bg-white dark:bg-gray-800 text-white">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="border border-gray-300 dark:border-gray-600 p-2">
              Date
            </th>
            <th className="border border-gray-300 dark:border-gray-600 p-2">
              Description
            </th>
            <th className="border border-gray-300 dark:border-gray-600 p-2">
              Category
            </th>
            <th className="border border-gray-300 dark:border-gray-600 p-2">
              Amount
            </th>
            <th className="border border-gray-300 dark:border-gray-600 p-2">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="border border-gray-300 dark:border-gray-600 p-2">
                {t.date}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-2">
                {t.description}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-2">
                {t.category}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-2">
                ${t.amount.toFixed(2)}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-2">
                <Link
                  href={`/edit-transaction/${t.id}`}
                  className="text-primary-light dark:text-primary-dark hover:underline mr-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-500 dark:text-red-400 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="p-2 bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="p-2 bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
