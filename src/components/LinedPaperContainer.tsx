import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/theme';

interface LinedPaperContainerProps {
  label: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const LinedPaperContainer: React.FC<LinedPaperContainerProps> = ({
  label,
  children,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>{label.toUpperCase()}</Text>
      </View>
      <View style={styles.paperBox}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#F3D2CF',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 1,
  },
  paperBox: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 12,
  },
});
