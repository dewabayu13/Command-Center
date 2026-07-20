/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const APP_CONFIG = {
  // Database type toggle
  // In Phase 2, this is 'local'. In Phase 3, it can be set to 'firebase'
  DB_TYPE: (((import.meta as any).env?.VITE_DB_TYPE || 'local') as 'local' | 'firebase'),

  // Local Storage
  LOCAL_STORAGE_PREFIX: 'easydes_',

  // Bongas Kulon Village Coordinates (Majalengka, West Java, Indonesia)
  VILLAGE_CENTER: {
    lat: -6.703128,
    lng: 108.321618,
    zoom: 14
  },

  // Mock API configuration
  API_BASE_URL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api',

  // System features
  REFRESH_INTERVAL_MS: 300000, // 5 minutes
  ENABLE_LOGGER: (import.meta as any).dev || (import.meta as any).env?.VITE_ENABLE_LOGGER === 'true',

  // Application metadata
  APP_NAME: 'EasyDes Smart Village Command Center',
  VILLAGE_NAME: 'Bongas Kulon',
  DISTRICT_NAME: 'Sumberjaya',
  REGENCY_NAME: 'Majalengka',
  PROVINCE_NAME: 'Jawa Barat'
};
