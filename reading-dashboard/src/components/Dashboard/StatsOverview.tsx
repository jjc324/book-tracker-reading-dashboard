import type { Book } from '../../types';

interface StatsOverviewProps {
  books: Book[];
}

export const StatsOverview = ({ books }: StatsOverviewProps) => {
  const totalBooks = books.length;
  const totalPages = books.reduce((sum, book) => sum + (book.pages || 0), 0);
  
  const ratedBooks = books.filter(book => book.rating !== null);
  const averageRating = ratedBooks.length > 0 
    ? Math.round(ratedBooks.reduce((sum, book) => sum + book.rating!, 0) / ratedBooks.length * 10) / 10
    : null;
  
  const years = books.map(book => book.year_read);
  const startYear = Math.min(...years);
  const endYear = Math.max(...years);
  const yearsReading = endYear - startYear + 1;
  
  const currentYear = new Date().getFullYear();
  const currentYearBooks = books.filter(book => book.year_read === currentYear).length;
  
  const readingDays = Math.round(totalPages / 250); // Assuming ~250 pages per day

  const stats = [
    {
      label: 'Total Books',
      value: totalBooks.toLocaleString(),
      subtitle: `${currentYearBooks} this year`
    },
    {
      label: 'Years Reading', 
      value: yearsReading,
      subtitle: `${startYear} - ${endYear}`
    },
    {
      label: 'Pages Read',
      value: totalPages.toLocaleString(),
      subtitle: `~${readingDays} days of reading`
    },
    {
      label: 'Average Rating',
      value: averageRating ? `${averageRating}/5` : 'N/A',
      subtitle: `${ratedBooks.length} books rated`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="text-3xl font-bold text-book-brown dark:text-book-tan mb-2">
            {stat.value}
          </div>
          <div className="text-lg font-medium text-gray-900 dark:text-white">
            {stat.label}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {stat.subtitle}
          </div>
        </div>
      ))}
    </div>
  );
};