
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'doisAuth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth) {
        setIsAuthenticated(JSON.parse(storedAuth));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key “${AUTH_STORAGE_KEY}”:`, error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = () => {
    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(true));
      setIsAuthenticated(true);
    } catch (error) {
       console.warn(`Error setting localStorage key “${AUTH_STORAGE_KEY}”:`, error);
    }
  };

  const logout = () => {
     try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(false));
      setIsAuthenticated(false);
    } catch (error) {
       console.warn(`Error setting localStorage key “${AUTH_STORAGE_KEY}”:`, error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
