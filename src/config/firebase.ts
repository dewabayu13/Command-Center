/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';
import { logger } from '../utils/logger';

const firebaseConfig = {
  apiKey: "AIzaSyCsdru_-FWneaa-88E86OmrdMcSuiXd6h4",
  authDomain: "easydes-command-center.firebaseapp.com",
  projectId: "easydes-command-center",
  storageBucket: "easydes-command-center.firebasestorage.app",
  messagingSenderId: "861260552996",
  appId: "1:861260552996:web:7cdb4a8b7dd83b64c5b1b1"
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export function isFirebaseConfigured(): boolean {
  return !!firebaseConfig.apiKey && !!firebaseConfig.projectId;
}

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    try {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      logger.info('Firebase app initialized successfully.');
    } catch (error) {
      logger.error('Failed to initialize Firebase App:', error);
      throw error;
    }
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    const firebaseApp = getFirebaseApp();
    auth = getAuth(firebaseApp);
  }
  return auth;
}

export function getFirebaseFirestore(): Firestore {
  if (!db) {
    const firebaseApp = getFirebaseApp();
    try {
      db = initializeFirestore(firebaseApp, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      });
      logger.info('Firestore initialized with offline persistent cache.');
    } catch (error) {
      logger.warn('Failed to initialize Firestore with persistent local cache, falling back to standard getFirestore():', error);
      db = getFirestore(firebaseApp);
    }
  }
  return db;
}
