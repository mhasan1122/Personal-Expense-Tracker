import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  View,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { ThemePreference } from '@/contexts/ThemeContext';

const OPTIONS: { value: ThemePreference; label: string; icon: 'wb-sunny' | 'dark-mode' | 'brightness-auto' }[] = [
  { value: 'light', label: 'Light', icon: 'wb-sunny' },
  { value: 'dark', label: 'Dark', icon: 'dark-mode' },
  { value: 'system', label: 'System', icon: 'brightness-auto' },
];

export function ThemeToggle() {
  const { preference, setTheme, resolvedTheme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor(
    { light: 'rgba(0,0,0,0.2)', dark: 'rgba(255,255,255,0.2)' },
    'background'
  );
  const iconColor = useThemeColor({}, 'icon');

  const currentIcon =
    resolvedTheme === 'dark' ? 'dark-mode' : 'wb-sunny';

  const handleSelect = async (value: ThemePreference) => {
    await setTheme(value);
    setShowPicker(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={[
          styles.button,
          {
            backgroundColor: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
            borderColor,
          },
        ]}
        activeOpacity={0.7}
        accessibilityLabel="Change theme"
        accessibilityHint="Opens theme options">
        <View style={styles.buttonInner}>
          <MaterialIcons
            name={currentIcon as 'wb-sunny' | 'dark-mode'}
            size={20}
            color={iconColor}
          />
          <ThemedText style={[styles.buttonLabel, { color: iconColor }]}>
            Theme
          </ThemedText>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="fade">
        <Pressable
          style={styles.overlay}
          onPress={() => setShowPicker(false)}>
          <Pressable
            style={[styles.menu, { backgroundColor, borderColor }]}
            onPress={(e) => e.stopPropagation()}>
            <ThemedText style={styles.menuTitle}>Theme</ThemedText>
            {OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.option,
                  preference === opt.value && styles.optionActive,
                  preference === opt.value && { backgroundColor: tintColor + '20' },
                ]}
                onPress={() => handleSelect(opt.value)}
                activeOpacity={0.7}>
                <MaterialIcons
                  name={opt.icon}
                  size={22}
                  color={preference === opt.value ? tintColor : textColor}
                />
                <ThemedText
                  style={[
                    styles.optionLabel,
                    preference === opt.value && { color: tintColor, fontWeight: '600' },
                  ]}>
                  {opt.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  menu: {
    width: '100%',
    maxWidth: 280,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  optionActive: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionLabel: {
    fontSize: 16,
  },
});
