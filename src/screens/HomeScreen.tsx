import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookCard, FilterType } from '../types/book';
import { BookListItem } from '../components/BookListItem';
import { PaperHeader } from '../components/PaperHeader';
import { Colors, Shadows } from '../constants/theme';

interface HomeScreenProps {
  books: BookCard[];
  onSelectBook: (book: BookCard) => void;
  onAddBook: () => void;
  onToggleFavorite: (book: BookCard) => void;
  onOpenStats: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  books,
  onSelectBook,
  onAddBook,
  onToggleFavorite,
  onOpenStats,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('todos');

  const filterTabs: { id: FilterType; label: string; icon: any }[] = [
    { id: 'todos', label: 'Todos', icon: 'albums-outline' },
    { id: 'favoritos', label: 'Favoritos', icon: 'heart' },
    { id: 'fisico', label: 'Físico', icon: 'book-outline' },
    { id: 'digital', label: 'E-book', icon: 'tablet-portrait-outline' },
    { id: 'audiolivro', label: 'Audiolivro', icon: 'headset-outline' },
  ];

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Filtro de texto por título ou autor
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Filtro por categoria
      switch (selectedFilter) {
        case 'favoritos':
          return book.isFavorite;
        case 'fisico':
          return book.format === 'fisico';
        case 'digital':
          return book.format === 'digital';
        case 'audiolivro':
          return book.format === 'audiolivro';
        default:
          return true;
      }
    });
  }, [books, searchQuery, selectedFilter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Top bar with Stats button and Paper header */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.statsButton}
            onPress={onOpenStats}
            accessibilityRole="button"
            accessibilityLabel="Abrir Estatísticas de Leitura"
          >
            <Ionicons name="bar-chart-outline" size={20} color={Colors.primaryDark} />
            <Text style={styles.statsButtonText}>Estatísticas</Text>
          </TouchableOpacity>
        </View>

        <PaperHeader subtitle="Minha Coleção Literária" />

        {/* Busca por título ou autor */}
        <View style={[styles.searchBox, Shadows.soft]}>
          <Ionicons name="search-outline" size={18} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            placeholder="Buscar por título ou autor..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            accessibilityLabel="Buscar por título ou autor"
            clearButtonMode="while-editing"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filtros em Abas de Papiro */}
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {filterTabs.map((tab) => {
              const isActive = selectedFilter === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setSelectedFilter(tab.id)}
                  activeOpacity={0.8}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                >
                  <Ionicons
                    name={tab.icon}
                    size={14}
                    color={isActive ? '#FFFFFF' : Colors.textSecondary}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Lista de Fichas de Leitura */}
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <BookListItem
              book={item}
              onPress={() => onSelectBook(item)}
              onToggleFavorite={() => onToggleFavorite(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="library-outline" size={54} color={Colors.borderDashed} />
              <Text style={styles.emptyTitle}>Nenhuma ficha encontrada</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || selectedFilter !== 'todos'
                  ? 'Tente ajustar sua busca ou filtro.'
                  : 'Que tal cadastrar a sua primeira leitura?'}
              </Text>
            </View>
          }
        />

        {/* Botão Flutuante "+ Adicionar Livro" */}
        <TouchableOpacity
          style={[styles.fab, Shadows.card]}
          onPress={onAddBook}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Adicionar nova ficha de leitura"
        >
          <Ionicons name="add" size={24} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.fabText}>Adicionar livro</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 8,
  },
  statsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3D2CF',
  },
  statsButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginLeft: 6,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    padding: 0,
  },
  filterSection: {
    marginBottom: 10,
  },
  filterScroll: {
    paddingVertical: 4,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3ECE4',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 90,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 14,
    fontFamily: 'serif',
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 6,
    textAlign: 'center',
    maxWidth: 240,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 28,
  },
  fabText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
