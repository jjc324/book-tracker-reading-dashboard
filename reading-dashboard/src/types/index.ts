export interface Book {
  original_text: string;
  title: string;
  author: string;
  year_read: number;
  format: 'unknown' | 'audio' | 'ebook' | 'physical';
  pages: number;
  published_year: string;
  categories: string[];
  description: string;
  rating: number;
  personal_tags: string[];
  notes: string;
  favorite_quotes: string[];
  date_finished: string | null;
}

export interface ReadingStats {
  totalBooks: number;
  totalPages: number;
  averageRating: number;
  yearsReading: number;
  booksThisYear: number;
  favoriteGenres: { genre: string; count: number }[];
  readingVelocity: { year: number; books: number; pages: number }[];
}

export interface FilterOptions {
  rating?: number[];
  genres?: string[];
  yearRead?: number[];
  format?: string[];
  pageRange?: [number, number];
  tags?: string[];
}

export interface SortOptions {
  field: 'title' | 'author' | 'rating' | 'year_read' | 'pages';
  direction: 'asc' | 'desc';
}

export type ViewMode = 'grid' | 'list' | 'compact';

export type Theme = 'light' | 'dark';