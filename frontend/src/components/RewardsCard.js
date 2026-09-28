import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export const RewardsCard = ({ rewards = [], disclaimer }) => {
  const { t } = useLanguage();

  const defaultRewards = [
    { position: '1st Winner', amount: 550, rank: 1, iconType: 'trophy_gold' },
    { position: '2nd Winner', amount: 300, rank: 2, iconType: 'medal_silver' },
    { position: '3rd Winner', amount: 240, rank: 3, iconType: 'medal_bronze' },
    { position: '4th Winner', amount: 200, rank: 4, iconType: 'star' },
    { position: '5th Winner', amount: 130, rank: 5, iconType: 'star' },
    { position: '6th Winner', amount: 80, rank: 6, iconType: 'star' },
  ];

  const displayRewards = rewards.length > 0 ? rewards : defaultRewards;

  const renderIcon = (iconType, rank) => {
    switch (iconType) {
      case 'trophy_gold':
        return <Ionicons name="trophy" size={20} color="#F59E0B" />;
      case 'medal_silver':
        return <MaterialCommunityIcons name="medal" size={20} color="#94A3B8" />;
      case 'medal_bronze':
        return <MaterialCommunityIcons name="medal" size={20} color="#CD7F32" />;
      case 'star':
      default:
        return <Ionicons name="star-outline" size={19} color="#0EA5E9" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('rewardsAllPositions')}</Text>

        <View style={styles.rewardsList}>
          {displayRewards.map((reward, index) => (
            <View key={index} style={styles.rewardRow}>
              <View style={styles.leftRow}>
                <View style={styles.iconBox}>{renderIcon(reward.iconType, reward.rank)}</View>
                <Text style={styles.positionText}>{reward.position}</Text>
              </View>
              <Text style={styles.amountText}>₹ {reward.amount}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Disclaimer Box */}
      <View style={styles.disclaimerBox}>
        <Feather name="info" size={16} color={COLORS.primaryTeal} style={{ marginRight: 8, marginTop: 1 }} />
        <Text style={styles.disclaimerText}>
          {disclaimer || t('disclaimer')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  rewardsList: {
    gap: 12,
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 26,
    alignItems: 'center',
    marginRight: 10,
  },
  positionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryTeal,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EBF8F6',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#BCE8E2',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#0F172A',
    lineHeight: 18,
    flex: 1,
    fontWeight: '500',
  },
});
