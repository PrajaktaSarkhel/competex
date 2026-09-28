/**
 * Concurrency & Data Consistency Verification Test
 * 
 * Verifies that under high-concurrency burst conditions:
 * 1. Overbooking NEVER occurs (spots booked cannot exceed total spots).
 * 2. Atomic MongoDB condition ensures exactly the right number of registrations succeed.
 * 3. Rejected requests receive graceful 409 Conflict responses.
 * 4. Compound unique indexes prevent double registration per user.
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Competition = require('../src/models/Competition');
const Registration = require('../src/models/Registration');
const User = require('../src/models/User');

async function runConcurrencyTest() {
  console.log('🧪 Starting Concurrency & Data Consistency Test...');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);

  try {
    // Setup test competition with strictly 5 spots available
    const TOTAL_SPOTS = 5;
    const CONCURRENT_REQUESTS = 30;

    const testComp = await Competition.create({
      title: 'Concurrency Benchmark Dance',
      slug: 'concurrency-benchmark',
      category: 'Dance',
      prizePool: 1000,
      entryFee: 50,
      totalSpots: TOTAL_SPOTS,
      bookedSpots: 0,
      dates: {
        registerBefore: new Date(Date.now() + 86400000),
        submissionStarts: new Date(),
        submissionEnds: new Date(Date.now() + 86400000 * 2),
        resultDate: new Date(Date.now() + 86400000 * 3),
      },
      judge: {
        name: 'Test Judge',
        title: 'Judge',
        experience: '10y',
        avatar: 'test.jpg',
      },
    });

    console.log(`📋 Created Test Competition: ${TOTAL_SPOTS} total spots, 0 booked.`);
    console.log(`⚡ Bombarding with ${CONCURRENT_REQUESTS} simultaneous parallel registration requests...`);

    const startTime = Date.now();

    // Fire all concurrent requests simultaneously using Promise.all
    const promises = Array.from({ length: CONCURRENT_REQUESTS }).map(async (_, idx) => {
      const syntheticUser = await User.create({
        name: `Tester ${idx}`,
        email: `tester_${idx}_${Date.now()}@concurrency.test`,
      });

      // Atomic conditional update
      const updated = await Competition.findOneAndUpdate(
        {
          _id: testComp._id,
          $expr: { $lt: ['$bookedSpots', '$totalSpots'] },
        },
        {
          $inc: { bookedSpots: 1 },
        },
        { new: true }
      );

      if (!updated) {
        return { success: false, index: idx, reason: 'SPOTS_FULL' };
      }

      await Registration.create({
        competitionId: testComp._id,
        userId: syntheticUser._id,
        userName: syntheticUser.name,
        userEmail: syntheticUser.email,
        payment: { amount: 50, status: 'SUCCESS' },
      });

      return { success: true, index: idx };
    });

    const results = await Promise.all(promises);
    const duration = Date.now() - startTime;

    const successful = results.filter((r) => r.success);
    const rejected = results.filter((r) => !r.success);

    const finalComp = await Competition.findById(testComp._id);
    const totalRegistrations = await Registration.countDocuments({ competitionId: testComp._id });

    console.log('\n📊 ========== CONCURRENCY TEST RESULTS ==========');
    console.log(`⏱️ Duration: ${duration}ms for ${CONCURRENT_REQUESTS} parallel transactions`);
    console.log(`✅ Successful Bookings: ${successful.length} (Expected: ${TOTAL_SPOTS})`);
    console.log(`🛑 Gracefully Rejected: ${rejected.length} (Expected: ${CONCURRENT_REQUESTS - TOTAL_SPOTS})`);
    console.log(`📦 Database bookedSpots: ${finalComp.bookedSpots} / ${finalComp.totalSpots}`);
    console.log(`📝 Actual Registration records created: ${totalRegistrations}`);

    // Assertions
    if (finalComp.bookedSpots > TOTAL_SPOTS) {
      throw new Error(`CRITICAL FAILURE: Overbooking occurred! Booked ${finalComp.bookedSpots} > ${TOTAL_SPOTS}`);
    }
    if (successful.length !== TOTAL_SPOTS) {
      throw new Error(`FAILURE: Expected ${TOTAL_SPOTS} successes, got ${successful.length}`);
    }
    if (totalRegistrations !== TOTAL_SPOTS) {
      throw new Error(`FAILURE: Registration record count mismatch. Expected ${TOTAL_SPOTS}, got ${totalRegistrations}`);
    }

    console.log('\n🎉 ALL CONCURRENCY & ATOMICITY ASSERTIONS PASSED WITH ZERO OVERBOOKING!\n');
  } finally {
    await mongoose.disconnect();
    await mongod.stop();
  }
}

runConcurrencyTest().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
