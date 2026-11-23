import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, StatusBar, SafeAreaView } from 'react-native';
import { BookCard, MainTab, AppSettings } from './src/types/book';
import { BookStorageService, defaultSettings } from './src/services/storage';
import { MainHomeScreen } from './src/screens/MainHomeScreen';
import { BookReaderScreen } from './src/screens/BookReaderScreen';
import { SearchBooksScreen } from './src/screens/SearchBooksScreen';
import { LibraryShelfScreen } from './src/screens/LibraryShelfScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { BookFormScreen } from './src/screens/BookFormScreen';
import { BottomNavBar } from './src/components/BottomNavBar';
import { LightTheme, DarkTheme } from './src/constants/theme';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<BookCard[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [currentTab, setCurrentTab] = useState<MainTab>('home');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingBook, setEditingBook] = useState<BookCard | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const loadedBooks = await BookStorageService.getBooks();
      const loadedSettings = await BookStorageService.getSettings();
      setBooks(loadedBooks);
      setSettings(loadedSettings);
      setCurrentPage(loadedSettings.lastViewedPage || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isDark = settings.darkMode;
  const theme = isDark ? DarkTheme : LightTheme;

  const handleUpdateSettings = async (partial: Partial<AppSettings>) => {
    const updated = await BookStorageService.saveSettings(partial);
    setSettings(updated);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    handleUpdateSettings({ lastViewedPage: newPage });
  };

  const handleSaveBook = async (book: BookCard) => {
    try {
      const updated = await BookStorageService.saveBook(book);
      setBooks(updated);
      setIsFormOpen(false);
      setEditingBook(null);
      setCurrentPage(book.pageNumber);
      setCurrentTab('book');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      const updated = await BookStorageService.deleteBook(id);
      setBooks(updated);
      setIsFormOpen(false);
      setEditingBook(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFavorite = async (book: BookCard) => {
    try {
      const updatedBook = { ...book, isFavorite: !book.isFavorite };
      const updatedList = await BookStorageService.saveBook(updatedBook);
      setBooks(updatedList);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddExternalBook = async (bookData: Partial<BookCard>, targetPage?: number) => {
    const pageNumber = targetPage || books.length + 1;
    const newBook: BookCard = {
      id: Date.now().toString(),
      pageNumber,
      title: bookData.title || 'Livro Sem Título',
      author: bookData.author || 'Autor Desconhecido',
      isbn: bookData.isbn,
      publishYear: bookData.publishYear,
      pages: bookData.pages,
      genre: bookData.genre,
      format: 'fisico',
      rating: 5,
      isFavorite: false,
      coverUri: bookData.coverUri,
      status: 'lido',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = await BookStorageService.saveBook(newBook);
    setBooks(updated);
    setCurrentPage(pageNumber);
    setCurrentTab('book');
  };

  const handleClearAllData = async () => {
    await BookStorageService.clearAllData();
    await loadAll();
    setCurrentTab('home');
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primaryDark} />
      </View>
    );
  }

  // Se o formulário de cadastro/edição estiver aberto
  if (isFormOpen) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <BookFormScreen
          initialBook={editingBook}
          onSave={handleSaveBook}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingBook(null);
          }}
          onDelete={handleDeleteBook}
        />
      </View>
    );
  }

  const lastViewedBook = books.find((b) => b.pageNumber === currentPage) || books[0];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.content}>
        {currentTab === 'home' && (
          <MainHomeScreen
            books={books}
            lastViewedBook={lastViewedBook}
            onContinueReading={() => {
              setCurrentTab('book');
            }}
            onOpenBookReader={() => {
              setCurrentTab('book');
            }}
            onGoToSearch={() => setCurrentTab('search')}
            onGoToLibrary={() => setCurrentTab('library')}
            onGoToSettings={() => setCurrentTab('settings')}
            onSelectBook={(book) => {
              handlePageChange(book.pageNumber);
              setCurrentTab('book');
            }}
            isDark={isDark}
          />
        )}

        {currentTab === 'book' && (
          <BookReaderScreen
            books={books}
            currentPageNumber={currentPage}
            onPageChange={handlePageChange}
            onEditBook={(book) => {
              setEditingBook(book);
              setIsFormOpen(true);
            }}
            onAddBookAtPage={(page) => {
              setEditingBook({
                id: '',
                pageNumber: page,
                title: '',
                author: '',
                format: 'fisico',
                rating: 5,
                isFavorite: false,
                status: 'lido',
                createdAt: '',
                updatedAt: '',
              });
              setIsFormOpen(true);
            }}
            onDeleteBook={handleDeleteBook}
            onToggleFavorite={handleToggleFavorite}
            isDark={isDark}
          />
        )}

        {currentTab === 'search' && (
          <SearchBooksScreen
            onAddExternalBook={handleAddExternalBook}
            totalPages={books.length}
            isDark={isDark}
          />
        )}

        {currentTab === 'library' && (
          <LibraryShelfScreen
            books={books}
            onSelectBook={(book) => {
              handlePageChange(book.pageNumber);
              setCurrentTab('book');
            }}
            isDark={isDark}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            books={books}
            onClearData={handleClearAllData}
            onBack={() => setCurrentTab('home')}
            isDark={isDark}
          />
        )}
      </View>

      {/* Barra de Navegação Inferior adaptada e sempre visível */}
      <BottomNavBar currentTab={currentTab} onSelectTab={setCurrentTab} isDark={isDark} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
