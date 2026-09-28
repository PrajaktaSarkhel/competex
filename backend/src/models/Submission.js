const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Submission title is required'],
      trim: true,
    },
    danceStyle: {
      type: String,
      required: [true, 'Dance style is required'],
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL or file path is required'],
      trim: true,
    },
    durationSeconds: {
      type: Number,
      default: 180,
    },
    description: {
      type: String,
      trim: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    judgeFeedback: {
      type: String,
    },
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
