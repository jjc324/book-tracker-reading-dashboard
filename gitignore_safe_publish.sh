cat > .gitignore << 'EOF'
# Personal book data - EXCLUDE FROM GITHUB
my_books.csv
enhanced_books.json
reading-dashboard/src/data/enhanced_books.json
reading_dashboard.pdf
reading_dashboard.png
reading_dashboard.py

# System files
.DS_Store
__pycache__/
*.pyc

# Dependencies
reading-dashboard/node_modules/

# Build outputs
reading-dashboard/dist/
reading-dashboard/build/
EOF

# Optional: Keep a sample data file
!sample_books.json
EOF

# Create a sample data file for demo purposes
cat > sample_books.json << 'EOF'
[
  {
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "year_read": 2024,
    "format": "paperback",
    "pages": 310,
    "published_year": "1937",
    "categories": ["Fantasy", "Adventure"],
    "description": "A classic fantasy adventure following Bilbo Baggins on his unexpected journey.",
    "rating": 4.5,
    "personal_tags": ["classic", "fantasy"],
    "notes": "Great introduction to Middle-earth",
    "favorite_quotes": [],
    "date_finished": "2024-01-15"
  }
]
EOF