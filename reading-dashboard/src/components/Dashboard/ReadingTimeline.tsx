import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Book } from '../../types';

interface ReadingTimelineProps {
  books: Book[];
}

export const ReadingTimeline = ({ books }: ReadingTimelineProps) => {
  // Group books by year and count them
  const yearData = books.reduce((acc, book) => {
    const year = book.year_read;
    if (!acc[year]) {
      acc[year] = 0;
    }
    acc[year]++;
    return acc;
  }, {} as Record<number, number>);

  // Convert to array and sort by year
  const chartData = Object.entries(yearData)
    .map(([year, count]) => ({
      year: parseInt(year),
      books: count
    }))
    .sort((a, b) => a.year - b.year);

  const maxBooks = Math.max(...Object.values(yearData));
  const peakYear = Object.entries(yearData).find(([_, count]) => count === maxBooks)?.[0];

  return (
    <div className="chart-container">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Reading Timeline
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Peak year: {peakYear} ({maxBooks} books)
        </p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="year" 
              stroke="currentColor"
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              stroke="currentColor"
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--tw-color-white)',
                border: '1px solid var(--tw-color-gray-200)',
                borderRadius: '8px',
                color: 'var(--tw-color-gray-900)'
              }}
              labelFormatter={(year) => `Year: ${year}`}
              formatter={(books) => [books, 'Books Read']}
            />
            <Line 
              type="monotone" 
              dataKey="books" 
              stroke="#8B4513" 
              strokeWidth={3}
              dot={{ fill: '#8B4513', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: '#A0522D' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};