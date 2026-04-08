'use client';

import { useState, useEffect } from 'react';
import { Movie } from '../../types/movie';
import { useMovies, useDeleteMovie } from '../../hook/useMovies';
import { useCurrentUser } from '../../hook/useUser';
import MovieCard from './MovieCard';

interface MovieListProps {
  movies?: Movie[]; // Optional external movies
  showUserMoviesOnly?: boolean; // Show only current user's movies
  onMovieEdit?: (movie: Movie) => void;
  onMovieView?: (movieId: string) => void;
}

export default function MovieList({
  movies: externalMovies,
  showUserMoviesOnly = false,
  onMovieEdit,
  onMovieView
}: MovieListProps) {
  const { movies: allMovies, loading: loadingAll, error: errorAll, refetch } = useMovies();
  const { deleteMovie, loading: deleting } = useDeleteMovie();
  const { email } = useCurrentUser();

  const [displayMovies, setDisplayMovies] = useState<Movie[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Determine which movies to display
  useEffect(() => {
    if (externalMovies) {
      setDisplayMovies(externalMovies);
    } else if (showUserMoviesOnly && email) {
      // Filter movies by current user
      setDisplayMovies(allMovies.filter(movie => movie.uploadedBy === email));
    } else {
      setDisplayMovies(allMovies);
    }
  }, [externalMovies, allMovies, showUserMoviesOnly, email]);

  const handleDelete = async (movieId: string) => {
    if (deleteConfirm === movieId) {
      // Perform delete
      const success = await deleteMovie(movieId);
      if (success) {
        // Refresh the movie list
        refetch();
        setDeleteConfirm(null);
      }
    } else {
      // Show confirmation
      setDeleteConfirm(movieId);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const isMovieOwner = (movie: Movie): boolean => {
    return email !== null && movie.uploadedBy === email;
  };

  if (loadingAll && !externalMovies) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (errorAll && !externalMovies) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 mb-4">{errorAll}</div>
        <button
          onClick={refetch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (displayMovies.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-500 mb-4">
          {showUserMoviesOnly ? 'You haven\'t uploaded any movies yet.' : 'No movies available.'}
        </div>
        {showUserMoviesOnly && (
          <p className="text-sm text-gray-400">
            Upload your first movie to get started!
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this movie? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {displayMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onEdit={onMovieEdit}
            onDelete={handleDelete}
            onView={onMovieView}
            showActions={true}
            isOwner={isMovieOwner(movie)}
          />
        ))}
      </div>

      {/* Load More Button (for future pagination) */}
      {displayMovies.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Showing {displayMovies.length} movie{displayMovies.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}