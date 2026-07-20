/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface BentoCardProps {
  id?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  id,
  title,
  subtitle,
  className = '',
  children,
  headerAction
}) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 relative overflow-hidden ${className}`}
    >
      {/* Visual Accent glow line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500/0 via-indigo-500/30 to-indigo-500/0" />

      {/* Card Header (Optional) */}
      {(title || subtitle || headerAction) && (
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
          <div className="flex flex-col">
            {title && (
              <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-sans">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 tracking-tight mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        {children}
      </div>
    </motion.section>
  );
};
