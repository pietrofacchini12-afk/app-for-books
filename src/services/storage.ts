import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookCard, AppSettings } from '../types/book';

const STORAGE_KEY = '@ficha_de_leitura_books_v3';
const SETTINGS_KEY = '@ficha_de_leitura_settings_v3';

export const initialBooks: BookCard[] = [];

export const defaultSettings: AppSettings = {
  darkMode: false,
  pageTurnAnimation: true,
  annualGoal: 12,
  lastViewedPage: 1,
};

export const BookStorageService = {
  async getBooks(): Promise<BookCard[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed: BookCard[] = JSON.parse(data);
        return parsed.sort((a, b) => (a.pageNumber || 1) - (b.pageNumber || 1));
      }
      // Sem livros de exemplo iniciais - estante limpa pronta para o usuário
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    } catch (e) {
      console.error('Erro ao obter livros:', e);
      return [];
    }
  },

  async saveBook(book: BookCard): Promise<BookCard[]> {
    try {
      const books = await this.getBooks();
      const index = books.findIndex((b) => b.id === book.id);
      let updated: BookCard[];

      if (index >= 0) {
        updated = [...books];
        updated[index] = { ...book, updatedAt: new Date().toISOString() };
      } else {
        // Se não tiver pageNumber, atribui a próxima página disponível
        const pageNumber = book.pageNumber || books.length + 1;
        updated = [...books, { ...book, pageNumber, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
      }

      // Ordena por página
      updated.sort((a, b) => (a.pageNumber || 1) - (b.pageNumber || 1));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Erro ao salvar livro:', e);
      throw e;
    }
  },

  async deleteBook(id: string): Promise<BookCard[]> {
    try {
      const books = await this.getBooks();
      const updated = books.filter((b) => b.id !== id);
      // Renumera as páginas após excluir
      const renumbered = updated.map((b, idx) => ({ ...b, pageNumber: idx + 1 }));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(renumbered));
      return renumbered;
    } catch (e) {
      console.error('Erro ao excluir livro:', e);
      throw e;
    }
  },

  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      if (data) {
        return { ...defaultSettings, ...JSON.parse(data) };
      }
      return defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  },

  async saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Erro ao salvar configurações:', e);
      return defaultSettings;
    }
  },

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(SETTINGS_KEY);
    } catch (e) {
      console.error('Erro ao limpar dados:', e);
    }
  },
};
