import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookCard, AppSettings } from '../types/book';

const STORAGE_KEY = '@ficha_de_leitura_books_v2';
const SETTINGS_KEY = '@ficha_de_leitura_settings_v2';

export const initialBooks: BookCard[] = [
  {
    id: 'sample-1',
    pageNumber: 1,
    title: 'Orgulho e Preconceito',
    author: 'Jane Austen',
    isbn: '9788544001820',
    publishYear: 1813,
    pages: 424,
    genre: 'Romance Clássico',
    favoriteCharacter: 'Elizabeth Bennet & Sr. Darcy',
    format: 'fisico',
    rating: 5,
    opinion: 'Melhor livro que já li',
    review: 'Uma das obras mais brilhantes da literatura mundial. O desenvolvimento dos diálogos e a evolução do sentimento mútuo entre Elizabeth e Darcy é construído com extrema sutileza e ironia inteligente sobre a sociedade inglesa do século XIX.',
    myOpinion: 'Releitura que aquece o coração em qualquer época do ano. As trocas de cartas e os bailes são inesquecíveis.',
    isFavorite: true,
    coverUri: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    status: 'lido',
    completedAt: '2026-03-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    pageNumber: 2,
    title: 'A Biblioteca da Meia-Noite',
    author: 'Matt Haig',
    isbn: '9786558380542',
    publishYear: 2020,
    pages: 308,
    genre: 'Ficção Filosófica',
    favoriteCharacter: 'Nora Seed & Sra. Elm',
    format: 'digital',
    rating: 4,
    opinion: 'Gostei',
    review: 'Entre a vida e a morte há uma biblioteca onde cada livro oferece a chance de experimentar outra vida que você poderia ter vivido. Um livro acolhedor sobre aceitação, perdas e esperança.',
    myOpinion: 'Fez refletir bastante sobre escolhas e sobre não se prender a arrependimentos do passado.',
    isFavorite: true,
    coverUri: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    status: 'lido',
    completedAt: '2026-06-20',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    pageNumber: 3,
    title: 'Pequena Coreografia do Adeus',
    author: 'Aline Bei',
    isbn: '9788535934489',
    publishYear: 2021,
    pages: 288,
    genre: 'Literatura Brasileira',
    favoriteCharacter: 'Júlia',
    format: 'audiolivro',
    rating: 5,
    opinion: 'Melhor livro que já li',
    review: 'Aline Bei escreve com ritmo poético que parece dançar pelas páginas e doer na medida certa. Narra os passos de Júlia tentando se encontrar após o divórcio dos pais e as marcas da infância.',
    myOpinion: 'Ouvir a narração em áudio foi uma experiência extremamente sensível e marcante.',
    isFavorite: false,
    coverUri: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    status: 'lido',
    completedAt: '2026-08-04',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialBooks));
      return initialBooks;
    } catch (e) {
      console.error('Erro ao obter livros:', e);
      return initialBooks;
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
