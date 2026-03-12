import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { TransactionProvider } from '@/contexts/TransactionContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootContent() {
  const { resolvedTheme } = useTheme();

  return (
    <NavThemeProvider
      value={resolvedTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TransactionProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Edit Transaction' }}
          />
        </Stack>
        <StatusBar style="auto" />
      </TransactionProvider>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootContent />
    </ThemeProvider>
  );
}
