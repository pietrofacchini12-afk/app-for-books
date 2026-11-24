import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AccessibilityInfo } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookCard } from '../types/book';
import { Colors, Shadows } from '../constants/theme';
import { StarRating } from './StarRating';

interface BookListItemProps {
  book: BookCard;
  onPress: () => void;
  onToggleFavorite?: () => void;
}

export const BookListItem: React.FC<BookListItemProps> = ({
  book,
  onPress,
  onToggleFavorite,
}) => {
  const getFormatBadge = () => {
    switch (book.format) {
      case 'fisico':
        return { label: 'Físico', icon: 'book-outline' as const };
      case 'digital':
        return { label: 'E-book', icon: 'tablet-portrait-outline' as const };
      case 'audiolivro':
        return { label: 'Audiolivro', icon: 'headset-outline' as const };
    }
  };

  const badge = getFormatBadge();

  return (
    <TouchableOpacity
      style={[styles.card, Shadows.card]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`Livro ${book.title}, por ${book.author}, avaliação ${book.rating} estrelas`}
    >
      {/* Capa */}
      <View style={styles.coverWrapper}>
        {book.coverUri ? (
          <Image source={{ uri: book.coverUri }} style={styles.coverImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderCover}>
            <Ionicons name="book-outline" size={28} color={Colors.secondary} />
            <Text style={styles.placeholderText}>3 x 4 cm</Text>
          </View>
        )}
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {book.title}
          </Text>
          {onToggleFavorite && (
            <TouchableOpacity
              onPress={onToggleFavorite}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={book.isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
            >
              <Ionicons
                name={book.isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={Colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.author} numberOfLines={1}>
          por {book.author}
        </Text>

        <View style={styles.ratingRow}>
          <StarRating rating={book.rating} size={16} />
          {book.pages ? (
            <Text style={styles.pagesText}>• {book.pages} pág.</Text>
          ) : null}
        </View>

        {book.opinion ? (
          <View style={styles.opinionBadge}>
            <Text style={styles.opinionText} numberOfLines={1}>
              “{book.opinion}”
            </Text>
          </View>
        ) : null}

        <View style={styles.footerRow}>
          <View style={styles.formatBadge}>
            <Ionicons name={badge.icon} size={13} color={Colors.badgeText} style={{ marginRight: 4 }} />
            <Text style={styles.formatText}>{badge.label}</Text>
          </View>

          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: book.status === 'lido' ? '#E8F5E9' : book.status === 'lendo' ? '#FFF8E1' : '#F5F5F5' }]}>
            <Text style={[styles.statusText, { color: book.status === 'lido' ? '#2E7D32' : book.status === 'lendo' ? '#F57F17' : Colors.textSecondary }]}>
              {book.status === 'lido' ? 'Terminado' : book.status === 'lendo' ? 'Começado' : book.status === 'abandonado' ? 'Pausado' : 'Quero ler'}
            </Text>
          </View>

          {book.location ? (
            <View style={[styles.statusBadge, { backgroundColor: '#EDE7F6' }]}>
              <Ionicons name="location-outline" size={11} color="#5E35B1" style={{ marginRight: 2 }} />
              <Text style={[styles.statusText, { color: '#5E35B1' }]} numberOfLines={1}>
                {book.location}
              </Text>
            </View>
          ) : null}

          {book.genre ? (
            <View style={styles.genreBadge}>
              <Text style={styles.genreText} numberOfLines={1}>
                {book.genre}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    padding: 12,
    marginBottom: 14,
    overflow: 'hidden',
  },
  coverWrapper: {
    width: 72,
    height: 104,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderDashed,
    borderStyle: 'dashed',
    overflow: 'hidden',
    backgroundColor: '#FAF5EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  placeholderText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
  },
  content: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  author: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  pagesText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 6,
  },
  opinionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FBF0EA',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  opinionText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: Colors.primaryDark,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  formatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.badgeBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  formatText: {
    fontSize: 11,
    color: Colors.badgeText,
    fontWeight: '600',
  },
  genreBadge: {
    backgroundColor: '#F3EFEA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  genreText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
