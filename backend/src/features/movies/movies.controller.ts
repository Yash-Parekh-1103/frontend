import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import db from '../../database/connection';
import { movies, createMovieSchema, updateMovieSchema } from '../../database/schema';
import { z } from 'zod';

export class MoviesController {
  // GET /api/movies - Get all movies
  static async getAllMovies(req: Request, res: Response) {
    try {
      const allMovies = await db.select().from(movies);

      res.status(200).json({
        success: true,
        data: allMovies,
        count: allMovies.length
      });
    } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch movies',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/movies/:id - Get movie by ID
  static async getMovieById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      // Validate UUID format
      if (!z.string().uuid().safeParse(id).success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid movie ID format'
        });
      }

      const movie = await db.select().from(movies).where(eq(movies.id, id));

      if (movie.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }

      res.status(200).json({
        success: true,
        data: movie[0]
      });
    } catch (error) {
      console.error('Error fetching movie:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch movie',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // POST /api/movies - Create new movie
  static async createMovie(req: Request, res: Response) {
    try {
      // Validate request body
      const validationResult = createMovieSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.issues
        });
      }

      const movieData = validationResult.data;

      // Insert movie into database
      const newMovie = await db.insert(movies).values(movieData).returning();

      res.status(201).json({
        success: true,
        message: 'Movie created successfully',
        data: newMovie[0]
      });
    } catch (error) {
      console.error('Error creating movie:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create movie',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // PUT /api/movies/:id - Update movie
  static async updateMovie(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      // Validate UUID format
      if (!z.string().uuid().safeParse(id).success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid movie ID format'
        });
      }

      // Validate request body
      const validationResult = updateMovieSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.issues
        });
      }

      const updateData = validationResult.data;

      // Convert averageRating to string if present (Drizzle decimal expects string)
      const updateDataForDb: any = {
        ...updateData,
        ...(updateData.averageRating !== undefined && {
          averageRating: updateData.averageRating.toString()
        })
      };

      // Check if movie exists
      const existingMovie = await db.select().from(movies).where(eq(movies.id, id));

      if (existingMovie.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }

      // Update movie
      const updatedMovie = await db
        .update(movies)
        .set(updateDataForDb)
        .where(eq(movies.id, id))
        .returning();

      res.status(200).json({
        success: true,
        message: 'Movie updated successfully',
        data: updatedMovie[0]
      });
    } catch (error) {
      console.error('Error updating movie:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update movie',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // DELETE /api/movies/:id - Delete movie
  static async deleteMovie(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      // Validate UUID format
      if (!z.string().uuid().safeParse(id).success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid movie ID format'
        });
      }

      // Check if movie exists
      const existingMovie = await db.select().from(movies).where(eq(movies.id, id));

      if (existingMovie.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }

      // Delete movie
      await db.delete(movies).where(eq(movies.id, id));

      res.status(200).json({
        success: true,
        message: 'Movie deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting movie:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete movie',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/movies/user/:email - Get movies by user email
  static async getMoviesByUser(req: Request, res: Response) {
    try {
      const email = req.params.email as string;

      // Validate email format
      if (!z.string().email().safeParse(email).success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      const userMovies = await db.select().from(movies).where(eq(movies.uploadedBy, email));

      res.status(200).json({
        success: true,
        data: userMovies,
        count: userMovies.length
      });
    } catch (error) {
      console.error('Error fetching user movies:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user movies',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/movies/search/:query - Search movies by title or description
  static async searchMovies(req: Request, res: Response) {
    try {
      const query = req.params.query as string;

      if (!query || query.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      // Basic text search (you can enhance this with full-text search later)
      const searchResults = await db
        .select()
        .from(movies);

      // Filter results in JavaScript for now (consider moving to SQL for better performance)
      const filteredResults = searchResults.filter(movie =>
        movie.title?.toLowerCase().includes(query.toLowerCase()) ||
        movie.description?.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre?.toLowerCase().includes(query.toLowerCase())
      );

      res.status(200).json({
        success: true,
        data: filteredResults,
        count: filteredResults.length,
        query: query
      });
    } catch (error) {
      console.error('Error searching movies:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search movies',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}