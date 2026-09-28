import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export const ImportantDatesCard = ({ dates }) => {
  const { t } = useLanguage();

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{t('importantDates')}</Text>

      <View style={styles.grid}>
        {/* Row 1 */}
        <View style={styles.row}>
          {/* Item 1: Register Before */}
          <View style={styles.gridItem}>
            <View style={styles.iconCircle}>
              <Feather name="calendar" size={18} color={COLORS.primaryTeal} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>{t('registerBefore')}</Text>
              <Text style={styles.itemDate}>10 Aug 26</Text>
              <Text style={styles.itemTime}>11:50 PM</Text>
            </View>
          </View>

          <View style={styles.verticalDivider} />

          {/* Item 2: Submission Starts */}
          <View style={styles.gridItem}>
            <View style={styles.iconCircle}>
              <Feather name="send" size={17} color={COLORS.primaryTeal} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>{t('submissionStarts')}</Text>
              <Text style={styles.itemDate}>6 Aug 26</Text>
              <Text style={styles.itemTime}>04:00 AM</Text>
            </View>
          </View>
        </View>

        <View style={styles.horizontalDivider} />

        {/* Row 2 */}
        <View style={styles.row}>
          {/* Item 3: Submission Ends */}
          <View style={styles.gridItem}>
            <View style={styles.iconCircle}>
              <Feather name="upload" size={18} color={COLORS.primaryTeal} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>{t('submissionEnds')}</Text>
              <Text style={styles.itemDate}>30 Aug 26</Text>
              <Text style={styles.itemTime}>11:55 PM</Text>
            </View>
          </View>

          <View style={styles.verticalDivider} />

          {/* Item 4: Result Date */}
          <View style={styles.gridItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="trophy-outline" size={19} color={COLORS.primaryTeal} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>{t('resultDate')}</Text>
              <Text style={styles.itemDate}>1 Sept 26</Text>
              <Text style={styles.itemTime}>11:50 PM</Text>
            </View>
          </View>
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
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  grid: {
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  gridItem: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  itemTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#F1F5F9',
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
});
