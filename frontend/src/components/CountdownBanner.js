import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export const CountdownBanner = ({ targetDate, status }) => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 6,
    minutes: 28,
    seconds: 32,
    isExpired: false,
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (n) => String(n).padStart(2, '0');

  const isClosed = status === 'REGISTRATION_CLOSED' || timeLeft.isExpired;

  return (
    <View style={styles.banner}>
      {/* Left Label */}
      <View style={styles.leftSection}>
        <Ionicons name="hourglass-outline" size={16} color={COLORS.primaryTeal} style={{ marginRight: 6 }} />
        <Text style={styles.label}>
          {isClosed ? t('registrationClosed') : t('registrationClosesIn')}
        </Text>
      </View>

      {/* Countdown Timer */}
      {!isClosed ? (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            {`${pad(timeLeft.days)}d : ${pad(timeLeft.hours)}h : ${pad(timeLeft.minutes)}m : ${pad(timeLeft.seconds)}s`}
          </Text>
        </View>
      ) : null}

      {/* Right Hurry Up Badge */}
      {!isClosed ? (
        <View style={styles.rightSection}>
          <Feather name="clock" size={14} color={COLORS.primaryTeal} style={{ marginRight: 4 }} />
          <Text style={styles.hurryText}>{t('hurryUp')}</Text>
        </View>
      ) : (
        <View style={styles.rightSection}>
          <Text style={[styles.hurryText, { color: COLORS.accentWarning }]}>Ended</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#EBF8F6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#BCE8E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  timerContainer: {
    paddingHorizontal: 4,
  },
  timerText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryTeal,
    letterSpacing: -0.2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hurryText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryTeal,
  },
});
