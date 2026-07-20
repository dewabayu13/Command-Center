/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const ClockWidget: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Determine work status
  const getWorkStatus = (date: Date) => {
    const hours = date.getHours();
    const day = date.getDay(); // 0 is Sunday, 6 is Saturday

    if (day === 0 || day === 6) {
      return { label: 'Libur Akhir Pekan', color: 'bg-rose-500/15 text-rose-500 dark:text-rose-400' };
    }
    if (hours >= 8 && hours < 12) {
      return { label: 'Jam Kerja Aktif', color: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400' };
    }
    if (hours >= 12 && hours < 13) {
      return { label: 'Jam Istirahat', color: 'bg-amber-500/15 text-amber-500 dark:text-amber-400' };
    }
    if (hours >= 13 && hours < 16) {
      return { label: 'Jam Kerja Aktif', color: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400' };
    }
    return { label: 'Luar Jam Kerja', color: 'bg-zinc-500/15 text-zinc-500 dark:text-zinc-400' };
  };

  const status = getWorkStatus(time);

  return (
    <div id="clock_widget" className="flex items-center gap-3 bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md px-4 py-2 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm transition-all duration-300">
      <div className="p-2 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-lg text-indigo-600 dark:text-indigo-400 animate-pulse">
        <Clock className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-mono font-bold tracking-wider text-zinc-800 dark:text-zinc-100">
            {formatTime(time)}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide uppercase ${status.color}`}>
            {status.label}
          </span>
        </div>
        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
          {formatDate(time)}
        </div>
      </div>
    </div>
  );
};
