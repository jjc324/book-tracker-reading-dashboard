import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { Loading, Modal, RatingInput, Button, BookCover } from '../components/UI';
import { ArrowLeft, Star, Edit2 } from 'lucide-react';

const BookDetail = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { books, loading, error } = useBooks();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [tempRating, setTempRating] = useState(0);

  if (loading) return <Loading message="Loading book details..." />;
  if (error) return <div>Error: {error}</div>;

  // For now, find book by title (we'll implement proper IDs later)
  const book = books.find(b =>
    b.title.toLowerCase().replace(/\s+/g, '-') === bookId?.toLowerCase()
  );

  const handleEditRating = () => {
    if (book) {
      setTempRating(book.rating);
      setIsRatingModalOpen(true);
    }
  };

  const handleSaveRating = () => {
    // In a real app, this would update the backend/local storage
    console.log('Saving rating:', tempRating);
    // TODO: Implement actual save functionality
    setIsRatingModalOpen(false);
  };

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
          <BookCover
            title={book.title}
            author={book.author}
            className="w-full aspect-[2/3] rounded-lg"
          />
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

            <div className="flex flex-wrap gap-4 items-center mb-4">
              <div className="flex items-center gap-2">
                <RatingInput value={book.rating} onChange={() => {}} readOnly size="md" showLabel />
                <button
                  onClick={handleEditRating}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Edit rating"
                >
                  <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>{book.pages} pages</span>
              <span>Read in {book.year_read}</span>
              <span className="capitalize">{book.format}</span>
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

      {/* Rating Modal */}
      <Modal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        title="Rate this book"
        footer={
          <>
            <Button
              onClick={() => setIsRatingModalOpen(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveRating}
              className="px-4 py-2 bg-book-brown hover:bg-book-brown/90 text-white rounded-lg transition-colors"
            >
              Save Rating
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            How would you rate "{book?.title}"?
          </p>
          <div className="flex justify-center py-4">
            <RatingInput
              value={tempRating}
              onChange={setTempRating}
              size="lg"
              showLabel={false}
            />
          </div>
          <div className="text-center text-2xl font-bold text-book-brown dark:text-book-tan">
            {tempRating > 0 ? `${tempRating} / 5 Stars` : 'Select a rating'}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookDetail;