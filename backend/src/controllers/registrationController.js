const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const User = require('../models/User');

// POST /api/competitions/:id/register
const registerForCompetition = async (req, res, next) => {
  const { id } = req.params;
  const { userId, userName, userEmail, userPhone, paymentMethod, paymentId } = req.body;

  if (!userId && !userEmail) {
    return res.status(400).json({
      success: false,
      message: 'User ID or Email is required for registration.',
    });
  }

  try {
    // 1. Resolve or create user if needed
    let user;
    if (userId) {
      user = await User.findById(userId);
    }
    if (!user && userEmail) {
      user = await User.findOne({ email: userEmail.toLowerCase() });
      if (!user) {
        user = await User.create({
          name: userName || 'Participant',
          email: userEmail.toLowerCase(),
          phone: userPhone,
        });
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User could not be identified' });
    }

    // 2. Check if already registered (Pre-check)
    const existingRegistration = await Registration.findOne({
      competitionId: id,
      $or: [{ userId: user._id }, { userEmail: user.email }],
      status: 'CONFIRMED',
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'You are already registered for this competition.',
        registration: existingRegistration,
      });
    }

    // 3. Check competition existence and lifecycle rules
    const compCheck = await Competition.findById(id);
    if (!compCheck) {
      return res.status(404).json({ success: false, message: 'Competition not found.' });
    }

    const currentStatus = compCheck.status;
    if (currentStatus === 'REGISTRATION_CLOSED' || currentStatus === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Registration is closed for this competition.',
        status: currentStatus,
      });
    }

    // 4. ATOMIC CONCURRENCY GUARD:
    // Execute atomic update with condition: bookedSpots must be strictly less than totalSpots
    const updatedCompetition = await Competition.findOneAndUpdate(
      {
        _id: id,
        $expr: { $lt: ['$bookedSpots', '$totalSpots'] },
      },
      {
        $inc: { bookedSpots: 1, version: 1 },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // If update returned null, it means concurrent users took all available spots!
    if (!updatedCompetition) {
      return res.status(409).json({
        success: false,
        message: 'Sorry! All remaining participation spots have just been booked.',
        isFull: true,
      });
    }

    // 5. Create Registration Record
    let registration;
    try {
      registration = await Registration.create({
        competitionId: id,
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone || userPhone,
        payment: {
          status: 'SUCCESS',
          orderId: `order_rzp_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          paymentId: paymentId || `pay_rzp_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          amount: updatedCompetition.entryFee,
          currency: updatedCompetition.currency,
          method: paymentMethod || 'Razorpay UPI',
          paidAt: new Date(),
        },
        status: 'CONFIRMED',
      });
    } catch (regError) {
      // Rollback atomic counter in case of duplicate key or DB constraint error
      console.error('Registration record creation failed. Rolling back booked spot...', regError.message);
      await Competition.findByIdAndUpdate(id, { $inc: { bookedSpots: -1 } });

      if (regError.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'You have already registered for this competition.',
        });
      }
      throw regError;
    }

    // 6. Broadcast live spots update to all connected WebSocket clients
    const io = req.app.get('io');
    if (io) {
      io.emit('spots_updated', {
        competitionId: updatedCompetition._id,
        bookedSpots: updatedCompetition.bookedSpots,
        totalSpots: updatedCompetition.totalSpots,
        spotsLeft: updatedCompetition.totalSpots - updatedCompetition.bookedSpots,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Registration successful! You are now registered for the competition.',
      registration,
      competition: {
        id: updatedCompetition._id,
        bookedSpots: updatedCompetition.bookedSpots,
        totalSpots: updatedCompetition.totalSpots,
        spotsLeft: updatedCompetition.totalSpots - updatedCompetition.bookedSpots,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/competitions/:id/registration-status?userId=...
const getRegistrationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, email } = req.query;

    if (!userId && !email) {
      return res.status(400).json({ success: false, message: 'userId or email query param required' });
    }

    const query = { competitionId: id, status: 'CONFIRMED' };
    if (userId) query.userId = userId;
    else if (email) query.userEmail = email.toLowerCase();

    const registration = await Registration.findOne(query);

    return res.status(200).json({
      success: true,
      isRegistered: !!registration,
      registration,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerForCompetition,
  getRegistrationStatus,
};
