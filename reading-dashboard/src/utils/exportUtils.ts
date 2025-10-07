import type { Book } from '../types/index';

/**
 * Export books data to CSV format
 */
export const exportToCSV = (books: Book[], filename = 'my_books_export.csv') => {
  // CSV headers
  const headers = [
    'Title',
    'Author',
    'Year Read',
    'Format',
    'Pages',
    'Published Year',
    'Categories',
    'Rating',
    'Date Finished',
    'Notes',
    'Tags'
  ];

  // Convert books to CSV rows
  const rows = books.map(book => [
    `"${book.title.replace(/"/g, '""')}"`, // Escape quotes
    `"${book.author.replace(/"/g, '""')}"`,
    book.year_read,
    book.format,
    book.pages,
    book.published_year,
    `"${book.categories.join('|')}"`,
    book.rating,
    book.date_finished || '',
    `"${(book.notes || '').replace(/"/g, '""')}"`,
    `"${book.personal_tags.join('|')}"`
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create and trigger download
  downloadFile(csvContent, filename, 'text/csv');
};

/**
 * Export books data to JSON format
 */
export const exportToJSON = (books: Book[], filename = 'my_books_export.json') => {
  const jsonContent = JSON.stringify(books, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
};

/**
 * Export reading statistics report as text
 */
export const exportStatsReport = (books: Book[], filename = 'reading_stats_report.txt') => {
  const totalBooks = books.length;
  const years = books.map(b => b.year_read);
  const startYear = Math.min(...years);
  const endYear = Math.max(...years);
  const yearsReading = endYear - startYear + 1;

  const totalPages = books.reduce((sum, book) => sum + (book.pages || 0), 0);
  const avgPages = Math.round(totalPages / totalBooks);

  const ratedBooks = books.filter(b => b.rating > 0);
  const avgRating = ratedBooks.length > 0
    ? (ratedBooks.reduce((sum, b) => sum + b.rating, 0) / ratedBooks.length).toFixed(2)
    : 'N/A';

  // Genre analysis
  const genreCounts: Record<string, number> = {};
  books.forEach(book => {
    book.categories.forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Author analysis
  const authorCounts: Record<string, number> = {};
  books.forEach(book => {
    authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
  });
  const topAuthors = Object.entries(authorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Yearly breakdown
  const yearlyBreakdown: Record<number, number> = {};
  books.forEach(book => {
    yearlyBreakdown[book.year_read] = (yearlyBreakdown[book.year_read] || 0) + 1;
  });

  const report = `
READING STATISTICS REPORT
Generated: ${new Date().toLocaleDateString()}

═══════════════════════════════════════════════════════════

OVERVIEW
───────────────────────────────────────────────────────────
Total Books Read:        ${totalBooks}
Reading Period:          ${startYear} - ${endYear} (${yearsReading} years)
Average Books/Year:      ${(totalBooks / yearsReading).toFixed(1)}

Total Pages Read:        ${totalPages.toLocaleString()}
Average Book Length:     ${avgPages} pages
Estimated Reading Time:  ~${Math.round(totalPages / 250)} hours

Books Rated:             ${ratedBooks.length} / ${totalBooks}
Average Rating:          ${avgRating}/5 stars

═══════════════════════════════════════════════════════════

TOP GENRES
───────────────────────────────────────────────────────────
${topGenres.map(([genre, count], i) =>
  `${i + 1}. ${genre.padEnd(25)} ${count} books (${((count / totalBooks) * 100).toFixed(1)}%)`
).join('\n')}

═══════════════════════════════════════════════════════════

TOP AUTHORS
───────────────────────────────────────────────────────────
${topAuthors.map(([author, count], i) =>
  `${i + 1}. ${author.padEnd(25)} ${count} books`
).join('\n')}

═══════════════════════════════════════════════════════════

YEARLY BREAKDOWN
───────────────────────────────────────────────────────────
${Object.entries(yearlyBreakdown)
  .sort((a, b) => Number(a[0]) - Number(b[0]))
  .map(([year, count]) => {
    const bar = '█'.repeat(Math.ceil(count / 2));
    return `${year}:  ${String(count).padStart(3)} books  ${bar}`;
  })
  .join('\n')}

═══════════════════════════════════════════════════════════

HIGHEST RATED BOOKS
───────────────────────────────────────────────────────────
${books
  .filter(b => b.rating === 5)
  .slice(0, 10)
  .map((book, i) =>
    `${i + 1}. "${book.title}" by ${book.author} (${book.year_read})`
  )
  .join('\n') || 'No 5-star books yet'}

═══════════════════════════════════════════════════════════
`;

  downloadFile(report, filename, 'text/plain');
};

/**
 * Helper function to trigger file download
 */
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export reading data with multiple format options
 */
export const exportReadingData = (
  books: Book[],
  format: 'csv' | 'json' | 'stats' = 'csv',
  customFilename?: string
) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const defaultFilename = `reading_data_${timestamp}`;

  switch (format) {
    case 'csv':
      exportToCSV(books, customFilename || `${defaultFilename}.csv`);
      break;
    case 'json':
      exportToJSON(books, customFilename || `${defaultFilename}.json`);
      break;
    case 'stats':
      exportStatsReport(books, customFilename || `${defaultFilename}_stats.txt`);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};
