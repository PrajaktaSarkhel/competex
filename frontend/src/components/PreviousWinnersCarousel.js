import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

const WINNER_ASSETS = {
  'Riya Shah': require('../../assets/winner_riya_shah.jpg'),
  'Aarav Mehta': require('../../assets/winner_aarav_mehta.jpg'),
  'Neha Verma': require('../../assets/winner_neha_verma.jpg'),
  'Ishita Chouhan': require('../../assets/winner_ishita_chouhan.jpg'),
};

export const PreviousWinnersCarousel = ({ winners = [], onPlayVideo }) => {
  const { t } = useLanguage();

  const defaultWinners = [
    {
      name: 'Riya Shah',
      position: '1st Winner',
      image: require('../../assets/winner_riya_shah.jpg'),
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    },
    {
      name: 'Aarav Mehta',
      position: '1st Winner',
      image: require('../../assets/winner_aarav_mehta.jpg'),
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
      name: 'Neha Verma',
      position: '2nd Winner',
      image: require('../../assets/winner_neha_verma.jpg'),
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    },
    {
      name: 'Ishita Chouhan',
      position: '3rd Winner',
      image: require('../../assets/winner_ishita_chouhan.jpg'),
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    },
  ];

  const displayWinners = winners.length > 0 ? winners : defaultWinners;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('previousWinners')}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displayWinners.map((winner, index) => {
          const imageSource =
            WINNER_ASSETS[winner.name] || (typeof winner.image === 'string' ? { uri: winner.image } : winner.image);

          return (
            <TouchableOpacity
              key={`${winner.name}-${index}`}
              style={styles.card}
              onPress={() =>
                onPlayVideo &&
                onPlayVideo(
                  winner.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                  `${winner.name} - Winning Performance (${winner.position})`
                )
              }
              activeOpacity={0.8}
            >
              {/* Image Container with Play Overlay */}
              <View style={styles.imageWrapper}>
                <Image source={imageSource} style={styles.winnerImage} resizeMode="cover" />
                <View style={styles.playOverlay}>
                  <View style={styles.playIconCircle}>
                    <Ionicons name="play" size={14} color="#FFFFFF" style={{ marginLeft: 2 }} />
                  </View>
                </View>
              </View>

              {/* Name & Position */}
              <View style={styles.infoWrapper}>
                <Text style={styles.winnerName} numberOfLines={1}>
                  {winner.name}
                </Text>
                <Text style={styles.winnerPosition}>{winner.position}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  scrollContent: {
    paddingRight: 16,
    gap: 12,
  },
  card: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  imageWrapper: {
    width: '100%',
    height: 100,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  winnerImage: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
  },
  playIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(10, 112, 103, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  infoWrapper: {
    padding: 8,
  },
  winnerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  winnerPosition: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primaryTeal,
  },
});
