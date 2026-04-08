import { Router } from 'express';
import { UserBehaviorController } from './user-behavior.controller';

const router = Router();

// POST /api/behavior - Track user behavior
router.post('/', UserBehaviorController.trackBehavior);

// GET /api/behavior/user/:email - Get user behavior with optional filters
router.get('/user/:email', UserBehaviorController.getUserBehavior);

// GET /api/behavior/movie/:movieId - Get movie behavior with optional filters
router.get('/movie/:movieId', UserBehaviorController.getMovieBehavior);

// GET /api/behavior/analytics/user/:email - Get user behavior analytics
router.get('/analytics/user/:email', UserBehaviorController.getUserBehaviorAnalytics);

// GET /api/behavior/analytics/movie/:movieId - Get movie behavior analytics
router.get('/analytics/movie/:movieId', UserBehaviorController.getMovieBehaviorAnalytics);

// DELETE /api/behavior/:id - Delete behavior record
router.delete('/:id', UserBehaviorController.deleteBehavior);

export default router;