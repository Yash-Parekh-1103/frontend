'use client';

import { Movie } from '../../types/movie';

interface MovieCardProps {
  movie: Movie;
  onEdit?: (movie: Movie) => void;
  onDelete?: (movieId: string) => void;
  onView?: (movieId: string) => void;
  showActions?: boolean;
  isOwner?: boolean;
}

export default function MovieCard({
  movie,
  onEdit,
  onDelete,
  onView,
  showActions = true,
  isOwner = false
}: MovieCardProps) {
  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  };

  const formatRating = (rating: string) => {
    const num = parseFloat(rating);
    return num > 0 ? num.toFixed(1) : 'No rating';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Movie Poster */}
      <div className="aspect-[2/3] bg-gray-200 overflow-hidden">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-movie.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <span className="text-gray-600 text-lg font-medium">No Image</span>
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {movie.title}
        </h3>

        <div className="space-y-1 text-sm text-gray-600 mb-3">
          {movie.genre && (
            <p><span className="font-medium">Genre:</span> {movie.genre}</p>
          )}
          {movie.releaseYear && (
            <p><span className="font-medium">Year:</span> {movie.releaseYear}</p>
          )}
          <p><span className="font-medium">Duration:</span> {formatDuration(movie.duration)}</p>
          <p><span className="font-medium">Rating:</span> ⭐ {formatRating(movie.averageRating)}</p>
        </div>

        {movie.description && (
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {movie.description}
          </p>
        )}

        <p className="text-xs text-gray-500 mb-3">
          Uploaded by: {movie.uploadedBy}
        </p>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={() => onView?.(movie.id)}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Watch
            </button>

            {isOwner && onEdit && (
              <button
                onClick={() => onEdit(movie)}
                className="px-3 py-2 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600 transition-colors"
              >
                Edit
              </button>
            )}

            {isOwner && onDelete && (
              <button
                onClick={() => onDelete(movie.id)}
                className="px-3 py-2 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}