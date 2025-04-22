export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Summary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}
