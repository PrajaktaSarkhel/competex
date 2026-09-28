const Submission = require('../models/Submission');
const Registration = require('../models/Registration');
const Competition = require('../models/Competition');

// POST /api/competitions/:id/submissions
const createSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, title, danceStyle, videoUrl, durationSeconds, description } = req.body;

    if (!userId || !title || !danceStyle || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'userId, title, danceStyle, and videoUrl are required fields.',
      });
    }

    // 1. Verify user is registered
    const registration = await Registration.findOne({
      competitionId: id,
      userId,
      status: 'CONFIRMED',
    });

    if (!registration) {
      return res.status(403).json({
        success: false,
        message: 'Only registered participants can upload a submission.',
      });
    }

    // 2. Check competition submission lifecycle
    const competition = await Competition.findById(id);
    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    const currentStatus = competition.status;
    if (currentStatus === 'SUBMISSION_CLOSED' || currentStatus === 'JUDGING' || currentStatus === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: `Submission window has closed. Current status: ${currentStatus}`,
      });
    }

    // 3. Check for existing submission
    const existingSubmission = await Submission.findOne({
      competitionId: id,
      userId,
    });

    if (existingSubmission) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted an entry for this competition. Multiple submissions are not permitted.',
        submission: existingSubmission,
      });
    }

    // 4. Create submission
    const submission = await Submission.create({
      competitionId: id,
      userId,
      registrationId: registration._id,
      title,
      danceStyle,
      videoUrl,
      durationSeconds: durationSeconds || 180,
      description,
      status: 'PENDING',
    });

    // Update registration flag
    registration.hasSubmitted = true;
    await registration.save();

    return res.status(201).json({
      success: true,
      message: 'Dance entry successfully submitted for judging!',
      submission,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/competitions/:id/submissions/me
const getMySubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId query parameter is required' });
    }

    const submission = await Submission.findOne({ competitionId: id, userId });

    return res.status(200).json({
      success: true,
      hasSubmitted: !!submission,
      submission,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubmission,
  getMySubmission,
};
