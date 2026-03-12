import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Transaction } from '@/types/transaction';
import {
  CATEGORIES,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  type Category,
  type TransactionType,
} from '@/types/transaction';
interface TransactionFormProps {
  onSubmit: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  editingTransaction?: Transaction | null;
}

export function TransactionForm({
  onSubmit,
  onCancel,
  editingTransaction,
}: TransactionFormProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<Category>('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isEditing = !!editingTransaction;

  const formatDateForDisplay = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDateChange = (
    event: { type: string },
    selectedDate?: Date
  ) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (event.type === 'dismissed') return;
    if (selectedDate) {
      setDate(selectedDate.toISOString().split('T')[0]);
    }
  };
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor(
    { light: 'rgba(0,0,0,0.2)', dark: 'rgba(255,255,255,0.2)' },
    'background'
  );
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({ light: '#0a7ea4', dark: '#0a7ea4' }, 'tint');

  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount.toString());
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date.split('T')[0]);
      setNote(editingTransaction.note || '');
    }
  }, [editingTransaction]);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Keep ref in sync so handleSubmit always reads latest values (avoids stale closure)
  const formRef = useRef({ title, amount, type, category, date, note });
  formRef.current = { title, amount, type, category, date, note };

  const handleSubmit = () => {
    const { title: t, amount: a, type: ty, category: cat, date: d, note: n } =
      formRef.current;
    const trimmedTitle = t.trim();
    const amountNum = parseFloat(a);

    if (!trimmedTitle) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    onSubmit({
      title: trimmedTitle,
      amount: amountNum,
      type: ty,
      category: cat,
      date: d,
      note: n.trim() || undefined,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText style={styles.label}>Title</ThemedText>
          <TextInput
            style={[styles.input, { color: textColor, borderColor }]}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Grocery shopping"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Amount (৳)</ThemedText>
          <TextInput
            style={[styles.input, { color: textColor, borderColor }]}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Type</ThemedText>
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'expense' && styles.typeButtonActive,
              ]}
              onPress={() => {
                setType('expense');
                setCategory('Food');
              }}>
              <ThemedText
                style={[
                  styles.typeButtonText,
                  type === 'expense' && styles.typeButtonTextActive,
                ]}>
                Expense
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'income' && styles.typeButtonActive,
              ]}
              onPress={() => {
                setType('income');
                setCategory('Salary');
              }}>
              <ThemedText
                style={[
                  styles.typeButtonText,
                  type === 'income' && styles.typeButtonTextActive,
                ]}>
                Income
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Category</ThemedText>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  category === cat && styles.categoryChipActive,
                ]}
                onPress={() => setCategory(cat)}>
                <ThemedText
                  style={[
                    styles.categoryChipText,
                    category === cat && styles.categoryChipTextActive,
                  ]}>
                  {cat}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Date</ThemedText>
          {Platform.OS === 'web' ? (
            <TextInput
              style={[styles.input, { color: textColor, borderColor }]}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#999"
            />
          ) : (
            <>
              <TouchableOpacity
                style={[styles.input, styles.dateTouchable, { borderColor }]}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}>
                <ThemedText style={[styles.dateText, { color: textColor }]}>
                  {formatDateForDisplay(date)}
                </ThemedText>
                <ThemedText style={styles.dateHint}>Tap to pick date</ThemedText>
              </TouchableOpacity>

          {showDatePicker && (
            <>
              {Platform.OS === 'ios' ? (
                <Modal
                  transparent
                  animationType="slide"
                  visible={showDatePicker}>
                  <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowDatePicker(false)}>
                    <Pressable
                      style={[styles.modalContent, { backgroundColor }]}
                      onPress={(e) => e.stopPropagation()}>
                      <View style={styles.modalHeader}>
                        <TouchableOpacity
                          onPress={() => setShowDatePicker(false)}>
                          <ThemedText style={[styles.doneButton, { color: tintColor }]}>
                            Done
                          </ThemedText>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        value={new Date(date + 'T12:00:00')}
                        mode="date"
                        display="compact"
                        onChange={handleDateChange}
                      />
                    </Pressable>
                  </Pressable>
                </Modal>
              ) : (
                <DateTimePicker
                  value={new Date(date + 'T12:00:00')}
                  mode="date"
                  display="calendar"
                  onChange={handleDateChange}
                />
              )}
            </>
          )}
            </>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Note (optional)</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea, { color: textColor, borderColor }]}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <ThemedText style={styles.submitButtonText}>
              {isEditing ? 'Update' : 'Add'} Transaction
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  dateTouchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateHint: {
    fontSize: 13,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  doneButton: {
    fontSize: 17,
    fontWeight: '600',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(128, 128, 128, 0.3)',
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#0a7ea4',
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#0a7ea4',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.3)',
  },
  categoryChipActive: {
    borderColor: '#0a7ea4',
    backgroundColor: 'rgba(10, 126, 164, 0.15)',
  },
  categoryChipText: {
    fontSize: 14,
  },
  categoryChipTextActive: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.4)',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
