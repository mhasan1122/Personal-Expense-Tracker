import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Transaction } from '@/types/transaction';

const STORAGE_KEY = '@expense_tracker_transactions';

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
    throw error;
  }
}

export async function addTransaction(transaction: Transaction): Promise<void> {
  const transactions = await getTransactions();
  transactions.unshift(transaction);
  await saveTransactions(transactions);
}

export async function updateTransaction(
  id: string,
  updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>
): Promise<void> {
  const transactions = await getTransactions();
  const index = transactions.findIndex((t) => t.id === id);
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updates };
    await saveTransactions(transactions);
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  const transactions = await getTransactions();
  const filtered = transactions.filter((t) => t.id !== id);
  await saveTransactions(filtered);
}
