import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import { AuthUserProvider, useAuthUser } from './src/context/AuthUserContext';
import { api } from './src/services/api';
import { COLORS } from './src/constants/theme';

import { HeaderNav } from './src/components/HeaderNav';
import { CompetitionHeader } from './src/components/CompetitionHeader';
import { JudgeCard } from './src/components/JudgeCard';
import { CountdownBanner } from './src/components/CountdownBanner';
import { ImportantDatesCard } from './src/components/ImportantDatesCard';
import { PreviousWinnersCarousel } from './src/components/PreviousWinnersCarousel';
import { TabSection } from './src/components/TabSection';
import { RewardsCard } from './src/components/RewardsCard';
import { InfoGuarantees } from './src/components/InfoGuarantees';
import { ReferEarnCard } from './src/components/ReferEarnCard';
import { TestimonialsLink } from './src/components/TestimonialsLink';
import { AdPlaceholder } from './src/components/AdPlaceholder';
import { BottomCtaBar } from './src/components/BottomCtaBar';
import { BottomNavBar } from './src/components/BottomNavBar';

import { RegistrationModal } from './src/components/modals/RegistrationModal';
import { SubmissionModal } from './src/components/modals/SubmissionModal';
import { VideoPlayerModal } from './src/components/modals/VideoPlayerModal';
import { ReviewsModal } from './src/components/modals/ReviewsModal';
import { RefundPolicyModal } from './src/components/modals/RefundPolicyModal';
import { DevControlsModal } from './src/components/modals/DevControlsModal';

function CompetitionScreen() {
  const { t } = useLanguage();
  const { currentUser } = useAuthUser();

  const [competition, setCompetition] = useState(null);
  const [userState, setUserState] = useState({
    isRegistered: true,
    registration: null,
    submission: null,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal States
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showDevControls, setShowDevControls] = useState(false);
  const [videoModal, setVideoModal] = useState({
    visible: false,
    url: '',
    title: '',
  });

  const loadCompetitionData = useCallback(async () => {
    try {
      const res = await api.getCompetition('feedants-classical-dance', currentUser?._id);
      if (res.success) {
        setCompetition(res.data);
        if (res.userState) {
          setUserState(res.userState);
        }
      }
    } catch (err) {
      console.warn('Load competition failed, using default offline data:', err.message);
      // Fallback data in case server is booting
      setCompetition({
        _id: '64e000000000000000000010',
        title: 'Feedants Classical Dance',
        category: 'Dance',
        prizePool: 1500,
        entryFee: 99,
        totalSpots: 20,
        bookedSpots: 1,
        spotsLeft: 19,
        status: 'REGISTRATION_OPEN',
        dates: {
          registerBefore: new Date(Date.now() + 86400000 + 23280000),
          submissionStarts: new Date(Date.now() - 86400000),
          submissionEnds: new Date(Date.now() + 86400000 * 20),
          resultDate: new Date(Date.now() + 86400000 * 22),
        },
        judge: {
          name: 'Manju Dubey',
          title: 'Professional Kathak Dancer',
          experience: '12+ Years of Experience',
          avatar: '/assets/judge_manju_dubey.jpg',
          introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        },
      });
      // Default to registered for Rahul, unregistered for Priya
      const isRahul = currentUser?.email === 'rahul@feedants.com';
      setUserState({
        isRegistered: isRahul,
        registration: isRahul ? { status: 'CONFIRMED' } : null,
        submission: null,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadCompetitionData();

    // Auto-polling for live spots updates every 5 seconds
    const pollInterval = setInterval(() => {
      loadCompetitionData();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [loadCompetitionData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadCompetitionData();
  };

  const handleOpenVideo = (url, title) => {
    setVideoModal({
      visible: true,
      url,
      title,
    });
  };

  if (loading && !competition) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryTeal} />
        <Text style={styles.loadingText}>Loading Feedants Competition...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Responsive mobile frame wrapper */}
      <View style={styles.wrapper}>
        <View style={styles.appContainer}>
          {/* Header Navigation with Language Toggle & Dev Controls */}
          <HeaderNav onOpenDevControls={() => setShowDevControls(true)} />

          {/* Scrollable Competition Content */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primaryTeal]}
              />
            }
          >
            {/* 1. Header Card (Title, Registered Badge, Tags, Metrics) */}
            <CompetitionHeader
              competition={competition}
              isRegistered={userState.isRegistered}
            />

            {/* 2. Judge Card */}
            <JudgeCard
              judge={competition?.judge}
              onPlayVideo={handleOpenVideo}
            />

            {/* 3. Countdown Banner */}
            <CountdownBanner
              targetDate={competition?.dates?.registerBefore}
              status={competition?.status}
            />

            {/* 4. Important Dates */}
            <ImportantDatesCard dates={competition?.dates} />

            {/* 5. Previous Winners Carousel */}
            <PreviousWinnersCarousel
              winners={competition?.previousWinners}
              onPlayVideo={handleOpenVideo}
            />

            {/* 6. Tabs (About / Judging / Rules) */}
            <TabSection competition={competition} />

            {/* 7. Rewards Breakdown (All Positions) */}
            <RewardsCard
              rewards={competition?.rewards}
              disclaimer={competition?.disclaimer}
            />

            {/* 8. Trust & Guarantees (Prize receipt, Refund, Razorpay) */}
            <InfoGuarantees
              onOpenPrizeInfo={() =>
                handleOpenVideo(
                  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                  'How Prize Money is Disbursed - Direct UPI / Bank'
                )
              }
              onOpenRefundPolicy={() => setShowRefundModal(true)}
            />

            {/* 9. Refer & Earn */}
            <ReferEarnCard referral={competition?.referral} />

            {/* 10. Hear From Our Users */}
            <TestimonialsLink onPress={() => setShowReviewsModal(true)} />

            {/* 11. Ad Placeholder */}
            <AdPlaceholder />
          </ScrollView>

          {/* Sticky Bottom CTA Button */}
          <BottomCtaBar
            isRegistered={userState.isRegistered}
            hasSubmitted={!!userState.submission}
            status={competition?.status}
            spotsLeft={competition?.spotsLeft ?? Math.max(0, (competition?.totalSpots || 20) - (competition?.bookedSpots || 0))}
            entryFee={competition?.entryFee}
            onPressRegister={() => setShowRegistrationModal(true)}
            onPressSubmit={() => setShowSubmissionModal(true)}
            onPressViewSubmission={() => setShowSubmissionModal(true)}
          />

          {/* Bottom Navigation Bar */}
          <BottomNavBar activeTab="competitions" />
        </View>
      </View>

      {/* Modals */}
      <RegistrationModal
        visible={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        competition={competition}
        onRegisteredSuccess={(reg) => {
          setUserState((prev) => ({
            ...prev,
            isRegistered: true,
            registration: reg,
          }));
          loadCompetitionData();
        }}
      />

      <SubmissionModal
        visible={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        competition={competition}
        existingSubmission={userState.submission}
        onSubmissionSuccess={(sub) => {
          setUserState((prev) => ({
            ...prev,
            submission: sub,
          }));
          loadCompetitionData();
        }}
      />

      <VideoPlayerModal
        visible={videoModal.visible}
        onClose={() => setVideoModal({ visible: false, url: '', title: '' })}
        videoUrl={videoModal.url}
        videoTitle={videoModal.title}
      />

      <ReviewsModal
        visible={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        competitionId={competition?._id}
      />

      <RefundPolicyModal
        visible={showRefundModal}
        onClose={() => setShowRefundModal(false)}
      />

      <DevControlsModal
        visible={showDevControls}
        onClose={() => setShowDevControls(false)}
        competition={competition}
        onStateUpdated={() => loadCompetitionData()}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthUserProvider>
        <CompetitionScreen />
      </AuthUserProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 480, // Clean mobile viewport frame on desktop web
    backgroundColor: '#FFFFFF',
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  scrollArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});
