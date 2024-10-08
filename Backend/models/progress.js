const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  totalLessons: {
    type: Number,
    required: true,
  },
  lessonsCompleted: {
    type: Number,
    default: 0,
  },
  totalQuizzes: {
    type: Number,
    default: 0,
  },
  quizzesCompleted: {
    type: Number,
    default: 0,
  },
  totalMaterials: {
    type: Number,
    default: 0,
  },
  materialsCompleted: {
    type: Number,
    default: 0,
  },
  percentage: {
    type: Number, // Overall progress in percentage
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model('Progress', ProgressSchema);
