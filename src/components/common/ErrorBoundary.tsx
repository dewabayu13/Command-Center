/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ErrorInfo, ReactNode } from 'react';
import { logger } from '../../utils/logger';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary caught an unhandled rendering crash:', error, errorInfo);
  }

  private handleReset = () => {
    (this as any).setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    const self = this as any;
    if (self.state.hasError) {
      if (self.props.fallback) {
        return self.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-zinc-800/40 rounded-3xl m-6">
          <div className="p-3.5 bg-rose-500/10 rounded-2xl text-rose-500 mb-4 animate-bounce">
            <AlertCircle className="w-8 h-8" />
          </div>
          
          <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            Terjadi Kesalahan Tampilan (UI Error)
          </h3>
          
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm text-xs mt-1.5 leading-relaxed">
            Sistem mendeteksi kegagalan render pada modul ini. Hal ini dapat disebabkan oleh keterlambatan sinkronisasi data sekunder.
          </p>

          <div className="mt-4 p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 rounded-xl max-w-md break-all overflow-auto max-h-24">
            {self.state.error?.toString() || 'Unknown Rendering Exception'}
          </div>

          <button
            onClick={this.handleReset}
            className="mt-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md shadow-indigo-600/10 active:scale-95 transition-transform cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Muat Ulang Dashboard</span>
          </button>
        </div>
      );
    }

    return self.props.children;
  }
}
export default ErrorBoundary;
