/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Data Tidak Ditemukan',
  description = 'Tidak ada catatan atau berkas terdaftar yang cocok dengan kriteria pencarian Anda saat ini.',
  icon,
  actionButton
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-white/40 dark:bg-zinc-900/10 border border-zinc-150 dark:border-zinc-800/60 rounded-3xl">
      <div className="p-3 bg-zinc-100 dark:bg-zinc-850 rounded-2xl text-zinc-400 dark:text-zinc-500 mb-4 flex items-center justify-center">
        {icon || <HelpCircle className="w-6 h-6" />}
      </div>
      
      <h4 className="text-sm font-black text-zinc-800 dark:text-zinc-200 tracking-tight">
        {title}
      </h4>
      
      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 max-w-xs mt-1.5 leading-relaxed">
        {description}
      </p>

      {actionButton && (
        <div className="mt-5">
          {actionButton}
        </div>
      )}
    </div>
  );
};
export default EmptyState;
