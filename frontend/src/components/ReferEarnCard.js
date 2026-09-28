import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export const ReferEarnCard = ({ referral }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const referralUrl = referral?.shareUrl || 'https://feedants.com/r/referral123';
  const rewardAmount = referral?.rewardAmount || 10;

  const handleCopyLink = async () => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(referralUrl);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join Feedants Classical Dance Competition and win from ₹1,500 prize pool! Use my link: ${referralUrl}`,
        url: referralUrl,
      });
    } catch (error) {
      console.warn('Share error', error);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        {/* Left Megaphone Icon */}
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="bullhorn-outline" size={24} color={COLORS.referralAccent} />
        </View>

        {/* Title and Share */}
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{t('referAndEarnDiscount')}</Text>
        </View>

        {/* Refer Now Button */}
        <TouchableOpacity style={styles.referButton} onPress={handleShare} activeOpacity={0.8}>
          <Text style={styles.referButtonText}>{t('referNow')}</Text>
        </TouchableOpacity>
      </View>

      {/* Referral Link & Copy Action Row */}
      <View style={styles.bottomRow}>
        <View style={styles.urlInputBox}>
          <Text style={styles.urlText} numberOfLines={1}>
            {referralUrl}
          </Text>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopyLink} activeOpacity={0.7}>
            <Text style={styles.copyBtnText}>{copied ? t('copied') : t('copyLink')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.earnSubtext}>{t('earnPerSignup')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EAF8F1',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#C7EDD7',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D7F5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  referButton: {
    backgroundColor: '#0E7A6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  referButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomRow: {
    gap: 6,
  },
  urlInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1EAE0',
    paddingLeft: 10,
    paddingRight: 4,
    paddingVertical: 3,
  },
  urlText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  copyBtn: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  earnSubtext: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065F46',
    textAlign: 'right',
  },
});
