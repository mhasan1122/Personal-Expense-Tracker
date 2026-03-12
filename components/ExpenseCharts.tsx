import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#f59e0b',
  Transport: '#3b82f6',
  Shopping: '#ec4899',
  Bills: '#8b5cf6',
  Salary: '#22c55e',
  Others: '#6b7280',
};

interface CategoryData {
  category: string;
  amount: number;
}

interface MonthlyData {
  month: string;
  total: number;
}

interface ExpenseChartsProps {
  categoryTotals: Record<string, number>;
  monthlyData?: MonthlyData[];
}

const screenWidth = Dimensions.get('window').width - 40;

export function ExpenseCharts({
  categoryTotals,
  monthlyData = [],
}: ExpenseChartsProps) {
  const textColor = useThemeColor({}, 'text');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const pieData = Object.entries(categoryTotals)
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({
      name: category,
      amount,
      color: CATEGORY_COLORS[category] || '#6b7280',
      legendFontColor: textColor,
      legendFontSize: 12,
    }));

  const barData = {
    labels: monthlyData.map((d) => d.month) || ['No data'],
    datasets: [{ data: monthlyData.map((d) => d.total) || [0] }],
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: 0,
    color: (opacity = 1) =>
      isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    labelColor: () => textColor,
  };

  if (pieData.length === 0 && monthlyData.length === 0) {
    return (
      <View style={styles.empty}>
        <ThemedText>No data to display. Add some expenses first!</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {pieData.length > 0 && (
        <View style={styles.chartSection}>
          <ThemedText type="subtitle" style={styles.chartTitle}>
            Category Spending
          </ThemedText>
          <PieChart
            data={pieData}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      )}

      {monthlyData.length > 0 && (
        <View style={styles.chartSection}>
          <ThemedText type="subtitle" style={styles.chartTitle}>
            Monthly Expenses
          </ThemedText>
          <BarChart
            style={styles.barChart}
            data={barData}
            width={screenWidth}
            height={220}
            yAxisLabel="$"
            yAxisSuffix=""
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chartSection: {
    marginBottom: 24,
  },
  chartTitle: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  barChart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
});
