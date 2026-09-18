// Global error handler — MUST be the last app.use() in server.js.
// Express recognizes it as an error handler because it takes 4 arguments.
//
// Every controller wraps its logic in try/catch and forwards errors here
// via next(err), instead of letting raw Mongoose error objects (which
// contain internal stack traces and implementation details) reach the client.
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // Mongoose validation error (e.g. missing required field, bad enum value)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: messages
    });
  }

  // Mongoose CastError (e.g. malformed ObjectId slipping through)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Invalid ${err.path}: ${err.value}`
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate field value entered'
    });
  }

  // Fallback: generic 500
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Something went wrong'
  });
}

module.exports = errorHandler;
