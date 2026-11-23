import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookSearchService, ExternalBook } from '../services/bookSearchService';
import { BookCard } from '../types/book';
import { LightTheme, DarkTheme, Shadows } from '../constants/theme';
import * as ImagePicker from 'expo-image-picker';

interface SearchBooksScreenProps {
  onAddExternalBook: (bookData: Partial<BookCard>, targetPage?: number) => void;
  totalPages: number;
  isDark: boolean;
}

export const SearchBooksScreen: React.FC<SearchBooksScreenProps> = ({
  onAddExternalBook,
  totalPages,
  isDark,
}) => {
  const theme = isDark ? DarkTheme : LightTheme;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ExternalBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<ExternalBook | null>(null);

  // Modal de adição
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customCover, setCustomCover] = useState<string | undefined>(undefined);
  const [chosenPage, setChosenPage] = useState(String(totalPages + 1));

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await BookSearchService.searchOnline(query);
      setResults(data);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível completar a busca.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = (book: ExternalBook) => {
    setSelectedBook(book);
    setCustomCover(book.coverUri);
    setChosenPage(String(totalPages + 1));
    setIsAddModalOpen(true);
  };

  const pickCustomPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissão necessária', 'Acesso à galeria é necessário para escolher uma foto.');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });
      if (!res.canceled && res.assets.length > 0) {
        setCustomCover(res.assets[0].uri);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmAdd = () => {
    if (!selectedBook) return;
    const pageNum = parseInt(chosenPage, 10) || totalPages + 1;

    onAddExternalBook(
      {
        title: selectedBook.title,
        author: selectedBook.author,
        isbn: selectedBook.isbn,
        publishYear: selectedBook.publishYear,
        pages: selectedBook.pages,
        genre: selectedBook.genre,
        coverUri: customCover,
      },
      pageNum
    );

    setIsAddModalOpen(false);
    setSelectedBook(null);
    Alert.alert('Sucesso', `"${selectedBook.title}" foi adicionado na página ${pageNum}!`);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        {/* Barra de Pesquisa */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Pesquisar Livros</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Encontre obras por título, autor ou ISBN
          </Text>
        </View>

        <View style={[styles.searchBox, Shadows.soft, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color={theme.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Digite título, autor ou ISBN..."
            placeholderTextColor={theme.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={[styles.searchActionBtn, { backgroundColor: theme.primaryDark }]} onPress={handleSearch}>
            <Text style={styles.searchActionBtnText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primaryDark} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Buscando no catálogo...</Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(_, idx) => String(idx)}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={[styles.resultCard, Shadows.soft, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                <View style={[styles.coverBox, { borderColor: theme.borderDashed, backgroundColor: isDark ? '#332C2A' : '#FAF5EE' }]}>
                  {item.coverUri ? (
                    <Image source={{ uri: item.coverUri }} style={styles.coverImage} resizeMode="cover" />
                  ) : (
                    <Ionicons name="book-outline" size={24} color={theme.secondary} />
                  )}
                </View>

                <View style={styles.resultDetails}>
                  <Text style={[styles.resultTitle, { color: theme.textPrimary }]} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={[styles.resultAuthor, { color: theme.textSecondary }]} numberOfLines={1}>
                    por {item.author}
                  </Text>
                  {item.publishYear ? (
                    <Text style={[styles.resultMeta, { color: theme.textMuted }]}>Ano: {item.publishYear}</Text>
                  ) : null}
                  {item.isbn ? (
                    <Text style={[styles.resultMeta, { color: theme.textMuted }]}>ISBN: {item.isbn}</Text>
                  ) : null}

                  <TouchableOpacity
                    style={[styles.addBtn, { backgroundColor: theme.primaryDark }]}
                    onPress={() => handleOpenAddModal(item)}
                  >
                    <Ionicons name="add" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.addBtnText}>Adicionar à biblioteca</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              !loading && query ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={48} color={theme.borderDashed} />
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    Nenhum livro encontrado para essa busca.
                  </Text>
                </View>
              ) : undefined
            }
          />
        )}

        {/* Modal: Adicionar à Minha Biblioteca */}
        <Modal visible={isAddModalOpen} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Adicionar à Biblioteca</Text>

              {selectedBook && (
                <View style={styles.modalBookPreview}>
                  <TouchableOpacity onPress={pickCustomPhoto} style={styles.modalCoverPicker}>
                    {customCover ? (
                      <Image source={{ uri: customCover }} style={styles.modalCoverImg} />
                    ) : (
                      <View style={[styles.modalCoverPlaceholder, { borderColor: theme.borderDashed }]}>
                        <Ionicons name="camera-outline" size={24} color={theme.secondary} />
                        <Text style={[styles.modalCoverText, { color: theme.textMuted }]}>Escolher foto</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.modalBookName, { color: theme.textPrimary }]} numberOfLines={2}>
                      {selectedBook.title}
                    </Text>
                    <Text style={[styles.modalBookAuthor, { color: theme.textSecondary }]}>
                      {selectedBook.author}
                    </Text>
                    <TouchableOpacity onPress={pickCustomPhoto} style={{ marginTop: 6 }}>
                      <Text style={[styles.changePhotoText, { color: theme.primaryDark }]}>
                        📷 Escolher foto própria da capa
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Escolha de Página */}
              <View style={styles.pageChoiceBox}>
                <Text style={[styles.pageChoiceLabel, { color: theme.textPrimary }]}>Página do caderno:</Text>
                <TextInput
                  style={[styles.pageChoiceInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
                  value={chosenPage}
                  onChangeText={setChosenPage}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalCancelBtn, { borderColor: theme.border }]}
                  onPress={() => setIsAddModalOpen(false)}
                >
                  <Text style={[styles.modalCancelBtnText, { color: theme.textSecondary }]}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalConfirmBtn, { backgroundColor: theme.primaryDark }]}
                  onPress={handleConfirmAdd}
                >
                  <Text style={styles.modalConfirmBtnText}>Criar Ficha</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  header: {
    marginVertical: 12,
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
  },
  searchActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 6,
  },
  searchActionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 13,
    marginTop: 10,
  },
  resultsList: {
    paddingBottom: 30,
    gap: 12,
  },
  resultCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  coverBox: {
    width: 70,
    height: 100,
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
  resultDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  resultAuthor: {
    fontSize: 13,
    marginTop: 2,
  },
  resultMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  addBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 6,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'serif',
    marginBottom: 14,
  },
  modalBookPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalCoverPicker: {
    width: 65,
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalCoverImg: {
    width: '100%',
    height: '100%',
  },
  modalCoverPlaceholder: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCoverText: {
    fontSize: 9,
    marginTop: 4,
  },
  modalBookName: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalBookAuthor: {
    fontSize: 12,
    marginTop: 2,
  },
  changePhotoText: {
    fontSize: 11,
    fontWeight: '600',
  },
  pageChoiceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  pageChoiceLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  pageChoiceInput: {
    width: 60,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalConfirmBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
