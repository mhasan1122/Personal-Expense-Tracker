import { useMemo } from 'react';
import type { Transaction } from '@/types/transaction';

/**
 * Get last 6 months of expense data for bar chart
 */
export function useMonthlyExpenses(
  transactions: Transaction[],
  currentDate?: Date
): { month: string; total: number }[] {
  return useMemo(() => {
    const date = currentDate ?? new Date();
    const result: { month: string; total: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);

      const total = transactions
        .filter((t) => {
          if (t.type !== 'expense') return false;
          const tDate = new Date(t.date);
          return tDate >= monthStart && tDate <= monthEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      result.push({
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        total,
      });
    }

    return result;
  }, [transactions, currentDate]);
}
