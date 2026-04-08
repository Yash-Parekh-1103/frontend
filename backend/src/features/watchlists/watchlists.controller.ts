import { Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import db from '../../database/connection';
import { watchlists, movies, addToWatchlistSchema } from '../../database/schema';
import { z } from 'zod';

export class WatchlistsController {
  // GET /api/watchlists/user/:email - Get all watchlist items for a user
  static async getUserWatchlist(req: Request, res: Response) {
    try {
      const email = req.params.email as string;

      // Validate email format
      if (!z.string().email().safeParse(email).success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Get watchlist items with movie details
      const userWatchlist = await db
        .select({
          id: watchlists.id,
          userEmail: watchlists.userEmail,
          movieId: watchlists.movieId,
          addedAt: watchlists.addedAt,
          movie: {
            id: movies.id,
            title: movies.title,
            description: movies.description,
            genre: movies.genre,
            releaseYear: movies.releaseYear,
            downloadUrl: movies.downloadUrl,
            posterUrl: movies.posterUrl,
            duration: movies.duration,
            uploadedBy: movies.uploadedBy,
            averageRating: movies.averageRating
          }
        })
        .from(watchlists)
        .innerJoin(movies, eq(watchlists.movieId, movies.id))
        .where(eq(watchlists.userEmail, email));

      res.status(200).json({
        success: true,
        data: userWatchlist,
        count: userWatchlist.length
      });
    } catch (error) {
      console.error('Error fetching user watchlist:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user watchlist',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // POST /api/watchlists - Add movie to watchlist
  static async addToWatchlist(req: Request, res: Response) {
    try {
      // Validate request body
      const validationResult = addToWatchlistSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.issues
        });
      }

      const { userEmail, movieId } = validationResult.data;

      // Check if movie exists
      const existingMovie = await db.select().from(movies).where(eq(movies.id, movieId));

      if (existingMovie.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }

      // Check if movie is already in user's watchlist
      const existingWatchlistItem = await db
        .select()
        .from(watchlists)
        .where(and(eq(watchlists.userEmail, userEmail), eq(watchlists.movieId, movieId)));

      if (existingWatchlistItem.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Movie already in watchlist'
        });
      }

      // Add to watchlist
      const newWatchlistItem = await db
        .insert(watchlists)
        .values({ userEmail, movieId })
        .returning();

      res.status(201).json({
        success: true,
        message: 'Movie added to watchlist successfully',
        data: newWatchlistItem[0]
      });
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add movie to watchlist',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // DELETE /api/watchlists/:id - Remove movie from watchlist by watchlist item ID
  static async removeFromWatchlist(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      // Validate UUID format
      if (!z.string().uuid().safeParse(id).success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid watchlist item ID format'
        });
      }

      // Check if watchlist item exists
      const existingItem = await db.select().from(watchlists).where(eq(watchlists.id, id));

      if (existingItem.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Watchlist item not found'
        });
      }

      // Delete watchlist item
      await db.delete(watchlists).where(eq(watchlists.id, id));

      res.status(200).json({
        success: true,
        message: 'Movie removed from watchlist successfully'
      });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove movie from watchlist',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // DELETE /api/watchlists/user/:email/movie/:movieId - Remove specific movie from user's watchlist
  static async removeMovieFromUserWatchlist(req: Request, res: Response) {
    try {
      const email = req.params.email as string;
      const movieId = req.params.movieId as string;

      // Validate email format
      if (!z.string().email().safeParse(email).success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Validate UUID format
      if (!z.string().uuid().safeParse(movieId).success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid movie ID format'
        });
      }

      // Check if watchlist item exists
      const existingItem = await db
        .select()
        .from(watchlists)
        .where(and(eq(watchlists.userEmail, email), eq(watchlists.movieId, movieId)));

      if (existingItem.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found in user watchlist'
        });
      }

      // Delete watchlist item
      await db
        .delete(watchlists)
        .where(and(eq(watchlists.userEmail, email), eq(watchlists.movieId, movieId)));

      res.status(200).json({
        success: true,
        message: 'Movie removed from watchlist successfully'
      });
    } catch (error) {
      console.error('Error removing movie from user watchlist:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove movie from watchlist',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/watchlists/movie/:movieId - Get all users who have this movie in their watchlist
  static async getMovieWatchlistUsers(req: Request, res: Response) {
    try {
      const movieId = req.params.movieId as string;

      // Validate UUID format
      if (!z.string().uuid().safeParse(movieId).success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid movie ID format'
        });
      }

      // Check if movie exists
      const existingMovie = await db.select().from(movies).where(eq(movies.id, movieId));

      if (existingMovie.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }

      // Get all users who have this movie in their watchlist
      const movieWatchlists = await db
        .select()
        .from(watchlists)
        .where(eq(watchlists.movieId, movieId));

      res.status(200).json({
        success: true,
        data: movieWatchlists,
        count: movieWatchlists.length
      });
    } catch (error) {
      console.error('Error fetching movie watchlist users:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch movie watchlist users',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}