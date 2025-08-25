# Create/update .gitignore to exclude your personal data
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.npm
.yarn

# Build outputs
dist/
build/
.vite/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Personal book data - EXCLUDE FROM GITHUB
my_books.csv
enhanced_books.json
src/data/enhanced_books.json
reading_dashboard.pdf
reading_dashboard.png

# Python cache
__pycache__/
*.pyc
*.pyo

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

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