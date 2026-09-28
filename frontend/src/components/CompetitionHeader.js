import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export const CompetitionHeader = ({ competition, isRegistered }) => {
  const { t } = useLanguage();

  if (!competition) return null;

  const totalSpots = competition.totalSpots || 20;
  const bookedSpots = competition.bookedSpots || 0;
  const spotsLeft = Math.max(0, totalSpots - bookedSpots);
  const progressRatio = Math.min(1, bookedSpots / totalSpots);

  return (
    <View style={styles.card}>
      {/* Top Title & Registration Status Badge */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>{competition.title || 'Feedants Classical Dance'}</Text>
        
        {isRegistered ? (
          <View style={styles.registeredBadge}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.primaryTeal} />
            <Text style={styles.registeredText}>{t('registered')}</Text>
          </View>
        ) : (
          <View style={styles.unregisteredBadge}>
            <Text style={styles.unregisteredText}>Not Registered</Text>
          </View>
        )}
      </View>

      {/* Tags Row */}
      <View style={styles.tagsRow}>
        <View style={styles.tagPill}>
          <Text style={styles.tagText}>{t('dance')}</Text>
        </View>
        <View style={styles.tagPill}>
          <Text style={styles.tagText}>{t('multiWin')}</Text>
        </View>
        <View style={styles.certificateTag}>
          <Ionicons name="trophy-outline" size={15} color={COLORS.primaryTeal} style={{ marginRight: 4 }} />
          <Text style={styles.certificateText}>{t('winnersCertificate')}</Text>
        </View>
      </View>

      {/* Key Metrics Row: Prize Pool, Entry Fee, Spots Booked */}
      <View style={styles.metricsRow}>
        {/* Prize Pool */}
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>{t('prizePool')}</Text>
          <Text style={styles.prizeValue}>₹ {competition.prizePool?.toLocaleString('en-IN') || '1,500'}</Text>
        </View>

        {/* Entry Fee */}
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>{t('entryFee')}</Text>
          <Text style={styles.feeValue}>₹ {competition.entryFee || '99'}</Text>
        </View>

        {/* Spots Left & Progress Bar */}
        <View style={styles.spotsMetricItem}>
          <View style={styles.spotsHeaderRow}>
            <MaterialCommunityIcons name="account-group-outline" size={15} color={COLORS.primaryTeal} />
            <Text style={styles.spotsLeftText}>
              {spotsLeft > 0 ? t('onlySpotsLeft', { count: spotsLeft }) : t('housefull')}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.max(5, progressRatio * 100)}%` },
              ]}
            />
          </View>

          <Text style={styles.bookedText}>
            {t('spotsBooked', { booked: bookedSpots, total: totalSpots })}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
    letterSpacing: -0.3,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5F3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#80CBC4',
    gap: 4,
  },
  registeredText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryTeal,
  },
  unregisteredBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  unregisteredText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tagPill: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  certificateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  certificateText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryTeal,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 4,
  },
  prizeValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primaryTeal,
    letterSpacing: -0.5,
  },
  feeValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  spotsMetricItem: {
    flex: 1.4,
    alignItems: 'flex-start',
  },
  spotsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  spotsLeftText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryTeal,
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primaryTeal,
    borderRadius: 3,
  },
  bookedText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});
