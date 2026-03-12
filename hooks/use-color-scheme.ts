import { useColorScheme as useRNColorScheme } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export function useColorScheme() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme;
}
