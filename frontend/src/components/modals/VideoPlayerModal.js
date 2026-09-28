import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export const VideoPlayerModal = ({ visible, onClose, videoUrl, videoTitle }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {videoTitle || 'Performance Video'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Video Container */}
          <View style={styles.videoWrapper}>
            {Platform.OS === 'web' ? (
              <video
                src={videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                controls
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000000' }}
              />
            ) : (
              <View style={styles.mobileMockPlayer}>
                <Ionicons name="play-circle" size={64} color={COLORS.primaryTeal} />
                <Text style={styles.mockPlayerText}>Playing: {videoTitle}</Text>
                <Text style={styles.mockPlayerSub}>Tap to toggle video controls</Text>
              </View>
            )}
          </View>

          {/* Footer note */}
          <View style={styles.footer}>
            <Feather name="award" size={14} color={COLORS.primaryTeal} style={{ marginRight: 6 }} />
            <Text style={styles.footerText}>Feedants Certified Classical Arts Channel</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  videoWrapper: {
    width: '100%',
    height: 315,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileMockPlayer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mockPlayerText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  mockPlayerSub: {
    fontSize: 12,
    color: '#94A3B8',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#1E293B',
  },
  footerText: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '500',
  },
});
