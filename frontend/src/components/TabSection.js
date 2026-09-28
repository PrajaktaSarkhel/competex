import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export const TabSection = ({ competition }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('about'); // 'about' | 'judging' | 'rules'
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs = [
    { id: 'about', label: t('aboutCompetition') },
    { id: 'judging', label: t('judgingParameters') },
    { id: 'rules', label: t('rulesAndEligibility') },
  ];

  return (
    <View style={styles.card}>
      {/* Tabs Header */}
      <View style={styles.tabsHeader}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Content */}
      <View style={styles.contentArea}>
        {/* Tab 1: About Competition */}
        {activeTab === 'about' && (
          <View>
            <Text style={styles.bodyText}>
              {competition?.about?.summary ||
                'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.'}
            </Text>

            {isExpanded && (
              <View style={styles.expandedContent}>
                <Text style={styles.bodyTextSecondary}>
                  {competition?.about?.fullDescription ||
                    'Feedants Classical Dance Championship is a premier national initiative aimed at identifying, nurturing, and spotlighting classical dance talent across India.'}
                </Text>

                <Text style={styles.subHeading}>Key Guidelines:</Text>
                {(competition?.about?.guidelines || [
                  'Perform any classical dance form of India (Kathak, Bharatanatyam, Odissi, etc.).',
                  'Solo performances only. Group entries are not permitted.',
                  'High definition video recording with clear facial expressions and audible rhythm.',
                  'Original performance recorded within the last 6 months.',
                ]).map((guideline, index) => (
                  <View key={index} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{guideline}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* View More / View Less Toggle */}
            <TouchableOpacity
              style={styles.viewMoreRow}
              onPress={() => setIsExpanded(!isExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.viewMoreText}>
                {isExpanded ? t('viewLess') : t('viewMore')}
              </Text>
              <Feather
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={COLORS.primaryTeal}
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Tab 2: Judging Parameters */}
        {activeTab === 'judging' && (
          <View style={styles.judgingList}>
            {(
              competition?.judgingParameters || [
                {
                  parameter: 'Taal & Laya (Rhythm & Timing)',
                  weightage: '30%',
                  description: 'Precision of footwork, rhythmic clarity, and mastery over tempo.',
                },
                {
                  parameter: 'Bhava & Abhinaya (Expressions)',
                  weightage: '30%',
                  description: 'Facial expressions, emotive conveyance, eye movements, and storytelling.',
                },
                {
                  parameter: 'Angashuddhi (Posture & Technique)',
                  weightage: '25%',
                  description: 'Geometric body alignment, hand mudras, and graceful balance.',
                },
                {
                  parameter: 'Aharya (Costume & Presentation)',
                  weightage: '15%',
                  description: 'Authenticity of costume, ghungroo, and aesthetic stage presence.',
                },
              ]
            ).map((item, index) => (
              <View key={index} style={styles.judgingItem}>
                <View style={styles.judgingHeader}>
                  <Text style={styles.judgingTitle}>{item.parameter}</Text>
                  <View style={styles.weightageBadge}>
                    <Text style={styles.weightageText}>{item.weightage}</Text>
                  </View>
                </View>
                <Text style={styles.judgingDesc}>{item.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Tab 3: Rules & Eligibility */}
        {activeTab === 'rules' && (
          <View style={styles.rulesList}>
            {(
              competition?.rulesAndEligibility || [
                {
                  title: 'Eligibility',
                  description: 'Open to dancers worldwide of all age groups. Age-appropriate evaluation applied.',
                },
                {
                  title: 'Format',
                  description: 'Video submission format (.mp4, .mov, or unlisted YouTube/Drive link).',
                },
                {
                  title: 'Originality',
                  description: 'Entry must be danced by the registered participant within the current cycle.',
                },
                {
                  title: 'Disqualification Criteria',
                  description:
                    'Lip-syncing, edited cuts in dance sequence, or submitting others work will lead to disqualification.',
                },
              ]
            ).map((rule, index) => (
              <View key={index} style={styles.ruleItem}>
                <Text style={styles.ruleTitle}>{rule.title}</Text>
                <Text style={styles.ruleDesc}>{rule.description}</Text>
              </View>
            ))}
          </View>
        )}
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
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  tabsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginRight: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: COLORS.primaryTeal,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.primaryTeal,
    fontWeight: '700',
  },
  contentArea: {
    paddingVertical: 4,
  },
  bodyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  expandedContent: {
    marginTop: 8,
  },
  bodyTextSecondary: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletDot: {
    fontSize: 14,
    color: COLORS.primaryTeal,
    marginRight: 6,
    lineHeight: 18,
  },
  bulletText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  viewMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 4,
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryTeal,
  },
  judgingList: {
    gap: 10,
  },
  judgingItem: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  judgingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  judgingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  weightageBadge: {
    backgroundColor: '#E8F5F3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  weightageText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryTeal,
  },
  judgingDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  rulesList: {
    gap: 10,
  },
  ruleItem: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  ruleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  ruleDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
});
