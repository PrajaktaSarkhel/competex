const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Competition title is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      default: 'Dance',
    },
    tags: {
      type: [String],
      default: ['Dance', 'Multi-Win', 'Winners get certificate'],
    },
    prizePool: {
      type: Number,
      required: true,
      min: [0, 'Prize pool cannot be negative'],
    },
    entryFee: {
      type: Number,
      required: true,
      min: [0, 'Entry fee cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    totalSpots: {
      type: Number,
      required: true,
      min: [1, 'Total spots must be at least 1'],
    },
    bookedSpots: {
      type: Number,
      default: 0,
      min: [0, 'Booked spots cannot be negative'],
      validate: {
        validator: function (val) {
          return val <= this.totalSpots;
        },
        message: 'Booked spots ({VALUE}) cannot exceed total spots',
      },
    },
    manualStatus: {
      type: String,
      enum: ['AUTO', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'SUBMISSION_OPEN', 'SUBMISSION_CLOSED', 'JUDGING', 'COMPLETED'],
      default: 'AUTO',
    },
    dates: {
      registerBefore: {
        type: Date,
        required: true,
      },
      submissionStarts: {
        type: Date,
        required: true,
      },
      submissionEnds: {
        type: Date,
        required: true,
      },
      resultDate: {
        type: Date,
        required: true,
      },
    },
    judge: {
      name: { type: String, required: true },
      title: { type: String, required: true },
      experience: { type: String, required: true },
      avatar: { type: String, required: true },
      introVideoUrl: { type: String, default: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      bio: { type: String },
    },
    previousWinners: [
      {
        name: { type: String, required: true },
        position: { type: String, required: true },
        image: { type: String, required: true },
        videoUrl: { type: String, default: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        danceStyle: { type: String, default: 'Kathak' },
      },
    ],
    about: {
      summary: {
        type: String,
        default:
          'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
      },
      fullDescription: {
        type: String,
        default:
          'Feedants Classical Dance Championship is a nationwide platform dedicated to nurturing classical arts. Whether you practice Kathak, Bharatanatyam, Odissi, Kuchipudi, or Kathakali, this competition provides a recognized stage with professional evaluation, certified credentials, and national visibility.',
      },
      guidelines: [
        'Perform any classical dance form of India (Kathak, Bharatanatyam, Odissi, etc.).',
        'Solo performances only. Group entries are not permitted.',
        'High definition video recording with clear facial expressions and audible rhythm (ghungroo/music).',
        'Original performance recorded within the last 6 months.',
      ],
    },
    judgingParameters: [
      {
        parameter: { type: String, required: true },
        weightage: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    rulesAndEligibility: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    rewards: [
      {
        position: { type: String, required: true },
        amount: { type: Number, required: true },
        rank: { type: Number, required: true },
        iconType: {
          type: String,
          enum: ['trophy_gold', 'medal_silver', 'medal_bronze', 'star'],
          default: 'star',
        },
      },
    ],
    referral: {
      rewardAmount: { type: Number, default: 10 },
      shareUrl: { type: String, default: 'https://feedants.com/r/referral123' },
    },
    disclaimer: {
      type: String,
      default: 'Only contributions from paid participants will be considered for judging.',
    },
    version: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: spots remaining
competitionSchema.virtual('spotsLeft').get(function () {
  return Math.max(0, this.totalSpots - this.bookedSpots);
});

// Virtual: is full
competitionSchema.virtual('isFull').get(function () {
  return this.bookedSpots >= this.totalSpots;
});

// Virtual: dynamic lifecycle status based on dates & manual overrides
competitionSchema.virtual('status').get(function () {
  if (this.manualStatus && this.manualStatus !== 'AUTO') {
    return this.manualStatus;
  }
  const now = new Date();
  if (now > this.dates.resultDate) {
    return 'COMPLETED';
  }
  if (now > this.dates.submissionEnds) {
    return 'JUDGING';
  }
  if (now > this.dates.registerBefore) {
    return 'REGISTRATION_CLOSED';
  }
  if (now >= this.dates.submissionStarts) {
    return 'SUBMISSION_OPEN';
  }
  return 'REGISTRATION_OPEN';
});

// Index for high-concurrency atomic booking
competitionSchema.index({ _id: 1, bookedSpots: 1, totalSpots: 1 });

module.exports = mongoose.model('Competition', competitionSchema);
