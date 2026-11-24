export type BookFormat = 'fisico' | 'digital' | 'audiolivro';

export type BookOpinion = 
  | 'Melhor livro que já li'
  | 'Gostei'
  | 'Não gostei'
  | 'Queria não ter lido';

export type ReadingStatus = 'quero_ler' | 'lendo' | 'lido' | 'abandonado';

export interface BookCard {
  id: string;
  pageNumber: number; // Número da página no caderno de leitura (1, 2, 3...)
  title: string;
  author: string;
  isbn?: string;
  publishYear?: number;
  pages?: number;
  genre?: string;
  favoriteCharacter?: string;
  format: BookFormat;
  rating: number; // 1 a 5
  opinion?: BookOpinion;
  review?: string; // Minha resenha
  myOpinion?: string; // Minha opinião
  isFavorite: boolean;
  coverUri?: string;
  status: ReadingStatus;
  startedAt?: string; // Data de início
  completedAt?: string; // Data de término
  location?: string; // Onde o livro fica (ex: Quarto, Estante Sala, Prateleira 2, Kindle)
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  darkMode: boolean;
  pageTurnAnimation: boolean;
  annualGoal: number;
  lastViewedPage: number;
}

export type MainTab = 'home' | 'book' | 'search' | 'library' | 'settings';

export type FilterType = 'todos' | 'favoritos' | 'fisico' | 'digital' | 'audiolivro';

