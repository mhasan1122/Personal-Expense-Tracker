/**
 * Format amount for display with currency symbol
 */
export function formatAmount(amount: number, type?: 'income' | 'expense'): string {
  const sign = type === 'income' ? '+' : type === 'expense' ? '-' : '';
  return `${sign}$${Math.abs(amount).toFixed(2)}`;
}

/**
 * Format date for display (e.g., "Mar 12, 2025")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format date for month/year display (e.g., "March 2025")
 */
export function formatMonthYear(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Get start and end of month for a given date
 */
export function getMonthRange(date: Date): { start: string; end: string } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString(),
  };
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
