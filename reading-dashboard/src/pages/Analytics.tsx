import { useBooks } from '../hooks/useBooks';
import { calculateReadingStats } from '../utils/bookUtils';
import { Loading } from '../components/UI';

const Analytics = () => {
  const { books, loading, error } = useBooks();

  if (loading) return <Loading message="Analyzing your reading patterns..." />;
  if (error) return <div>Error: {error}</div>;

  const stats = calculateReadingStats(books);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Reading Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Insights from your reading journey
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="stat-card">
          <div className="text-2xl font-bold text-book-brown dark:text-book-tan">
            {stats.totalBooks}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Books</div>
        </div>
        
        <div className="stat-card">
          <div className="text-2xl font-bold text-book-brown dark:text-book-tan">
            {stats.totalPages.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pages Read</div>
        </div>
        
        <div className="stat-card">
          <div className="text-2xl font-bold text-book-brown dark:text-book-tan">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
        </div>
        
        <div className="stat-card">
          <div className="text-2xl font-bold text-book-brown dark:text-book-tan">
            {stats.booksThisYear}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">This Year</div>
        </div>
        
        <div className="stat-card">
          <div className="text-2xl font-bold text-book-brown dark:text-book-tan">
            {Math.round(stats.totalPages / stats.totalBooks)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Pages</div>
        </div>
      </div>

      {/* Favorite Genres */}
      <div className="chart-container">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Favorite Genres
        </h2>
        <div className="space-y-3">
          {stats.favoriteGenres.slice(0, 5).map((genre, index) => (
            <div key={genre.genre} className="flex items-center">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {genre.genre}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {genre.count} books
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-book-brown dark:bg-book-tan h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(genre.count / stats.favoriteGenres[0].count) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reading Velocity */}
      <div className="chart-container">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Reading by Year
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats.readingVelocity.slice(-10).map((yearData) => (
            <div key={yearData.year} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-lg font-bold text-book-brown dark:text-book-tan">
                {yearData.books}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {yearData.year}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;