import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import { CURRENCY_SYMBOL } from '@/constants/theme';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
}

export function SummaryCard({ title, amount, type }: SummaryCardProps) {
  const incomeColor = useThemeColor(
    { light: '#22c55e', dark: '#4ade80' },
    'text'
  );
  const expenseColor = useThemeColor(
    { light: '#ef4444', dark: '#f87171' },
    'text'
  );
  const balanceColor = useThemeColor(
    { light: '#0a7ea4', dark: '#38bdf8' },
    'text'
  );

  const amountColor =
    type === 'income'
      ? incomeColor
      : type === 'expense'
        ? expenseColor
        : balanceColor;

  const sign = type === 'income' ? '+' : type === 'expense' ? '-' : '';
  const displayAmount = `${sign}${CURRENCY_SYMBOL}${Math.abs(amount).toFixed(2)}`;

  return (
    <View style={styles.card}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={[styles.amount, { color: amountColor }]}>
        {displayAmount}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    minWidth: 100,
  },
  title: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
});
