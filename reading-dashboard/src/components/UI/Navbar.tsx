import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, BookOpen, BarChart3, Search } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BookOpen },
    { path: '/books', label: 'Library', icon: Search },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white hover:text-book-brown dark:hover:text-book-tan transition-colors"
          >
            <BookOpen className="w-6 h-6" />
            <span>Reading Dashboard</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive(path)
                    ? 'text-book-brown dark:text-book-tan bg-book-tan/10 dark:bg-book-brown/10'
                    : 'text-gray-700 dark:text-gray-300 hover:text-book-brown dark:hover:text-book-tan'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-1 py-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive(path)
                    ? 'text-book-brown dark:text-book-tan bg-book-tan/10 dark:bg-book-brown/10'
                    : 'text-gray-700 dark:text-gray-300 hover:text-book-brown dark:hover:text-book-tan'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};