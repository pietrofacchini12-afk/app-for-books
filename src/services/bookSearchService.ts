export interface ExternalBook {
  title: string;
  author: string;
  publishYear?: number;
  pages?: number;
  isbn?: string;
  coverUri?: string;
  genre?: string;
  description?: string;
}

export const BookSearchService = {
  async searchOnline(query: string): Promise<ExternalBook[]> {
    if (!query.trim()) return [];

    try {
      // Busca pela API do Open Library
      const encodedQuery = encodeURIComponent(query.trim());
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodedQuery}&limit=12`
      );

      if (!response.ok) {
        throw new Error('Falha na resposta da Open Library');
      }

      const data = await response.json();
      if (!data.docs || !Array.isArray(data.docs)) {
        return [];
      }

      return data.docs.map((doc: any): ExternalBook => {
        const coverId = doc.cover_i;
        const isbn = doc.isbn ? doc.isbn[0] : undefined;
        const coverUri = coverId
          ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
          : isbn
          ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
          : undefined;

        return {
          title: doc.title || 'Título desconhecido',
          author: doc.author_name ? doc.author_name.join(', ') : 'Autor desconhecido',
          publishYear: doc.first_publish_year || (doc.publish_year ? doc.publish_year[0] : undefined),
          pages: doc.number_of_pages_median || undefined,
          isbn: isbn,
          coverUri: coverUri,
          genre: doc.subject ? doc.subject.slice(0, 3).join(', ') : undefined,
        };
      });
    } catch (e) {
      console.warn('Erro na busca online de livros:', e);
      return [];
    }
  },
};
