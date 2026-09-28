import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export const RefundPolicyModal = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <MaterialCommunityIcons name="shield-check" size={20} color={COLORS.primaryTeal} />
              <Text style={styles.title}>Feedants Refund Policy</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.p}>
              At Feedants, we take transparency and participant satisfaction seriously. Here are the clear guidelines regarding entry fee refunds:
            </Text>

            <View style={styles.clause}>
              <Text style={styles.clauseTitle}>1. 100% Refund on Cancellation</Text>
              <Text style={styles.clauseText}>
                If a competition is canceled, rescheduled by more than 14 days, or fails to meet the minimum participant quota, 100% of your entry fee will be immediately refunded back to your original source of payment within 48 hours.
              </Text>
            </View>

            <View style={styles.clause}>
              <Text style={styles.clauseTitle}>2. Cancellation by Participant</Text>
              <Text style={styles.clauseText}>
                Participants may request a cancellation and full refund up to 24 hours before the Registration Closes deadline. Once submissions commence or judging begins, fees become non-refundable as judging allocations are locked.
              </Text>
            </View>

            <View style={styles.clause}>
              <Text style={styles.clauseTitle}>3. Instant UPI Reimbursement</Text>
              <Text style={styles.clauseText}>
                Approved refunds are processed via Razorpay directly to your linked UPI VPA or bank account without administrative deduction.
              </Text>
            </View>

            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
              <Text style={styles.doneBtnText}>Understood</Text>
            </TouchableOpacity>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
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
  p: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  clause: {
    marginBottom: 14,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  clauseTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  clauseText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  doneBtn: {
    backgroundColor: COLORS.primaryTeal,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
