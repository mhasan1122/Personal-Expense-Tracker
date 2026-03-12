import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { TransactionForm } from '@/components/TransactionForm';
import { useTransactions } from '@/contexts/TransactionContext';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function EditTransactionModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { transactions, updateTransaction } = useTransactions();

  const transaction = useMemo(() => {
    if (!id) return null;
    return transactions.find((t) => t.id === id) ?? null;
  }, [transactions, id]);

  const handleSubmit = async (
    data: Parameters<typeof updateTransaction>[1] & {
      title: string;
      amount: number;
      type: 'income' | 'expense';
      category: string;
      date: string;
      note?: string;
    }
  ) => {
    if (id) {
      await updateTransaction(id, data);
      router.back();
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: useThemeColor({}, 'background') },
      ]}
      edges={['top']}>
      <View style={styles.header}>
        <ThemedText type="title">Edit Transaction</ThemedText>
      </View>
      {transaction ? (
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          editingTransaction={transaction}
        />
      ) : (
        <View style={styles.loading}>
          <ThemedText>
            {id ? 'Transaction not found' : 'No transaction selected'}
          </ThemedText>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
