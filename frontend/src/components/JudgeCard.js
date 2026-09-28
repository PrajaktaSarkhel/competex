import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export const JudgeCard = ({ judge, onPlayVideo }) => {
  const { t } = useLanguage();

  if (!judge) return null;

  return (
    <View style={styles.card}>
      {/* Judge Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={require('../../assets/judge_manju_dubey.jpg')}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>

      {/* Judge Info Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.judgeLabel}>{t('judge')}</Text>
        <Text style={styles.judgeName}>{judge.name || 'Manju Dubey'}</Text>
        <Text style={styles.judgeTitle}>{judge.title || 'Professional Kathak Dancer'}</Text>
        <Text style={styles.judgeExp}>{judge.experience || '12+ Years of Experience'}</Text>
      </View>

      {/* Intro Video Action */}
      <TouchableOpacity
        style={styles.videoAction}
        onPress={() => onPlayVideo && onPlayVideo(judge.introVideoUrl, `${judge.name} - Intro Video`)}
        activeOpacity={0.7}
      >
        <View style={styles.playIconCircle}>
          <Ionicons name="play" size={20} color={COLORS.primaryTeal} style={{ marginLeft: 2 }} />
        </View>
        <Text style={styles.videoText}>{t('introVideo')}</Text>
      </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
    borderWidth: 2,
    borderColor: '#E6F8F5',
  },
  detailsContainer: {
    flex: 1,
  },
  judgeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  judgeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  judgeTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  judgeExp: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  videoAction: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  playIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#80CBC4',
  },
  videoText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
