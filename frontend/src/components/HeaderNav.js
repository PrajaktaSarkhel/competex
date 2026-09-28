import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export const HeaderNav = ({ onOpenDevControls }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Mock iOS / Android Status Bar */}
      <View style={styles.statusBarMock}>
        <Text style={styles.statusTime}>9:41</Text>
        <View style={styles.statusIcons}>
          <Feather name="bar-chart-2" size={14} color="#000" style={styles.statusIcon} />
          <Feather name="wifi" size={14} color="#000" style={styles.statusIcon} />
          <Feather name="battery" size={16} color="#000" style={styles.statusIcon} />
        </View>
      </View>

      {/* Main Navigation Row */}
      <View style={styles.navRow}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={COLORS.textPrimary} />
          <Text style={styles.backText}>{t('goBack')}</Text>
        </TouchableOpacity>

        {/* Right Actions: Dev Tools + Language Switcher */}
        <View style={styles.rightActions}>
          {/* Quick Dev / Demo Controls Button */}
          {onOpenDevControls && (
            <TouchableOpacity
              style={styles.devButton}
              onPress={onOpenDevControls}
              title="Demo Controls"
              activeOpacity={0.7}
            >
              <Feather name="sliders" size={16} color={COLORS.primaryTeal} />
            </TouchableOpacity>
          )}

          {/* Language Toggle: ENG / हिंदी */}
          <View style={styles.languageToggle}>
            <TouchableOpacity
              style={[
                styles.langBtn,
                language === 'ENG' ? styles.langBtnActive : styles.langBtnInactive,
              ]}
              onPress={() => setLanguage('ENG')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.langText,
                  language === 'ENG' ? styles.langTextActive : styles.langTextInactive,
                ]}
              >
                ENG
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langBtn,
                language === 'हिंदी' ? styles.langBtnActive : styles.langBtnInactive,
              ]}
              onPress={() => setLanguage('हिंदी')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.langText,
                  language === 'हिंदी' ? styles.langTextActive : styles.langTextInactive,
                ]}
              >
                हिंदी
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  statusBarMock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 8,
  },
  statusTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIcon: {
    marginLeft: 4,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  devButton: {
    backgroundColor: COLORS.primaryTealLight,
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primaryTealBorder,
  },
  languageToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  langBtnActive: {
    backgroundColor: COLORS.primaryTeal,
  },
  langBtnInactive: {
    backgroundColor: '#FFFFFF',
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
  },
  langTextActive: {
    color: '#FFFFFF',
  },
  langTextInactive: {
    color: COLORS.textSecondary,
  },
});
