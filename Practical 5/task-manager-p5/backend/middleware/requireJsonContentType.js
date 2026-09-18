// Practical 4 supplementary problem, carried forward:
// Rejects POST/PUT requests that do not declare Content-Type: application/json.
function requireJsonContentType(req, res, next) {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        success: false,
        error: 'Content-Type must be application/json'
      });
    }
  }
  next();
}

module.exports = requireJsonContentType;
