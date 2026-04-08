// Types based on backend movie schema
export interface Movie {
  id: string;
  title: string;
  description?: string;
  genre?: string;
  releaseYear?: number;
  downloadUrl: string;
  posterUrl?: string;
  duration?: number; // in minutes
  uploadedBy: string; // email
  averageRating: string; // decimal as string
}

export interface NewMovie {
  title: string;
  description?: string;
  genre?: string;
  releaseYear?: number;
  downloadUrl: string;
  posterUrl?: string;
  duration?: number;
  uploadedBy: string;
}

export interface UpdateMovie {
  title?: string;
  description?: string;
  genre?: string;
  releaseYear?: number;
  downloadUrl?: string;
  posterUrl?: string;
  duration?: number;
  averageRating?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    code: string;
    path: string[];
    message: string;
  }>;
  count?: number;
  query?: string;
}

// Movie form data for react-hook-form
export interface MovieFormData {
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  downloadUrl: string;
  posterUrl: string;
  duration: number;
}