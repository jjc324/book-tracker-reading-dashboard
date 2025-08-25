import { useBooks } from '../hooks/useBooks';
import { useFilters } from '../hooks/useFilters';
import { Loading } from '../components/UI';

const BookLibrary = () => {
  const { books, loading, error } = useBooks();
  const { filteredAndSortedBooks, searchQuery, setSearchQuery } = useFilters(books);

  if (loading) return <Loading message="Loading your book library..." />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Book Library
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore your collection of {books.length} books
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search books, authors, or genres..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-book-brown dark:focus:ring-book-tan focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Results */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredAndSortedBooks.length} books
      </div>

      {/* Placeholder grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedBooks.slice(0, 12).map((book) => (
          <div key={`${book.title}-${book.author}`} className="book-card p-4">
            <div className="aspect-[2/3] bg-gradient-to-br from-book-tan to-book-brown rounded-lg mb-3 flex items-center justify-center text-white text-xs font-medium text-center p-2">
              {book.title}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {book.author}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
              <span>{book.year_read}</span>
              <span>★ {book.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookLibrary;