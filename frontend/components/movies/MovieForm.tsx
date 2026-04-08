'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { MovieFormData } from '../../types/movie';
import { useCreateMovie } from '../../hook/useMovies';
import { useCurrentUser } from '../../hook/useUser';

interface MovieFormProps {
  onSuccess?: (movieId: string) => void;
  onCancel?: () => void;
}

export default function MovieForm({ onSuccess, onCancel }: MovieFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm<MovieFormData>();

  const { createMovie, loading } = useCreateMovie();
  const { email } = useCurrentUser();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: MovieFormData) => {
    if (!email) {
      setSubmitError('You must be logged in to upload a movie');
      return;
    }

    try {
      setSubmitError(null);
      const newMovie = await createMovie({
        title: data.title,
        description: data.description || undefined,
        genre: data.genre || undefined,
        releaseYear: data.releaseYear || undefined,
        downloadUrl: data.downloadUrl,
        posterUrl: data.posterUrl || undefined,
        duration: data.duration || undefined,
        uploadedBy: email
      });

      if (newMovie) {
        reset();
        onSuccess?.(newMovie.id);
      }
    } catch (validationErrors: any) {
      // Handle validation errors from the API
      if (Array.isArray(validationErrors)) {
        validationErrors.forEach((error: any) => {
          if (error.path && error.path.length > 0) {
            const fieldName = error.path[0] as keyof MovieFormData;
            setError(fieldName, {
              type: 'server',
              message: error.message
            });
          }
        });
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Upload New Movie</h2>

      {submitError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 1, message: 'Title cannot be empty' }
            })}
            type="text"
            id="title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter movie title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter movie description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Genre and Release Year Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <input
              {...register('genre')}
              type="text"
              id="genre"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Action, Comedy, Drama"
            />
            {errors.genre && (
              <p className="mt-1 text-sm text-red-600">{errors.genre.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="releaseYear" className="block text-sm font-medium text-gray-700 mb-1">
              Release Year
            </label>
            <input
              {...register('releaseYear', {
                valueAsNumber: true,
                min: { value: 1900, message: 'Year must be 1900 or later' },
                max: { value: 2030, message: 'Year must be 2030 or earlier' }
              })}
              type="number"
              id="releaseYear"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="2024"
              min="1900"
              max="2030"
            />
            {errors.releaseYear && (
              <p className="mt-1 text-sm text-red-600">{errors.releaseYear.message}</p>
            )}
          </div>
        </div>

        {/* Download URL Field */}
        <div>
          <label htmlFor="downloadUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Download URL <span className="text-red-500">*</span>
          </label>
          <input
            {...register('downloadUrl', {
              required: 'Download URL is required',
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Must be a valid URL starting with http:// or https://'
              }
            })}
            type="url"
            id="downloadUrl"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/movie.mp4"
          />
          {errors.downloadUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.downloadUrl.message}</p>
          )}
        </div>

        {/* Poster URL Field */}
        <div>
          <label htmlFor="posterUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Poster URL
          </label>
          <input
            {...register('posterUrl', {
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Must be a valid URL starting with http:// or https://'
              }
            })}
            type="url"
            id="posterUrl"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/poster.jpg"
          />
          {errors.posterUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.posterUrl.message}</p>
          )}
        </div>

        {/* Duration Field */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes)
          </label>
          <input
            {...register('duration', {
              valueAsNumber: true,
              min: { value: 1, message: 'Duration must be at least 1 minute' }
            })}
            type="number"
            id="duration"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="120"
            min="1"
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading...' : 'Upload Movie'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}