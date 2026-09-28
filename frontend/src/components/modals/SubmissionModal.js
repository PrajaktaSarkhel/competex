import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { api } from '../../services/api';
import { useAuthUser } from '../../context/AuthUserContext';

const DANCE_STYLES = [
  'Kathak',
  'Bharatanatyam',
  'Odissi',
  'Kuchipudi',
  'Mohiniyattam',
  'Manipuri',
  'Kathakali',
];

export const SubmissionModal = ({
  visible,
  onClose,
  competition,
  existingSubmission,
  onSubmissionSuccess,
}) => {
  const { currentUser } = useAuthUser();
  const [title, setTitle] = useState('');
  const [danceStyle, setDanceStyle] = useState('Kathak');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=sample_classical_dance');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!visible) return null;

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Please provide a title for your performance.');
      return;
    }
    if (!videoUrl.trim()) {
      setError('Please provide a valid video URL or file link.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await api.submitEntry(competition._id, {
        userId: currentUser?._id,
        title,
        danceStyle,
        videoUrl,
        description,
        durationSeconds: 210,
      });

      if (res.success) {
        setIsSuccess(true);
        if (onSubmissionSuccess) {
          onSubmissionSuccess(res.submission);
        }
      } else {
        setError(res.message || 'Submission could not be recorded.');
      }
    } catch (err) {
      setError(err.message || 'Error occurred while submitting entry.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {existingSubmission ? 'Your Submission' : 'Upload Dance Submission'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {existingSubmission || isSuccess ? (
              <View style={styles.successBox}>
                <View style={styles.iconCircle}>
                  <Ionicons name="cloud-done" size={44} color={COLORS.primaryTeal} />
                </View>
                <Text style={styles.successTitle}>Entry Submitted!</Text>
                <Text style={styles.successDesc}>
                  Your classical dance performance has been registered and scheduled for judging by{' '}
                  {competition?.judge?.name || 'Manju Dubey'}.
                </Text>

                <View style={styles.detailsCard}>
                  <Text style={styles.detailTitle}>
                    {existingSubmission?.title || title || 'Classical Performance'}
                  </Text>
                  <Text style={styles.detailStyle}>
                    Style: {existingSubmission?.danceStyle || danceStyle}
                  </Text>
                  <Text style={styles.detailStatus}>
                    Status: {existingSubmission?.status || 'UNDER_REVIEW'}
                  </Text>
                </View>

                <TouchableOpacity style={styles.primaryBtn} onPress={handleClose}>
                  <Text style={styles.primaryBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {error && (
                  <View style={styles.errorAlert}>
                    <Feather name="alert-circle" size={16} color="#DC2626" style={{ marginRight: 6 }} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <Text style={styles.label}>Performance Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Kathak Tarana in Teentaal"
                  value={title}
                  onChangeText={setTitle}
                />

                <Text style={styles.label}>Classical Dance Form *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stylesScroll}>
                  {DANCE_STYLES.map((style) => (
                    <TouchableOpacity
                      key={style}
                      style={[
                        styles.stylePill,
                        danceStyle === style && styles.stylePillActive,
                      ]}
                      onPress={() => setDanceStyle(style)}
                    >
                      <Text
                        style={[
                          styles.stylePillText,
                          danceStyle === style && styles.stylePillTextActive,
                        ]}
                      >
                        {style}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.label}>Video Link (YouTube / Drive / MP4) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://youtu.be/... or Drive link"
                  value={videoUrl}
                  onChangeText={setVideoUrl}
                  autoCapitalize="none"
                />

                <Text style={styles.label}>Performance Notes / Description (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Mention Raag, Taal, Guru lineage, or choreography notes..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />

                <View style={styles.guidelineAlert}>
                  <Feather name="info" size={15} color={COLORS.primaryTeal} style={{ marginRight: 6 }} />
                  <Text style={styles.guidelineText}>
                    Ensure your video has clear lighting, visible footwork (tatkar), and audible rhythm.
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.primaryBtn, loading && styles.disabledBtn]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryBtnText}>Submit Entry for Review</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
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
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  stylesScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  stylePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
    backgroundColor: '#F8FAFC',
  },
  stylePillActive: {
    backgroundColor: '#E8F5F3',
    borderColor: COLORS.primaryTeal,
  },
  stylePillText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  stylePillTextActive: {
    color: COLORS.primaryTeal,
    fontWeight: '700',
  },
  guidelineAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8F6',
    padding: 10,
    borderRadius: 10,
    marginTop: 14,
    marginBottom: 16,
  },
  guidelineText: {
    fontSize: 11,
    color: '#0F172A',
    flex: 1,
    lineHeight: 16,
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 12,
    color: '#B91C1C',
    flex: 1,
  },
  primaryBtn: {
    backgroundColor: COLORS.primaryTeal,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  successDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 4,
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  detailStyle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  detailStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryTeal,
    marginTop: 4,
  },
});
