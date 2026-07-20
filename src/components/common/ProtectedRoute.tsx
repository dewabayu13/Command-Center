/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, Lock, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react';
import { SYSTEM_ROLES } from '../../constants';
import { LoadingBoundary } from './LoadingBoundary';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallbackToDashboard?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  fallbackToDashboard 
}) => {
  const { user, loading, hasPermission } = useAuth();

  // 1. Session is currently resolving
  if (loading) {
    return <LoadingBoundary variant="page" />;
  }

  // 2. User is not logged in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] h-full p-6 text-center">
        <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-inner">
          <Lock className="w-10 h-10 text-zinc-400 dark:text-zinc-600 animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mt-4">Portal Terkunci</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">
          Sesi Anda telah kedaluwarsa atau belum diautentikasi. Silakan masuk akun terlebih dahulu untuk melihat data modul ini.
        </p>
      </div>
    );
  }

  // 3. Role verification (Role-Based Access Control)
  if (allowedRoles && allowedRoles.length > 0 && !hasPermission(allowedRoles)) {
    // Look up human-readable roles names for display
    const requiredRoleNames = allowedRoles
      .map(role => SYSTEM_ROLES.find(r => r.role === role)?.label || role)
      .join(', ');

    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] h-full p-6 text-center">
        <div className="p-4 bg-rose-500/5 rounded-full border border-rose-500/10 shadow-lg shadow-rose-500/5 animate-bounce-slow">
          <ShieldAlert className="w-12 h-12 text-rose-500" />
        </div>
        
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mt-5">Akses Terbatas</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 max-w-md leading-relaxed">
          Maaf, akun Anda ({user.fullName} - <span className="font-semibold text-rose-500">{user.role}</span>) tidak memiliki wewenang untuk membuka halaman ini. 
        </p>

        {/* Authorized Roles badge group */}
        <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl max-w-md w-full">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono mb-2">
            <KeyRound className="w-3.5 h-3.5 text-indigo-500" /> Wewenang Yang Dibutuhkan
          </div>
          <p className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
            {requiredRoleNames}
          </p>
        </div>

        {/* Navigation Action */}
        {fallbackToDashboard && (
          <button
            onClick={fallbackToDashboard}
            className="mt-6 flex items-center gap-2 text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Kembali ke Beranda Utama</span>
          </button>
        )}
      </div>
    );
  }

  // 4. Authorized: Render protected section child nodes
  return <>{children}</>;
};
