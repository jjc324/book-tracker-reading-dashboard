import { useState, useEffect, useMemo } from 'react';
import type { Book } from '../types/index';
import booksData from '../data/enhanced_books.json';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Since we're importing directly, we can set it immediately
      setBooks(booksData as Book[]);
      setLoading(false);
    } catch (err) {
      setError('Failed to load books data');
      setLoading(false);
    }
  }, []);

  const booksByYear = useMemo(() => {
    return books.reduce((acc, book) => {
      const year = book.year_read;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(book);
      return acc;
    }, {} as Record<number, Book[]>);
  }, [books]);

  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    books.forEach(book => {
      book.categories.forEach(category => genres.add(category));
    });
    return Array.from(genres).sort();
  }, [books]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    books.forEach(book => {
      book.personal_tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [books]);

  const allAuthors = useMemo(() => {
    const authors = new Set<string>();
    books.forEach(book => authors.add(book.author));
    return Array.from(authors).sort();
  }, [books]);

  const yearRange = useMemo(() => {
    if (books.length === 0) return { min: 2011, max: 2025 };
    const years = books.map(book => book.year_read);
    return {
      min: Math.min(...years),
      max: Math.max(...years)
    };
  }, [books]);

  const pageRange = useMemo(() => {
    if (books.length === 0) return { min: 0, max: 1000 };
    const pages = books.map(book => book.pages || 0);
    return {
      min: Math.min(...pages),
      max: Math.max(...pages)
    };
  }, [books]);

  return {
    books,
    loading,
    error,
    booksByYear,
    allGenres,
    allTags,
    allAuthors,
    yearRange,
    pageRange
  };
};