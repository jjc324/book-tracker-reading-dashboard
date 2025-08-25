import json
import pandas as pd
from collections import Counter
from datetime import datetime

def analyze_reading_data():
    """Generate quick reading statistics in terminal"""
    
    # Load data
    with open('enhanced_books.json', 'r', encoding='utf-8') as f:
        books = json.load(f)
    
    df = pd.DataFrame(books)
    
    print("📚" + "="*60)
    print("           YOUR READING JOURNEY STATISTICS")
    print("="*63)
    
    # Basic Stats
    total_books = len(df)
    years_span = df['year_read'].max() - df['year_read'].min() + 1
    start_year = df['year_read'].min()
    end_year = df['year_read'].max()
    
    print(f"\n📖 READING OVERVIEW")
    print(f"   Total Books: {total_books:,}")
    print(f"   Reading Years: {start_year} - {end_year} ({years_span} years)")
    print(f"   Average per Year: {total_books/years_span:.1f} books")
    
    # Yearly breakdown
    yearly_counts = df['year_read'].value_counts().sort_index()
    best_year = yearly_counts.idxmax()
    best_count = yearly_counts.max()
    worst_year = yearly_counts.idxmin()
    worst_count = yearly_counts.min()
    
    print(f"\n📅 YEARLY PATTERNS")
    print(f"   Best Year: {best_year} ({best_count} books)")
    print(f"   Quietest Year: {worst_year} ({worst_count} books)")
    print(f"   Last 3 Years: {yearly_counts.tail(3).sum()} books")
    
    # Recent years detail
    print(f"\n   Recent Years Breakdown:")
    for year in sorted(yearly_counts.index)[-5:]:
        count = yearly_counts[year]
        bar = "█" * (count // 3) + "▌" * (count % 3)
        print(f"   {year}: {count:2d} books {bar}")
    
    # Page Analysis
    pages_data = df[df['pages'].notna() & (df['pages'] != 0)]
    if len(pages_data) > 0:
        total_pages = pages_data['pages'].sum()
        avg_pages = pages_data['pages'].mean()
        longest_book = df.loc[df['pages'].idxmax()] if df['pages'].max() > 0 else None
        
        print(f"\n📄 PAGE STATISTICS")
        print(f"   Total Pages Read: {total_pages:,}")
        print(f"   Average Book Length: {avg_pages:.0f} pages")
        if longest_book is not None:
            print(f"   Longest Book: {longest_book['title']} ({longest_book['pages']} pages)")
        
        # Estimate reading time (assuming 250 words/page, 250 words/minute)
        est_hours = (total_pages * 250) / (250 * 60)
        print(f"   Estimated Reading Time: {est_hours:,.0f} hours ({est_hours/24:,.0f} days)")
    
    # Genre Analysis
    all_genres = []
    for categories in df['categories']:
        if categories:
            all_genres.extend(categories)
    
    if all_genres:
        genre_counts = Counter(all_genres)
        print(f"\n🎭 TOP GENRES")
        for genre, count in genre_counts.most_common(8):
            percentage = (count / total_books) * 100
            print(f"   {genre:<20} {count:3d} books ({percentage:4.1f}%)")
    
    # Author Analysis
    author_counts = df['author'].value_counts()
    print(f"\n👥 AUTHOR INSIGHTS")
    print(f"   Unique Authors: {df['author'].nunique()}")
    print(f"   Most Read Author: {author_counts.index[0]} ({author_counts.iloc[0]} books)")
    
    print(f"\n   Top Authors:")
    for author, count in author_counts.head(10).items():
        if count > 1:  # Only show authors with multiple books
            print(f"   {author:<25} {count} books")
    
    # Rating Analysis
    rated_books = df[df['rating'].notna()]
    if len(rated_books) > 0:
        avg_rating = rated_books['rating'].mean()
        rating_counts = rated_books['rating'].value_counts().sort_index()
        
        print(f"\n⭐ RATING ANALYSIS")
        print(f"   Rated Books: {len(rated_books)} / {total_books} ({len(rated_books)/total_books*100:.1f}%)")
        print(f"   Average Rating: {avg_rating:.2f}/5")
        
        print(f"\n   Rating Distribution:")
        for rating in range(1, 6):
            count = rating_counts.get(rating, 0)
            stars = "⭐" * rating
            bar = "█" * (count // 2) + "▌" * (count % 2)
            print(f"   {stars:<6} {count:2d} books {bar}")
        
        # Find highly rated books
        five_stars = rated_books[rated_books['rating'] == 5]
        if len(five_stars) > 0:
            print(f"\n🏆 YOUR 5-STAR BOOKS ({len(five_stars)}):")
            for _, book in five_stars.head(10).iterrows():
                print(f"   • {book['title']} by {book['author']} ({book['year_read']})")
    else:
        print(f"\n⭐ RATING ANALYSIS")
        print(f"   No ratings yet - start rating your books to see insights!")
    
    # Reading Velocity Analysis
    print(f"\n🚀 READING VELOCITY")
    recent_years = yearly_counts.tail(3)
    older_years = yearly_counts.head(3)
    
    if len(recent_years) > 0 and len(older_years) > 0:
        recent_avg = recent_years.mean()
        older_avg = older_years.mean()
        change = ((recent_avg - older_avg) / older_avg) * 100
        
        print(f"   Early Years Avg: {older_avg:.1f} books/year")
        print(f"   Recent Years Avg: {recent_avg:.1f} books/year")
        trend = "📈 increasing" if change > 0 else "📉 decreasing"
        print(f"   Trend: {trend} ({change:+.1f}%)")
    
    # Fun Facts
    print(f"\n🎉 FUN FACTS")
    
    # Find reading streaks
    consecutive_years = 0
    for year in range(start_year, end_year + 1):
        if year in yearly_counts.index:
            consecutive_years += 1
        else:
            break
    
    print(f"   Reading Streak: {consecutive_years} consecutive years")
    
    # Books per decade of life (assuming you're tracking from college age)
    if years_span >= 10:
        print(f"   Books per Decade: ~{(total_books/years_span)*10:.0f} books")
    
    # Estimate unique words encountered (rough calculation)
    if len(pages_data) > 0:
        est_words = total_pages * 250  # ~250 words per page
        print(f"   Estimated Words Read: {est_words:,}")
    
    print(f"\n" + "="*63)
    print("🏆 Keep up the amazing reading journey!")
    print("="*63)

if __name__ == "__main__":
    try:
        analyze_reading_data()
    except FileNotFoundError:
        print("❌ enhanced_books.json not found!")
        print("Run the book processing script first.")
    except Exception as e:
        print(f"❌ Error: {e}")
