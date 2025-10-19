export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes: string;
}

export enum ExpenseCategory {
  Food = 1,
  Transport,
  Rent,
  Entertainment,
  Utilities,
  Others
}


export interface CreateExpenseRequest {
  title: string;
  amount: number;
  category: number;
  date: string;
  notes: string;
}

export interface UpdateExpenseRequest {
  id: string;
  title: string;
  amount: number;
  category: number;
  date: string;
  notes: string;
}

export interface FilterExpenseRequest {
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface CategorySummary {
  category: string;
  totalAmount: number;
  count: number;
}

export interface TrendData {
  month: string;
  totalSpent: number;
}

