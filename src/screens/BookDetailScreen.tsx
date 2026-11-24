import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookCard } from '../types/book';
import { StarRating } from '../components/StarRating';
import { PaperHeader } from '../components/PaperHeader';
import { ExportService } from '../services/exportService';
import { Colors, Shadows } from '../constants/theme';

interface BookDetailScreenProps {
  book: BookCard;
  onBack: () => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (book: BookCard) => void;
}

export const BookDetailScreen: React.FC<BookDetailScreenProps> = ({
  book,
  onBack,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const handleExportPdf = async () => {
    await ExportService.exportAsPdf(book);
  };

  const handlePrint = async () => {
    await ExportService.printFicha(book);
  };

  const handleDeletePrompt = () => {
    Alert.alert(
      'Excluir Ficha',
      `Deseja realmente apagar a ficha de "${book.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => onDelete(book.id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Barra superior de navegação */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a biblioteca"
          >
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
            <Text style={styles.navBtnText}>Biblioteca</Text>
          </TouchableOpacity>

          <View style={styles.navRightGroup}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => onToggleFavorite(book)}
              accessibilityRole="button"
              accessibilityLabel={book.isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
            >
              <Ionicons
                name={book.isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={Colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconCircle}
              onPress={onEdit}
              accessibilityRole="button"
              accessibilityLabel="Editar ficha"
            >
              <Ionicons name="pencil-outline" size={18} color={Colors.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconCircle}
              onPress={handleDeletePrompt}
              accessibilityRole="button"
              accessibilityLabel="Excluir ficha"
            >
              <Ionicons name="trash-outline" size={18} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Ficha de Leitura em formato Folha de Papel Pautada */}
        <View style={[styles.sheetCard, Shadows.card]}>
          <PaperHeader subtitle="Minha Leitura Concluída" />

          {/* Top Section */}
          <View style={styles.topSection}>
            <View style={styles.coverBox}>
              {book.coverUri ? (
                <Image source={{ uri: book.coverUri }} style={styles.coverImage} resizeMode="cover" />
              ) : (
                <View style={styles.placeholderBox}>
                  <Ionicons name="book-outline" size={32} color={Colors.secondary} />
                  <Text style={styles.coverBoxText}>3 x 4 cm</Text>
                </View>
              )}
            </View>

            <View style={styles.topDetails}>
              <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>TÍTULO:</Text>
                <Text style={styles.fieldValueTitle}>{book.title}</Text>
              </View>

              <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>AUTOR:</Text>
                <Text style={styles.fieldValueAuthor}>{book.author}</Text>
              </View>

              <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>AVALIAÇÃO:</Text>
                <StarRating rating={book.rating} size={22} />
              </View>
            </View>
          </View>

          {/* Opinião / Sentimento sobre o livro */}
          {book.opinion && (
            <View style={styles.opinionBanner}>
              <View style={styles.badgeSectionTitle}>
                <Text style={styles.badgeSectionTitleText}>SOBRE O LIVRO</Text>
              </View>
              <View style={styles.opinionHighlight}>
                <Ionicons name="ribbon-outline" size={18} color={Colors.primaryDark} style={{ marginRight: 6 }} />
                <Text style={styles.opinionHighlightText}>{book.opinion}</Text>
              </View>
            </View>
          )}

          {/* Informações complementares */}
          <View style={styles.tagsContainer}>
            {/* Status */}
            <View style={[styles.infoPill, { backgroundColor: book.status === 'lido' ? '#E8F5E9' : book.status === 'lendo' ? '#FFF8E1' : '#F5F5F5' }]}>
              <Ionicons
                name={book.status === 'lido' ? 'checkmark-circle' : book.status === 'lendo' ? 'book' : 'bookmark'}
                size={14}
                color={book.status === 'lido' ? '#2E7D32' : book.status === 'lendo' ? '#F57F17' : Colors.badgeText}
              />
              <Text style={[styles.infoPillText, { color: book.status === 'lido' ? '#2E7D32' : book.status === 'lendo' ? '#F57F17' : Colors.badgeText }]}>
                {book.status === 'lido' ? 'Terminado (Lido)' : book.status === 'lendo' ? 'Começado (Lendo)' : book.status === 'abandonado' ? 'Pausado' : 'Quero Ler'}
              </Text>
            </View>

            {/* Onde fica */}
            {book.location ? (
              <View style={[styles.infoPill, { backgroundColor: '#EDE7F6' }]}>
                <Ionicons name="location" size={14} color="#5E35B1" />
                <Text style={[styles.infoPillText, { color: '#5E35B1' }]}>Local: {book.location}</Text>
              </View>
            ) : null}

            {/* Datas */}
            {book.startedAt ? (
              <View style={styles.infoPill}>
                <Ionicons name="play-outline" size={14} color={Colors.badgeText} />
                <Text style={styles.infoPillText}>Início: {book.startedAt}</Text>
              </View>
            ) : null}

            {book.completedAt ? (
              <View style={styles.infoPill}>
                <Ionicons name="checkmark-done-outline" size={14} color={Colors.badgeText} />
                <Text style={styles.infoPillText}>Término: {book.completedAt}</Text>
              </View>
            ) : null}

            <View style={styles.infoPill}>
              <Ionicons
                name={
                  book.format === 'fisico'
                    ? 'book-outline'
                    : book.format === 'digital'
                    ? 'tablet-portrait-outline'
                    : 'headset-outline'
                }
                size={14}
                color={Colors.badgeText}
              />
              <Text style={styles.infoPillText}>{ExportService.getFormatLabel(book.format)}</Text>
            </View>

            {book.pages ? (
              <View style={styles.infoPill}>
                <Ionicons name="document-text-outline" size={14} color={Colors.badgeText} />
                <Text style={styles.infoPillText}>{book.pages} páginas</Text>
              </View>
            ) : null}

            {book.genre ? (
              <View style={styles.infoPill}>
                <Ionicons name="pricetag-outline" size={14} color={Colors.badgeText} />
                <Text style={styles.infoPillText}>{book.genre}</Text>
              </View>
            ) : null}

            {book.favoriteCharacter ? (
              <View style={styles.infoPill}>
                <Ionicons name="sparkles" size={14} color={Colors.secondary} />
                <Text style={styles.infoPillText}>Personagem: {book.favoriteCharacter}</Text>
              </View>
            ) : null}
          </View>

          {/* Minha Resenha */}
          {book.review ? (
            <View style={styles.sectionBlock}>
              <View style={styles.badgeSectionTitle}>
                <Text style={styles.badgeSectionTitleText}>MINHA RESENHA:</Text>
              </View>
              <View style={styles.linedBox}>
                <Text style={styles.linedBoxText}>{book.review}</Text>
              </View>
            </View>
          ) : null}

          {/* Minha Opinião */}
          {book.myOpinion ? (
            <View style={styles.sectionBlock}>
              <View style={styles.badgeSectionTitle}>
                <Text style={styles.badgeSectionTitleText}>MINHA OPINIÃO:</Text>
              </View>
              <View style={styles.linedBox}>
                <Text style={styles.linedBoxText}>{book.myOpinion}</Text>
              </View>
            </View>
          ) : null}

          {/* Rodapé da folha */}
          <View style={styles.sheetFooter}>
            <Ionicons name="cafe-outline" size={16} color={Colors.secondary} />
            <Text style={styles.footerNote}>Leitura registrada na minha estante</Text>
          </View>
        </View>

        {/* Botões de Ação: Exportar PDF & Imprimir */}
        <View style={styles.exportSection}>
          <TouchableOpacity
            style={[styles.exportBtn, Shadows.soft]}
            onPress={handleExportPdf}
            activeOpacity={0.85}
          >
            <Ionicons name="share-social-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.exportBtnText}>Compartilhar Ficha (PDF)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.printBtn}
            onPress={handlePrint}
            activeOpacity={0.8}
          >
            <Ionicons name="print-outline" size={18} color={Colors.primaryDark} style={{ marginRight: 6 }} />
            <Text style={styles.printBtnText}>Imprimir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  navBtnText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginLeft: 6,
  },
  navRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 22,
  },
  topSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  coverBox: {
    width: 110,
    height: 155,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.borderDashed,
    borderStyle: 'dashed',
    backgroundColor: '#FAF5EE',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderBox: {
    alignItems: 'center',
  },
  coverBoxText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  topDetails: {
    flex: 1,
    justifyContent: 'space-around',
  },
  fieldItem: {
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  fieldValueTitle: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'serif',
    color: Colors.textPrimary,
  },
  fieldValueAuthor: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  opinionBanner: {
    marginVertical: 8,
  },
  badgeSectionTitle: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  badgeSectionTitleText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 1,
  },
  opinionHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF3ED',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  opinionHighlightText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.badgeBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 6,
  },
  infoPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.badgeText,
  },
  sectionBlock: {
    marginTop: 14,
  },
  linedBox: {
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
  },
  linedBoxText: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  sheetFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  footerNote: {
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  exportSection: {
    marginTop: 18,
    gap: 10,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryDark,
    paddingVertical: 14,
    borderRadius: 16,
  },
  exportBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  printBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 12,
    borderRadius: 16,
  },
  printBtnText: {
    color: Colors.primaryDark,
    fontSize: 13,
    fontWeight: '600',
  },
});
