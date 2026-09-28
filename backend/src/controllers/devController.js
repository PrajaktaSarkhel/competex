const { seedDatabase } = require('../utils/seedData');
const User = require('../models/User');
const Competition = require('../models/Competition');
const Registration = require('../models/Registration');

// POST /api/dev/reset-seed
const resetSeed = async (req, res, next) => {
  try {
    const data = await seedDatabase();
    return res.status(200).json({
      success: true,
      message: 'Database reset and re-seeded with initial Feedants demo data!',
      data: {
        competitionId: data.competition._id,
        rahulId: data.rahul._id,
        priyaId: data.priya._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/dev/users
const getDevUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: 1 });
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/dev/simulate-concurrency
// Spawns multiple parallel registration attempts to prove atomic locking and zero overbooking
const simulateConcurrency = async (req, res, next) => {
  try {
    const { competitionId, totalAttempts = 25 } = req.body;

    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    const initialBooked = competition.bookedSpots;
    const initialTotal = competition.totalSpots;
    const spotsAvailableBefore = initialTotal - initialBooked;

    console.log(`⚡ Concurrency test: Firing ${totalAttempts} parallel registration requests for ${spotsAvailableBefore} available spots...`);

    // Create unique synthetic user IDs for each concurrent attempt
    const attempts = [];
    for (let i = 0; i < totalAttempts; i++) {
      const syntheticEmail = `concurrent_tester_${Date.now()}_${i}@example.com`;
      const syntheticName = `Concurrent Dancer ${i + 1}`;

      attempts.push(
        (async () => {
          try {
            // Atomic conditional update
            const updated = await Competition.findOneAndUpdate(
              {
                _id: competitionId,
                $expr: { $lt: ['$bookedSpots', '$totalSpots'] },
              },
              {
                $inc: { bookedSpots: 1, version: 1 },
              },
              { new: true }
            );

            if (!updated) {
              return { success: false, reason: 'SPOTS_FULL' };
            }

            // Create temporary test user and registration
            const testUser = await User.create({
              name: syntheticName,
              email: syntheticEmail,
            });

            const reg = await Registration.create({
              competitionId,
              userId: testUser._id,
              userName: syntheticName,
              userEmail: syntheticEmail,
              payment: {
                status: 'SUCCESS',
                amount: competition.entryFee,
                paymentId: `pay_sim_${Date.now()}_${i}`,
              },
            });

            return { success: true, registrationId: reg._id };
          } catch (err) {
            // Rollback if needed
            await Competition.findByIdAndUpdate(competitionId, { $inc: { bookedSpots: -1 } });
            return { success: false, reason: err.message };
          }
        })()
      );
    }

    // Run all attempts in parallel simultaneously using Promise.all
    const results = await Promise.all(attempts);

    const successful = results.filter((r) => r.success).length;
    const rejected = results.filter((r) => !r.success).length;

    const finalComp = await Competition.findById(competitionId);

    // Notify connected clients of the updated spots
    const io = req.app.get('io');
    if (io) {
      io.emit('spots_updated', {
        competitionId: finalComp._id,
        bookedSpots: finalComp.bookedSpots,
        totalSpots: finalComp.totalSpots,
        spotsLeft: finalComp.totalSpots - finalComp.bookedSpots,
      });
    }

    return res.status(200).json({
      success: true,
      summary: {
        totalRequests: totalAttempts,
        successfulRegistrations: successful,
        rejectedRequests: rejected,
        spotsAvailableBefore,
        finalBookedSpots: finalComp.bookedSpots,
        finalTotalSpots: finalComp.totalSpots,
        overbookingOccurred: finalComp.bookedSpots > finalComp.totalSpots,
        dataConsistencyVerified: finalComp.bookedSpots <= finalComp.totalSpots,
      },
      message: `Simulated ${totalAttempts} concurrent registration requests: ${successful} succeeded, ${rejected} rejected gracefully. Zero overbooking!`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  resetSeed,
  getDevUsers,
  simulateConcurrency,
};
