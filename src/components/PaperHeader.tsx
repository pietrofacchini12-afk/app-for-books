import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

interface PaperHeaderProps {
  title?: string;
  subtitle?: string;
  showHeart?: boolean;
}

export const PaperHeader: React.FC<PaperHeaderProps> = ({
  title = 'FICHA DE LEITURA',
  subtitle,
  showHeart = true,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.decorRow}>
        <Ionicons name="sparkles-outline" size={14} color={Colors.secondary} />
        <Text style={styles.headerTitle}>{title}</Text>
        <Ionicons name="sparkles-outline" size={14} color={Colors.secondary} />
      </View>
      
      {showHeart && (
        <View style={styles.heartRow}>
          <View style={styles.line} />
          <Ionicons name="heart" size={12} color={Colors.primary} style={styles.heartIcon} />
          <View style={styles.line} />
        </View>
      )}

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  decorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 4,
    color: Colors.textPrimary,
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  heartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    marginTop: 6,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  heartIcon: {
    marginHorizontal: 8,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
});
