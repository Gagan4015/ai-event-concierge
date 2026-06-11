const { validationResult } = require('express-validator');
const EventSearch = require('../models/EventSearch');
const { generateVenueProposal } = require('../utils/openaiService');

// POST /api/events/search
const createEventSearch = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { query } = req.body;

    // Generate AI proposal
    const aiResult = await generateVenueProposal(query);

    // Save to MongoDB
    const eventSearch = await EventSearch.create({
      userQuery: query,
      parsedIntent: aiResult.parsedIntent,
      proposal: aiResult.proposal,
      alternativeVenues: aiResult.alternativeVenues,
      aiModel: aiResult.aiModel,
      processingTimeMs: aiResult.processingTimeMs,
      status: 'success',
    });

    return res.status(201).json({
      success: true,
      message: 'Venue proposal generated successfully',
      data: eventSearch,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/events/history
const getEventHistory = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      EventSearch.find({ status: 'success' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      EventSearch.countDocuments({ status: 'success' }),
    ]);

    return res.json({
      success: true,
      data: events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/events/:id
const getEventById = async (req, res, next) => {
  try {
    const event = await EventSearch.findById(req.params.id).lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event search not found',
      });
    }

    return res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/events/:id
const deleteEvent = async (req, res, next) => {
  try {
    const event = await EventSearch.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event search not found',
      });
    }

    return res.json({
      success: true,
      message: 'Event search deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/events/stats
const getStats = async (req, res, next) => {
  try {
    const [total, today] = await Promise.all([
      EventSearch.countDocuments({ status: 'success' }),
      EventSearch.countDocuments({
        status: 'success',
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
    ]);

    return res.json({
      success: true,
      data: { totalSearches: total, searchesToday: today },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEventSearch,
  getEventHistory,
  getEventById,
  deleteEvent,
  getStats,
};
