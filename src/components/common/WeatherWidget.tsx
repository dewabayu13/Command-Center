/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CloudRain, Sun, Wind, Droplets, AlertTriangle } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  const { weather } = useApp();

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'hujan':
      case 'hujan deras':
      case 'gerimis':
        return <CloudRain className="w-8 h-8 text-blue-500 animate-bounce" />;
      default:
        return <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />;
    }
  };

  return (
    <div id="weather_widget" className="flex items-center gap-4 bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md px-4 py-2 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-2">
        {getWeatherIcon(weather.condition)}
        <div>
          <span className="text-xl font-bold text-zinc-800 dark:text-zinc-100 font-mono">
            {weather.temp}°C
          </span>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium leading-none">
            {weather.condition}
          </p>
        </div>
      </div>

      <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700 hidden sm:block" />

      <div className="hidden sm:flex gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
          <Droplets className="w-3.5 h-3.5 text-indigo-400" />
          <div>
            <p className="text-[9px] text-zinc-400 uppercase font-bold leading-none">Hum</p>
            <p className="font-semibold font-mono">{weather.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
          <Wind className="w-3.5 h-3.5 text-teal-400" />
          <div>
            <p className="text-[9px] text-zinc-400 uppercase font-bold leading-none">Wind</p>
            <p className="font-semibold font-mono">{weather.windSpeed} km/h</p>
          </div>
        </div>
      </div>

      {weather.alert && (
        <>
          <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700 hidden lg:block" />
          <div className="hidden lg:flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/20 max-w-xs">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-bounce" />
            <p className="text-[10px] leading-tight font-medium overflow-hidden text-ellipsis whitespace-nowrap">
              {weather.alert}
            </p>
          </div>
        </>
      )}
    </div>
  );
};
