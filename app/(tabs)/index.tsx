import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { SummaryCard } from '@/components/SummaryCard';
import { TransactionItem } from '@/components/TransactionItem';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTransactions } from '@/contexts/TransactionContext';
import { useTransactionSummary } from '@/hooks/useTransactionSummary';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function DashboardScreen() {
  const router = useRouter();
  const { transactions, loading, deleteTransaction, refreshTransactions } =
    useTransactions();
  const { totalIncome, totalExpense, balance, transactions: monthlyTransactions } =
    useTransactionSummary(transactions);
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  const recentTransactions = monthlyTransactions.slice(0, 5);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Image
            source={require('@/assets/images/LOGO.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText type="title">Dashboard</ThemedText>
        </View>
        <View style={styles.headerActions}>
          <ThemeToggle />
          <TouchableOpacity onPress={() => router.push('/(tabs)/add')}>
            <ThemedText style={[styles.addButton, { color: tintColor }]}>
              + Add
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshTransactions} />
        }>
        <View style={styles.summaryRow}>
          <SummaryCard title="Income" amount={totalIncome} type="income" />
          <View style={styles.cardSpacer} />
          <SummaryCard title="Expense" amount={totalExpense} type="expense" />
        </View>
        <View style={styles.summaryRow}>
          <SummaryCard
            title="Balance"
            amount={balance}
            type="balance"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Recent Transactions</ThemedText>
            <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
              <ThemedText style={[styles.seeAll, { color: tintColor }]}>
                See All
              </ThemedText>
            </TouchableOpacity>
          </View>
          {recentTransactions.length === 0 ? (
            <ThemedText style={styles.emptyText}>
              No transactions this month. Tap + Add to get started!
            </ThemedText>
          ) : (
            recentTransactions.map((t) => (
              <TransactionItem
                key={t.id}
                transaction={t}
                onEdit={(trans) =>
                  router.push({
                    pathname: '/modal',
                    params: { id: trans.id, mode: 'edit' },
                  })
                }
                onDelete={deleteTransaction}
              />
            ))
          )}
        </View>
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  cardSpacer: {
    width: 12,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    opacity: 0.7,
    fontStyle: 'italic',
  },
});
