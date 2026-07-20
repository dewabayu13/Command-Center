/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { APP_CONFIG } from '../config/appConfig';

class Logger {
  private get prefix(): string {
    const time = new Date().toISOString().split('T')[1].slice(0, 8);
    return `[EasyDes Command Center ${time}]`;
  }

  debug(message: string, ...args: any[]): void {
    if (APP_CONFIG.ENABLE_LOGGER) {
      console.debug(`%c${this.prefix} DEBUG: ${message}`, 'color: #8B5CF6', ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (APP_CONFIG.ENABLE_LOGGER) {
      console.log(`%c${this.prefix} INFO:  ${message}`, 'color: #3B82F6', ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (APP_CONFIG.ENABLE_LOGGER) {
      console.warn(`%c${this.prefix} WARN:  ${message}`, 'color: #F59E0B', ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    // Errors should always be printed, but decorated if logger is active
    console.error(`%c${this.prefix} ERROR: ${message}`, 'color: #EF4444; font-weight: bold', ...args);
  }
}

export const logger = new Logger();
