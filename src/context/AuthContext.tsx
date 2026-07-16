/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { SYSTEM_USERS } from '../data';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, role: UserRole, password?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load existing session from localStorage
    const savedUser = localStorage.getItem('slr_tech_hub_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user session', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: UserRole, password?: string): Promise<boolean> => {
    // Look up user details in our preset list
    const foundUser = SYSTEM_USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.role === role && 
      (!u.password || u.password === password)
    );
    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem('slr_tech_hub_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('slr_tech_hub_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
