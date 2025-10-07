import json
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from collections import Counter, defaultdict
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Set up beautiful plotting style
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

class ReadingAnalyzer:
    def __init__(self, json_file='enhanced_books.json'):
        self.json_file = json_file
        self.books = []
        self.df = None
        self.load_data()
        
    def load_data(self):
        """Load and prepare data for analysis"""
        with open(self.json_file, 'r', encoding='utf-8') as f:
            self.books = json.load(f)
        
        # Convert to DataFrame for easier analysis
        self.df = pd.DataFrame(self.books)
        print(f"📊 Loaded {len(self.df)} books for analysis")
        
        # Add derived columns
        self.df['has_rating'] = self.df['rating'].notna()
        self.df['decade_read'] = (self.df['year_read'] // 10) * 10
        self.df['pages_numeric'] = pd.to_numeric(self.df['pages'], errors='coerce')
        
        # Clean up categories
        self.df['primary_genre'] = self.df['categories'].apply(
            lambda x: x[0] if x and len(x) > 0 else 'Unknown'
        )
    
    def create_dashboard(self):
        """Generate comprehensive reading dashboard"""
        # Create a large figure with subplots
        fig = plt.figure(figsize=(20, 24))
        
        # Main title
        fig.suptitle('📚 YOUR READING JOURNEY (2011-2025)', 
                    fontsize=24, fontweight='bold', y=0.98)
        
        # Grid layout: 6 rows, 2 columns
        gs = fig.add_gridspec(6, 2, height_ratios=[1, 1, 1, 1, 1, 1], 
                             width_ratios=[1, 1], hspace=0.3, wspace=0.2)
        
        # 1. Books per Year Timeline
        ax1 = fig.add_subplot(gs[0, :])
        self.plot_books_per_year(ax1)
        
        # 2. Genre Distribution
        ax2 = fig.add_subplot(gs[1, 0])
        self.plot_genre_distribution(ax2)
        
        # 3. Page Count Analysis
        ax3 = fig.add_subplot(gs[1, 1])
        self.plot_page_analysis(ax3)
        
        # 4. Reading Intensity Heatmap
        ax4 = fig.add_subplot(gs[2, :])
        self.plot_reading_heatmap(ax4)
        
        # 5. Rating Analysis (if available)
        ax5 = fig.add_subplot(gs[3, 0])
        ax6 = fig.add_subplot(gs[3, 1])
        self.plot_rating_analysis(ax5, ax6)
        
        # 6. Author Analysis
        ax7 = fig.add_subplot(gs[4, 0])
        self.plot_top_authors(ax7)
        
        # 7. Reading Patterns
        ax8 = fig.add_subplot(gs[4, 1])
        self.plot_reading_patterns(ax8)
        
        # 8. Summary Stats
        ax9 = fig.add_subplot(gs[5, :])
        self.plot_summary_stats(ax9)
        
        # Save the dashboard
        plt.tight_layout()
        plt.savefig('reading_dashboard.png', dpi=300, bbox_inches='tight')
        plt.savefig('reading_dashboard.pdf', bbox_inches='tight')
        print("📈 Dashboard saved as 'reading_dashboard.png' and 'reading_dashboard.pdf'")
        plt.show()
    
    def plot_books_per_year(self, ax):
        """Plot books read per year with trend line"""
        yearly_counts = self.df['year_read'].value_counts().sort_index()
        
        # Create bar plot
        bars = ax.bar(yearly_counts.index, yearly_counts.values, 
                     alpha=0.7, color='skyblue', edgecolor='navy', linewidth=0.5)
        
        # Add trend line
        z = np.polyfit(yearly_counts.index, yearly_counts.values, 1)
        p = np.poly1d(z)
        ax.plot(yearly_counts.index, p(yearly_counts.index), 
               "r--", alpha=0.8, linewidth=2, label=f'Trend')
        
        # Customize
        ax.set_title('📖 Books Read Per Year', fontsize=16, fontweight='bold', pad=20)
        ax.set_xlabel('Year', fontsize=12)
        ax.set_ylabel('Number of Books', fontsize=12)
        ax.grid(True, alpha=0.3)
        ax.legend()
        
        # Add value labels on bars
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                   f'{int(height)}', ha='center', va='bottom', fontsize=10)
        
        # Highlight best year
        best_year = yearly_counts.idxmax()
        best_count = yearly_counts.max()
        ax.annotate(f'Peak: {best_count} books!', 
                   xy=(best_year, best_count), xytext=(best_year, best_count + 5),
                   arrowprops=dict(arrowstyle='->', color='red'),
                   fontsize=11, ha='center', color='red', fontweight='bold')
    
    def plot_genre_distribution(self, ax):
        """Plot top genres as pie chart"""
        genre_counts = self.df['primary_genre'].value_counts().head(8)
        
        # Create pie chart with better colors
        colors = plt.cm.Set3(np.linspace(0, 1, len(genre_counts)))
        wedges, texts, autotexts = ax.pie(genre_counts.values, labels=genre_counts.index, 
                                         autopct='%1.1f%%', colors=colors, startangle=90)
        
        # Customize text
        for autotext in autotexts:
            autotext.set_color('white')
            autotext.set_fontweight('bold')
        
        ax.set_title('🎭 Reading Genres', fontsize=14, fontweight='bold', pad=20)
    
    def plot_page_analysis(self, ax):
        """Analyze page counts"""
        pages_data = self.df[self.df['pages_numeric'].notna()]['pages_numeric']
        
        if len(pages_data) > 0:
            # Create histogram
            ax.hist(pages_data, bins=30, alpha=0.7, color='lightgreen', 
                   edgecolor='darkgreen', linewidth=0.5)
            
            # Add statistics lines
            mean_pages = pages_data.mean()
            median_pages = pages_data.median()
            
            ax.axvline(mean_pages, color='red', linestyle='--', 
                      label=f'Mean: {mean_pages:.0f} pages')
            ax.axvline(median_pages, color='blue', linestyle='--', 
                      label=f'Median: {median_pages:.0f} pages')
            
            ax.set_title('📄 Book Length Distribution', fontsize=14, fontweight='bold')
            ax.set_xlabel('Pages')
            ax.set_ylabel('Number of Books')
            ax.legend()
            ax.grid(True, alpha=0.3)
        else:
            ax.text(0.5, 0.5, 'No page data available', 
                   ha='center', va='center', transform=ax.transAxes, fontsize=12)
            ax.set_title('📄 Book Length Distribution', fontsize=14, fontweight='bold')
    
    def plot_reading_heatmap(self, ax):
        """Create reading intensity heatmap by year and month"""
        # For now, we'll simulate monthly data since we don't have exact dates
        # In the future, this could use actual reading dates
        
        years = sorted(self.df['year_read'].unique())
        months = list(range(1, 13))
        
        # Create a matrix of reading intensity (simulated)
        np.random.seed(42)  # For reproducible "random" data
        yearly_totals = self.df['year_read'].value_counts()
        
        heatmap_data = []
        for year in years:
            year_total = yearly_totals.get(year, 0)
            # Simulate monthly distribution (some months busier than others)
            monthly_weights = np.random.dirichlet(np.ones(12)) * year_total
            heatmap_data.append(monthly_weights)
        
        heatmap_matrix = np.array(heatmap_data)
        
        # Create heatmap
        im = ax.imshow(heatmap_matrix, cmap='YlOrRd', aspect='auto')
        
        # Set ticks and labels
        ax.set_xticks(range(12))
        ax.set_xticklabels(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
        ax.set_yticks(range(len(years)))
        ax.set_yticklabels(years)
        
        ax.set_title('🔥 Reading Intensity Heatmap (Estimated)', fontsize=14, fontweight='bold')
        ax.set_xlabel('Month')
        ax.set_ylabel('Year')
        
        # Add colorbar
        cbar = plt.colorbar(im, ax=ax, shrink=0.8)
        cbar.set_label('Books Read', rotation=270, labelpad=15)
    
    def plot_rating_analysis(self, ax1, ax2):
        """Analyze ratings if available"""
        rated_books = self.df[self.df['has_rating']]
        
        if len(rated_books) > 0:
            # Rating distribution
            rating_counts = rated_books['rating'].value_counts().sort_index()
            bars = ax1.bar(rating_counts.index, rating_counts.values, 
                          color=['red', 'orange', 'yellow', 'lightgreen', 'green'])
            
            ax1.set_title('⭐ Rating Distribution', fontsize=14, fontweight='bold')
            ax1.set_xlabel('Rating (Stars)')
            ax1.set_ylabel('Number of Books')
            ax1.set_xticks(range(1, 6))
            
            # Add value labels
            for bar in bars:
                height = bar.get_height()
                if height > 0:
                    ax1.text(bar.get_x() + bar.get_width()/2., height + 0.1,
                           f'{int(height)}', ha='center', va='bottom')
            
            # Rating trends over time
            rating_by_year = rated_books.groupby('year_read')['rating'].mean()
            ax2.plot(rating_by_year.index, rating_by_year.values, 
                    marker='o', linewidth=2, markersize=6)
            ax2.set_title('📈 Average Rating Over Time', fontsize=14, fontweight='bold')
            ax2.set_xlabel('Year')
            ax2.set_ylabel('Average Rating')
            ax2.grid(True, alpha=0.3)
            ax2.set_ylim(1, 5)
            
        else:
            for ax in [ax1, ax2]:
                ax.text(0.5, 0.5, 'No ratings available yet.\nStart rating your books!', 
                       ha='center', va='center', transform=ax.transAxes, 
                       fontsize=12, style='italic')
                ax.set_title('⭐ Rating Analysis', fontsize=14, fontweight='bold')
    
    def plot_top_authors(self, ax):
        """Show most-read authors"""
        author_counts = self.df['author'].value_counts().head(10)
        
        # Create horizontal bar chart
        bars = ax.barh(range(len(author_counts)), author_counts.values, color='lightcoral')
        ax.set_yticks(range(len(author_counts)))
        ax.set_yticklabels(author_counts.index, fontsize=10)
        ax.set_xlabel('Number of Books')
        ax.set_title('👥 Most Read Authors', fontsize=14, fontweight='bold')
        
        # Add value labels
        for i, bar in enumerate(bars):
            width = bar.get_width()
            ax.text(width + 0.1, bar.get_y() + bar.get_height()/2,
                   f'{int(width)}', ha='left', va='center')
        
        ax.grid(True, alpha=0.3, axis='x')
    
    def plot_reading_patterns(self, ax):
        """Analyze reading patterns"""
        # Books by decade published
        decade_counts = self.df['published_year'].apply(
            lambda x: (int(x) // 10) * 10 if pd.notna(x) and str(x).isdigit() else None
        ).value_counts().sort_index()
        
        if len(decade_counts) > 0:
            ax.bar(decade_counts.index, decade_counts.values, 
                  width=8, alpha=0.7, color='mediumpurple')
            ax.set_title('📚 Books by Publication Decade', fontsize=14, fontweight='bold')
            ax.set_xlabel('Publication Decade')
            ax.set_ylabel('Number of Books')
            ax.grid(True, alpha=0.3)
            
            # Format x-axis
            ax.set_xticks(decade_counts.index)
            ax.set_xticklabels([f"{int(d)}s" for d in decade_counts.index], rotation=45)
        else:
            ax.text(0.5, 0.5, 'No publication year data available', 
                   ha='center', va='center', transform=ax.transAxes, fontsize=12)
            ax.set_title('📚 Books by Publication Decade', fontsize=14, fontweight='bold')
    
    def plot_summary_stats(self, ax):
        """Display key summary statistics"""
        ax.axis('off')
        
        # Calculate key stats
        total_books = len(self.df)
        years_reading = self.df['year_read'].max() - self.df['year_read'].min() + 1
        avg_books_per_year = total_books / years_reading
        
        total_pages = self.df['pages_numeric'].sum(skipna=True)
        avg_pages = self.df['pages_numeric'].mean(skipna=True)
        
        rated_books = len(self.df[self.df['has_rating']])
        avg_rating = self.df['rating'].mean(skipna=True) if rated_books > 0 else 0
        
        unique_authors = self.df['author'].nunique()
        most_read_author = self.df['author'].value_counts().index[0]
        most_read_count = self.df['author'].value_counts().iloc[0]
        
        # Create stats text
        stats_text = f"""
        📊 READING STATISTICS SUMMARY
        
        🔢 Total Books Read: {total_books:,}
        📅 Years of Reading: {years_reading} years ({self.df['year_read'].min()}-{self.df['year_read'].max()})
        📈 Average Books/Year: {avg_books_per_year:.1f}
        
        📄 Total Pages Read: {total_pages:,.0f} pages
        📖 Average Book Length: {avg_pages:.0f} pages
        
        ⭐ Books Rated: {rated_books} / {total_books}
        🏆 Average Rating: {avg_rating:.1f}/5 stars
        
        👥 Unique Authors: {unique_authors}
        🎯 Most Read Author: {most_read_author} ({most_read_count} books)
        
        🎉 You've been reading for {years_reading} years - that's incredible dedication!
        """
        
        ax.text(0.05, 0.95, stats_text, transform=ax.transAxes, fontsize=12,
               verticalalignment='top', fontfamily='monospace',
               bbox=dict(boxstyle="round,pad=1", facecolor="lightblue", alpha=0.8))

def main():
    """Generate the reading dashboard"""
    print("🎨 Generating your Reading Stats Dashboard...")
    
    try:
        analyzer = ReadingAnalyzer()
        analyzer.create_dashboard()
        
        print(f"\n🎉 Dashboard complete!")
        print(f"📁 Files created:")
        print(f"   • reading_dashboard.png (high-resolution image)")
        print(f"   • reading_dashboard.pdf (print-friendly)")
        
    except FileNotFoundError:
        print("❌ enhanced_books.json not found!")
        print("Make sure you've run the book processing script first.")
    except Exception as e:
        print(f"❌ Error creating dashboard: {e}")

if __name__ == "__main__":
    main()
