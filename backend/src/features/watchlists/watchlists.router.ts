import { Router } from 'express';
import { WatchlistsController } from './watchlists.controller';

const router = Router();

// GET /api/watchlists/user/:email - Get user's watchlist
router.get('/user/:email', WatchlistsController.getUserWatchlist);

// GET /api/watchlists/movie/:movieId - Get users who have this movie in watchlist
router.get('/movie/:movieId', WatchlistsController.getMovieWatchlistUsers);

// POST /api/watchlists - Add movie to watchlist
router.post('/', WatchlistsController.addToWatchlist);

// DELETE /api/watchlists/:id - Remove from watchlist by watchlist item ID
router.delete('/:id', WatchlistsController.removeFromWatchlist);

// DELETE /api/watchlists/user/:email/movie/:movieId - Remove specific movie from user's watchlist
router.delete('/user/:email/movie/:movieId', WatchlistsController.removeMovieFromUserWatchlist);

export default router;