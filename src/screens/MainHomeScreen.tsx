import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookCard } from '../types/book';
import { PaperHeader } from '../components/PaperHeader';
import { LightTheme, DarkTheme, Shadows } from '../constants/theme';
import { StarRating } from '../components/StarRating';

interface MainHomeScreenProps {
  books: BookCard[];
  lastViewedBook?: BookCard;
  onContinueReading: () => void;
  onOpenBookReader: () => void;
  onGoToSearch: () => void;
  onGoToLibrary: () => void;
  onGoToSettings: () => void;
  onSelectBook: (book: BookCard) => void;
  isDark: boolean;
}

export const MainHomeScreen: React.FC<MainHomeScreenProps> = ({
  books,
  lastViewedBook,
  onContinueReading,
  onOpenBookReader,
  onGoToSearch,
  onGoToLibrary,
  onGoToSettings,
  onSelectBook,
  isDark,
}) => {
  const theme = isDark ? DarkTheme : LightTheme;
  const recentBook = lastViewedBook || books[0];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={[styles.settingsCircle, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={onGoToSettings}
            accessibilityLabel="Abrir configurações"
          >
            <Ionicons name="settings-outline" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        <PaperHeader title="FICHA DE LEITURA" subtitle="Meu Diário Literário" />

        {/* 1. CONTINUAR LENDO (Abre a última ficha/página visualizada) */}
        {recentBook ? (
          <View style={[styles.card, Shadows.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderLeft}>
                <Ionicons name="bookmark" size={18} color={theme.primaryDark} />
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Continuar lendo</Text>
              </View>
              <View style={[styles.pageBadge, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.pageBadgeText, { color: theme.primaryDark }]}>
                  Pág. {recentBook.pageNumber || 1}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.continueCardInner}
              onPress={onContinueReading}
              activeOpacity={0.85}
              accessibilityLabel={`Continuar lendo ${recentBook.title}`}
            >
              <View style={[styles.coverBox, { borderColor: theme.borderDashed, backgroundColor: isDark ? '#332C2A' : '#FAF5EE' }]}>
                {recentBook.coverUri ? (
                  <Image source={{ uri: recentBook.coverUri }} style={styles.coverImage} resizeMode="cover" />
                ) : (
                  <Ionicons name="book-outline" size={26} color={theme.secondary} />
                )}
              </View>

              <View style={styles.continueInfo}>
                <Text style={[styles.bookTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                  {recentBook.title}
                </Text>
                <Text style={[styles.bookAuthor, { color: theme.textSecondary }]} numberOfLines={1}>
                  por {recentBook.author}
                </Text>
                <View style={{ marginTop: 4 }}>
                  <StarRating rating={recentBook.rating} size={15} color={theme.starActive} inactiveColor={theme.starInactive} />
                </View>
                <View style={[styles.resumeButton, { backgroundColor: theme.primaryDark }]}>
                  <Text style={styles.resumeButtonText}>Abrir Ficha</Text>
                  <Ionicons name="arrow-forward" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* 2. MENU PRINCIPAL: ABRIR MEU LIVRO DE LEITURA */}
        <TouchableOpacity
          style={[styles.bigActionCard, Shadows.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
          onPress={onOpenBookReader}
          activeOpacity={0.85}
        >
          <View style={[styles.iconCircle, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="book" size={26} color={theme.primaryDark} />
          </View>
          <View style={styles.bigActionTextCol}>
            <Text style={[styles.bigActionTitle, { color: theme.textPrimary }]}>Abrir meu livro de leitura</Text>
            <Text style={[styles.bigActionSubtitle, { color: theme.textSecondary }]}>
              Folheie suas páginas, vá para uma página específica ou adicione novas fichas.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={theme.textMuted} />
        </TouchableOpacity>

        {/* 3. PESQUISAR LIVROS ONLINE */}
        <TouchableOpacity
          style={[styles.bigActionCard, Shadows.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
          onPress={onGoToSearch}
          activeOpacity={0.85}
        >
          <View style={[styles.iconCircle, { backgroundColor: isDark ? '#3D342B' : '#FAEDCD' }]}>
            <Ionicons name="search" size={24} color={theme.secondary} />
          </View>
          <View style={styles.bigActionTextCol}>
            <Text style={[styles.bigActionTitle, { color: theme.textPrimary }]}>Pesquisar livros</Text>
            <Text style={[styles.bigActionSubtitle, { color: theme.textSecondary }]}>
              Busque por título, autor ou ISBN e adicione direto à sua biblioteca.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={theme.textMuted} />
        </TouchableOpacity>

        {/* 4. MINHA BIBLIOTECA (Estante de capas) */}
        <View style={styles.shelfSection}>
          <View style={styles.shelfHeaderRow}>
            <Text style={[styles.shelfHeaderTitle, { color: theme.textPrimary }]}>Minha Biblioteca</Text>
            <TouchableOpacity onPress={onGoToLibrary}>
              <Text style={[styles.seeAllText, { color: theme.primaryDark }]}>Ver tudo ({books.length}) →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelfScroll}>
            {books.length === 0 ? (
              <View style={{ paddingVertical: 14 }}>
                <Text style={{ fontSize: 13, color: theme.textMuted, fontStyle: 'italic' }}>
                  Nenhum livro cadastrado ainda. Clique em "Abrir meu livro de leitura" para criar sua primeira ficha!
                </Text>
              </View>
            ) : (
              books.map((b) => (
                <TouchableOpacity
                  key={b.id}
                  style={styles.miniShelfItem}
                  onPress={() => onSelectBook(b)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.miniCoverBox, { borderColor: theme.border, backgroundColor: isDark ? '#332C2A' : '#FAF5EE' }]}>
                    {b.coverUri ? (
                      <Image source={{ uri: b.coverUri }} style={styles.coverImage} resizeMode="cover" />
                    ) : (
                      <Ionicons name="book-outline" size={20} color={theme.secondary} />
                    )}
                  </View>
                  <Text style={[styles.miniBookTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                    {b.title}
                  </Text>
                  <Text style={[styles.miniPageTag, { color: theme.textMuted }]}>Pág. {b.pageNumber}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  settingsCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  pageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pageBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  continueCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coverBox: {
    width: 64,
    height: 90,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  continueInfo: {
    flex: 1,
    marginLeft: 14,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  bookAuthor: {
    fontSize: 13,
    marginTop: 2,
  },
  resumeButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 8,
  },
  resumeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  bigActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigActionTextCol: {
    flex: 1,
    marginHorizontal: 12,
  },
  bigActionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  bigActionSubtitle: {
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },
  shelfSection: {
    marginTop: 10,
  },
  shelfHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  shelfHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  shelfScroll: {
    gap: 12,
    paddingVertical: 4,
  },
  miniShelfItem: {
    width: 80,
    alignItems: 'center',
  },
  miniCoverBox: {
    width: 76,
    height: 108,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniBookTitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  miniPageTag: {
    fontSize: 10,
    marginTop: 2,
  },
});
