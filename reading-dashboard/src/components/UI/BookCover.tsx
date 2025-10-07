import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface BookCoverProps {
  title: string;
  author: string;
  className?: string;
  showPlaceholder?: boolean;
}

export const BookCover = ({ title, author, className = '', showPlaceholder = true }: BookCoverProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Construct Open Library cover URL
  // Format: https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg
  // For now, we'll use a placeholder since we don't have ISBNs
  // In production, you'd store ISBNs in your data and use them here

  // Alternative: Use Google Books API search
  const getCoverUrl = () => {
    // This is a simplified approach - in production you'd want to:
    // 1. Store ISBN in your book data
    // 2. Use Open Library API: https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg
    // 3. Or use Google Books API with title/author search

    // For now, return null to show placeholder
    return null;
  };

  const coverUrl = getCoverUrl();

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Placeholder gradient background
  const PlaceholderCover = () => (
    <div className={`
      ${className}
      bg-gradient-to-br from-book-tan to-book-brown
      flex flex-col items-center justify-center
      text-white
      p-4
      shadow-lg
    `}>
      <BookOpen className="w-12 h-12 mb-3 opacity-80" />
      <div className="text-center">
        <p className="text-sm font-semibold line-clamp-3 mb-1">
          {title}
        </p>
        <p className="text-xs opacity-75 line-clamp-2">
          {author}
        </p>
      </div>
    </div>
  );

  // If no cover URL or error, show placeholder
  if (!coverUrl || imageError || !showPlaceholder) {
    return <PlaceholderCover />;
  }

  return (
    <div className={`relative ${className}`}>
      {!imageLoaded && <PlaceholderCover />}
      <img
        src={coverUrl}
        alt={`Cover of ${title} by ${author}`}
        className={`
          ${className}
          object-cover
          shadow-lg
          transition-opacity duration-300
          ${imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}
        `}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};
