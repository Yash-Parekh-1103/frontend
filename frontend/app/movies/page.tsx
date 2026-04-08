'use client';

import { useState } from 'react';
import { Movie } from '../../types/movie';
import MovieForm from '../../components/movies/MovieForm';
import MovieList from '../../components/movies/MovieList';
import MovieSearch from '../../components/movies/MovieSearch';
import { useCurrentUser } from '../../hook/useUser';

type ViewMode = 'all' | 'my-movies' | 'upload' | 'search';

export default function MoviesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const { email, isLoaded } = useCurrentUser();

  const handleMovieUploadSuccess = (movieId: string) => {
    console.log('Movie uploaded successfully:', movieId);
    setViewMode('all'); // Switch to all movies view to see the new movie
  };

  const handleMovieEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setViewMode('upload'); // Use the same form for editing
  };

  const handleMovieView = (movieId: string) => {
    console.log('View movie:', movieId);
    // In a real app, this would navigate to the movie detail page
    alert(`Would navigate to movie ${movieId}`);
  };

  const handleCancelUpload = () => {
    setEditingMovie(null);
    setViewMode('all');
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Movie Platform</h1>

          {/* Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-lg font-medium ${
                viewMode === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All Movies
            </button>
            <button
              onClick={() => setViewMode('search')}
              className={`px-4 py-2 rounded-lg font-medium ${
                viewMode === 'search'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Search
            </button>
            {email && (
              <>
                <button
                  onClick={() => setViewMode('my-movies')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    viewMode === 'my-movies'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  My Movies
                </button>
                <button
                  onClick={() => {
                    setEditingMovie(null);
                    setViewMode('upload');
                  }}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    viewMode === 'upload'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Upload Movie
                </button>
              </>
            )}
          </div>

          {/* User Info */}
          <div className="text-sm text-gray-600">
            {email ? (
              <p>Logged in as: <span className="font-medium">{email}</span></p>
            ) : (
              <p className="text-yellow-600">Please sign in to upload movies</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {viewMode === 'search' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Movies</h2>
              <MovieSearch
                onMovieView={handleMovieView}
                onMovieEdit={handleMovieEdit}
                showResults={true}
              />
            </div>
          )}

          {viewMode === 'upload' && (
            <div>
              <MovieForm
                onSuccess={handleMovieUploadSuccess}
                onCancel={handleCancelUpload}
              />
            </div>
          )}

          {viewMode === 'all' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">All Movies</h2>
              <MovieList
                onMovieEdit={handleMovieEdit}
                onMovieView={handleMovieView}
              />
            </div>
          )}

          {viewMode === 'my-movies' && email && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Movies</h2>
              <MovieList
                showUserMoviesOnly={true}
                onMovieEdit={handleMovieEdit}
                onMovieView={handleMovieView}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}