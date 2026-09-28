import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export const BottomCtaBar = ({
  isRegistered,
  hasSubmitted,
  status,
  spotsLeft,
  entryFee,
  onPressRegister,
  onPressSubmit,
  onPressViewSubmission,
}) => {
  const { t } = useLanguage();

  // Determine button state based on registration and lifecycle
  let buttonTitle = t('registerNow');
  let buttonSubtext = `₹ ${entryFee || 99} Entry Fee`;
  let buttonAction = onPressRegister;
  let isDisabled = false;

  if (isRegistered) {
    if (hasSubmitted) {
      buttonTitle = 'View Submission';
      buttonSubtext = 'Entry Submitted for Judging';
      buttonAction = onPressViewSubmission;
    } else if (status === 'SUBMISSION_CLOSED' || status === 'JUDGING' || status === 'COMPLETED') {
      buttonTitle = t('judgingInProgress');
      buttonSubtext = 'Submissions Closed';
      isDisabled = true;
    } else {
      // User is registered and submissions are active (matches screenshot!)
      buttonTitle = t('uploadSubmission');
      buttonSubtext = t('registered');
      buttonAction = onPressSubmit;
    }
  } else {
    // Unregistered user
    if (spotsLeft <= 0) {
      buttonTitle = t('housefull');
      buttonSubtext = 'All spots booked';
      isDisabled = true;
    } else if (status === 'REGISTRATION_CLOSED') {
      buttonTitle = t('registrationClosed');
      buttonSubtext = 'Deadline passed';
      isDisabled = true;
    } else {
      buttonTitle = `${t('registerNow')} • ₹${entryFee || 99}`;
      buttonSubtext = t('onlySpotsLeft', { count: spotsLeft });
      buttonAction = onPressRegister;
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.ctaButton, isDisabled && styles.disabledButton]}
        onPress={!isDisabled ? buttonAction : undefined}
        activeOpacity={0.85}
        disabled={isDisabled}
      >
        <Text style={styles.ctaTitle}>{buttonTitle}</Text>
        {buttonSubtext ? <Text style={styles.ctaSubtext}>{buttonSubtext}</Text> : null}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  ctaButton: {
    backgroundColor: COLORS.primaryTeal,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primaryTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  ctaSubtext: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
});
