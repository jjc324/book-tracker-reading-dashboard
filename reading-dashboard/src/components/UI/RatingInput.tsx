import { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const RatingInput = ({
  value,
  onChange,
  readOnly = false,
  size = 'md',
  showLabel = true
}: RatingInputProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const iconSize = sizeClasses[size];
  const displayRating = hoverRating !== null ? hoverRating : value;

  const handleClick = (rating: number) => {
    if (!readOnly) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readOnly) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-1"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            disabled={readOnly}
            className={`
              transition-all duration-150
              ${!readOnly ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
              ${!readOnly ? 'focus:outline-none focus:ring-2 focus:ring-book-brown rounded' : ''}
            `}
            aria-label={`Rate ${rating} stars`}
          >
            <Star
              className={`
                ${iconSize}
                transition-colors duration-150
                ${rating <= displayRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
                }
                ${!readOnly && hoverRating !== null && rating <= hoverRating
                  ? 'fill-yellow-300 text-yellow-300'
                  : ''
                }
              `}
            />
          </button>
        ))}
      </div>

      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem]">
          {value > 0 ? `${value}/5` : 'Not rated'}
        </span>
      )}
    </div>
  );
};
