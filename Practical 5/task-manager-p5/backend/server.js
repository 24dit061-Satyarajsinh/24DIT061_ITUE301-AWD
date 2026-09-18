const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const logger = require('./middleware/logger');
const requireJsonContentType = require('./middleware/requireJsonContentType');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// ---------------------------------------------------------------------------
// Global middleware pipeline
// ---------------------------------------------------------------------------
app.use(cors()); // allow the React frontend (different port) to call this API
app.use(express.json()); // parse JSON request bodies -> req.body
app.use(logger); // log method/url/timestamp for every request
app.use(requireJsonContentType); // reject POST/PUT without proper Content-Type

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Task Manager API is running' });
});

app.use('/api/tasks', taskRoutes);

// 404 handler for any route that doesn't match above
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.originalUrl}`
  });
});

// Global error handler — must be LAST
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Connect to MongoDB, then start the server
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
