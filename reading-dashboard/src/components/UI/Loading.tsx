import { BookOpen } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

export const Loading = ({ message = 'Loading...' }: LoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-600 dark:text-gray-400">
      <div className="relative">
        <BookOpen className="w-8 h-8 animate-pulse" />
        <div className="absolute inset-0 w-8 h-8 border-2 border-book-brown/30 dark:border-book-tan/30 border-t-book-brown dark:border-t-book-tan rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-medium">{message}</p>
    </div>
  );
};