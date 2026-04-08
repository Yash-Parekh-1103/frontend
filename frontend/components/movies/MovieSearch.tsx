'use client';

import { useState, useEffect, useRef } from 'react';
import { useMovieSearch } from '../../hook/useMovies';
import { Movie } from '../../types/movie';
import MovieCard from './MovieCard';

interface MovieSearchProps {
  onMovieView?: (movieId: string) => void;
  onMovieEdit?: (movie: Movie) => void;
  placeholder?: string;
  showResults?: boolean;
}

export default function MovieSearch({
  onMovieView,
  onMovieEdit,
  placeholder = "Search movies by title, description, or genre...",
  showResults = true
}: MovieSearchProps) {
  const { results, loading, error, searchMovies, clearSearch } = useMovieSearch();
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        searchMovies(query);
        setShowDropdown(true);
      } else {
        clearSearch();
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchMovies, clearSearch]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (query.trim() && results.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleClear = () => {
    setQuery('');
    clearSearch();
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Searching...</span>
          </div>
        </div>
      )}

      {/* Search Dropdown Results */}
      {showDropdown && !loading && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
          {error ? (
            <div className="p-4 text-red-600 text-sm">
              {error}
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              <div className="text-xs text-gray-500 px-2 py-1 border-b">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </div>
              <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                {results.slice(0, 5).map((movie) => (
                  <div
                    key={movie.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => {
                      onMovieView?.(movie.id);
                      setShowDropdown(false);
                    }}
                  >
                    <div className="flex-shrink-0 w-12 h-16 bg-gray-200 rounded overflow-hidden">
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {movie.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {movie.genre} • {movie.releaseYear}
                      </p>
                      {movie.description && (
                        <p className="text-xs text-gray-400 truncate">
                          {movie.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {results.length > 5 && (
                  <div className="text-center py-2 border-t">
                    <span className="text-xs text-gray-500">
                      +{results.length - 5} more results
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 text-gray-500 text-sm text-center">
              No movies found for "{query}"
            </div>
          )}
        </div>
      )}

      {/* Full Results Grid (if showResults is true and not using dropdown) */}
      {showResults && !showDropdown && query.trim() && !loading && results.length > 0 && (
        <div className="mt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results for "{query}" ({results.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {results.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onEdit={onMovieEdit}
                onView={onMovieView}
                showActions={true}
                isOwner={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}