import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      if (data.success) {
        setUser(data.data);
        toast.success(`Welcome back, ${data.data.name}!`);
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', userData);
      if (data.success) {
        setUser(data.data);
        toast.success('Account created successfully!');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (email) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/send-otp', { email });
      if (data.success) {
        toast.success(data.message || `OTP sent to ${email}`);
        return data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordWithOtp = async (email, otp, newPassword) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/reset-password-otp', { email, otp, newPassword });
      if (data.success) {
        setUser(data.data);
        toast.success(data.message || 'Password reset successfully!');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithOtp = async (email, otp) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login-otp', { email, otp });
      if (data.success) {
        setUser(data.data);
        toast.success(`Welcome back, ${data.data.name}!`);
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (updatedFields) => {
    try {
      const { data } = await API.put('/auth/profile', updatedFields);
      if (data.success) {
        setUser(data.data);
        toast.success('Profile updated successfully');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        sendOtp,
        resetPasswordWithOtp,
        loginWithOtp,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
