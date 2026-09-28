import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export const BottomNavBar = ({ activeTab = 'competitions', onTabPress }) => {
  const { t } = useLanguage();

  return (
    <View style={styles.navBar}>
      {/* 1. Home */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabPress && onTabPress('home')}
        activeOpacity={0.7}
      >
        <Feather
          name="home"
          size={20}
          color={activeTab === 'home' ? COLORS.primaryTeal : COLORS.textMuted}
        />
        <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
          {t('home')}
        </Text>
      </TouchableOpacity>

      {/* 2. Explore */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabPress && onTabPress('explore')}
        activeOpacity={0.7}
      >
        <Feather
          name="search"
          size={20}
          color={activeTab === 'explore' ? COLORS.primaryTeal : COLORS.textMuted}
        />
        <Text style={[styles.navLabel, activeTab === 'explore' && styles.navLabelActive]}>
          {t('explore')}
        </Text>
      </TouchableOpacity>

      {/* 3. Create Action (+) */}
      <TouchableOpacity
        style={styles.createButtonWrapper}
        onPress={() => onTabPress && onTabPress('create')}
        activeOpacity={0.85}
      >
        <View style={styles.createButtonCircle}>
          <Feather name="plus" size={24} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      {/* 4. Competitions (Active) */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabPress && onTabPress('competitions')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="trophy"
          size={20}
          color={activeTab === 'competitions' ? COLORS.primaryTeal : COLORS.textMuted}
        />
        <Text style={[styles.navLabel, activeTab === 'competitions' && styles.navLabelActive]}>
          {t('competitions')}
        </Text>
      </TouchableOpacity>

      {/* 5. Profile */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabPress && onTabPress('profile')}
        activeOpacity={0.7}
      >
        <Image
          source={require('../../assets/user_profile_avatar.jpg')}
          style={[styles.profileAvatar, activeTab === 'profile' && styles.profileAvatarActive]}
        />
        <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>
          {t('profile')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 3,
  },
  navLabelActive: {
    color: COLORS.primaryTeal,
    fontWeight: '700',
  },
  createButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -2,
    flex: 1,
  },
  createButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryTeal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primaryTeal,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  profileAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  profileAvatarActive: {
    borderColor: COLORS.primaryTeal,
    borderWidth: 2,
  },
});
