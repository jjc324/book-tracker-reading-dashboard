import pandas as pd
import json
import requests
import time
from datetime import datetime

def clean_book_title_author(book_text):
    """
    Parse your book format - adjust this based on how your data looks
    Examples it handles:
    - "Master of the Senate: Years of Lyndon B Johnson by Robert Caro (Book 3) (08.13.24)"
    - "A Walk in the Woods by Bill Bryson (audio) (08.13.24)"
    """
    # Remove date at the end if present
    book_text = book_text.strip()
    
    # Remove dates like (08.13.24) or (MM.DD.YY)
    import re
    book_text = re.sub(r'\s*\(\d{1,2}\.\d{1,2}\.\d{2,4}\)\s*$', '', book_text)
    
    # Check if it's audio
    is_audio = '(audio)' in book_text.lower()
    book_text = book_text.replace('(audio)', '').replace('(Audio)', '')
    
    # Split by "by"
    if ' by ' in book_text:
        title, author = book_text.split(' by ', 1)
        title = title.strip()
        author = author.strip()
        
        # Clean up any remaining parentheses for series info
        author = re.sub(r'\s*\([^)]*\)\s*$', '', author).strip()
    else:
        title = book_text.strip()
        author = "Unknown"
    
    return {
        'title': title,
        'author': author,
        'format': 'audio' if is_audio else 'unknown'
    }

def get_book_info_from_api(title, author):
    """Get additional info from Google Books API"""
    try:
        # Create search query
        query = f"{title} {author}".replace(' ', '+')
        url = f"https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=1"
        
        response = requests.get(url, timeout=5)
        time.sleep(0.5)  # Be nice to the API
        
        if response.status_code == 200:
            data = response.json()
            if data.get('totalItems', 0) > 0:
                book_info = data['items'][0]['volumeInfo']
                
                return {
                    'pages': book_info.get('pageCount'),
                    'published_year': book_info.get('publishedDate', '').split('-')[0] if book_info.get('publishedDate') else None,
                    'categories': book_info.get('categories', []),
                    'description': book_info.get('description', '')[:500] + '...' if book_info.get('description') else None
                }
    except Exception as e:
        print(f"API error for '{title}': {e}")
    
    return {'pages': None, 'published_year': None, 'categories': [], 'description': None}

def process_books_csv(csv_file_path):
    """Main function to process your CSV"""
    print(f"Reading CSV file: {csv_file_path}")
    
    try:
        df = pd.read_csv(csv_file_path)
        print(f"Found {len(df)} rows in CSV")
        print("Column names:", df.columns.tolist())
        print("\nFirst few rows:")
        print(df.head())
        
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return
    
    # Process each book
    enhanced_books = []
    
    for index, row in df.iterrows():
        print(f"\nProcessing book {index + 1}/{len(df)}")
        
        # Get book info from your format
        book_text = str(row.get('Book', ''))  # Adjust column name if needed
        year_read = row.get('Year', 2024)     # Adjust column name if needed
        
        if not book_text or book_text == 'nan':
            print(f"Skipping empty row {index + 1}")
            continue
        
        print(f"Processing: {book_text}")
        
        # Parse title and author
        parsed = clean_book_title_author(book_text)
        
        # Get additional info from API (optional - comment out if too slow)
        api_info = get_book_info_from_api(parsed['title'], parsed['author'])
        
        # Combine all info
        book_data = {
            'original_text': book_text,
            'title': parsed['title'],
            'author': parsed['author'],
            'year_read': year_read,
            'format': parsed['format'],
            'pages': api_info['pages'],
            'published_year': api_info['published_year'],
            'categories': api_info['categories'],
            'description': api_info['description'],
            # Placeholder fields for you to fill later
            'rating': None,
            'personal_tags': [],
            'notes': '',
            'favorite_quotes': [],
            'date_finished': None
        }
        
        enhanced_books.append(book_data)
        
        print(f"✓ {parsed['title']} by {parsed['author']}")
    
    return enhanced_books

def save_results(books_data, output_file='enhanced_books.json'):
    """Save the results to JSON file"""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(books_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Saved {len(books_data)} books to {output_file}")

def print_summary(books_data):
    """Print a nice summary"""
    print(f"\n📊 SUMMARY")
    print(f"Total books processed: {len(books_data)}")
    
    # Count by year
    years = {}
    for book in books_data:
        year = book['year_read']
        years[year] = years.get(year, 0) + 1
    
    print(f"Books by year:")
    for year in sorted(years.keys()):
        print(f"  {year}: {years[year]} books")
    
    # Count formats
    formats = {}
    for book in books_data:
        fmt = book['format']
        formats[fmt] = formats.get(fmt, 0) + 1
    
    print(f"By format:")
    for fmt, count in formats.items():
        print(f"  {fmt}: {count} books")

# MAIN EXECUTION
if __name__ == "__main__":
    # CHANGE THIS to your CSV file path
    csv_file = "my_books.csv"  # ← Change this to your file name
    
    print("🚀 Starting book data processing...")
    
    # Process the CSV
    books = process_books_csv(csv_file)
    
    if books:
        # Save results
        save_results(books)
        
        # Print summary
        print_summary(books)
        
        print(f"\n🎉 Done! Check 'enhanced_books.json' for your processed data.")
        print(f"Next steps:")
        print(f"1. Open enhanced_books.json to see your data")
        print(f"2. Add ratings and personal notes")
        print(f"3. We can build the web interface!")
    else:
        print("❌ No books were processed. Check your CSV file and column names.")
