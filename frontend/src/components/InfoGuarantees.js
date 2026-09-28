import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export const InfoGuarantees = ({ onOpenPrizeInfo, onOpenRefundPolicy }) => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      {/* Left Card: Prize Money Video Link */}
      <TouchableOpacity
        style={styles.leftCard}
        onPress={onOpenPrizeInfo}
        activeOpacity={0.8}
      >
        <View style={styles.playIconContainer}>
          <Ionicons name="play" size={20} color={COLORS.primaryTeal} style={{ marginLeft: 2 }} />
        </View>
        <View style={styles.prizeTextWrapper}>
          <Text style={styles.prizeCardTitle}>{t('howWillYouReceivePrize')}</Text>
          <Text style={styles.prizeCardSubtext}>{t('watchVideoToKnowMore')}</Text>
        </View>
      </TouchableOpacity>

      {/* Right Column: Refund Policy & Razorpay Secure Payments */}
      <View style={styles.rightColumn}>
        {/* Refund Policy */}
        <TouchableOpacity
          style={styles.policyRow}
          onPress={onOpenRefundPolicy}
          activeOpacity={0.7}
        >
          <Feather name="shield" size={16} color={COLORS.textPrimary} style={{ marginRight: 6 }} />
          <Text style={styles.policyText}>{t('refundPolicy')}</Text>
        </TouchableOpacity>

        {/* Razorpay Security Badge */}
        <View style={styles.securityRow}>
          <Feather name="shield" size={16} color={COLORS.textPrimary} style={{ marginRight: 6 }} />
          <View style={styles.razorpayBlock}>
            <Text style={styles.securityLabel}>{t('securePaymentsPoweredBy')}</Text>
            <View style={styles.razorpayBadge}>
              <MaterialCommunityIcons name="lightning-bolt" size={14} color="#0C2340" />
              <Text style={styles.razorpayBrand}>Razorpay</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    gap: 12,
  },
  leftCard: {
    flex: 1.1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  playIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E8F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#80CBC4',
  },
  prizeTextWrapper: {
    flex: 1,
  },
  prizeCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 16,
    marginBottom: 2,
  },
  prizeCardSubtext: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  rightColumn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  policyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 2,
  },
  razorpayBlock: {
    flex: 1,
  },
  securityLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  razorpayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  razorpayBrand: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0C2340',
    letterSpacing: -0.3,
  },
});
