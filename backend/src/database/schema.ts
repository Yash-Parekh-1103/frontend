import { pgTable, uuid, varchar, text, integer, decimal, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { sql } from 'drizzle-orm';

// Movies table
export const movies = pgTable('movies', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  genre: varchar('genre', { length: 100 }),
  releaseYear: integer('release_year'),
  downloadUrl: varchar('download_url', { length: 500 }).notNull(),
  posterUrl: varchar('poster_url', { length: 500 }),
  duration: integer('duration'), // duration in minutes
  uploadedBy: varchar('uploaded_by', { length: 255 }).notNull(), // email from Clerk
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0.00'),
});

// User watchlists (playlists)
export const watchlists = pgTable('watchlists', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userEmail: varchar('user_email', { length: 255 }).notNull(), // email from Clerk
  movieId: uuid('movie_id').references(() => movies.id).notNull(),
  addedAt: timestamp('added_at').defaultNow().notNull(),
});

// User behavior for AI features
export const userBehavior = pgTable('user_behavior', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userEmail: varchar('user_email', { length: 255 }).notNull(), // email from Clerk
  movieId: uuid('movie_id').references(() => movies.id).notNull(),
  actionType: varchar('action_type', { length: 50 }).notNull(), // 'view', 'like', 'download', 'add_to_playlist'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Zod schemas for validation
export const insertMovieSchema = createInsertSchema(movies, {
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  genre: z.string().max(100).optional(),
  releaseYear: z.number().int().min(1900).max(2030).optional(),
  downloadUrl: z.string().url("Must be a valid URL").max(500),
  posterUrl: z.string().url("Must be a valid URL").max(500).optional(),
  duration: z.number().int().min(1).optional(),
  uploadedBy: z.string().email("Must be a valid email").max(255),
  averageRating: z.number().min(0).max(10).optional(),
});

export const selectMovieSchema = createSelectSchema(movies);

export const insertWatchlistSchema = createInsertSchema(watchlists, {
  userEmail: z.string().email("Must be a valid email").max(255),
  movieId: z.string().uuid("Must be a valid UUID"),
});

export const selectWatchlistSchema = createSelectSchema(watchlists);

export const insertUserBehaviorSchema = createInsertSchema(userBehavior, {
  userEmail: z.string().email("Must be a valid email").max(255),
  movieId: z.string().uuid("Must be a valid UUID"),
  actionType: z.enum(['view', 'like', 'download', 'add_to_playlist']),
});

export const selectUserBehaviorSchema = createSelectSchema(userBehavior);

// Custom validation schemas for API requests
export const createMovieSchema = insertMovieSchema.omit({
  id: true,
  averageRating: true
});

export const updateMovieSchema = insertMovieSchema.partial().omit({
  id: true,
  uploadedBy: true
});

export const addToWatchlistSchema = insertWatchlistSchema.omit({
  id: true,
  addedAt: true
});

export const trackBehaviorSchema = insertUserBehaviorSchema.omit({
  id: true,
  createdAt: true
});

// TypeScript types inferred from Drizzle tables
export type Movie = typeof movies.$inferSelect;
export type NewMovie = typeof movies.$inferInsert;
export type Watchlist = typeof watchlists.$inferSelect;
export type NewWatchlist = typeof watchlists.$inferInsert;
export type UserBehavior = typeof userBehavior.$inferSelect;
export type NewUserBehavior = typeof userBehavior.$inferInsert;

// Zod schema types for API validation
export type CreateMovieInput = z.infer<typeof createMovieSchema>;
export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;
export type AddToWatchlistInput = z.infer<typeof addToWatchlistSchema>;
export type TrackBehaviorInput = z.infer<typeof trackBehaviorSchema>;