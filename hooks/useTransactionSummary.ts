import { useMemo } from 'react';
import type { Transaction } from '@/types/transaction';
import { getMonthRange } from '@/utils/format';

export function useTransactionSummary(
  transactions: Transaction[],
  selectedDate?: Date
) {
  return useMemo(() => {
    const date = selectedDate ?? new Date();
    const { start, end } = getMonthRange(date);

    const filtered = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate >= new Date(start) && tDate <= new Date(end);
    });

    const totalIncome = filtered
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filtered
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    const categoryTotals: Record<string, number> = {};
    filtered
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    return {
      transactions: filtered,
      totalIncome,
      totalExpense,
      balance,
      categoryTotals,
    };
  }, [transactions, selectedDate]);
}
