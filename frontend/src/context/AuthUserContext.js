import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthUserContext = createContext();

export const AuthUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await api.getDevUsers();
      if (res.success && res.users.length > 0) {
        setAvailableUsers(res.users);
        // Default to Rahul Sharma (who is registered, matching the screenshot!)
        const defaultUser = res.users.find((u) => u.email === 'rahul@feedants.com') || res.users[0];
        setCurrentUser(defaultUser);
      }
    } catch (err) {
      console.warn('Could not fetch dev users, using fallback mock user:', err.message);
      // Fallback mock user if backend not yet reached
      const fallback = {
        _id: '64e000000000000000000001',
        name: 'Rahul Sharma',
        email: 'rahul@feedants.com',
        phone: '+91 98765 43210',
      };
      setCurrentUser(fallback);
      setAvailableUsers([
        fallback,
        {
          _id: '64e000000000000000000002',
          name: 'Priya Patel',
          email: 'priya@feedants.com',
          phone: '+91 98765 12345',
        },
      ]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const switchUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <AuthUserContext.Provider
      value={{
        currentUser,
        availableUsers,
        loadingUsers,
        switchUser,
        refreshUsers: fetchUsers,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};

export const useAuthUser = () => {
  const context = useContext(AuthUserContext);
  if (!context) {
    throw new Error('useAuthUser must be used within an AuthUserProvider');
  }
  return context;
};
