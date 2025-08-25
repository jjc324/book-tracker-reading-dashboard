import pandas as pd
import json
import requests
from datetime import datetime
import re
from dataclasses import dataclass
from typing import List, Optional, Dict
import csv

@dataclass
class Book:
    title: str
    author: str
    year_read: int
    date_finished: Optional[str] = None
    format: str = "physical"  # physical, audio, ebook
    rating: Optional[int] = None  # 1-5 scale
    pages: Optional[int] = None
    genres: List[str] = None
    isbn: Optional[str] = None
    goodreads_id: Optional[str] = None
    personal_tags: List[str] = None
    summary: Optional[str] = None
    favorite_quotes: List[str] = None
    readwise_highlights_count: Optional[int] = None
    reading_time_days: Optional[int] = None
    reread: bool = False
    recommended_by: Optional[str] = None
    mood_when_reading: Optional[str] = None
    location_read: Optional[str] = None
    
class BookTrackingSystem:
    def __init__(self):
        self.books = []
        self.readwise_api_key = None
        
    def import_from_sheets(self, csv_file_path: str):
        """Import existing Google Sheets data"""
        df = pd.read_csv(csv_file_path)
        
        for _, row in df.iterrows():
            # Parse your current format
            title_author = row['Book']  # Assuming format like "Title by Author"
            
            # Basic parsing - you'd refine this based on your exact format
            if ' by ' in title_author:
                title, author = title_author.split(' by ', 1)
            else:
                title, author = title_author, "Unknown"
            
            book = Book(
                title=title.strip(),
                author=author.strip(),
                year_read=row['Year'],
                # Add more parsing as needed
            )
            self.books.append(book)
    
    def enhance_with_api_data(self, book: Book):
        """Enhance book data using Google Books API or OpenLibrary"""
        try:
            # Google Books API (free, no key needed for basic queries)
            search_query = f"{book.title} {book.author}".replace(' ', '+')
            url = f"https://www.googleapis.com/books/v1/volumes?q={search_query}&maxResults=1"
            
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                if data['totalItems'] > 0:
                    volume_info = data['items'][0]['volumeInfo']
                    
                    book.pages = volume_info.get('pageCount')
                    book.genres = volume_info.get('categories', [])
                    book.isbn = self._extract_isbn(volume_info.get('industryIdentifiers', []))
                    
        except Exception as e:
            print(f"Error enhancing {book.title}: {e}")
    
    def _extract_isbn(self, identifiers):
        """Extract ISBN from Google Books API response"""
        for identifier in identifiers:
            if identifier['type'] in ['ISBN_13', 'ISBN_10']:
                return identifier['identifier']
        return None
    
    def connect_readwise(self, api_token: str):
        """Connect to Readwise API to import highlights"""
        self.readwise_api_key = api_token
        
        headers = {"Authorization": f"Token {api_token}"}
        url = "https://readwise.io/api/v2/books/"
        
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                readwise_books = response.json()['results']
                self._match_readwise_books(readwise_books)
        except Exception as e:
            print(f"Error connecting to Readwise: {e}")
    
    def _match_readwise_books(self, readwise_books):
        """Match Readwise books with your tracked books"""
        for book in self.books:
            for rw_book in readwise_books:
                # Simple matching - you'd want more sophisticated matching
                if (book.title.lower() in rw_book['title'].lower() or 
                    rw_book['title'].lower() in book.title.lower()):
                    
                    book.readwise_highlights_count = rw_book['num_highlights']
                    # Could fetch actual highlights here
    
    def add_personal_rating_prompt(self):
        """Interactive rating session"""
        unrated_books = [book for book in self.books if book.rating is None]
        
        print(f"Found {len(unrated_books)} unrated books.")
        
        for book in unrated_books[:10]:  # Rate 10 at a time
            print(f"\n{book.title} by {book.author} ({book.year_read})")
            try:
                rating = input("Rate 1-5 (or 's' to skip, 'q' to quit): ")
                if rating == 'q':
                    break
                elif rating == 's':
                    continue
                else:
                    book.rating = int(rating)
                    
                # Optional: add tags
                tags = input("Add tags (comma separated, optional): ")
                if tags.strip():
                    book.personal_tags = [tag.strip() for tag in tags.split(',')]
                    
            except ValueError:
                print("Invalid rating, skipping...")
    
    def export_to_json(self, filename: str = 'books_database.json'):
        """Export enhanced data to JSON for web app"""
        books_data = []
        for book in self.books:
            book_dict = {
                'title': book.title,
                'author': book.author,
                'year_read': book.year_read,
                'date_finished': book.date_finished,
                'format': book.format,
                'rating': book.rating,
                'pages': book.pages,
                'genres': book.genres or [],
                'isbn': book.isbn,
                'personal_tags': book.personal_tags or [],
                'summary': book.summary,
                'favorite_quotes': book.favorite_quotes or [],
                'readwise_highlights_count': book.readwise_highlights_count,
                'reading_time_days': book.reading_time_days,
                'reread': book.reread,
                'recommended_by': book.recommended_by,
                'mood_when_reading': book.mood_when_reading,
                'location_read': book.location_read
            }
            books_data.append(book_dict)
        
        with open(filename, 'w') as f:
            json.dump(books_data, f, indent=2)
        
        print(f"Exported {len(books_data)} books to {filename}")
    
    def generate_reading_stats(self):
        """Generate interesting statistics"""
        total_books = len(self.books)
        total_pages = sum(book.pages for book in self.books if book.pages)
        avg_rating = sum(book.rating for book in self.books if book.rating) / len([book for book in self.books if book.rating])
        
        print(f"\n=== READING STATS ===")
        print(f"Total books: {total_books}")
        print(f"Total pages: {total_pages:,}")
        print(f"Average rating: {avg_rating:.2f}")
        
        # Books per year
        year_counts = {}
        for book in self.books:
            year_counts[book.year_read] = year_counts.get(book.year_read, 0) + 1
        
        print("\nBooks per year:")
        for year in sorted(year_counts.keys()):
            print(f"  {year}: {year_counts[year]} books")

# Usage example
if __name__ == "__main__":
    tracker = BookTrackingSystem()
    
    # Step 1: Import your Google Sheets data
    # tracker.import_from_sheets('your_books.csv')
    
    # Step 2: Enhance with API data
    # for book in tracker.books:
    #     tracker.enhance_with_api_data(book)
    
    # Step 3: Connect Readwise (optional)
    # tracker.connect_readwise('your_readwise_token')
    
    # Step 4: Add personal ratings
    # tracker.add_personal_rating_prompt()
    
    # Step 5: Export for web app
    # tracker.export_to_json()
    
    print("Book tracking system ready!")
