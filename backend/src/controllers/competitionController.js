const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const Submission = require('../models/Submission');
const Review = require('../models/Review');
const User = require('../models/User');

// GET /api/competitions/:idOrSlug
const getCompetitionDetails = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const { userId } = req.query;

    let query = {};
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = idOrSlug;
    } else {
      query.slug = idOrSlug;
    }

    const competition = await Competition.findOne(query);

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found',
      });
    }

    let userState = {
      isRegistered: false,
      registration: null,
      submission: null,
    };

    if (userId) {
      const registration = await Registration.findOne({
        competitionId: competition._id,
        userId: userId,
        status: 'CONFIRMED',
      });

      if (registration) {
        userState.isRegistered = true;
        userState.registration = registration;

        const submission = await Submission.findOne({
          competitionId: competition._id,
          userId: userId,
        });

        if (submission) {
          userState.submission = submission;
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: competition,
      userState,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/competitions
const getAllCompetitions = async (req, res, next) => {
  try {
    const competitions = await Competition.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: competitions.length,
      data: competitions,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/competitions/:id/reviews
const getCompetitionReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ competitionId: id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/competitions/:id/admin/lifecycle
const updateCompetitionLifecycle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { manualStatus, dates } = req.body;

    const updateFields = {};
    if (manualStatus) updateFields.manualStatus = manualStatus;
    if (dates) {
      if (dates.registerBefore) updateFields['dates.registerBefore'] = new Date(dates.registerBefore);
      if (dates.submissionStarts) updateFields['dates.submissionStarts'] = new Date(dates.submissionStarts);
      if (dates.submissionEnds) updateFields['dates.submissionEnds'] = new Date(dates.submissionEnds);
      if (dates.resultDate) updateFields['dates.resultDate'] = new Date(dates.resultDate);
    }

    const updated = await Competition.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    // Broadcast update via socket if available
    const io = req.app.get('io');
    if (io) {
      io.emit('competition_updated', updated);
    }

    return res.status(200).json({
      success: true,
      message: `Lifecycle state updated to ${updated.status}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompetitionDetails,
  getAllCompetitions,
  getCompetitionReviews,
  updateCompetitionLifecycle,
};
