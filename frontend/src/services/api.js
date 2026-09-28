import { Platform } from 'react-native';

// For Android emulator, localhost is 10.0.2.2. For web / iOS, localhost is 127.0.0.1 or localhost
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

const BASE_URL = getBaseUrl();

export const api = {
  // Fetch competition details with user registration status
  getCompetition: async (slugOrId = 'feedants-classical-dance', userId = null) => {
    try {
      const url = new URL(`${BASE_URL}/competitions/${slugOrId}`);
      if (userId) url.searchParams.append('userId', userId);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API getCompetition failed, error:', err.message);
      throw err;
    }
  },

  // Register for competition
  register: async (competitionId, data) => {
    const res = await fetch(`${BASE_URL}/competitions/${competitionId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  // Upload / submit competition entry
  submitEntry: async (competitionId, data) => {
    const res = await fetch(`${BASE_URL}/competitions/${competitionId}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  // Get current user submission
  getMySubmission: async (competitionId, userId) => {
    const res = await fetch(
      `${BASE_URL}/competitions/${competitionId}/submissions/me?userId=${userId}`
    );
    return await res.json();
  },

  // Get competition reviews
  getReviews: async (competitionId) => {
    const res = await fetch(`${BASE_URL}/competitions/${competitionId}/reviews`);
    return await res.json();
  },

  // Get dev users for testing
  getDevUsers: async () => {
    const res = await fetch(`${BASE_URL}/dev/users`);
    return await res.json();
  },

  // Reset database with initial Feedants demo data
  resetSeedData: async () => {
    const res = await fetch(`${BASE_URL}/dev/reset-seed`, { method: 'POST' });
    return await res.json();
  },

  // Update lifecycle state (Admin override)
  updateLifecycle: async (competitionId, manualStatus) => {
    const res = await fetch(`${BASE_URL}/competitions/${competitionId}/admin/lifecycle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manualStatus }),
    });
    return await res.json();
  },

  // Run concurrency simulation test
  simulateConcurrency: async (competitionId, totalAttempts = 25) => {
    const res = await fetch(`${BASE_URL}/dev/simulate-concurrency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ competitionId, totalAttempts }),
    });
    return await res.json();
  },
};
