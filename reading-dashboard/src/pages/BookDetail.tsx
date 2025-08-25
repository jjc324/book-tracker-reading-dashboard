import { useParams, Link } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { Loading } from '../components/UI';
import { ArrowLeft } from 'lucide-react';

const BookDetail = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { books, loading, error } = useBooks();

  if (loading) return <Loading message="Loading book details..." />;
  if (error) return <div>Error: {error}</div>;

  // For now, find book by title (we'll implement proper IDs later)
  const book = books.find(b => 
    b.title.toLowerCase().replace(/\s+/g, '-') === bookId?.toLowerCase()
  );

  if (!book) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Book Not Found
        </h1>
        <Link 
          to="/books" 
          className="text-book-brown dark:text-book-tan hover:underline"
        >
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link 
        to="/books" 
        className="inline-flex items-center text-book-brown dark:text-book-tan hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Library
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="lg:col-span-1">
          <div className="aspect-[2/3] bg-gradient-to-br from-book-tan to-book-brown rounded-lg flex items-center justify-center text-white text-lg font-medium text-center p-6">
            {book.title}
          </div>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {book.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              by {book.author}
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>★ {book.rating}/5</span>
              <span>{book.pages} pages</span>
              <span>Read in {book.year_read}</span>
              <span>{book.format}</span>
            </div>
          </div>

          {book.categories.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {book.categories.map((category) => (
                  <span 
                    key={category}
                    className="px-3 py-1 bg-book-tan/20 dark:bg-book-brown/20 text-book-brown dark:text-book-tan rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {book.description && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {book.description}
              </p>
            </div>
          )}

          {book.notes && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">My Notes</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {book.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;