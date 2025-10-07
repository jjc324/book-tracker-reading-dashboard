# 📚 Book Tracker - Reading Dashboard

A beautiful, interactive full-stack application to track and visualize your reading journey. Built with React, TypeScript, Tailwind CSS, and Python.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)
![Python](https://img.shields.io/badge/Python-3.x-3776ab.svg)

## 🌟 Features

### 📊 Interactive Web Dashboard
- **Beautiful Visualizations**: Interactive charts showing reading timeline, genre distribution, and detailed statistics
- **Smart Search & Filters**: Find books instantly with powerful search and filtering capabilities
- **Book Library**: Browse your complete collection with sortable grid/list views
- **Detailed Book Pages**: View comprehensive information including ratings, notes, quotes, and descriptions
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices

### 🐍 Python Data Pipeline
- **CSV Import**: Convert your reading data from CSV to enriched JSON format
- **Book Management System**: Add ratings, tags, notes, and favorite quotes
- **Statistics Generator**: Get detailed terminal-based reading insights
- **Data Cleanup Utilities**: Validate and fix data inconsistencies
- **Visualization Export**: Generate beautiful dashboard PDFs and PNGs with matplotlib

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.8+
- Your reading data in CSV format (or use our sample data)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/jjc324/book-tracker-reading-dashboard.git
cd book-tracker-reading-dashboard
```

2. **Set up the React dashboard:**
```bash
cd reading-dashboard
npm install
npm run dev
```

3. **Open your browser:**
Navigate to `http://localhost:5173` to view your dashboard

### First-Time Setup with Your Data

If you have your own reading data:

1. **Prepare your CSV file** with the following columns:
```csv
title,author,year_read,format,pages,published_year,categories,description
"1984","George Orwell",2023,"paperback",328,1949,"Fiction|Dystopian","A dystopian novel..."
```

2. **Process your data:**
```bash
# From the project root
python3 enhance_books.py
```

3. **Copy to React app:**
```bash
cp enhanced_books.json reading-dashboard/src/data/
```

4. **Refresh your dashboard** - your books will appear automatically!

### Try the Demo

Want to see it in action first?

```bash
# Use the sample data
cp sample_books.json reading-dashboard/src/data/enhanced_books.json
cd reading-dashboard
npm run dev
```

## 📁 Project Structure

```
book-tracker-reading-dashboard/
├── reading-dashboard/          # React web application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Dashboard/      # Dashboard widgets
│   │   │   ├── BookExplorer/   # Library components
│   │   │   └── UI/             # Reusable UI components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Main page components
│   │   ├── utils/              # Utility functions
│   │   ├── types/              # TypeScript definitions
│   │   └── data/               # Book data (gitignored)
│   ├── package.json
│   └── tailwind.config.js
├── sample_books.json           # Demo data (15 books)
├── enhance_books.py            # CSV to JSON converter
├── book_tracker_system.py      # Interactive book management
├── quick_stats.py              # Terminal statistics viewer
├── reading_dashboard.py        # Python visualization generator
└── README.md
```

## 🎨 Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend/Data Processing
- **Python 3.x**
- **pandas** - Data manipulation
- **matplotlib** - Static visualizations
- **seaborn** - Statistical plots

## 📖 Usage

### Web Dashboard

#### Dashboard Page
View your reading overview with:
- Total books, years reading, pages read, average rating
- Interactive reading timeline chart
- Genre distribution pie chart
- Recently read books with ratings

#### Library Page
Browse and search your collection:
- Search by title, author, genre, or tags
- Filter and sort functionality
- Grid view with book cards
- Click any book for detailed view

#### Analytics Page
Dive deeper into your reading patterns:
- Favorite genres breakdown
- Reading velocity by year
- Comprehensive statistics

#### Book Detail Page
See everything about a specific book:
- Full description and metadata
- Your personal notes and quotes
- Genre tags and ratings
- Reading date and format

### Python Tools

#### Process Your CSV Data
```bash
python3 enhance_books.py
```
Converts `my_books.csv` to `enhanced_books.json` with enriched data structure.

#### Manage Your Books
```bash
python3 book_tracker_system.py
```
Interactive CLI to:
- Add ratings to books
- Tag books with custom labels
- Add personal notes and quotes
- Update book metadata

#### View Quick Statistics
```bash
python3 quick_stats.py
```
Terminal-based reading statistics with:
- Books per year breakdown
- Top authors and genres
- Page count analysis
- Reading velocity trends

#### Generate Static Dashboard
```bash
python3 reading_dashboard.py
```
Creates beautiful PDF and PNG visualizations with matplotlib.

## 🎯 Customization

### Themes
The dashboard includes custom book-themed colors. Modify in `tailwind.config.js`:

```javascript
colors: {
  'book-brown': '#8B4513',
  'book-tan': '#D2B48C',
  'book-cream': '#F5F5DC',
  'book-dark': '#2C1810',
}
```

### Data Format
Your enhanced JSON format supports:

```json
{
  "title": "Book Title",
  "author": "Author Name",
  "year_read": 2024,
  "format": "physical|ebook|audio",
  "pages": 300,
  "published_year": "2023",
  "categories": ["Fiction", "Mystery"],
  "description": "Book description...",
  "rating": 5,
  "personal_tags": ["favorite", "re-read"],
  "notes": "Your thoughts...",
  "favorite_quotes": ["Quote 1", "Quote 2"],
  "date_finished": "2024-03-15"
}
```

## 🔧 Development

### Available Scripts

**React Dashboard:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Python Scripts:**
```bash
python3 enhance_books.py        # Process CSV data
python3 book_tracker_system.py  # Book management system
python3 quick_stats.py          # Generate statistics
python3 reading_dashboard.py    # Create visualizations
```

### Adding New Features

1. **New React Component:**
   - Add to `reading-dashboard/src/components/`
   - Follow TypeScript conventions
   - Use Tailwind for styling

2. **New Data Field:**
   - Update type definitions in `src/types/index.ts`
   - Modify Python processing scripts
   - Update React components to display new data

## 📊 Sample Data

The repository includes `sample_books.json` with 15 diverse books for demo purposes:
- Mix of fiction and non-fiction
- Various formats (physical, ebook, audio)
- Different genres and time periods
- Ratings, notes, and quotes included

Perfect for testing the dashboard without exposing personal data!

## 🔒 Privacy

This project is designed with privacy in mind:
- Personal book data is gitignored by default
- Sample data provided for demos
- All data stays local (no external services)
- Easy to anonymize or remove sensitive information

The `.gitignore` file protects:
- `my_books.csv` (your source data)
- `enhanced_books.json` (processed data)
- `reading-dashboard/src/data/` (app data directory)
- Generated visualizations

## 🛠 Troubleshooting

### Data Not Loading
- Ensure `enhanced_books.json` exists in `reading-dashboard/src/data/`
- Verify JSON format is valid
- Check browser console for errors

### Python Script Errors
```bash
# Install required packages
pip3 install pandas numpy matplotlib seaborn
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules/.vite
npm install
npm run dev
```

## 🚧 Roadmap

- [ ] Book cover image integration
- [ ] Reading goals and progress tracking
- [ ] Export functionality for reports
- [ ] Book recommendations based on reading history
- [ ] Social sharing features
- [ ] Reading challenges and achievements
- [ ] Advanced analytics and insights
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Design inspired by modern book tracking apps
- Built with amazing open-source tools and libraries
- Book data structure based on common reading tracker formats

## 📧 Contact

For questions, suggestions, or issues:
- Open an issue on GitHub
- Repository: [https://github.com/jjc324/book-tracker-reading-dashboard](https://github.com/jjc324/book-tracker-reading-dashboard)

---

**Happy Reading! 📚✨**

> "A reader lives a thousand lives before he dies. The man who never reads lives only one." - George R.R. Martin
