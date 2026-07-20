/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileText,
  Landmark,
  CircleDollarSign,
  Hammer,
  Video,
  Package,
  MessageSquareWarning,
  Menu,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Workflow,
  LogOut,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, currentRole } = useApp();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'population', label: 'Kependudukan', icon: Users },
    { id: 'attendance', label: 'Presensi Aparatur', icon: ClipboardCheck },
    { id: 'letters', label: 'Layanan Surat', icon: FileText },
    { id: 'tax', label: 'Pajak PBB', icon: Landmark },
    { id: 'finance', label: 'Keuangan APBDes', icon: CircleDollarSign },
    { id: 'projects', label: 'Pembangunan Desa', icon: Hammer },
    { id: 'cctv', label: 'Pantau CCTV', icon: Video },
    { id: 'assets', label: 'Aset Desa', icon: Package },
    { id: 'complaints', label: 'Aduan Warga', icon: MessageSquareWarning }
  ];

  const handlePageSelect = (pageId: string) => {
    setActivePage(pageId);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-zinc-950 text-zinc-100 border-r border-zinc-900 shadow-xl transition-all duration-300">
      {/* Brand Header */}
      <div>
        <div className={`p-5 flex items-center justify-between border-b border-zinc-900 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
              <Workflow className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-sm font-bold tracking-tight text-white uppercase">EasyDes</h2>
                <p className="text-[10px] text-zinc-400 font-medium font-mono">COMMAND CENTER</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button 
              onClick={() => setIsCollapsed(true)} 
              className="hidden lg:block p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* User Role Quick Glance */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-b border-zinc-900 bg-zinc-900/20">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col gap-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" /> {user ? user.fullName.split(' ')[0] : 'Otorisasi Sesi'}
              </span>
              <span className="text-xs font-semibold text-indigo-400 truncate">{currentRole}</span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handlePageSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`} />
                {!isCollapsed && (
                  <span className="truncate tracking-wide">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Controls */}
      <div className="p-3 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="flex flex-col gap-2.5">
          {user && (
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer shadow-sm shadow-rose-500/5"
              title="Keluar Sesi"
            >
              <LogOut className="w-3.5 h-3.5" />
              {!isCollapsed && <span className="text-xs font-bold">Keluar Sesi</span>}
            </button>
          )}

          {/* Theme Toggle & Collapse Buttons */}
          <div className="flex items-center justify-between gap-1">
            <button
              onClick={toggleTheme}
              className={`flex-1 p-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 ${isCollapsed ? 'w-full' : ''}`}
              title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {!isCollapsed && <span className="text-[11px] font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
            {isCollapsed && (
              <button
                onClick={() => setIsCollapsed(false)}
                className="hidden lg:flex p-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {!isCollapsed && (
            <div className="text-center">
              <p className="text-[9px] text-zinc-500 font-mono">v3.0.2 (PHASE 3B)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block h-screen flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Menu Trigger Bar */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-zinc-950 text-white z-50 flex items-center justify-between px-4 h-14 border-b border-zinc-900 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            <Workflow className="w-4.5 h-4.5" />
          </div>
          <span className="text-sm font-bold tracking-wider uppercase">EasyDes</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-300"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black"
            />
            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-64 h-full bg-zinc-950 flex flex-col z-50 pt-14"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
