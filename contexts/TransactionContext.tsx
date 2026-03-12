import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { Transaction } from '@/types/transaction';
import {
  getTransactions,
  addTransaction as addStorage,
  updateTransaction as updateStorage,
  deleteTransaction as deleteStorage,
} from '@/storage/transactionStorage';

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  updateTransaction: (
    id: string,
    updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshTransactions = useCallback(async () => {
    setLoading(true);
    const data = await getTransactions();
    setTransactions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  const addTransaction = useCallback(
    async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
      const now = new Date().toISOString();
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        createdAt: now,
      };
      await addStorage(newTransaction);
      setTransactions((prev) => [newTransaction, ...prev]);
    },
    []
  );

  const updateTransaction = useCallback(
    async (
      id: string,
      updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>
    ) => {
      await updateStorage(id, updates);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    },
    []
  );

  const deleteTransaction = useCallback(async (id: string) => {
    await deleteStorage(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refreshTransactions,
      }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
