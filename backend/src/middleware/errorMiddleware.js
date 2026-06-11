const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // Log error
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[ERROR] ${err.message}`);
    if (process.env.NODE_ENV === 'development') {
      console.error(err.stack);
    }
  }

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal server error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry';
  }

  // Gemini API errors
  if (
    err.message?.includes('GEMINI_API_KEY') ||
    err.message?.includes('GoogleGenerativeAI') ||
    err.message?.includes('[GoogleGenerativeAI Error]') ||
    err.status === 429
  ) {
    statusCode = 503;
    message = 'AI service temporarily unavailable. Please try again.';
  }

  // Rate limit
  if (statusCode === 429) {
    message = err.message || 'Too many requests';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
