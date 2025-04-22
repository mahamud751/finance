"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getTransactions } from "@/lib/api";
import {
  setTransactions,
  setError,
  setLoading,
} from "@/redux/store/slices/transactionsSlice";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";

const COLORS = ["#0088FE", "#FFBB28"];

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const { transactions, error, loading } = useSelector(
    (state: RootState) => state.transactions
  );
  const [refresh] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Ensure theme is only accessed after mounting to avoid SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const refreshKey = searchParams.get("refreshKey");

  const summary = transactions.reduce(
    (acc, t) => {
      if (t.amount > 0) {
        acc.totalIncome += t.amount;
      } else {
        acc.totalExpenses += Math.abs(t.amount);
      }
      acc.balance = acc.totalIncome - acc.totalExpenses;
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0, balance: 0 }
  );

  useEffect(() => {
    async function fetchTransactions() {
      dispatch(setLoading(true));
      try {
        const { data } = await getTransactions({ page: 1, limit: 1000 });
        dispatch(setTransactions(data));
        console.log("Dashboard fetched transactions:", data);
      } catch (err) {
        dispatch(setError("Failed to fetch transactions"));
      } finally {
        dispatch(setLoading(false));
      }
    }
    fetchTransactions();
  }, [dispatch, refresh, refreshKey]);

  const chartData = [
    { name: "Income", value: summary.totalIncome },
    { name: "Expenses", value: summary.totalExpenses },
  ];

  // Define tooltip styles based on theme
  const tooltipStyle = {
    backgroundColor: theme === "dark" ? "#1a202c" : "#ffffff",
    color: theme === "dark" ? "#e2e8f0" : "#1a202c",
    border: "1px solid",
    borderColor: theme === "dark" ? "#4a5568" : "#e2e8f0",
  };

  return (
    <div className="p-6 bg-background-light dark:bg-background-dark text-text-light rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-white">
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded shadow">
          <h2 className="text-lg font-semibold">Total Income</h2>
          <p>${summary.totalIncome.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded shadow">
          <h2 className="text-lg font-semibold">Total Expenses</h2>
          <p>${summary.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded shadow">
          <h2 className="text-lg font-semibold">Balance</h2>
          <p>${summary.balance.toFixed(2)}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          {mounted && <Tooltip contentStyle={tooltipStyle} />}
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}
