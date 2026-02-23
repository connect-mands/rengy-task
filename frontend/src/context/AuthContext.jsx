import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import { api, setAccessToken } from '../api/client';

const REFRESH_KEY = 'refresh_token';
const COOKIE_OPTS = { sameSite: 'strict', secure: window.location.protocol === 'https:' };

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    const refreshToken = Cookies.get(REFRESH_KEY);
    if (!refreshToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api('POST', '/api/auth/refresh', { refreshToken });
      setAccessToken(data.accessToken);
      Cookies.set(REFRESH_KEY, data.refreshToken, { ...COOKIE_OPTS, expires: 7 });
      const me = await api('GET', '/api/auth/me');
      setUser(me.data.user);
      return true;
    } catch (_) {
      Cookies.remove(REFRESH_KEY);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      refreshAuth();
    }, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, refreshAuth]);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = useCallback(async (email, password) => {
    const { data } = await api('POST', '/api/auth/signin', { email, password });
    setAccessToken(data.accessToken);
    Cookies.set(REFRESH_KEY, data.refreshToken, { ...COOKIE_OPTS, expires: 7 });
    setUser(data.user);
    return data;
  }, []);

  const signup = useCallback(async (email, password, name) => {
    const { data } = await api('POST', '/api/auth/signup', { email, password, name });
    setAccessToken(data.accessToken);
    Cookies.set(REFRESH_KEY, data.refreshToken, { ...COOKIE_OPTS, expires: 7 });
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    Cookies.remove(REFRESH_KEY);
    setUser(null);
  }, []);

  const value = { user, loading, login, signup, logout, refreshAuth };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
