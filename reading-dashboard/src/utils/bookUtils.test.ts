import { describe, it, expect } from 'vitest';
import { filterBooks, sortBooks, searchBooks, calculateReadingStats } from './bookUtils';
import type { Book } from '../types';

const mockBooks: Book[] = [
  {
    original_text: '1984 by George Orwell',
    title: '1984',
    author: 'George Orwell',
    year_read: 2023,
    format: 'physical',
    pages: 328,
    published_year: '1949',
    categories: ['Fiction', 'Dystopian'],
    description: 'A dystopian novel',
    rating: 5,
    personal_tags: ['classic', 'thought-provoking'],
    notes: 'Amazing book',
    favorite_quotes: [],
    date_finished: '2023-03-15',
  },
  {
    original_text: 'Atomic Habits by James Clear',
    title: 'Atomic Habits',
    author: 'James Clear',
    year_read: 2024,
    format: 'audio',
    pages: 320,
    published_year: '2018',
    categories: ['Self-Help', 'Psychology'],
    description: 'A guide to building habits',
    rating: 4,
    personal_tags: ['practical'],
    notes: 'Very practical',
    favorite_quotes: [],
    date_finished: '2024-01-08',
  },
  {
    original_text: 'Dune by Frank Herbert',
    title: 'Dune',
    author: 'Frank Herbert',
    year_read: 2022,
    format: 'physical',
    pages: 688,
    published_year: '1965',
    categories: ['Science Fiction', 'Fantasy'],
    description: 'Epic sci-fi novel',
    rating: 4,
    personal_tags: ['epic'],
    notes: '',
    favorite_quotes: [],
    date_finished: '2022-10-15',
  },
];

describe('filterBooks', () => {
  it('should filter books by rating', () => {
    const result = filterBooks(mockBooks, { rating: [5] });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('1984');
  });

  it('should filter books by genre', () => {
    const result = filterBooks(mockBooks, { genres: ['Fiction'] });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('1984');
  });

  it('should filter books by year', () => {
    const result = filterBooks(mockBooks, { yearRead: [2023, 2024] });
    expect(result).toHaveLength(2);
  });

  it('should filter books by format', () => {
    const result = filterBooks(mockBooks, { format: ['physical'] });
    expect(result).toHaveLength(2);
  });

  it('should filter books by page range', () => {
    const result = filterBooks(mockBooks, { pageRange: [300, 400] });
    expect(result).toHaveLength(2);
  });

  it('should apply multiple filters', () => {
    const result = filterBooks(mockBooks, {
      format: ['physical'],
      rating: [4],
    });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Dune');
  });
});

describe('sortBooks', () => {
  it('should sort books by title ascending', () => {
    const result = sortBooks(mockBooks, { field: 'title', direction: 'asc' });
    expect(result[0].title).toBe('1984');
    expect(result[2].title).toBe('Dune');
  });

  it('should sort books by title descending', () => {
    const result = sortBooks(mockBooks, { field: 'title', direction: 'desc' });
    expect(result[0].title).toBe('Dune');
    expect(result[2].title).toBe('1984');
  });

  it('should sort books by year_read ascending', () => {
    const result = sortBooks(mockBooks, { field: 'year_read', direction: 'asc' });
    expect(result[0].year_read).toBe(2022);
    expect(result[2].year_read).toBe(2024);
  });

  it('should sort books by pages descending', () => {
    const result = sortBooks(mockBooks, { field: 'pages', direction: 'desc' });
    expect(result[0].pages).toBe(688);
    expect(result[2].pages).toBe(320);
  });

  it('should sort books by rating', () => {
    const result = sortBooks(mockBooks, { field: 'rating', direction: 'desc' });
    expect(result[0].rating).toBe(5);
  });
});

describe('searchBooks', () => {
  it('should search books by title', () => {
    const result = searchBooks(mockBooks, '1984');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('1984');
  });

  it('should search books by author', () => {
    const result = searchBooks(mockBooks, 'Orwell');
    expect(result).toHaveLength(1);
    expect(result[0].author).toBe('George Orwell');
  });

  it('should search books by genre', () => {
    const result = searchBooks(mockBooks, 'Fiction');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should be case-insensitive', () => {
    const result = searchBooks(mockBooks, 'ORWELL');
    expect(result).toHaveLength(1);
  });

  it('should return all books for empty query', () => {
    const result = searchBooks(mockBooks, '');
    expect(result).toHaveLength(mockBooks.length);
  });

  it('should return empty array for non-matching query', () => {
    const result = searchBooks(mockBooks, 'NonExistentBook');
    expect(result).toHaveLength(0);
  });
});

describe('calculateReadingStats', () => {
  it('should calculate total books', () => {
    const stats = calculateReadingStats(mockBooks);
    expect(stats.totalBooks).toBe(3);
  });

  it('should calculate total pages', () => {
    const stats = calculateReadingStats(mockBooks);
    expect(stats.totalPages).toBe(1336); // 328 + 320 + 688
  });

  it('should calculate average rating', () => {
    const stats = calculateReadingStats(mockBooks);
    expect(stats.averageRating).toBeCloseTo(4.33, 1);
  });

  it('should calculate years reading', () => {
    const stats = calculateReadingStats(mockBooks);
    expect(stats.yearsReading).toBe(3); // 2022-2024
  });

  it('should calculate books this year', () => {
    const stats = calculateReadingStats(mockBooks);
    // This will depend on current year
    expect(typeof stats.booksThisYear).toBe('number');
  });

  it('should calculate favorite genres', () => {
    const stats = calculateReadingStats(mockBooks);
    expect(stats.favoriteGenres.length).toBeGreaterThan(0);
    expect(stats.favoriteGenres[0]).toHaveProperty('genre');
    expect(stats.favoriteGenres[0]).toHaveProperty('count');
  });

  it('should calculate reading velocity', () => {
    const stats = calculateReadingStats(mockBooks);
    expect(stats.readingVelocity.length).toBeGreaterThan(0);
    expect(stats.readingVelocity[0]).toHaveProperty('year');
    expect(stats.readingVelocity[0]).toHaveProperty('books');
    expect(stats.readingVelocity[0]).toHaveProperty('pages');
  });
});
