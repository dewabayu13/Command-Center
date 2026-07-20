/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { APP_CONFIG } from '../config/appConfig';
import { logger } from '../utils/logger';

interface RequestOptions extends RequestInit {
  timeout?: number;
}

export class APIError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { timeout = 10000, headers, ...customOptions } = options;
  const url = `${APP_CONFIG.API_BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  const config: RequestInit = {
    headers: { ...defaultHeaders, ...headers },
    signal: controller.signal,
    ...customOptions
  };

  logger.debug(`API Request: [${config.method || 'GET'}] ${url}`);

  try {
    const response = await fetch(url, config);
    clearTimeout(id);

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      logger.error(`API Error Response: [${response.status}] ${response.statusText}`, data);
      throw new APIError(response.statusText || 'Fetch failed', response.status, data);
    }

    logger.debug(`API Success Response: [${response.status}] ${url}`);
    return data as T;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      logger.error(`API Timeout: ${url} (exceeded ${timeout}ms)`);
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    logger.error(`API Connection Failure for ${url}:`, error);
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, { method: 'GET', ...options }),

  post: <T>(endpoint: string, body?: any, options?: RequestOptions) => 
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),

  put: <T>(endpoint: string, body?: any, options?: RequestOptions) => 
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),

  delete: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, { method: 'DELETE', ...options })
};
