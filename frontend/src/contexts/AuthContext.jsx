import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Set up axios defaults
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Add axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    // Check if user is already logged in on component mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        logout();
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`http://localhost:5001/api/auth/${role}/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user in state
      setUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      setLoading(false);
      return false;
    }
  };

  const register = async (userData, role) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`http://localhost:5001/api/auth/${role}/register`, {
        ...userData,
        role
      });
      
      const { token, user } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user in state
      setUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    // Remove token and user data from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
    
    // Reset user in state
    setUser(null);
    setIsAuthenticated(false);
    return true;
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 