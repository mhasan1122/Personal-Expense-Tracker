import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  type ViewStyle,
} from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import type { Transaction } from '@/types/transaction';
import { formatAmount, formatDate } from '@/utils/format';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  style?: ViewStyle;
}

export function TransactionItem({
  transaction,
  onEdit,
  onDelete,
  style,
}: TransactionItemProps) {
  const borderColor = useThemeColor(
    { light: 'rgba(0,0,0,0.08)', dark: 'rgba(255,255,255,0.08)' },
    'background'
  );
  const incomeColor = '#22c55e';
  const expenseColor = '#ef4444';

  const amountColor =
    transaction.type === 'income' ? incomeColor : expenseColor;

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(transaction.id) },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, { borderBottomColor: borderColor }, style]}
      onPress={() => onEdit(transaction)}
      onLongPress={handleDelete}
      activeOpacity={0.7}>
      <View style={styles.content}>
        <View>
          <ThemedText type="defaultSemiBold" numberOfLines={1}>
            {transaction.title}
          </ThemedText>
          <ThemedText style={styles.subtext}>
            {transaction.category} • {formatDate(transaction.date)}
          </ThemedText>
        </View>
        <ThemedText
          style={[styles.amount, { color: amountColor }]}
          numberOfLines={1}>
          {formatAmount(transaction.amount, transaction.type)}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtext: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
  },
});
