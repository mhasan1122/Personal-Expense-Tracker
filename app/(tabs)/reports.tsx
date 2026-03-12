import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { SummaryCard } from '@/components/SummaryCard';
import { CategorySpendingCard } from '@/components/CategorySpendingCard';
import { ExpenseCharts } from '@/components/ExpenseCharts';
import { useTransactions } from '@/contexts/TransactionContext';
import { useTransactionSummary } from '@/hooks/useTransactionSummary';
import { useMonthlyExpenses } from '@/hooks/useMonthlyExpenses';
import { generateAndSharePDF } from '@/utils/pdfExport';
import { formatMonthYear, getMonthRange } from '@/utils/format';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ReportsScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { transactions, loading, refreshTransactions } = useTransactions();
  const {
    totalIncome,
    totalExpense,
    balance,
    categoryTotals,
    transactions: monthlyTransactions,
  } = useTransactionSummary(transactions, selectedDate);
  const monthlyData = useMonthlyExpenses(transactions, selectedDate);
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  const categoryBreakdown = Object.entries(categoryTotals)
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const totalExpenseForCategory = Object.values(categoryTotals).reduce(
    (a, b) => a + b,
    0
  );

  const handlePrevMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1)
    );
  };

  const handleExportPDF = async () => {
    try {
      await generateAndSharePDF({
        totalIncome,
        totalExpense,
        balance,
        month: formatMonthYear(selectedDate.toISOString()),
        categoryBreakdown,
      });
    } catch (error) {
      console.error('PDF export failed:', error);
    }
  };

  const currentMonthLabel = formatMonthYear(selectedDate.toISOString());
  const isCurrentMonth =
    selectedDate.getMonth() === new Date().getMonth() &&
    selectedDate.getFullYear() === new Date().getFullYear();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <View style={styles.header}>
        <ThemedText type="title">Reports</ThemedText>
        <TouchableOpacity onPress={handleExportPDF}>
          <ThemedText style={[styles.exportButton, { color: tintColor }]}>
            Export PDF
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshTransactions} />
        }>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={handlePrevMonth}>
            <ThemedText style={[styles.monthNav, { color: tintColor }]}>
              ← Prev
            </ThemedText>
          </TouchableOpacity>
          <ThemedText type="subtitle">{currentMonthLabel}</ThemedText>
          <TouchableOpacity
            onPress={handleNextMonth}
            disabled={isCurrentMonth}>
            <ThemedText
              style={[
                styles.monthNav,
                { color: tintColor, opacity: isCurrentMonth ? 0.5 : 1 },
              ]}>
              Next →
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <SummaryCard title="Income" amount={totalIncome} type="income" />
          <View style={styles.cardSpacer} />
          <SummaryCard title="Expense" amount={totalExpense} type="expense" />
        </View>
        <View style={styles.summaryRow}>
          <SummaryCard title="Balance" amount={balance} type="balance" />
        </View>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Category Breakdown
        </ThemedText>
        {categoryBreakdown.length === 0 ? (
          <ThemedText style={styles.emptyText}>
            No expenses this month.
          </ThemedText>
        ) : (
          categoryBreakdown.map(({ category, amount }) => (
            <CategorySpendingCard
              key={category}
              category={category}
              amount={amount}
              total={totalExpenseForCategory}
            />
          ))
        )}

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Charts
        </ThemedText>
        <ExpenseCharts categoryTotals={categoryTotals} monthlyData={monthlyData} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  exportButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthNav: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  cardSpacer: {
    width: 12,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    opacity: 0.7,
    fontStyle: 'italic',
  },
});
