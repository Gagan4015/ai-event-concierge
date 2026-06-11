const express = require('express');
const { body, param, query } = require('express-validator');
const rateLimit = require('express-rate-limit');
const {
  createEventSearch,
  getEventHistory,
  getEventById,
  deleteEvent,
  getStats,
} = require('../controllers/eventController');

const router = express.Router();

// Strict rate limiter for AI endpoint
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { success: false, message: 'Too many AI requests. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/events/search - Generate AI venue proposal
router.post(
  '/search',
  aiLimiter,
  [
    body('query')
      .trim()
      .notEmpty()
      .withMessage('Event description is required')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Query must be between 10 and 1000 characters'),
  ],
  createEventSearch
);

// GET /api/events/history - Get search history
router.get(
  '/history',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be 1-50'),
  ],
  getEventHistory
);

// GET /api/events/stats - Get statistics
router.get('/stats', getStats);

// GET /api/events/:id - Get single event
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid event ID')],
  getEventById
);

// DELETE /api/events/:id - Delete single event
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid event ID')],
  deleteEvent
);

module.exports = router;
