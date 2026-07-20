/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Bell, Shield, Check, Mail, Landmark, MessageSquare, AlertCircle } from 'lucide-react';
import { ClockWidget } from './ClockWidget';
import { WeatherWidget } from './WeatherWidget';
import { motion, AnimatePresence } from 'motion/react';

export const Topbar: React.FC = () => {
  const { 
    activePage, 
    currentRole, 
    setCurrentRole, 
    notifications, 
    markNotificationAsRead 
  } = useApp();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const pageNames: { [key: string]: string } = {
    dashboard: 'Command Center',
    population: 'Administrasi Kependudukan',
    attendance: 'Monitoring Presensi Aparatur',
    letters: 'Layanan Surat Digital',
    tax: 'Sistem Monitoring Pajak PBB',
    finance: 'Transparansi Keuangan APBDes',
    projects: 'Monitoring Pembangunan Desa',
    cctv: 'CCTV Pengawasan Terpadu',
    assets: 'Manajemen Inventaris Aset',
    complaints: 'Pusat Aduan & Keluhan Warga'
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'letter': return <Mail className="w-4 h-4 text-indigo-500" />;
      case 'tax': return <Landmark className="w-4 h-4 text-amber-500" />;
      case 'complaint': return <MessageSquare className="w-4 h-4 text-rose-500" />;
      default: return <AlertCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <header className="fixed lg:sticky top-14 lg:top-0 left-0 w-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 z-30 px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all duration-300">
      
      {/* Breadcrumb & Navigation Info */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          <span>EasyDes</span>
          <span>/</span>
          <span>{activePage === 'dashboard' ? 'Overview' : 'Modul'}</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mt-0.5">
          {pageNames[activePage] || 'Command Center'}
        </h1>
      </div>

      {/* Widgets & Control Group */}
      <div className="flex flex-wrap items-center gap-4 ml-auto">
        
        {/* Dynamic Widgets */}
        <WeatherWidget />
        <ClockWidget />

        {/* Interactive Simulation Role Selector */}
        <div className="relative flex items-center gap-2 bg-indigo-500/5 dark:bg-indigo-400/5 px-3 py-1.5 rounded-xl border border-indigo-500/10 dark:border-indigo-400/10">
          <Shield className="w-4 h-4 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-[9px] text-indigo-500 dark:text-indigo-400/80 font-bold uppercase leading-none font-mono">Simulasi Peran</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent border-none text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:ring-0 cursor-pointer pr-1 py-0 select-none outline-none"
            >
              {Object.values(UserRole).map((role) => (
                <option key={role} value={role} className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100">
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notification Center */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-all relative border border-zinc-200/30 dark:border-zinc-700/30 shadow-sm"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md shadow-rose-500/30">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-150 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-800 dark:text-white">Pusat Notifikasi</span>
                    {unreadCount > 0 && (
                      <span className="text-xs text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full font-semibold font-mono">
                        {unreadCount} Baru
                      </span>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800 custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-zinc-400">
                        Tidak ada notifikasi aktif.
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-3.5 flex gap-3 transition-colors ${notif.read ? 'opacity-70 bg-white dark:bg-zinc-900' : 'bg-indigo-50/20 dark:bg-indigo-500/5'}`}
                        >
                          <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 h-9 w-9 flex items-center justify-center">
                            {getCategoryIcon(notif.category)}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{notif.title}</h4>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight">{notif.description}</p>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 block font-mono">{notif.timestamp}</span>
                          </div>
                          {!notif.read && (
                            <button
                              onClick={() => markNotificationAsRead(notif.id)}
                              className="p-1 rounded-full text-indigo-500 hover:bg-indigo-50 dark:hover:bg-zinc-800 h-6 w-6 flex items-center justify-center"
                              title="Tandai selesai dibaca"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
};
