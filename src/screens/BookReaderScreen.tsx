import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookCard } from '../types/book';
import { StarRating } from '../components/StarRating';
import { PaperHeader } from '../components/PaperHeader';
import { LightTheme, DarkTheme, Shadows } from '../constants/theme';
import { ExportService } from '../services/exportService';

const { width } = Dimensions.get('window');

interface BookReaderScreenProps {
  books: BookCard[];
  currentPageNumber: number;
  onPageChange: (newPage: number) => void;
  onEditBook: (book: BookCard) => void;
  onAddBookAtPage: (page: number) => void;
  onDeleteBook: (id: string) => void;
  onToggleFavorite: (book: BookCard) => void;
  isDark: boolean;
}

export const BookReaderScreen: React.FC<BookReaderScreenProps> = ({
  books,
  currentPageNumber,
  onPageChange,
  onEditBook,
  onAddBookAtPage,
  onDeleteBook,
  onToggleFavorite,
  isDark,
}) => {
  const theme = isDark ? DarkTheme : LightTheme;
  const [goToPageInput, setGoToPageInput] = useState('');
  const [isJumpModalOpen, setIsJumpModalOpen] = useState(false);

  // Encontra o livro associado a esta página (se existir)
  const totalPages = Math.max(books.length, 1);
  const currentBook = books.find((b) => b.pageNumber === currentPageNumber);

  const handlePrevPage = () => {
    if (currentPageNumber > 1) {
      onPageChange(currentPageNumber - 1);
    }
  };

  const handleNextPage = () => {
    onPageChange(currentPageNumber + 1);
  };

  const handleJumpToPage = () => {
    const pageNum = parseInt(goToPageInput, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      Alert.alert('Página inválida', 'Informe um número de página válido maior que zero.');
      return;
    }
    onPageChange(pageNum);
    setIsJumpModalOpen(false);
    setGoToPageInput('');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Barra de Navegação de Páginas do Livro */}
      <View style={[styles.topBookBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.pageNavBtn, currentPageNumber <= 1 && styles.pageNavBtnDisabled]}
          onPress={handlePrevPage}
          disabled={currentPageNumber <= 1}
        >
          <Ionicons name="arrow-back" size={18} color={currentPageNumber <= 1 ? theme.textMuted : theme.primaryDark} />
          <Text style={[styles.pageNavBtnText, { color: currentPageNumber <= 1 ? theme.textMuted : theme.primaryDark }]}>
            Anterior
          </Text>
        </TouchableOpacity>

        {/* Indicador de Página e botão "Ir para página" */}
        <TouchableOpacity
          style={[styles.pageBadgeTouchable, { backgroundColor: theme.primaryLight }]}
          onPress={() => setIsJumpModalOpen(!isJumpModalOpen)}
        >
          <Ionicons name="bookmarks-outline" size={14} color={theme.primaryDark} />
          <Text style={[styles.pageBadgeNumber, { color: theme.primaryDark }]}>
            Pág. {currentPageNumber} {totalPages > 0 ? `de ${totalPages}` : ''}
          </Text>
          <Ionicons name="chevron-down" size={12} color={theme.primaryDark} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pageNavBtn}
          onPress={handleNextPage}
        >
          <Text style={[styles.pageNavBtnText, { color: theme.primaryDark }]}>
            Próxima
          </Text>
          <Ionicons name="arrow-forward" size={18} color={theme.primaryDark} />
        </TouchableOpacity>
      </View>

      {/* Caixa de Entrada Rápida "Ir para página [número editável]" */}
      {isJumpModalOpen && (
        <View style={[styles.jumpBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.jumpLabel, { color: theme.textSecondary }]}>Ir para página:</Text>
          <TextInput
            style={[styles.jumpInput, { backgroundColor: theme.cardBackground, borderColor: theme.border, color: theme.textPrimary }]}
            value={goToPageInput}
            onChangeText={setGoToPageInput}
            keyboardType="numeric"
            placeholder={String(currentPageNumber)}
            placeholderTextColor={theme.textMuted}
          />
          <TouchableOpacity style={[styles.jumpSubmitBtn, { backgroundColor: theme.primaryDark }]} onPress={handleJumpToPage}>
            <Text style={styles.jumpSubmitBtnText}>Ir</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {currentBook ? (
          /* FICHA DO LIVRO NA PÁGINA ATUAL */
          <View style={[styles.paperSheet, Shadows.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <View style={styles.sheetTopControls}>
              <View style={[styles.pageBadgeCorner, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.pageBadgeCornerText, { color: theme.primaryDark }]}>
                  PÁG. {currentBook.pageNumber}
                </Text>
              </View>

              <View style={styles.actionIconsRow}>
                <TouchableOpacity
                  style={[styles.iconBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={() => onToggleFavorite(currentBook)}
                >
                  <Ionicons
                    name={currentBook.isFavorite ? 'heart' : 'heart-outline'}
                    size={18}
                    color={theme.primary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.iconBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={() => onEditBook(currentBook)}
                >
                  <Ionicons name="pencil" size={16} color={theme.textPrimary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.iconBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={() => ExportService.exportAsPdf(currentBook)}
                >
                  <Ionicons name="share-outline" size={16} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            <PaperHeader title="FICHA DE LEITURA" subtitle="Meu Registro Literário" />

            {/* Capa e Informações Principais */}
            <View style={styles.bookHeaderRow}>
              <View style={[styles.coverBox, { borderColor: theme.borderDashed, backgroundColor: isDark ? '#332C2A' : '#FAF5EE' }]}>
                {currentBook.coverUri ? (
                  <Image source={{ uri: currentBook.coverUri }} style={styles.coverImage} resizeMode="cover" />
                ) : (
                  <View style={styles.placeholderCover}>
                    <Ionicons name="book-outline" size={26} color={theme.secondary} />
                    <Text style={[styles.placeholderCoverText, { color: theme.textMuted }]}>3 x 4 cm</Text>
                  </View>
                )}
              </View>

              <View style={styles.bookMainInfo}>
                <View style={styles.fieldItem}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>TÍTULO:</Text>
                  <Text style={[styles.fieldTitleValue, { color: theme.textPrimary }]} numberOfLines={2}>
                    {currentBook.title}
                  </Text>
                </View>

                <View style={styles.fieldItem}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>AUTOR:</Text>
                  <Text style={[styles.fieldAuthorValue, { color: theme.textSecondary }]} numberOfLines={1}>
                    {currentBook.author}
                  </Text>
                </View>

                <View style={{ marginTop: 2 }}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>AVALIAÇÃO:</Text>
                  <StarRating rating={currentBook.rating} size={20} color={theme.starActive} inactiveColor={theme.starInactive} />
                </View>
              </View>
            </View>

            {/* Badges de Formato, Páginas e Gênero */}
            <View style={styles.pillsRow}>
              <View style={[styles.pillBadge, { backgroundColor: theme.badgeBg }]}>
                <Ionicons
                  name={
                    currentBook.format === 'fisico'
                      ? 'book-outline'
                      : currentBook.format === 'digital'
                      ? 'tablet-portrait-outline'
                      : 'headset-outline'
                  }
                  size={12}
                  color={theme.badgeText}
                />
                <Text style={[styles.pillBadgeText, { color: theme.badgeText }]}>
                  {ExportService.getFormatLabel(currentBook.format)}
                </Text>
              </View>

              {currentBook.pages ? (
                <View style={[styles.pillBadge, { backgroundColor: theme.badgeBg }]}>
                  <Ionicons name="document-text-outline" size={12} color={theme.badgeText} />
                  <Text style={[styles.pillBadgeText, { color: theme.badgeText }]}>{currentBook.pages} pág.</Text>
                </View>
              ) : null}

              {currentBook.genre ? (
                <View style={[styles.pillBadge, { backgroundColor: theme.badgeBg }]}>
                  <Ionicons name="pricetag-outline" size={12} color={theme.badgeText} />
                  <Text style={[styles.pillBadgeText, { color: theme.badgeText }]}>{currentBook.genre}</Text>
                </View>
              ) : null}

              {currentBook.favoriteCharacter ? (
                <View style={[styles.pillBadge, { backgroundColor: theme.badgeBg }]}>
                  <Ionicons name="sparkles" size={12} color={theme.secondary} />
                  <Text style={[styles.pillBadgeText, { color: theme.badgeText }]}>
                    {currentBook.favoriteCharacter}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Opinião Rápida */}
            {currentBook.opinion && (
              <View style={[styles.opinionContainer, { backgroundColor: isDark ? '#3D2F31' : '#FDF3F1', borderColor: theme.border }]}>
                <Ionicons name="ribbon-outline" size={16} color={theme.primaryDark} style={{ marginRight: 6 }} />
                <Text style={[styles.opinionText, { color: theme.primaryDark }]}>{currentBook.opinion}</Text>
              </View>
            )}

            {/* Resenha */}
            {currentBook.review ? (
              <View style={styles.sectionMargin}>
                <View style={[styles.sectionTitleTag, { backgroundColor: theme.primaryLight }]}>
                  <Text style={[styles.sectionTitleTagText, { color: theme.primaryDark }]}>MINHA RESENHA:</Text>
                </View>
                <View style={[styles.linedBox, { borderColor: theme.border, backgroundColor: theme.surface }]}>
                  <Text style={[styles.linedBoxText, { color: theme.textPrimary }]}>{currentBook.review}</Text>
                </View>
              </View>
            ) : null}

            {/* Minha Opinião */}
            {currentBook.myOpinion ? (
              <View style={styles.sectionMargin}>
                <View style={[styles.sectionTitleTag, { backgroundColor: theme.primaryLight }]}>
                  <Text style={[styles.sectionTitleTagText, { color: theme.primaryDark }]}>MINHA OPINIÃO:</Text>
                </View>
                <View style={[styles.linedBox, { borderColor: theme.border, backgroundColor: theme.surface }]}>
                  <Text style={[styles.linedBoxText, { color: theme.textPrimary }]}>{currentBook.myOpinion}</Text>
                </View>
              </View>
            ) : null}
          </View>
        ) : (
          /* PÁGINA EM BRANCO: Permite adicionar livro nesta página */
          <View style={[styles.emptyPageSheet, Shadows.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <View style={[styles.pageBadgeCorner, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.pageBadgeCornerText, { color: theme.primaryDark }]}>PÁG. {currentPageNumber}</Text>
            </View>

            <View style={styles.emptyContent}>
              <Ionicons name="book-outline" size={60} color={theme.borderDashed} />
              <Text style={[styles.emptyPageTitle, { color: theme.textPrimary }]}>Página em branco</Text>
              <Text style={[styles.emptyPageDesc, { color: theme.textSecondary }]}>
                Esta página do seu livro ainda não possui uma ficha de leitura registrada.
              </Text>

              <TouchableOpacity
                style={[styles.addBookOnPageBtn, Shadows.soft, { backgroundColor: theme.primaryDark }]}
                onPress={() => onAddBookAtPage(currentPageNumber)}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.addBookOnPageBtnText}>Adicionar livro nesta página</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBookBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  pageNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    gap: 4,
  },
  pageNavBtnDisabled: {
    opacity: 0.4,
  },
  pageNavBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  pageBadgeTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  pageBadgeNumber: {
    fontSize: 13,
    fontWeight: '700',
  },
  jumpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 10,
  },
  jumpLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  jumpInput: {
    width: 60,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'center',
    fontSize: 14,
  },
  jumpSubmitBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  jumpSubmitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  paperSheet: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  sheetTopControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pageBadgeCorner: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pageBadgeCornerText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  actionIconsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookHeaderRow: {
    flexDirection: 'row',
    gap: 14,
    marginVertical: 10,
  },
  coverBox: {
    width: 85,
    height: 120,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    alignItems: 'center',
  },
  placeholderCoverText: {
    fontSize: 10,
    marginTop: 4,
  },
  bookMainInfo: {
    flex: 1,
    justifyContent: 'space-around',
  },
  fieldItem: {
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  fieldTitleValue: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  fieldAuthorValue: {
    fontSize: 13,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 8,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  pillBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  opinionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 6,
  },
  opinionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionMargin: {
    marginTop: 10,
  },
  sectionTitleTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  sectionTitleTagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  linedBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  linedBoxText: {
    fontSize: 12,
    lineHeight: 20,
  },
  emptyPageSheet: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    minHeight: 380,
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyPageTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'serif',
    marginTop: 16,
  },
  emptyPageDesc: {
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 10,
    maxWidth: 260,
    lineHeight: 18,
  },
  addBookOnPageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 14,
  },
  addBookOnPageBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
