const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: [String],
  image: { 
    type: String,
    required: false,
  },
  lessons: [
    {
      title: String,
      content: String,
      completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      learningMaterials: [ 
        {
          type: {
            type: String,
            enum: ['video', 'document', 'other'],
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
          title: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            default: '',
          },
          duration: {
            type: Number,
          },
        },
      ],
      quizzes: [
        {
          title: {
            type: String,
            required: true,
          },
          questions: [
            {
              question: {
                type: String,
                required: true,
              },
              options: [String],
              correctAnswer: {
                type: String,
                required: true,
              },
            },
          ],
          completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        },
      ],
    },
  ],
  duration: {
    type: Number,
  },
  price: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Course', CourseSchema);
