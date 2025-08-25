# 📚 Reading Dashboard

A beautiful, interactive dashboard to track and visualize your reading journey. Built with React, TypeScript, and Tailwind CSS.

![Dashboard Preview](https://via.placeholder.com/800x400/8B4513/FFFFFF?text=Reading+Dashboard+Preview)

## 🌟 Features

- **📊 Interactive Dashboard**: Beautiful charts showing reading timeline, genre distribution, and key statistics
- **📖 Book Library**: Searchable and filterable library with detailed book information
- **⭐ Rating System**: Add and manage personal ratings for your books
- **🎨 Dark/Light Mode**: Toggle between themes for comfortable reading
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 📈 Dashboard Components

- **Stats Overview**: Total books, years reading, pages read, average rating
- **Reading Timeline**: Interactive chart showing books read per year
- **Genre Distribution**: Pie chart of your reading preferences
- **Recent Books**: Latest additions to your library with ratings

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Your reading data in CSV format

### Installation

1. **Clone and setup the project:**
```bash
cd reading-dashboard
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to `http://localhost:5173` to view your dashboard

## 📊 Data Management

### Initial Setup from CSV

If you have your books in a CSV file (like `my_books.csv` that I can see in your project):

1. **Your CSV file** is already in the project root (`my_books.csv`)

2. **Run the book enhancer:**
```bash
# This script converts your CSV to the enhanced JSON format
python3 enhance_books.py
```

**Expected CSV format:**
```csv
title,author,year_read,format,pages,published_year,categories,description
"The Brothers Karamazov","Fyodor Dostoevsky",2024,"paperback",826,2002,"Fiction","Classic Russian novel..."
```

### Adding and Managing Ratings

To review and add ratings to your books:

1. **Run the book tracker system:**
```bash
# Main system for managing your book data
python3 book_tracker_system.py
```

2. **Quick stats check:**
```bash
# Get quick statistics about your reading
python3 quick_stats.py
```

3. **Apply quick fixes:**
```bash
# Fix any data issues
python3 quick_fix.py
```

### Updating Your Book List

When you finish new books:

1. **Add new books to `my_books.csv`** with the new entries

2. **Re-process the data:**
```bash
# Re-run the enhancer to update your dashboard data
python3 enhance_books.py
```

3. **Check for any issues:**
```bash
# Run quick fixes if needed
python3 quick_fix.py
```

4. **Refresh your dashboard** - the new books will appear automatically

## 🛠 Development Scripts

### Available NPM Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production  
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Data Management (Python scripts in root folder)
python3 enhance_books.py        # Process my_books.csv to enhanced_books.json
python3 book_tracker_system.py  # Main book management system
python3 quick_stats.py          # Generate reading statistics
python3 quick_fix.py            # Fix data issues
```

### Python Data Scripts

Located in your project root folder:

```bash
# Main book data processing
python3 enhance_books.py

# Complete book tracking system (ratings, tags, etc.)
python3 book_tracker_system.py

# Quick statistics and insights
python3 quick_stats.py

# Fix data inconsistencies
python3 quick_fix.py

# Simple book processor (if needed)
python3 simple_book_processor.py
```

## 📁 Project Structure

```
reading-dashboard/
├── src/                        # React application source
│   ├── components/
│   │   ├── Dashboard/          # Dashboard components
│   │   ├── BookExplorer/       # Library and search components  
│   │   ├── BookDetail/         # Individual book pages
│   │   ├── Analytics/          # Advanced analytics
│   │   └── UI/                 # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   ├── types/                  # TypeScript type definitions
│   ├── pages/                  # Main page components
│   └── data/
│       └── enhanced_books.json # Your processed book data
├── my_books.csv               # Your source book data
├── enhanced_books.json        # Copy of processed data (root level)
├── book_tracker_system.py     # Main book management system
├── enhance_books.py           # CSV to JSON processor
├── quick_stats.py             # Statistics generator
├── quick_fix.py               # Data cleanup utility
├── simple_book_processor.py   # Alternative processor
└── node_modules/              # Dependencies
```

## 🎨 Customization

### Themes
The dashboard supports light and dark themes. Toggle using the theme switcher in the navigation.

### Colors
Customize the book-themed color palette in `tailwind.config.js`:

```javascript
colors: {
  'book-brown': '#8B4513',
  'book-tan': '#D2B48C',
  'book-cream': '#F5F5DC',
  'book-gold': '#FFD700',
}
```

### Charts
Modify chart configurations in the respective components:
- `ReadingTimeline.tsx` - Yearly reading chart
- `GenreChart.tsx` - Genre distribution
- `StatsOverview.tsx` - Key metrics

## 📖 Data Format

Your enhanced book data includes:

```json
{
  "title": "Book Title",
  "author": "Author Name",
  "year_read": 2024,
  "format": "paperback",
  "pages": 300,
  "published_year": "2023",
  "categories": ["Fiction", "Mystery"],
  "description": "Book description...",
  "rating": 4.5,
  "personal_tags": ["favorite", "re-read"],
  "notes": "Personal notes about the book",
  "favorite_quotes": ["Quote 1", "Quote 2"],
  "date_finished": "2024-03-15"
}
```

## 🔧 Troubleshooting

### Common Issues

**PostCSS/Tailwind Errors:**
```bash
npm install -D @tailwindcss/postcss
# Update postcss.config.js as shown in setup
```

**Data Loading Issues:**
- Check that `enhanced_books.json` exists in `src/data/`
- Verify JSON format is valid
- Run data processor again if needed

**Rating Script Not Working:**
```bash
# Install Python dependencies
pip3 install pandas numpy
```

**Development Server Issues:**
```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

## 📊 Your Reading Stats

Based on your current data:
- **462 books** read over **15 years** (2011-2025)
- **~180,000+ pages** (~125 days of reading time)
- **Peak year**: 2012 with 60 books
- **Recent growth**: 2023 (50 books), 2024 (42 books)
- **Top authors**: Stephen King (17), Brandon Sanderson (15), Haruki Murakami (12)
- **Genre leader**: Fiction (33% of collection)

## 🚀 Next Features

- [ ] Book recommendations based on reading history
- [ ] Reading goals and progress tracking
- [ ] Export reading reports
- [ ] Social sharing of favorite books
- [ ] Advanced analytics and insights
- [ ] Book cover image integration
- [ ] Reading challenges and achievements

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy Reading! 📚✨**

> "A room without books is like a body without a soul." - Marcus Tullius Cicero