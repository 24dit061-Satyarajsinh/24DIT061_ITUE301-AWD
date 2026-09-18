const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Task Schema
// ---------------------------------------------------------------------------
// NOTE: MongoDB itself is schema-less — it will happily store any document
// shape in a collection. Mongoose adds an *application-level* schema on top
// so that every document written through this model is validated BEFORE it
// ever reaches the database. This gives us:
//   1. Guaranteed required fields (title)
//   2. Guaranteed default values (completed, priority, createdAt)
//   3. Type coercion / rejection (e.g. a String cannot silently become a Number)
//   4. Enum restriction (priority can only be low/medium/high)
// ---------------------------------------------------------------------------

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  // Supplementary Problem 1: priority restricted to an enum
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: '{VALUE} is not a valid priority. Must be low, medium, or high.'
    },
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Supplementary Problem 2: pre-save hook that trims whitespace from title.
// `trim: true` above already handles this for normal saves, but this hook
// demonstrates the concept explicitly and also covers any manual .save()
// calls where the value was set directly on the document.
taskSchema.pre('save', function (next) {
  if (this.title && typeof this.title === 'string') {
    this.title = this.title.trim();
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
