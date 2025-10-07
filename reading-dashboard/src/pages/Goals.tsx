import { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import { Loading } from '../components/UI';
import { Target, TrendingUp, Calendar, BookOpen } from 'lucide-react';

const Goals = () => {
  const { books, loading, error } = useBooks();
  const [yearlyGoal, setYearlyGoal] = useState(50); // Default goal

  if (loading) return <Loading message="Loading your reading goals..." />;
  if (error) return <div>Error: {error}</div>;

  const currentYear = new Date().getFullYear();
  const booksThisYear = books.filter(book => book.year_read === currentYear).length;
  const progressPercentage = Math.min((booksThisYear / yearlyGoal) * 100, 100);

  // Calculate days into year
  const today = new Date();
  const startOfYear = new Date(currentYear, 0, 1);
  const daysIntoYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const daysInYear = 365; // Simplified
  const yearProgress = (daysIntoYear / daysInYear) * 100;

  // Calculate if on track
  const expectedBooks = Math.floor((yearlyGoal * daysIntoYear) / daysInYear);
  const booksAheadBehind = booksThisYear - expectedBooks;
  const isOnTrack = booksAheadBehind >= 0;

  // Calculate average reading pace
  const daysPerBook = booksThisYear > 0 ? daysIntoYear / booksThisYear : 0;
  const booksNeeded = yearlyGoal - booksThisYear;
  const daysRemaining = daysInYear - daysIntoYear;

  // Monthly breakdown
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const booksInMonth = books.filter(book => {
      // Since we don't have exact dates, we'll estimate based on year
      return book.year_read === currentYear;
    }).length;
    return {
      month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      books: month <= today.getMonth() + 1 ? Math.floor(booksThisYear / (today.getMonth() + 1)) : 0
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Reading Goals
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and stay motivated
        </p>
      </div>

      {/* Goal Setting */}
      <div className="chart-container">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {currentYear} Reading Goal
        </h2>
        <div className="flex items-center gap-4 mb-6">
          <label className="text-gray-700 dark:text-gray-300">
            Books to read in {currentYear}:
          </label>
          <input
            type="number"
            value={yearlyGoal}
            onChange={(e) => setYearlyGoal(Number(e.target.value))}
            className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     focus:ring-2 focus:ring-book-brown dark:focus:ring-book-tan focus:border-transparent
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="1"
          />
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">
              {booksThisYear} of {yearlyGoal} books
            </span>
            <span className="font-semibold text-book-brown dark:text-book-tan">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-book-brown to-book-tan transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Status Message */}
        <div className={`p-4 rounded-lg ${
          isOnTrack
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
        }`}>
          <div className="flex items-start gap-3">
            <TrendingUp className={`w-5 h-5 mt-0.5 ${
              isOnTrack ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
            }`} />
            <div>
              <p className={`font-semibold ${
                isOnTrack ? 'text-green-900 dark:text-green-300' : 'text-orange-900 dark:text-orange-300'
              }`}>
                {isOnTrack
                  ? `You're ${Math.abs(booksAheadBehind)} book${Math.abs(booksAheadBehind) !== 1 ? 's' : ''} ahead of schedule! 🎉`
                  : `You're ${Math.abs(booksAheadBehind)} book${Math.abs(booksAheadBehind) !== 1 ? 's' : ''} behind schedule`
                }
              </p>
              <p className={`text-sm mt-1 ${
                isOnTrack ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'
              }`}>
                Expected: {expectedBooks} books by now ({yearProgress.toFixed(1)}% through the year)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-book-brown dark:text-book-tan" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Books Remaining</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {Math.max(booksNeeded, 0)}
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-book-brown dark:text-book-tan" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Days Remaining</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {daysRemaining}
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-book-brown dark:text-book-tan" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Current Pace</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {daysPerBook > 0 ? daysPerBook.toFixed(1) : '-'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            days per book
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-book-brown dark:text-book-tan" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Needed Pace</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {booksNeeded > 0 && daysRemaining > 0
              ? (daysRemaining / booksNeeded).toFixed(1)
              : '-'
            }
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            days per book
          </div>
        </div>
      </div>

      {/* Motivational Section */}
      <div className="chart-container">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Keep Going! 💪
        </h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          {booksNeeded > 0 ? (
            <>
              <p>
                • To reach your goal, you need to read <strong className="text-book-brown dark:text-book-tan">
                  {booksNeeded} more book{booksNeeded !== 1 ? 's' : ''}
                </strong> this year
              </p>
              <p>
                • That's about <strong className="text-book-brown dark:text-book-tan">
                  1 book every {(daysRemaining / Math.max(booksNeeded, 1)).toFixed(0)} days
                </strong>
              </p>
              <p>
                • If you read at your current pace, you'll finish <strong className="text-book-brown dark:text-book-tan">
                  {Math.floor(daysRemaining / Math.max(daysPerBook, 1)) + booksThisYear} books
                </strong> by year end
              </p>
            </>
          ) : (
            <>
              <p className="text-green-600 dark:text-green-400 font-semibold">
                🎉 Congratulations! You've reached your reading goal for {currentYear}!
              </p>
              <p>
                You still have {daysRemaining} days left - consider setting a stretch goal!
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Goals;
