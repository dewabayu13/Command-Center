/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { AuthOverlay } from './components/common/AuthOverlay';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { UserRole } from './types';
import { Sidebar } from './components/common/Sidebar';
import { Topbar } from './components/common/Topbar';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingBoundary } from './components/common/LoadingBoundary';
import { AIAssistant } from './components/common/AIAssistant';

// Performance optimization: Route-based lazy loading and code splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Population = React.lazy(() => import('./pages/Population').then(m => ({ default: m.Population })));
const AttendanceMonitor = React.lazy(() => import('./pages/Attendance').then(m => ({ default: m.AttendanceMonitor })));
const Letters = React.lazy(() => import('./pages/Letters').then(m => ({ default: m.Letters })));
const TaxMonitor = React.lazy(() => import('./pages/TaxMonitor').then(m => ({ default: m.TaxMonitor })));
const Finance = React.lazy(() => import('./pages/Finance').then(m => ({ default: m.Finance })));
const Projects = React.lazy(() => import('./pages/Projects').then(m => ({ default: m.Projects })));
const CCTV = React.lazy(() => import('./pages/CCTV').then(m => ({ default: m.CCTV })));
const Assets = React.lazy(() => import('./pages/Assets').then(m => ({ default: m.Assets })));
const Complaints = React.lazy(() => import('./pages/Complaints').then(m => ({ default: m.Complaints })));

import { motion, AnimatePresence } from 'motion/react';

const MainLayout: React.FC = () => {
  const { activePage, setActivePage } = useApp();
  const { isDarkMode } = useTheme();

  const handleFallback = () => {
    setActivePage('dashboard');
  };

  // Route/Page mapping engine with Role-Based Access Control (RBAC) Protection
  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'population':
        return (
          <ProtectedRoute 
            allowedRoles={[UserRole.ADMIN, UserRole.VILLAGE_HEAD, UserRole.SECRETARY, UserRole.OPERATOR, UserRole.KASI_PEMERINTAHAN]} 
            fallbackToDashboard={handleFallback}
          >
            <Population />
          </ProtectedRoute>
        );
      case 'attendance':
        return (
          <ProtectedRoute 
            allowedRoles={[UserRole.ADMIN, UserRole.VILLAGE_HEAD, UserRole.SECRETARY, UserRole.OPERATOR]} 
            fallbackToDashboard={handleFallback}
          >
            <AttendanceMonitor />
          </ProtectedRoute>
        );
      case 'letters':
        return (
          <ProtectedRoute 
            allowedRoles={[UserRole.ADMIN, UserRole.VILLAGE_HEAD, UserRole.SECRETARY, UserRole.OPERATOR, UserRole.KASI_PELAYANAN]} 
            fallbackToDashboard={handleFallback}
          >
            <Letters />
          </ProtectedRoute>
        );
      case 'tax':
        return (
          <ProtectedRoute 
            allowedRoles={[UserRole.ADMIN, UserRole.VILLAGE_HEAD, UserRole.SECRETARY, UserRole.OPERATOR, UserRole.TAX_COLLECTOR]} 
            fallbackToDashboard={handleFallback}
          >
            <TaxMonitor />
          </ProtectedRoute>
        );
      case 'finance':
        return (
          <ProtectedRoute 
            allowedRoles={[UserRole.ADMIN, UserRole.VILLAGE_HEAD, UserRole.SECRETARY, UserRole.TREASURER, UserRole.KASI_KESEJAHTERAAN]} 
            fallbackToDashboard={handleFallback}
          >
            <Finance />
          </ProtectedRoute>
        );
      case 'projects':
        return (
          <ProtectedRoute 
            allowedRoles={[UserRole.ADMIN, UserRole.VILLAGE_HEAD, UserRole.SECRETARY, UserRole.OPERATOR, UserRole.KASI_KESEJAHTERAAN]} 
            fallbackToDashboard={handleFallback}
          >
            <Projects />
          </ProtectedRoute>
        );
      case 'cctv':
        return (
          <ProtectedRoute 
            allowedRoles={[UserRole.ADMIN, UserRole.VILLAGE_HEAD, UserRole.SECRETARY, UserRole.OPERATOR, UserRole.HAMLET_HEAD]} 
            fallbackToDashboard={handleFallback}
          >
            <CCTV />
          </ProtectedRoute>
        );
      case 'assets':
        return (
          <ProtectedRoute 
            allowedRoles={[UserRole.ADMIN, UserRole.VILLAGE_HEAD, UserRole.SECRETARY, UserRole.TREASURER]} 
            fallbackToDashboard={handleFallback}
          >
            <Assets />
          </ProtectedRoute>
        );
      case 'complaints':
        return <Complaints />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div id="app_workspace" className={`flex h-screen w-screen overflow-hidden ${isDarkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-800'}`}>
      
      {/* 1. Left Collapsible Side Panel Navigation */}
      <Sidebar />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full pt-14 lg:pt-0">
        
        {/* Top bar integrating digital indicators, simulators, and alerts */}
        <Topbar />

        {/* Dynamic Screen Content Canvas Panel */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="h-full w-full"
              >
                <Suspense fallback={<LoadingBoundary variant="page" />}>
                  {renderActivePage()}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </main>
      </div>

    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AppProvider>
              <MainLayout />
              <AuthOverlay />
              <ToastContainer />
              <AIAssistant />
            </AppProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
