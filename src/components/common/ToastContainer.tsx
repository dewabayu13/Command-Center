/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <Info className="w-5 h-5 text-indigo-500" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/20 bg-white/95 dark:bg-zinc-900/95 shadow-emerald-500/5';
      case 'warning':
        return 'border-amber-500/20 bg-white/95 dark:bg-zinc-900/95 shadow-amber-500/5';
      case 'error':
        return 'border-rose-500/20 bg-white/95 dark:bg-zinc-900/95 shadow-rose-500/5';
      default:
        return 'border-indigo-500/20 bg-white/95 dark:bg-zinc-900/95 shadow-indigo-500/5';
    }
  };

  return (
    <div 
      id="toast_panel_container" 
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 w-full max-w-sm pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-lg ${getColors(t.type)}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(t.type)}
            </div>
            
            <div className="flex-1 min-w-0 text-xs">
              {t.title && (
                <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-0.5 leading-tight">
                  {t.title}
                </h5>
              )}
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {t.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
