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
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { api } from '../../services/api';
import { useAuthUser } from '../../context/AuthUserContext';

export const RegistrationModal = ({ visible, onClose, competition, onRegisteredSuccess }) => {
  const { currentUser } = useAuthUser();
  const [userName, setUserName] = useState(currentUser?.name || 'Priya Patel');
  const [userEmail, setUserEmail] = useState(currentUser?.email || 'priya@feedants.com');
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '+91 98765 12345');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NETBANKING'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successData, setSuccessData] = useState(null);

  if (!visible) return null;

  const handleRegister = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await api.register(competition._id, {
        userId: currentUser?._id,
        userName,
        userEmail,
        userPhone,
        paymentMethod: `Razorpay ${paymentMethod}`,
        paymentId: `pay_rzp_${Date.now()}`,
      });

      if (res.success) {
        setSuccessData(res);
        if (onRegisteredSuccess) {
          onRegisteredSuccess(res.registration);
        }
      } else {
        setErrorMessage(res.message || 'Registration could not be completed.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessData(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {successData ? 'Registration Confirmed!' : 'Competition Checkout'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {successData ? (
              // Success View
              <View style={styles.successContainer}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark-circle" size={48} color={COLORS.primaryTeal} />
                </View>
                <Text style={styles.successHeading}>You're In!</Text>
                <Text style={styles.successSubtext}>
                  You have successfully booked your spot for {competition?.title}.
                </Text>

                <View style={styles.receiptBox}>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Participant:</Text>
                    <Text style={styles.receiptVal}>{userName}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Spots Remaining:</Text>
                    <Text style={styles.receiptVal}>{successData.competition?.spotsLeft} spots</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Transaction ID:</Text>
                    <Text style={styles.receiptVal}>
                      {successData.registration?.payment?.paymentId?.slice(0, 16)}...
                    </Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Amount Paid:</Text>
                    <Text style={[styles.receiptVal, { color: COLORS.primaryTeal, fontWeight: '800' }]}>
                      ₹ {competition?.entryFee}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.doneBtn} onPress={handleClose}>
                  <Text style={styles.doneBtnText}>Continue to Competition</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Form View
              <View>
                {/* Competition Brief */}
                <View style={styles.compBrief}>
                  <Text style={styles.compBriefTitle}>{competition?.title}</Text>
                  <View style={styles.compBriefRow}>
                    <Text style={styles.compBriefFee}>Fee: ₹ {competition?.entryFee || 99}</Text>
                    <Text style={styles.compBriefSpots}>
                      {competition?.spotsLeft} of {competition?.totalSpots} spots left
                    </Text>
                  </View>
                </View>

                {errorMessage && (
                  <View style={styles.errorAlert}>
                    <Feather name="alert-circle" size={16} color="#EF4444" style={{ marginRight: 6 }} />
                    <Text style={styles.errorAlertText}>{errorMessage}</Text>
                  </View>
                )}

                {/* Participant Fields */}
                <Text style={styles.fieldLabel}>Participant Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="Your Full Name"
                  placeholderTextColor={COLORS.textMuted}
                />

                <Text style={styles.fieldLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={userEmail}
                  onChangeText={setUserEmail}
                  placeholder="your.email@example.com"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.fieldLabel}>Phone Number (WhatsApp)</Text>
                <TextInput
                  style={styles.input}
                  value={userPhone}
                  onChangeText={setUserPhone}
                  placeholder="+91 98765 43210"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="phone-pad"
                />

                {/* Payment Method Selector */}
                <Text style={styles.fieldLabel}>Select Payment Method</Text>
                <View style={styles.paymentMethodsRow}>
                  {['UPI', 'CARD', 'NETBANKING'].map((method) => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.payMethodBtn,
                        paymentMethod === method && styles.payMethodBtnActive,
                      ]}
                      onPress={() => setPaymentMethod(method)}
                    >
                      <Text
                        style={[
                          styles.payMethodText,
                          paymentMethod === method && styles.payMethodTextActive,
                        ]}
                      >
                        {method === 'UPI' ? 'UPI / GPay' : method === 'CARD' ? 'Card' : 'NetBanking'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Trust guarantee */}
                <View style={styles.trustBadge}>
                  <MaterialCommunityIcons name="shield-check" size={16} color={COLORS.primaryTeal} />
                  <Text style={styles.trustText}>
                    100% Secure 256-bit encrypted checkout via Razorpay
                  </Text>
                </View>

                {/* Submit Action */}
                <TouchableOpacity
                  style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitBtnText}>
                      Pay ₹ {competition?.entryFee || 99} & Confirm Spot
                    </Text>
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
  compBrief: {
    backgroundColor: '#E8F5F3',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BCE8E2',
  },
  compBriefTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  compBriefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  compBriefFee: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryTeal,
  },
  compBriefSpots: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  errorAlertText: {
    fontSize: 12,
    color: '#B91C1C',
    fontWeight: '600',
    flex: 1,
  },
  fieldLabel: {
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
  paymentMethodsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  payMethodBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  payMethodBtnActive: {
    borderColor: COLORS.primaryTeal,
    backgroundColor: '#E8F5F3',
  },
  payMethodText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  payMethodTextActive: {
    color: COLORS.primaryTeal,
    fontWeight: '700',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 16,
  },
  trustText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  submitBtn: {
    backgroundColor: COLORS.primaryTeal,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  successSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 8,
    marginBottom: 20,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receiptLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  receiptVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  doneBtn: {
    backgroundColor: COLORS.primaryTeal,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
