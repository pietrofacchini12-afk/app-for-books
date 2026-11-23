import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainTab } from '../types/book';
import { LightTheme, DarkTheme } from '../constants/theme';

interface BottomNavBarProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  isDark: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  isDark,
}) => {
  const theme = isDark ? DarkTheme : LightTheme;

  const tabs: { id: MainTab; label: string; icon: keyof typeof Ionicons.glyphMap; iconActive: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'home', label: 'Início', icon: 'home-outline', iconActive: 'home' },
    { id: 'book', label: 'Caderno', icon: 'book-outline', iconActive: 'book' },
    { id: 'search', label: 'Pesquisar', icon: 'search-outline', iconActive: 'search' },
    { id: 'library', label: 'Biblioteca', icon: 'grid-outline', iconActive: 'grid' },
    { id: 'settings', label: 'Ajustes', icon: 'settings-outline', iconActive: 'settings' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.tabBarBg, borderTopColor: theme.tabBarBorder }]}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabButton}
            onPress={() => onSelectTab(tab.id)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={22}
              color={isActive ? theme.tabActive : theme.tabInactive}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? theme.tabActive : theme.tabInactive },
                isActive && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 76 : 64,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 6,
    paddingTop: 6,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 3,
    fontWeight: '500',
  },
  tabLabelActive: {
    fontWeight: '700',
  },
});
