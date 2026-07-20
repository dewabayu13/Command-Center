/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, UserRole } from '../types';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';
import { logger } from '../utils/logger';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role?: UserRole, additionalData?: { phoneNumber?: string; dusunId?: string }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (fullName: string, photoURL?: string, additionalData?: { phoneNumber?: string; dusunId?: string }) => Promise<void>;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Load persistent sessions on app mount
  useEffect(() => {
    async function initSession() {
      try {
        setLoading(true);
        // First handle any Google redirect sign-in result if in Firebase mode
        const redirectUser = await authService.handleRedirectResult();
        if (redirectUser) {
          setUser(redirectUser);
          toast(`Selamat datang kembali, ${redirectUser.fullName}!`, 'success', 'Sesi Aktif (Google)');
          return;
        }

        const savedUser = await authService.getPersistedSession();
        if (savedUser) {
          setUser(savedUser);
          logger.info(`Session restored for user: ${savedUser.fullName} (${savedUser.role})`);
        }
      } catch (error: any) {
        logger.error('Session restoration error:', error);
      } finally {
        setLoading(false);
      }
    }
    initSession();
  }, [toast]);

  // Handle standard email & password login
  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const authUser = await authService.login(email, password);
      setUser(authUser);
      toast(`Selamat datang kembali, ${authUser.fullName}!`, 'success', 'Login Berhasil');
    } catch (error: any) {
      toast(error.message || 'Gagal login. Periksa kembali email dan password Anda.', 'error', 'Login Gagal');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Handle registration
  const register = useCallback(async (
    email: string, 
    password: string, 
    fullName: string, 
    role: UserRole = UserRole.PUBLIC_USER,
    additionalData: { phoneNumber?: string; dusunId?: string } = {}
  ) => {
    try {
      setLoading(true);
      const authUser = await authService.register(email, password, fullName, role, additionalData);
      setUser(authUser);
      toast(`Registrasi berhasil! Selamat datang di EasyDes, ${fullName}.`, 'success', 'Pendaftaran Sukses');
    } catch (error: any) {
      toast(error.message || 'Pendaftaran gagal. Silakan coba kembali.', 'error', 'Pendaftaran Gagal');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Handle Google Login
  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      const authUser = await authService.loginWithGoogle();
      setUser(authUser);
      toast(`Selamat datang kembali, ${authUser.fullName}!`, 'success', 'Login Google Berhasil');
    } catch (error: any) {
      // If it is a redirect notification, don't show as hard error
      if (error.message && error.message.includes('dialihkan')) {
        toast(error.message, 'warning', 'Pengalihan Autentikasi');
      } else {
        toast(error.message || 'Gagal masuk menggunakan Google.', 'error', 'Autentikasi Gagal');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Handle Logout
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      toast('Sesi Anda telah diakhiri dengan aman.', 'success', 'Log Out Berhasil');
    } catch (error: any) {
      toast('Terjadi kesalahan saat mengakhiri sesi.', 'error', 'Log Out Gagal');
      logger.error('Log out error:', error);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Handle password reset
  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      await authService.resetPassword(email);
      toast(`Instruksi pengaturan ulang sandi telah dikirim ke email: ${email}`, 'success', 'Email Terkirim');
    } catch (error: any) {
      toast(error.message || 'Gagal mengirim email reset sandi.', 'error', 'Gagal Mengirim');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Handle Profile Update
  const updateProfile = useCallback(async (
    fullName: string, 
    photoURL?: string, 
    additionalData: { phoneNumber?: string; dusunId?: string } = {}
  ) => {
    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile(fullName, photoURL, additionalData);
      setUser(updatedUser);
      toast('Informasi profil Anda berhasil diperbarui.', 'success', 'Profil Diperbarui');
    } catch (error: any) {
      toast(error.message || 'Gagal memperbarui profil.', 'error', 'Pembaruan Gagal');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Check if current user role matches one of allowed roles (Role-Based Access Control)
  const hasPermission = useCallback((allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    // Super Admin has access to all roles by default
    if (user.role === UserRole.ADMIN) return true;
    return allowedRoles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      loginWithGoogle,
      logout,
      resetPassword,
      updateProfile,
      hasPermission
    }}>
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
