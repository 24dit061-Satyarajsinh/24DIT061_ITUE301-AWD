// Logs every incoming request: method, URL, and timestamp.
// Registered globally with app.use() in server.js so it runs for every route.
function logger(req, res, next) {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next(); // always call next() or the request will hang forever
}

module.exports = logger;
