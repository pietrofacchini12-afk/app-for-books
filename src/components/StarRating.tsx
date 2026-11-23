import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  color?: string;
  inactiveColor?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 24,
  interactive = false,
  onRatingChange,
  color = Colors.starActive,
  inactiveColor = Colors.starInactive,
}) => {
  return (
    <View style={styles.container} accessibilityRole="radiogroup" accessibilityLabel={`Avaliação: ${rating} de ${maxStars} estrelas`}>
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        const StarIcon = (
          <Ionicons
            name={isFilled ? 'star' : 'star-outline'}
            size={size}
            color={isFilled ? color : inactiveColor}
            style={styles.star}
          />
        );

        if (interactive && onRatingChange) {
          return (
            <TouchableOpacity
              key={starValue}
              onPress={() => onRatingChange(starValue)}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ selected: isFilled }}
              accessibilityLabel={`${starValue} estrela${starValue > 1 ? 's' : ''}`}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              {StarIcon}
            </TouchableOpacity>
          );
        }

        return <View key={starValue}>{StarIcon}</View>;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 4,
  },
});
