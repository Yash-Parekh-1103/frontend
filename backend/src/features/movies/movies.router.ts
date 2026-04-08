import { Router } from 'express';
import { MoviesController } from './movies.controller';

const router = Router();

// GET /api/movies - Get all movies
router.get('/', MoviesController.getAllMovies);

// GET /api/movies/search/:query - Search movies (must be before /:id to avoid conflicts)
router.get('/search/:query', MoviesController.searchMovies);

// GET /api/movies/user/:email - Get movies by user email
router.get('/user/:email', MoviesController.getMoviesByUser);

// GET /api/movies/:id - Get movie by ID
router.get('/:id', MoviesController.getMovieById);

// POST /api/movies - Create new movie
router.post('/', MoviesController.createMovie);

// PUT /api/movies/:id - Update movie
router.put('/:id', MoviesController.updateMovie);

// DELETE /api/movies/:id - Delete movie
router.delete('/:id', MoviesController.deleteMovie);

export default router;