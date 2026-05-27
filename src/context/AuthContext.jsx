import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await api.get('/auth/me'); // Optional: check if token is valid
        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    // For now, check local storage or just keep it simple
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = async () => {
    await api.get('/auth/logout');
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
