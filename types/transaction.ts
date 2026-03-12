export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Rent'
  | 'Salary'
  | 'Others';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // ISO date string
  note?: string;
  createdAt: string; // ISO timestamp
}

export const CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Rent',
  'Salary',
  'Others',
];

export const INCOME_CATEGORIES: Category[] = ['Salary', 'Others'];
export const EXPENSE_CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Rent',
  'Others',
];
