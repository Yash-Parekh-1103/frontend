import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import api from '../lib/api';
import { Movie, NewMovie, UpdateMovie, ApiResponse } from '../types/movie';

// Hook for fetching all movies
export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<Movie[]>>('/movies');
      if (response.data.success && response.data.data) {
        setMovies(response.data.data);
      }
    } catch (err) {
      const error = err as AxiosError<ApiResponse<any>>;
      setError(error.response?.data?.message || 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return { movies, loading, error, refetch: fetchMovies };
};

// Hook for fetching a single movie
export const useMovie = (id: string | null) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovie = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<Movie>>(`/movies/${id}`);
      if (response.data.success && response.data.data) {
        setMovie(response.data.data);
      }
    } catch (err) {
      const error = err as AxiosError<ApiResponse<any>>;
      setError(error.response?.data?.message || 'Failed to fetch movie');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  return { movie, loading, error, refetch: fetchMovie };
};

// Hook for creating a movie
export const useCreateMovie = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMovie = async (movieData: NewMovie): Promise<Movie | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<ApiResponse<Movie>>('/movies', movieData);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (err) {
      const error = err as AxiosError<ApiResponse<any>>;
      setError(error.response?.data?.message || 'Failed to create movie');
      // If there are validation errors, throw them for the form to handle
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createMovie, loading, error };
};

// Hook for updating a movie
export const useUpdateMovie = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMovie = async (id: string, movieData: UpdateMovie): Promise<Movie | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put<ApiResponse<Movie>>(`/movies/${id}`, movieData);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (err) {
      const error = err as AxiosError<ApiResponse<any>>;
      setError(error.response?.data?.message || 'Failed to update movie');
      // If there are validation errors, throw them for the form to handle
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateMovie, loading, error };
};

// Hook for deleting a movie
export const useDeleteMovie = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteMovie = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete<ApiResponse<void>>(`/movies/${id}`);
      return response.data.success;
    } catch (err) {
      const error = err as AxiosError<ApiResponse<any>>;
      setError(error.response?.data?.message || 'Failed to delete movie');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteMovie, loading, error };
};

// Hook for fetching movies by user
export const useMoviesByUser = (email: string | null) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMoviesByUser = async () => {
    if (!email) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<Movie[]>>(`/movies/user/${encodeURIComponent(email)}`);
      if (response.data.success && response.data.data) {
        setMovies(response.data.data);
      }
    } catch (err) {
      const error = err as AxiosError<ApiResponse<any>>;
      setError(error.response?.data?.message || 'Failed to fetch user movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoviesByUser();
  }, [email]);

  return { movies, loading, error, refetch: fetchMoviesByUser };
};

// Hook for searching movies
export const useMovieSearch = () => {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMovies = async (query: string): Promise<Movie[]> => {
    if (!query.trim()) {
      setResults([]);
      return [];
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<Movie[]>>(`/movies/search/${encodeURIComponent(query.trim())}`);
      if (response.data.success && response.data.data) {
        setResults(response.data.data);
        return response.data.data;
      }
      setResults([]);
      return [];
    } catch (err) {
      const error = err as AxiosError<ApiResponse<any>>;
      setError(error.response?.data?.message || 'Failed to search movies');
      setResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setResults([]);
    setError(null);
  };

  return { results, loading, error, searchMovies, clearSearch };
};