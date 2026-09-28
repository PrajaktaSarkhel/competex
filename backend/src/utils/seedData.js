const Competition = require('../models/Competition');
const User = require('../models/User');
const Registration = require('../models/Registration');
const Submission = require('../models/Submission');
const Review = require('../models/Review');

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database with initial data matching Feedants design...');

    // Clear existing collections
    await Promise.all([
      Competition.deleteMany({}),
      User.deleteMany({}),
      Registration.deleteMany({}),
      Submission.deleteMany({}),
      Review.deleteMany({}),
    ]);

    // Create Demo Users
    const rahul = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@feedants.com',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'user',
      referralCode: 'RAHUL123',
    });

    const priya = await User.create({
      name: 'Priya Patel',
      email: 'priya@feedants.com',
      phone: '+91 98765 12345',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      role: 'user',
      referralCode: 'PRIYA456',
    });

    // Create Initial Competition matching the design
    // Calculate registerBefore to match ~1 day 6 hours from now so the countdown ticks live!
    const now = new Date();
    const registerBefore = new Date(now.getTime() + (1 * 24 * 60 + 6 * 60 + 28) * 60 * 1000 + 32 * 1000);
    const submissionStarts = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Started 1 day ago
    const submissionEnds = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000); // Ends in 20 days
    const resultDate = new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000); // Results in 25 days

    const competition = await Competition.create({
      title: 'Feedants Classical Dance',
      slug: 'feedants-classical-dance',
      category: 'Dance',
      tags: ['Dance', 'Multi-Win', 'Winners get certificate'],
      prizePool: 1500,
      entryFee: 99,
      currency: 'INR',
      totalSpots: 20,
      bookedSpots: 1, // 1/20 booked, exactly 19 spots left!
      manualStatus: 'AUTO',
      dates: {
        registerBefore,
        submissionStarts,
        submissionEnds,
        resultDate,
      },
      judge: {
        name: 'Manju Dubey',
        title: 'Professional Kathak Dancer',
        experience: '12+ Years of Experience',
        avatar: '/assets/judge_manju_dubey.jpg',
        introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        bio: 'Sangeet Natak Akademi Yuva Puraskar awardee, senior disciple of Pandit Birju Maharaj ji with over a decade of international performing & judging experience.',
      },
      previousWinners: [
        {
          name: 'Riya Shah',
          position: '1st Winner',
          image: '/assets/winner_riya_shah.jpg',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          danceStyle: 'Kathak',
        },
        {
          name: 'Aarav Mehta',
          position: '1st Winner',
          image: '/assets/winner_aarav_mehta.jpg',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          danceStyle: 'Kathak',
        },
        {
          name: 'Neha Verma',
          position: '2nd Winner',
          image: '/assets/winner_neha_verma.jpg',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          danceStyle: 'Bharatanatyam',
        },
        {
          name: 'Ishita Chouhan',
          position: '3rd Winner',
          image: '/assets/winner_ishita_chouhan.jpg',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          danceStyle: 'Odissi',
        },
      ],
      about: {
        summary:
          'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
        fullDescription:
          'Feedants Classical Dance Championship is a premier national initiative aimed at identifying, nurturing, and spotlighting classical dance talent across India. Dancers of Kathak, Bharatanatyam, Odissi, Kuchipudi, Kathakali, and Mohiniyattam are invited to submit their original recorded performances for critical evaluation by venerated masters of the art.',
        guidelines: [
          'Solo performance video between 2 to 5 minutes duration.',
          'Classical forms eligible: Kathak, Bharatanatyam, Odissi, Kuchipudi, Mohiniyattam, Manipuri, Sattriya, Kathakali.',
          'High resolution video with continuous single take (no jump cuts or post-production edits).',
          'Traditional attire and appropriate ghungroo/ornaments recommended.',
          'Audio track must be clear and rhythmically synchronized with live footwork.',
        ],
      },
      judgingParameters: [
        {
          parameter: 'Taal & Laya (Rhythm & Timing)',
          weightage: '30%',
          description: 'Precision of footwork (tatkar), rhythmic clarity, and mastery over tempo.',
        },
        {
          parameter: 'Bhava & Abhinaya (Expressions)',
          weightage: '30%',
          description: 'Facial expressions, emotive conveyance, eye movements (drishti bhed), and storytelling.',
        },
        {
          parameter: 'Angashuddhi & Grace (Posture & Technique)',
          weightage: '25%',
          description: 'Geometric body alignment, hand mudras, chakkars (spins), and graceful balance.',
        },
        {
          parameter: 'Aharya (Costume & Presentation)',
          weightage: '15%',
          description: 'Authenticity of costume, ghungroo, stage presence, and overall aesthetic appeal.',
        },
      ],
      rulesAndEligibility: [
        {
          title: 'Eligibility',
          description: 'Open to dancers worldwide of all age groups. Age-appropriate evaluation applied.',
        },
        {
          title: 'Format',
          description: 'Video submission format (.mp4, .mov, or unlisted YouTube/Drive link).',
        },
        {
          title: 'Originality',
          description: 'Entry must be danced by the registered participant within the current competition cycle.',
        },
        {
          title: 'Disqualification Criteria',
          description: 'Lip-syncing, edited cuts in dance sequence, or submitting other artists’ work will result in immediate disqualification without refund.',
        },
      ],
      rewards: [
        { position: '1st Winner', amount: 550, rank: 1, iconType: 'trophy_gold' },
        { position: '2nd Winner', amount: 300, rank: 2, iconType: 'medal_silver' },
        { position: '3rd Winner', amount: 240, rank: 3, iconType: 'medal_bronze' },
        { position: '4th Winner', amount: 200, rank: 4, iconType: 'star' },
        { position: '5th Winner', amount: 130, rank: 5, iconType: 'star' },
        { position: '6th Winner', amount: 80, rank: 6, iconType: 'star' },
      ],
      referral: {
        rewardAmount: 10,
        shareUrl: 'https://feedants.com/r/referral123',
      },
      disclaimer: 'Only contributions from paid participants will be considered for judging.',
    });

    // Create 1 Registration for Rahul (matches the initial screenshot where Rahul is Registered!)
    const registration = await Registration.create({
      competitionId: competition._id,
      userId: rahul._id,
      userName: rahul.name,
      userEmail: rahul.email,
      userPhone: rahul.phone,
      payment: {
        status: 'SUCCESS',
        orderId: 'order_feedants_101',
        paymentId: 'pay_rzp_live_101',
        amount: 99,
        currency: 'INR',
        method: 'Razorpay UPI',
      },
      status: 'CONFIRMED',
    });

    // Create Reviews for Social Proof
    await Review.create([
      {
        competitionId: competition._id,
        userName: 'Aanya Sharma',
        userRole: 'Kathak Senior Disciple',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        comment:
          'Feedants platform is a blessing for classical dancers! Receiving detailed feedback from Manju Dubey ma’am directly helped me refine my chakkars and abhinaya.',
      },
      {
        competitionId: competition._id,
        userName: 'Devendra Joshi',
        userRole: 'Bharatanatyam Teacher',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        comment:
          'Prompt prize disbursement directly into my UPI ID within 24 hours of result declaration. 100% transparent and professionally judged.',
      },
      {
        competitionId: competition._id,
        userName: 'Tanvi Pillai',
        userRole: 'Mohiniyattam Performer',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        comment:
          'The national certificate provided was recognized by our academy. The smooth submission workflow made it so easy to upload my high-res video.',
      },
    ]);

    console.log('✅ Seed completed successfully!');
    return { competition, rahul, priya, registration };
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
};

module.exports = { seedDatabase };
