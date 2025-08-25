import { useBooks } from '../hooks/useBooks';
import { Loading } from '../components/UI';
import { StatsOverview, ReadingTimeline, GenreChart, RecentBooks } from '../components/Dashboard';

const Dashboard = () => {
  const { books, loading, error } = useBooks();

  if (loading) return <Loading message="Loading your reading dashboard..." />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Your Reading Journey
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {books.length} books and counting...
        </p>
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