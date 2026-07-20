/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LoadingBoundaryProps {
  variant?: 'card' | 'page' | 'table';
}

export const LoadingBoundary: React.FC<LoadingBoundaryProps> = ({ variant = 'page' }) => {
  if (variant === 'card') {
    return (
      <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-5 rounded-2xl animate-pulse space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/3" />
          <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-12" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-full" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-5/6" />
        </div>
        <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full pt-2" />
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="w-full space-y-3.5 animate-pulse">
        <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-zinc-200 dark:bg-zinc-800/65 rounded-xl flex items-center px-4 gap-4">
              <div className="h-4 bg-zinc-300 dark:bg-zinc-750 rounded-md w-1/4" />
              <div className="h-4 bg-zinc-300 dark:bg-zinc-750 rounded-md w-1/4" />
              <div className="h-4 bg-zinc-300 dark:bg-zinc-750 rounded-md w-1/6" />
              <div className="h-4 bg-zinc-300 dark:bg-zinc-750 rounded-md w-1/12 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-pulse w-full h-full">
      {/* 3 top cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-5 rounded-2xl" />
        ))}
      </div>

      {/* Main grid structure */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-2xl w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-44 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl" />
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 h-96 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl" />
      </div>
    </div>
  );
};
export default LoadingBoundary;
