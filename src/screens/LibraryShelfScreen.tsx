import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookCard } from '../types/book';
import { LightTheme, DarkTheme, Shadows } from '../constants/theme';
import { StarRating } from '../components/StarRating';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 3;

interface LibraryShelfScreenProps {
  books: BookCard[];
  onSelectBook: (book: BookCard) => void;
  isDark: boolean;
}

export const LibraryShelfScreen: React.FC<LibraryShelfScreenProps> = ({
  books,
  onSelectBook,
  isDark,
}) => {
  const theme = isDark ? DarkTheme : LightTheme;
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('todos'); // todos, favoritos, fisico, digital, audiolivro, 5estrelas
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;

      if (filterType === 'favoritos') return book.isFavorite;
      if (filterType === 'fisico') return book.format === 'fisico';
      if (filterType === 'digital') return book.format === 'digital';
      if (filterType === 'audiolivro') return book.format === 'audiolivro';
      if (filterType === '5estrelas') return book.rating === 5;

      return true;
    });
  }, [books, search, filterType]);

  const filterChips = [
    { id: 'todos', label: 'Todos' },
    { id: 'favoritos', label: 'Favoritos ♥' },
    { id: 'fisico', label: 'Físico 📖' },
    { id: 'digital', label: 'E-book 📱' },
    { id: 'audiolivro', label: 'Audiolivro 🎧' },
    { id: '5estrelas', label: '5 Estrelas ★' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Minha Biblioteca</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              {books.length} {books.length === 1 ? 'livro catalogado' : 'livros catalogados'}
            </Text>
          </View>

          <View style={styles.viewToggleGroup}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                viewMode === 'grid' && { backgroundColor: theme.primaryLight },
              ]}
              onPress={() => setViewMode('grid')}
            >
              <Ionicons
                name="grid"
                size={18}
                color={viewMode === 'grid' ? theme.primaryDark : theme.textMuted}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleBtn,
                viewMode === 'list' && { backgroundColor: theme.primaryLight },
              ]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons
                name="list"
                size={20}
                color={viewMode === 'list' ? theme.primaryDark : theme.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Busca */}
        <View style={[styles.searchBox, Shadows.soft, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={18} color={theme.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Buscar na minha estante..."
            placeholderTextColor={theme.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filtros em Abas Horizontais */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
          {filterChips.map((chip) => {
            const isSelected = filterType === chip.id;
            return (
              <TouchableOpacity
                key={chip.id}
                style={[
                  styles.filterChip,
                  { backgroundColor: isSelected ? theme.primaryDark : theme.surface, borderColor: theme.border },
                ]}
                onPress={() => setFilterType(chip.id)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                    isSelected && { fontWeight: '700' },
                  ]}
                >
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Grade ou Lista de Livros */}
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          key={viewMode}
          numColumns={viewMode === 'grid' ? 3 : 1}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (viewMode === 'grid') {
              return (
                <TouchableOpacity
                  style={[styles.gridCard, { width: COLUMN_WIDTH }]}
                  onPress={() => onSelectBook(item)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.gridCoverWrapper, Shadows.soft, { borderColor: theme.border, backgroundColor: isDark ? '#332C2A' : '#FAF5EE' }]}>
                    {item.coverUri ? (
                      <Image source={{ uri: item.coverUri }} style={styles.gridCoverImg} resizeMode="cover" />
                    ) : (
                      <View style={styles.gridPlaceholder}>
                        <Ionicons name="book-outline" size={24} color={theme.secondary} />
                        <Text style={[styles.gridPlaceholderText, { color: theme.textMuted }]}>Pág. {item.pageNumber}</Text>
                      </View>
                    )}
                    {item.isFavorite && (
                      <View style={styles.gridFavBadge}>
                        <Ionicons name="heart" size={12} color="#E5989B" />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.gridTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.gridAuthor, { color: theme.textMuted }]} numberOfLines={1}>
                    {item.author}
                  </Text>
                  <View style={{ marginTop: 2 }}>
                    <StarRating rating={item.rating} size={11} color={theme.starActive} inactiveColor={theme.starInactive} />
                  </View>
                </TouchableOpacity>
              );
            }

            // Modo Lista
            return (
              <TouchableOpacity
                style={[styles.listCard, Shadows.soft, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
                onPress={() => onSelectBook(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.listCoverWrapper, { borderColor: theme.borderDashed, backgroundColor: isDark ? '#332C2A' : '#FAF5EE' }]}>
                  {item.coverUri ? (
                    <Image source={{ uri: item.coverUri }} style={styles.listCoverImg} resizeMode="cover" />
                  ) : (
                    <Ionicons name="book-outline" size={20} color={theme.secondary} />
                  )}
                </View>

                <View style={styles.listDetails}>
                  <View style={styles.listTitleRow}>
                    <Text style={[styles.listTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    {item.isFavorite && <Ionicons name="heart" size={16} color={theme.primary} />}
                  </View>
                  <Text style={[styles.listAuthor, { color: theme.textSecondary }]} numberOfLines={1}>
                    por {item.author}
                  </Text>

                  <View style={styles.listMetaRow}>
                    <StarRating rating={item.rating} size={13} color={theme.starActive} inactiveColor={theme.starInactive} />
                    <View style={[styles.pagePill, { backgroundColor: theme.primaryLight }]}>
                      <Text style={[styles.pagePillText, { color: theme.primaryDark }]}>Pág. {item.pageNumber}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="library-outline" size={48} color={theme.borderDashed} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Nenhum livro encontrado.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  viewToggleGroup: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EADBC8',
    borderRadius: 12,
    overflow: 'hidden',
  },
  toggleBtn: {
    padding: 6,
    paddingHorizontal: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 4,
  },
  filterBar: {
    gap: 8,
    paddingVertical: 6,
    marginBottom: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 30,
    gap: 12,
  },
  gridCard: {
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  gridCoverWrapper: {
    width: '100%',
    height: 128,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gridCoverImg: {
    width: '100%',
    height: '100%',
  },
  gridPlaceholder: {
    alignItems: 'center',
  },
  gridPlaceholderText: {
    fontSize: 9,
    marginTop: 4,
  },
  gridFavBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 2,
  },
  gridTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  gridAuthor: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 1,
  },
  listCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    gap: 12,
    alignItems: 'center',
  },
  listCoverWrapper: {
    width: 52,
    height: 74,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  listCoverImg: {
    width: '100%',
    height: '100%',
  },
  listDetails: {
    flex: 1,
  },
  listTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  listAuthor: {
    fontSize: 12,
    marginTop: 2,
  },
  listMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  pagePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pagePillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 13,
    marginTop: 8,
  },
});
