import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirebaseToken } from '../config/firebase';
import axios from 'axios';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL ;

import socket from '../services/socket';

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);


  // Join socket room when user changes
  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  }, [user]);

  // Sync token to server
  const syncFcmToken = async (authToken) => {
    try {
      const fcmToken = await getFirebaseToken();
      if (fcmToken) {
        await axios.put(`${API_BASE_URL}/users/fcm-token`, { fcmToken }, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('FCM token synced to server');
      }
    } catch (err) {
      console.error('Failed to sync FCM token:', err);
    }
  };

  // Bootstrap from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser  = localStorage.getItem('user');
    if (storedToken && storedUser) {
      const parsedToken = storedToken;
      setToken(parsedToken);
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        syncFcmToken(parsedToken);
      } catch {
        // corrupted — clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    syncFcmToken(authToken);
    
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
  };

  const updateUser = (updatedUserData) => {
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated, isAdmin, loading,}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
