import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { CURRENCY_SYMBOL } from '@/constants/theme';

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#f59e0b',
  Transport: '#3b82f6',
  Shopping: '#ec4899',
  Bills: '#8b5cf6',
  Rent: '#14b8a6',
  Salary: '#22c55e',
  Others: '#6b7280',
};

interface CategorySpendingCardProps {
  category: string;
  amount: number;
  total: number;
}

export function CategorySpendingCard({
  category,
  amount,
  total,
}: CategorySpendingCardProps) {
  const percentage = total > 0 ? (amount / total) * 100 : 0;
  const barColor = CATEGORY_COLORS[category] || '#6b7280';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold">{category}</ThemedText>
        <ThemedText style={styles.amount}>{CURRENCY_SYMBOL}{amount.toFixed(2)}</ThemedText>
      </View>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
      <ThemedText style={styles.percentage}>{percentage.toFixed(1)}%</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
  },
  barContainer: {
    height: 6,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 3,
  },
  percentage: {
    fontSize: 11,
    opacity: 0.7,
    marginTop: 2,
  },
});
