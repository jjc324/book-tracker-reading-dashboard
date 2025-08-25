import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Book } from '../../types';

interface GenreChartProps {
  books: Book[];
}

const COLORS = [
  '#8B4513', // book-brown
  '#D2B48C', // book-tan  
  '#F5F5DC', // book-cream
  '#CD853F', // peru
  '#DEB887', // burlywood
  '#BC8F8F', // rosy brown
  '#F4A460', // sandy brown
  '#DAA520', // goldenrod
  '#B8860B', // dark goldenrod
  '#A0522D'  // sienna
];

export const GenreChart = ({ books }: GenreChartProps) => {
  // Count books by genre
  const genreCount = books.reduce((acc, book) => {
    book.categories.forEach(category => {
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category]++;
    });
    return acc;
  }, {} as Record<string, number>);

  // Convert to array and sort by count
  const chartData = Object.entries(genreCount)
    .map(([genre, count]) => ({
      genre,
      count,
      percentage: Math.round((count / books.length) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 genres

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{data.genre}</p>
          <p className="text-gray-600 dark:text-gray-400">
            {data.count} books ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Genre Distribution
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Top 10 genres by number of books
        </p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="count"
              label={({ genre, percentage }) => `${genre} (${percentage}%)`}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {chartData.slice(0, 6).map((item, index) => (
          <div key={item.genre} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-gray-700 dark:text-gray-300 truncate">
              {item.genre} ({item.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};