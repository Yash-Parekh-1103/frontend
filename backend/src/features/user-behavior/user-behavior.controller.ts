import { Request, Response } from 'express';
import { eq, and, desc } from 'drizzle-orm';
import db from '../../database/connection';
import { userBehavior, movies, trackBehaviorSchema } from '../../database/schema';
import { z } from 'zod';

export class UserBehaviorController {
  // POST /api/behavior - Track user behavior (view, like, download, add_to_playlist)
  static async trackBehavior(req: Request, res: Response) {
    try {
      // Validate request body
      const validationResult = trackBehaviorSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.issues
        });
      }

      const { userEmail, movieId, actionType } = validationResult.data;

      // Check if movie exists
      const existingMovie = await db.select().from(movies).where(eq(movies.id, movieId));

      if (existingMovie.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }

      // Track the behavior
      const newBehavior = await db
        .insert(userBehavior)
        .values({ userEmail, movieId, actionType })
        .returning();

      res.status(201).json({
        success: true,
        message: 'Behavior tracked successfully',
        data: newBehavior[0]
      });
    } catch (error) {
      console.error('Error tracking behavior:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to track behavior',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/behavior/user/:email - Get all behavior for a user
  static async getUserBehavior(req: Request, res: Response) {
    try {
      const email = req.params.email as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const actionType = req.query.actionType as string;

      // Validate email format
      if (!z.string().email().safeParse(email).success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Validate limit
      if (limit < 1 || limit > 1000) {
        return res.status(400).json({
          success: false,
          message: 'Limit must be between 1 and 1000'
        });
      }

      let query = db
        .select({
          id: userBehavior.id,
          userEmail: userBehavior.userEmail,
          movieId: userBehavior.movieId,
          actionType: userBehavior.actionType,
          createdAt: userBehavior.createdAt,
          movie: {
            id: movies.id,
            title: movies.title,
            description: movies.description,
            genre: movies.genre,
            releaseYear: movies.releaseYear,
            posterUrl: movies.posterUrl,
            duration: movies.duration,
            averageRating: movies.averageRating
          }
        })
        .from(userBehavior)
        .innerJoin(movies, eq(userBehavior.movieId, movies.id))
        .where(eq(userBehavior.userEmail, email))
        .orderBy(desc(userBehavior.createdAt))
        .limit(limit);

      // Add action type filter if provided
      if (actionType) {
        const validActionTypes = ['view', 'like', 'download', 'add_to_playlist'];
        if (!validActionTypes.includes(actionType)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid action type. Must be one of: view, like, download, add_to_playlist'
          });
        }

        query = db
          .select({
            id: userBehavior.id,
            userEmail: userBehavior.userEmail,
            movieId: userBehavior.movieId,
            actionType: userBehavior.actionType,
            createdAt: userBehavior.createdAt,
            movie: {
              id: movies.id,
              title: movies.title,
              description: movies.description,
              genre: movies.genre,
              releaseYear: movies.releaseYear,
              posterUrl: movies.posterUrl,
              duration: movies.duration,
              averageRating: movies.averageRating
            }
          })
          .from(userBehavior)
          .innerJoin(movies, eq(userBehavior.movieId, movies.id))
          .where(and(eq(userBehavior.userEmail, email), eq(userBehavior.actionType, actionType)))
          .orderBy(desc(userBehavior.createdAt))
          .limit(limit);
      }

      const behaviors = await query;

      res.status(200).json({
        success: true,
        data: behaviors,
        count: behaviors.length,
        filters: {
          userEmail: email,
          actionType: actionType || 'all',
          limit
        }
      });
    } catch (error) {
      console.error('Error fetching user behavior:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user behavior',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/behavior/movie/:movieId - Get all behavior for a movie
  static async getMovieBehavior(req: Request, res: Response) {
    try {
      const movieId = req.params.movieId as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const actionType = req.query.actionType as string;

      // Validate UUID format
      if (!z.string().uuid().safeParse(movieId).success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid movie ID format'
        });
      }

      // Validate limit
      if (limit < 1 || limit > 1000) {
        return res.status(400).json({
          success: false,
          message: 'Limit must be between 1 and 1000'
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

      let query = db
        .select()
        .from(userBehavior)
        .where(eq(userBehavior.movieId, movieId))
        .orderBy(desc(userBehavior.createdAt))
        .limit(limit);

      // Add action type filter if provided
      if (actionType) {
        const validActionTypes = ['view', 'like', 'download', 'add_to_playlist'];
        if (!validActionTypes.includes(actionType)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid action type. Must be one of: view, like, download, add_to_playlist'
          });
        }

        query = db
          .select()
          .from(userBehavior)
          .where(and(eq(userBehavior.movieId, movieId), eq(userBehavior.actionType, actionType)))
          .orderBy(desc(userBehavior.createdAt))
          .limit(limit);
      }

      const behaviors = await query;

      res.status(200).json({
        success: true,
        data: behaviors,
        count: behaviors.length,
        filters: {
          movieId,
          actionType: actionType || 'all',
          limit
        }
      });
    } catch (error) {
      console.error('Error fetching movie behavior:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch movie behavior',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/behavior/analytics/user/:email - Get user behavior analytics (aggregated data)
  static async getUserBehaviorAnalytics(req: Request, res: Response) {
    try {
      const email = req.params.email as string;

      // Validate email format
      if (!z.string().email().safeParse(email).success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Get all behavior for the user
      const allBehavior = await db
        .select()
        .from(userBehavior)
        .where(eq(userBehavior.userEmail, email));

      // Calculate analytics
      const analytics = {
        totalActions: allBehavior.length,
        actionBreakdown: {
          views: allBehavior.filter(b => b.actionType === 'view').length,
          likes: allBehavior.filter(b => b.actionType === 'like').length,
          downloads: allBehavior.filter(b => b.actionType === 'download').length,
          playlist_additions: allBehavior.filter(b => b.actionType === 'add_to_playlist').length
        },
        uniqueMovies: new Set(allBehavior.map(b => b.movieId)).size,
        mostWatchedMovies: Object.entries(
          allBehavior
            .filter(b => b.actionType === 'view')
            .reduce((acc, b) => {
              acc[b.movieId] = (acc[b.movieId] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
        )
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([movieId, count]) => ({ movieId, viewCount: count })),
        recentActivity: allBehavior
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10)
      };

      res.status(200).json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Error fetching user behavior analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user behavior analytics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/behavior/analytics/movie/:movieId - Get movie behavior analytics
  static async getMovieBehaviorAnalytics(req: Request, res: Response) {
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

      // Get all behavior for the movie
      const allBehavior = await db
        .select()
        .from(userBehavior)
        .where(eq(userBehavior.movieId, movieId));

      // Calculate analytics
      const analytics = {
        totalActions: allBehavior.length,
        actionBreakdown: {
          views: allBehavior.filter(b => b.actionType === 'view').length,
          likes: allBehavior.filter(b => b.actionType === 'like').length,
          downloads: allBehavior.filter(b => b.actionType === 'download').length,
          playlist_additions: allBehavior.filter(b => b.actionType === 'add_to_playlist').length
        },
        uniqueUsers: new Set(allBehavior.map(b => b.userEmail)).size,
        topUsers: Object.entries(
          allBehavior.reduce((acc, b) => {
            acc[b.userEmail] = (acc[b.userEmail] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        )
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([userEmail, count]) => ({ userEmail, actionCount: count })),
        recentActivity: allBehavior
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10)
      };

      res.status(200).json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Error fetching movie behavior analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch movie behavior analytics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // DELETE /api/behavior/:id - Delete specific behavior record (admin only)
  static async deleteBehavior(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      // Validate UUID format
      if (!z.string().uuid().safeParse(id).success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid behavior ID format'
        });
      }

      // Check if behavior record exists
      const existingBehavior = await db.select().from(userBehavior).where(eq(userBehavior.id, id));

      if (existingBehavior.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Behavior record not found'
        });
      }

      // Delete behavior record
      await db.delete(userBehavior).where(eq(userBehavior.id, id));

      res.status(200).json({
        success: true,
        message: 'Behavior record deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting behavior record:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete behavior record',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}