import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export const AdPlaceholder = () => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="bullhorn-outline" size={16} color={COLORS.textMuted} style={{ marginRight: 6 }} />
      <Text style={styles.text}>{t('adHere')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});
