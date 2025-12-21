
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  login: async () => { },
  register: async () => { },
  signOut: async () => { },
});

export const AuthProvider = ({ children }) => {
  console.log("AuthProvider mounting");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await api.get('/auth/profile');
        setUser(data);
      } catch (error) {
        console.error('Session check failed', error);
        // Only clear token if it's an authentication error (401)
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data);
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('token', data.token);
      setUser(data);
      toast.success('Registration successful');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
  };

  // 'profile' is essentially the 'user' in this context, keeping it for compatibility
  const value = {
    user,
    profile: user,
    loading,
    login,
    register,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
