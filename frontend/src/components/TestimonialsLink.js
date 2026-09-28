import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export const TestimonialsLink = ({ onPress }) => {
  const { t } = useLanguage();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftRow}>
        <Feather name="message-square" size={18} color={COLORS.textPrimary} style={{ marginRight: 10 }} />
        <View>
          <Text style={styles.title}>{t('hearFromOurUsers')}</Text>
          <Text style={styles.subtext}>{t('seeParticipantReviews')}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  subtext: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
