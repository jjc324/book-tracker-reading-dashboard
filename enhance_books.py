import json
import os
import shutil
from datetime import datetime

class BookEnhancer:
    def __init__(self, json_file='enhanced_books.json'):
        self.json_file = json_file
        self.books = []
        self.load_books()
        
    def load_books(self):
        """Load books from JSON file"""
        try:
            with open(self.json_file, 'r', encoding='utf-8') as f:
                self.books = json.load(f)
            print(f"📚 Loaded {len(self.books)} books from {self.json_file}")
        except FileNotFoundError:
            print(f"❌ File {self.json_file} not found!")
            return
    
    def save_books(self):
        """Save books back to JSON file with backup"""
        # Create backup first
        backup_file = f"{self.json_file}.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        if os.path.exists(self.json_file):
            shutil.copy(self.json_file, backup_file)
            print(f"💾 Backup created: {backup_file}")
        
        # Save updated data
        with open(self.json_file, 'w', encoding='utf-8') as f:
            json.dump(self.books, f, indent=2, ensure_ascii=False)
        print(f"✅ Books saved to {self.json_file}")
    
    def add_ratings_batch(self, count=10):
        """Add ratings to unrated books in batches"""
        unrated = [book for book in self.books if book.get('rating') is None]
        
        if not unrated:
            print("🎉 All books already have ratings!")
            return
        
        print(f"\n⭐ Found {len(unrated)} unrated books")
        print(f"Let's rate {min(count, len(unrated))} books:")
        print("\nRating scale: 1-5 stars")
        print("Commands: 's' = skip, 'q' = quit, 'info' = more book info")
        print("-" * 50)
        
        rated_count = 0
        for i, book in enumerate(unrated[:count]):
            print(f"\n📖 Book {i+1}/{min(count, len(unrated))}")
            print(f"Title: {book['title']}")
            print(f"Author: {book['author']}")
            print(f"Year Read: {book['year_read']}")
            if book.get('pages'):
                print(f"Pages: {book['pages']}")
            if book.get('categories'):
                print(f"Genre: {', '.join(book['categories'])}")
            
            while True:
                rating = input(f"\nRate '{book['title']}' (1-5 stars, 's'=skip, 'q'=quit, 'info'=more): ").strip().lower()
                
                if rating == 'q':
                    print(f"✅ Rated {rated_count} books this session")
                    return rated_count
                elif rating == 's':
                    break
                elif rating == 'info':
                    if book.get('description'):
                        print(f"\nDescription: {book['description'][:200]}...")
                    else:
                        print("No description available")
                    continue
                
                try:
                    rating_num = int(rating)
                    if 1 <= rating_num <= 5:
                        book['rating'] = rating_num
                        rated_count += 1
                        print(f"⭐ Rated {rating_num}/5")
                        
                        # Ask for optional tags
                        tags = input("Add tags (optional, comma-separated): ").strip()
                        if tags:
                            book['personal_tags'] = [tag.strip() for tag in tags.split(',')]
                        
                        # Ask for notes
                        notes = input("Add notes (optional): ").strip()
                        if notes:
                            book['notes'] = notes
                        
                        break
                    else:
                        print("Please enter a number between 1-5")
                except ValueError:
                    print("Invalid input. Try again.")
        
        print(f"\n✅ Rated {rated_count} books this session")
        return rated_count
    
    def search_books(self, query):
        """Search books by title or author"""
        query = query.lower()
        matches = []
        
        for book in self.books:
            if (query in book['title'].lower() or 
                query in book['author'].lower()):
                matches.append(book)
        
        return matches
    
    def show_stats(self):
        """Show statistics about your books"""
        total = len(self.books)
        rated = len([b for b in self.books if b.get('rating')])
        unrated = total - rated
        
        if rated > 0:
            avg_rating = sum(b['rating'] for b in self.books if b.get('rating')) / rated
            rating_dist = {}
            for i in range(1, 6):
                rating_dist[i] = len([b for b in self.books if b.get('rating') == i])
        
        print(f"\n📊 YOUR READING STATS")
        print(f"Total Books: {total}")
        print(f"Rated Books: {rated}")
        print(f"Unrated Books: {unrated}")
        
        if rated > 0:
            print(f"Average Rating: {avg_rating:.1f}/5")
            print("\nRating Distribution:")
            for rating, count in rating_dist.items():
                stars = "⭐" * rating
                print(f"  {stars} ({rating}): {count} books")
        
        # Books by year
        years = {}
        for book in self.books:
            year = book['year_read']
            years[year] = years.get(year, 0) + 1
        
        print(f"\nMost Productive Years:")
        for year in sorted(years.keys(), key=lambda x: years[x], reverse=True)[:5]:
            print(f"  {year}: {years[year]} books")
        
        # Top rated books (if any)
        if rated > 0:
            top_books = [b for b in self.books if b.get('rating') == 5]
            if top_books:
                print(f"\n🏆 Your 5-Star Books ({len(top_books)}):")
                for book in top_books[:10]:  # Show first 10
                    print(f"  • {book['title']} by {book['author']} ({book['year_read']})")
    
    def quick_rate_book(self, title_query):
        """Quickly rate a specific book"""
        matches = self.search_books(title_query)
        
        if not matches:
            print(f"No books found matching '{title_query}'")
            return
        
        if len(matches) == 1:
            book = matches[0]
        else:
            print(f"Found {len(matches)} matches:")
            for i, book in enumerate(matches, 1):
                rating_str = f" ({book['rating']}⭐)" if book.get('rating') else " (unrated)"
                print(f"  {i}. {book['title']} by {book['author']} ({book['year_read']}){rating_str}")
            
            choice = input("Enter number to select: ").strip()
            try:
                book = matches[int(choice) - 1]
            except (ValueError, IndexError):
                print("Invalid selection")
                return
        
        current_rating = book.get('rating', 'unrated')
        print(f"\nBook: {book['title']} by {book['author']}")
        print(f"Current rating: {current_rating}")
        
        rating = input("New rating (1-5, or Enter to skip): ").strip()
        if rating and rating.isdigit() and 1 <= int(rating) <= 5:
            book['rating'] = int(rating)
            print(f"✅ Updated rating to {rating}⭐")
            
            # Update tags/notes too?
            update_more = input("Update tags/notes too? (y/n): ").strip().lower()
            if update_more == 'y':
                tags = input(f"Tags (current: {book.get('personal_tags', [])}): ").strip()
                if tags:
                    book['personal_tags'] = [tag.strip() for tag in tags.split(',')]
                
                notes = input(f"Notes (current: {book.get('notes', '')}): ").strip()
                if notes:
                    book['notes'] = notes

def main():
    enhancer = BookEnhancer()
    
    if not enhancer.books:
        return
    
    while True:
        print("\n" + "="*50)
        print("📚 BOOK ENHANCER MENU")
        print("="*50)
        print("1. Add ratings (batch of 10)")
        print("2. Rate specific book")
        print("3. Show statistics")
        print("4. Search books")
        print("5. Save and quit")
        print("6. Quit without saving")
        
        choice = input("\nEnter choice (1-6): ").strip()
        
        if choice == '1':
            count = enhancer.add_ratings_batch()
            if count > 0:
                save = input("\nSave progress? (y/n): ").strip().lower()
                if save == 'y':
                    enhancer.save_books()
        
        elif choice == '2':
            query = input("Enter book title or author to search: ").strip()
            if query:
                enhancer.quick_rate_book(query)
                save = input("\nSave changes? (y/n): ").strip().lower()
                if save == 'y':
                    enhancer.save_books()
        
        elif choice == '3':
            enhancer.show_stats()
        
        elif choice == '4':
            query = input("Search for: ").strip()
            matches = enhancer.search_books(query)
            print(f"\nFound {len(matches)} matches:")
            for book in matches[:20]:  # Limit to 20 results
                rating_str = f" ({book['rating']}⭐)" if book.get('rating') else " (unrated)"
                print(f"  • {book['title']} by {book['author']} ({book['year_read']}){rating_str}")
        
        elif choice == '5':
            enhancer.save_books()
            print("👋 Goodbye!")
            break
        
        elif choice == '6':
            confirm = input("Quit without saving? (y/n): ").strip().lower()
            if confirm == 'y':
                print("👋 Goodbye!")
                break
        
        else:
            print("Invalid choice")

if __name__ == "__main__":
    main()
