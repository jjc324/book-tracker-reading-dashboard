import { useState, useMemo } from 'react';
import type { Book, FilterOptions, SortOptions, ViewMode } from '../types/index';
import { filterBooks, sortBooks, searchBooks } from '../utils/bookUtils';

export const useFilters = (books: Book[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'year_read',
    direction: 'desc'
  });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredAndSortedBooks = useMemo(() => {
    let result = books;
    
    // Apply search
    if (searchQuery.trim()) {
      result = searchBooks(result, searchQuery);
    }
    
    // Apply filters
    result = filterBooks(result, filters);
    
    // Apply sorting
    result = sortBooks(result, sortOptions);
    
    return result;
  }, [books, searchQuery, filters, sortOptions]);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilter = (key: keyof FilterOptions) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (filters.rating && filters.rating.length > 0) count++;
    if (filters.genres && filters.genres.length > 0) count++;
    if (filters.yearRead && filters.yearRead.length > 0) count++;
    if (filters.format && filters.format.length > 0) count++;
    if (filters.pageRange) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    return count;
  }, [searchQuery, filters]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    sortOptions,
    setSortOptions,
    viewMode,
    setViewMode,
    filteredAndSortedBooks,
    activeFilterCount
  };
};