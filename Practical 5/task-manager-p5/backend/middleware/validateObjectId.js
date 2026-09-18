const mongoose = require('mongoose');

// Route-specific middleware (not global) — only attached to routes that
// take an :id param. Rejects malformed IDs with a clean 400 before the
// request ever reaches Mongoose/MongoDB, instead of surfacing a raw
// Mongoose CastError.
function validateObjectId(req, res, next) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: `Invalid task ID format: ${id}`
    });
  }
  next();
}

module.exports = validateObjectId;
