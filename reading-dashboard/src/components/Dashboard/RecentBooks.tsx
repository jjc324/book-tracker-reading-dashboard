import { motion } from 'framer-motion';
import { Star, Calendar, BookOpen } from 'lucide-react';
import type { Book } from '../../types';

interface RecentBooksProps {
  books: Book[];
}

export const RecentBooks = ({ books }: RecentBooksProps) => {
  // Get the 10 most recently read books (assuming higher year_read means more recent)
  const recentBooks = [...books]
    .sort((a, b) => {
      // First sort by year, then by title for consistency
      if (b.year_read !== a.year_read) {
        return b.year_read - a.year_read;
      }
      return a.title.localeCompare(b.title);
    })
    .slice(0, 10);

  const renderStars = (rating: number | null) => {
    if (rating === null) return <span className="text-gray-400 text-xs">Not rated</span>;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
          {rating}/5
        </span>
      </div>
    );
  };

  return (
    <div className="chart-container">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Recently Read
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Your latest literary adventures
        </p>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {recentBooks.map((book, index) => (
          <motion.div
            key={`${book.title}-${book.author}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="book-card p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start gap-4">
              {/* Placeholder book cover */}
              <div className="w-12 h-16 bg-gradient-to-br from-book-brown to-book-tan rounded-sm shadow-sm flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                  {book.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                  by {book.author}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{book.year_read}</span>
                    {book.pages && (
                      <>
                        <span>•</span>
                        <span>{book.pages} pages</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="mt-2">
                  {renderStars(book.rating)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};