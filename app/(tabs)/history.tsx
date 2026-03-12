import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { TransactionItem } from '@/components/TransactionItem';
import { useTransactions } from '@/contexts/TransactionContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatDate } from '@/utils/format';

export default function HistoryScreen() {
  const router = useRouter();
  const { transactions, loading, deleteTransaction, refreshTransactions } =
    useTransactions();
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor(
    { light: 'rgba(0,0,0,0.2)', dark: 'rgba(255,255,255,0.2)' },
    'background'
  );

  const filteredTransactions = useMemo(() => {
    if (!filterStart && !filterEnd) return transactions;
    return transactions.filter((t) => {
      const tDate = t.date.split('T')[0];
      if (filterStart && tDate < filterStart) return false;
      if (filterEnd && tDate > filterEnd) return false;
      return true;
    });
  }, [transactions, filterStart, filterEnd]);

  const clearFilters = () => {
    setFilterStart('');
    setFilterEnd('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <View style={styles.header}>
        <ThemedText type="title">Transactions</ThemedText>
        <TouchableOpacity onPress={() => router.push('/(tabs)/add')}>
          <ThemedText style={[styles.addButton, { color: tintColor }]}>
            + Add
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={[styles.filterSection, { borderBottomColor: borderColor }]}>
        <ThemedText style={styles.filterLabel}>Filter by date</ThemedText>
        <View style={styles.filterRow}>
          <TextInput
            style={[styles.filterInput, { color: textColor, borderColor }]}
            value={filterStart}
            onChangeText={setFilterStart}
            placeholder="Start (YYYY-MM-DD)"
            placeholderTextColor="#999"
          />
          <TextInput
            style={[styles.filterInput, { color: textColor, borderColor }]}
            value={filterEnd}
            onChangeText={setFilterEnd}
            placeholder="End (YYYY-MM-DD)"
            placeholderTextColor="#999"
          />
        </View>
        {(filterStart || filterEnd) && (
          <TouchableOpacity onPress={clearFilters}>
            <ThemedText style={styles.clearFilters}>Clear filters</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshTransactions} />
        }
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>
            {transactions.length === 0
              ? 'No transactions yet. Add your first transaction!'
              : 'No transactions match your filters.'}
          </ThemedText>
        }
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onEdit={(trans) =>
              router.push({
                pathname: '/modal',
                params: { id: trans.id, mode: 'edit' },
              })
            }
            onDelete={deleteTransaction}
          />
        )}
      />
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
  addButton: {
    fontSize: 18,
    fontWeight: '600',
  },
  filterSection: {
    padding: 16,
    borderBottomWidth: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  clearFilters: {
    marginTop: 8,
    fontSize: 14,
    color: '#0a7ea4',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyText: {
    padding: 40,
    textAlign: 'center',
    opacity: 0.7,
  },
});
