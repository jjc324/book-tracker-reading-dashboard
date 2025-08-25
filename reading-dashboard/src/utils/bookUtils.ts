import { Book, ReadingStats, FilterOptions, SortOptions } from '../types';

export const calculateReadingStats = (books: Book[]): ReadingStats => {
  const totalBooks = books.length;
  const totalPages = books.reduce((sum, book) => sum + (book.pages || 0), 0);
  const averageRating = books.reduce((sum, book) => sum + book.rating, 0) / totalBooks;
  
  const years = books.map(book => book.year_read);
  const yearsReading = Math.max(...years) - Math.min(...years) + 1;
  const currentYear = new Date().getFullYear();
  const booksThisYear = books.filter(book => book.year_read === currentYear).length;
  
  // Calculate favorite genres
  const genreCounts = books.reduce((acc, book) => {
    book.categories.forEach(category => {
      acc[category] = (acc[category] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  const favoriteGenres = Object.entries(genreCounts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Calculate reading velocity by year
  const yearlyStats = books.reduce((acc, book) => {
    const year = book.year_read;
    if (!acc[year]) {
      acc[year] = { year, books: 0, pages: 0 };
    }
    acc[year].books += 1;
    acc[year].pages += book.pages || 0;
    return acc;
  }, {} as Record<number, { year: number; books: number; pages: number }>);
  
  const readingVelocity = Object.values(yearlyStats).sort((a, b) => a.year - b.year);
  
  return {
    totalBooks,
    totalPages,
    averageRating,
    yearsReading,
    booksThisYear,
    favoriteGenres,
    readingVelocity
  };
};

export const filterBooks = (books: Book[], filters: FilterOptions): Book[] => {
  return books.filter(book => {
    // Rating filter
    if (filters.rating && filters.rating.length > 0 && !filters.rating.includes(book.rating)) {
      return false;
    }
    
    // Genre filter
    if (filters.genres && filters.genres.length > 0) {
      const hasMatchingGenre = book.categories.some(category => 
        filters.genres?.includes(category)
      );
      if (!hasMatchingGenre) return false;
    }
    
    // Year filter
    if (filters.yearRead && filters.yearRead.length > 0 && !filters.yearRead.includes(book.year_read)) {
      return false;
    }
    
    // Format filter
    if (filters.format && filters.format.length > 0 && !filters.format.includes(book.format)) {
      return false;
    }
    
    // Page range filter
    if (filters.pageRange) {
      const [min, max] = filters.pageRange;
      if (book.pages < min || book.pages > max) {
        return false;
      }
    }
    
    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = book.personal_tags.some(tag => 
        filters.tags?.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }
    
    return true;
  });
};

export const sortBooks = (books: Book[], sort: SortOptions): Book[] => {
  return [...books].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;
    
    switch (sort.field) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'author':
        aValue = a.author.toLowerCase();
        bValue = b.author.toLowerCase();
        break;
      case 'rating':
        aValue = a.rating;
        bValue = b.rating;
        break;
      case 'year_read':
        aValue = a.year_read;
        bValue = b.year_read;
        break;
      case 'pages':
        aValue = a.pages || 0;
        bValue = b.pages || 0;
        break;
      default:
        return 0;
    }
    
    if (sort.direction === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

export const searchBooks = (books: Book[], query: string): Book[] => {
  if (!query.trim()) return books;
  
  const searchTerm = query.toLowerCase().trim();
  
  return books.filter(book => 
    book.title.toLowerCase().includes(searchTerm) ||
    book.author.toLowerCase().includes(searchTerm) ||
    book.description.toLowerCase().includes(searchTerm) ||
    book.categories.some(category => category.toLowerCase().includes(searchTerm)) ||
    book.personal_tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

export const getBookRecommendations = (book: Book, allBooks: Book[]): Book[] => {
  const similarBooks = allBooks
    .filter(b => b.title !== book.title)
    .map(b => {
      let score = 0;
      
      // Same author
      if (b.author === book.author) score += 3;
      
      // Shared genres
      const sharedGenres = b.categories.filter(cat => book.categories.includes(cat));
      score += sharedGenres.length * 2;
      
      // Similar rating (within 1 star)
      if (Math.abs(b.rating - book.rating) <= 1) score += 1;
      
      // Shared tags
      const sharedTags = b.personal_tags.filter(tag => book.personal_tags.includes(tag));
      score += sharedTags.length;
      
      return { book: b, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.book);
    
  return similarBooks;
};