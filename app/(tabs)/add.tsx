import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { TransactionForm } from '@/components/TransactionForm';
import { useTransactions } from '@/contexts/TransactionContext';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function AddTransactionScreen() {
  const router = useRouter();
  const { addTransaction } = useTransactions();
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = async (data: Parameters<typeof addTransaction>[0]) => {
    await addTransaction(data);
    setFormKey((k) => k + 1);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const backgroundColor = useThemeColor({}, 'background');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <View style={styles.header}>
        <ThemedText type="title">Add Transaction</ThemedText>
      </View>
      <TransactionForm
        key={formKey}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
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
});
