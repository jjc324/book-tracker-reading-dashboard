import json

# Quick fix: manually add the ratings you just entered
# This will update your JSON file with the 8 books you rated

def quick_add_ratings():
    with open('enhanced_books.json', 'r', encoding='utf-8') as f:
        books = json.load(f)
    
    # The ratings you just entered based on your terminal output:
    ratings_to_add = {
        "Anthem": {"rating": 3, "personal_tags": ["fiction"]},
        "Game of Thrones": {"rating": 3, "personal_tags": ["fiction"], "notes": "Read a long time ago, hard to remember but great start to the series"},
        "A Clash of Kings": {"rating": 3, "personal_tags": ["fiction"]},
        "A Storm of Swords": {"rating": 4, "personal_tags": ["fiction"], "notes": "Best book in the series that I read"},
        "A Confederacy of Dunces": {"rating": 3, "personal_tags": ["fiction"], "notes": "Would like to re-read I don't recall it very well"},
        "Fight Club": {"rating": 3, "personal_tags": ["fiction"], "notes": "Think I liked the movie better, maybe?"},
        "Too Big to Fail": {"rating": 3, "personal_tags": ["non-fiction", "business"]},
        "Sperm Wars": {"rating": 3, "personal_tags": ["evolutionary biology", "non-fiction"]}
    }
    
    # Apply the ratings
    updated_count = 0
    for book in books:
        if book['title'] in ratings_to_add:
            rating_data = ratings_to_add[book['title']]
            book['rating'] = rating_data['rating']
            book['personal_tags'] = rating_data.get('personal_tags', [])
            if 'notes' in rating_data:
                book['notes'] = rating_data['notes']
            updated_count += 1
            print(f"✅ Updated: {book['title']} - {rating_data['rating']}⭐")
    
    # Save back to file
    with open('enhanced_books.json', 'w', encoding='utf-8') as f:
        json.dump(books, f, indent=2, ensure_ascii=False)
    
    print(f"\n🎉 Successfully saved {updated_count} ratings to enhanced_books.json")

if __name__ == "__main__":
    quick_add_ratings()
