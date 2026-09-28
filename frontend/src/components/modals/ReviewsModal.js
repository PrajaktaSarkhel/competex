import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { api } from '../../services/api';

export const ReviewsModal = ({ visible, onClose, competitionId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && competitionId) {
      loadReviews();
    }
  }, [visible, competitionId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await api.getReviews(competitionId);
      if (res.success) {
        setReviews(res.data);
      }
    } catch (err) {
      console.warn('Reviews fetch failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Participant Testimonials</Text>
              <Text style={styles.subtitle}>Verified dancer reviews from Feedants competitions</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {reviews.map((rev, index) => (
              <View key={rev._id || index} style={styles.reviewCard}>
                <View style={styles.authorRow}>
                  <Image source={{ uri: rev.userAvatar }} style={styles.avatar} />
                  <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>{rev.userName}</Text>
                    <Text style={styles.authorRole}>{rev.userRole}</Text>
                  </View>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name="star"
                        size={14}
                        color={star <= rev.rating ? '#F59E0B' : '#E2E8F0'}
                      />
                    ))}
                  </View>
                </View>

                <Text style={styles.commentText}>"{rev.comment}"</Text>

                <View style={styles.badgeRow}>
                  <Ionicons name="checkmark-seal" size={13} color={COLORS.primaryTeal} />
                  <Text style={styles.badgeText}>Verified Paid Participant</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 20,
    gap: 12,
  },
  reviewCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: '#E2E8F0',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  authorRole: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  commentText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryTeal,
  },
});
