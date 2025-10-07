import { useBooks } from '../hooks/useBooks';
import { Loading, Button } from '../components/UI';
import { StatsOverview, ReadingTimeline, GenreChart, RecentBooks } from '../components/Dashboard';
import { exportReadingData } from '../utils/exportUtils';
import { Download } from 'lucide-react';

const Dashboard = () => {
  const { books, loading, error } = useBooks();

  if (loading) return <Loading message="Loading your reading dashboard..." />;
  if (error) return <div>Error: {error}</div>;

  const handleExport = (format: 'csv' | 'json' | 'stats') => {
    exportReadingData(books, format);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Your Reading Journey
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {books.length} books and counting...
        </p>

        {/* Export Buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                     text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                     rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => handleExport('json')}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                     text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                     rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </Button>
          <Button
            onClick={() => handleExport('stats')}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                     text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                     rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <StatsOverview books={books} />
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ReadingTimeline books={books} />
        <GenreChart books={books} />
      </div>
      
      {/* Recent Books */}
      <RecentBooks books={books} />
    </div>
  );
};

export default Dashboard;