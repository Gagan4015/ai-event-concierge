const mongoose = require('mongoose');

const venueProposalSchema = new mongoose.Schema({
  venueName: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  estimatedCost: {
    type: String,
    required: true,
    trim: true,
  },
  whyItFits: {
    type: String,
    required: true,
  },
  capacity: {
    type: String,
    default: null,
  },
  amenities: {
    type: [String],
    default: [],
  },
  venueType: {
    type: String,
    default: null,
  },
}, { _id: false });

const eventSearchSchema = new mongoose.Schema(
  {
    userQuery: {
      type: String,
      required: [true, 'User query is required'],
      trim: true,
      maxlength: [1000, 'Query cannot exceed 1000 characters'],
    },
    parsedIntent: {
      attendees: { type: String, default: null },
      duration: { type: String, default: null },
      budget: { type: String, default: null },
      eventType: { type: String, default: null },
      preferences: { type: [String], default: [] },
    },
    proposal: {
      type: venueProposalSchema,
      required: true,
    },
    alternativeVenues: {
      type: [venueProposalSchema],
      default: [],
    },
    aiModel: {
      type: String,
      default: 'gpt-4o-mini',
    },
    processingTimeMs: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['success', 'error'],
      default: 'success',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for efficient queries
eventSearchSchema.index({ createdAt: -1 });
eventSearchSchema.index({ status: 1, createdAt: -1 });

// Virtual for formatted date
eventSearchSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

eventSearchSchema.set('toJSON', { virtuals: true });

const EventSearch = mongoose.model('EventSearch', eventSearchSchema);

module.exports = EventSearch;
