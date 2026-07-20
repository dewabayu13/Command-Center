/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  User as FirebaseUser,
  getRedirectResult
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseFirestore, isFirebaseConfigured } from '../config/firebase';
import { APP_CONFIG } from '../config/appConfig';
import { AuthUser, UserRole, Employee } from '../types';
import { mockEmployees } from '../utils/mockData';
import { logger } from '../utils/logger';

// Key for mock user profiles in localStorage
const MOCK_USERS_KEY = `${APP_CONFIG.LOCAL_STORAGE_PREFIX}mock_users`;
const MOCK_SESSION_KEY = `${APP_CONFIG.LOCAL_STORAGE_PREFIX}mock_session`;

// Initialize mock users from pre-seeded staff if local storage is blank
function getMockUsersList(): AuthUser[] {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(MOCK_USERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }

  // Pre-seed mock users with standard credentials
  const defaultUsers: AuthUser[] = mockEmployees.map((emp) => ({
    uid: emp.uid,
    email: emp.email,
    fullName: emp.fullName,
    role: emp.role,
    phoneNumber: emp.phoneNumber,
    dusunId: emp.dusunId,
    createdAt: new Date().toISOString()
  }));

  window.localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

export const authService = {
  /**
   * Check if the application is currently running in real Firebase auth mode
   */
  isFirebaseMode(): boolean {
    return APP_CONFIG.DB_TYPE === 'firebase' && isFirebaseConfigured();
  },

  /**
   * Sign in using Email and Password
   */
  async login(email: string, password: string): Promise<AuthUser> {
    logger.info(`AuthService.login requested for: ${email}`);
    
    if (this.isFirebaseMode()) {
      try {
        const auth = getFirebaseAuth();
        const db = getFirebaseFirestore();
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        
        // Sync with Firestore profile document
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          logger.info(`User profile synced from Firestore: ${data.fullName}`);
          return {
            uid: fbUser.uid,
            email: fbUser.email || email,
            fullName: data.fullName || fbUser.displayName || 'Unknown User',
            role: (data.role || UserRole.PUBLIC_USER) as UserRole,
            phoneNumber: data.phoneNumber || '',
            dusunId: data.dusunId || '',
            createdAt: data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000).toISOString() : new Date().toISOString()
          };
        } else {
          // If Firestore profile document doesn't exist, build a default from Auth metadata
          const defaultProfile: AuthUser = {
            uid: fbUser.uid,
            email: fbUser.email || email,
            fullName: fbUser.displayName || 'Pengguna Baru',
            role: UserRole.PUBLIC_USER,
            createdAt: new Date().toISOString()
          };
          
          await setDoc(userDocRef, {
            uid: defaultProfile.uid,
            email: defaultProfile.email,
            fullName: defaultProfile.fullName,
            role: defaultProfile.role,
            createdAt: serverTimestamp()
          });
          
          logger.warn(`Firestore profile did not exist. Created default PUBLIC_USER profile for: ${fbUser.uid}`);
          return defaultProfile;
        }
      } catch (error: any) {
        logger.error('Firebase Auth Login Failure:', error);
        throw this.translateAuthError(error);
      }
    } else {
      // Mock local storage authentication flow
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const users = getMockUsersList();
          const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
          
          if (!found) {
            reject(new Error('Kredensial salah: Akun email tidak terdaftar di sistem.'));
            return;
          }
          
          // For mock, any password length >= 6 is accepted, or 'password123'
          if (password.length < 6) {
            reject(new Error('Kredensial salah: Password minimal berisi 6 karakter.'));
            return;
          }
          
          // Save session
          window.localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(found));
          logger.info(`Mock user logged in successfully: ${found.fullName} with role ${found.role}`);
          resolve(found);
        }, 800);
      });
    }
  },

  /**
   * Register a new user and automatically sync metadata with Firestore
   */
  async register(
    email: string, 
    password: string, 
    fullName: string, 
    role: UserRole = UserRole.PUBLIC_USER,
    additionalData: { phoneNumber?: string; dusunId?: string } = {}
  ): Promise<AuthUser> {
    logger.info(`AuthService.register requested for: ${email}, Role: ${role}`);
    
    if (this.isFirebaseMode()) {
      try {
        const auth = getFirebaseAuth();
        const db = getFirebaseFirestore();
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        
        // Update display name inside Firebase Authentication profile
        await firebaseUpdateProfile(fbUser, {
          displayName: fullName
        });
        
        // Write the main user profile record to Firestore 'users' collection
        const newUser: AuthUser = {
          uid: fbUser.uid,
          email,
          fullName,
          role,
          ...additionalData,
          createdAt: new Date().toISOString()
        };
        
        const userDocRef = doc(db, 'users', fbUser.uid);
        await setDoc(userDocRef, {
          uid: newUser.uid,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
          phoneNumber: newUser.phoneNumber || '',
          dusunId: newUser.dusunId || '',
          createdAt: serverTimestamp()
        });
        
        logger.info(`User registration successfully written to Firestore for UID: ${fbUser.uid}`);
        return newUser;
      } catch (error: any) {
        logger.error('Firebase Registration Failure:', error);
        throw this.translateAuthError(error);
      }
    } else {
      // Mock local storage registration flow
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const users = getMockUsersList();
          const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
          
          if (emailExists) {
            reject(new Error('Pendaftaran gagal: Alamat email sudah digunakan pengguna lain.'));
            return;
          }
          
          const newUser: AuthUser = {
            uid: `mock_${Date.now()}`,
            email,
            fullName,
            role,
            ...additionalData,
            createdAt: new Date().toISOString()
          };
          
          users.push(newUser);
          window.localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
          
          // Save session
          window.localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(newUser));
          logger.info(`Mock user registered and session saved: ${fullName}`);
          resolve(newUser);
        }, 800);
      });
    }
  },

  /**
   * Login using Google Auth
   */
  async loginWithGoogle(): Promise<AuthUser> {
    logger.info('AuthService.loginWithGoogle requested');
    
    if (this.isFirebaseMode()) {
      const auth = getFirebaseAuth();
      const db = getFirebaseFirestore();
      const provider = new GoogleAuthProvider();
      
      try {
        let fbUser: FirebaseUser;
        
        // Inside AI Studio Preview iframes, signInWithPopup can trigger security blocks.
        // We catch popup failures and retry using redirect.
        try {
          const result = await signInWithPopup(auth, provider);
          fbUser = result.user;
        } catch (popupError: any) {
          logger.warn('Google Popup blocked or failed. Attempting login via Redirect...', popupError);
          // Only trigger redirect if we're in top frame or user is ready
          await signInWithRedirect(auth, provider);
          // Return a placeholder or wait for redirect (the page will refresh anyway)
          throw new Error('Google Sign-In dialihkan. Harap tunggu halaman memuat kembali.');
        }
        
        // Sync with Firestore
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDoc = await getDoc(userDocRef);
        let role = UserRole.PUBLIC_USER;
        let phoneNumber = fbUser.phoneNumber || '';
        let dusunId = '';
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          role = (data.role || UserRole.PUBLIC_USER) as UserRole;
          phoneNumber = data.phoneNumber || phoneNumber;
          dusunId = data.dusunId || '';
        } else {
          // Store new Google login as public user in Firestore
          await setDoc(userDocRef, {
            uid: fbUser.uid,
            email: fbUser.email || '',
            fullName: fbUser.displayName || 'Google User',
            role: UserRole.PUBLIC_USER,
            createdAt: serverTimestamp()
          });
          logger.info(`Created default Firestore entry for Google User: ${fbUser.uid}`);
        }
        
        return {
          uid: fbUser.uid,
          email: fbUser.email || '',
          fullName: fbUser.displayName || 'Google User',
          role,
          phoneNumber,
          dusunId,
          createdAt: new Date().toISOString()
        };
      } catch (error: any) {
        logger.error('Google Sign-In overall failure:', error);
        throw this.translateAuthError(error);
      }
    } else {
      // Mock Google Login: Return a pre-configured mock operator account
      return new Promise((resolve) => {
        setTimeout(() => {
          const users = getMockUsersList();
          // Find the Operator or Admin mock
          const defaultGoogleMock = users.find(u => u.role === UserRole.OPERATOR) || users[0];
          
          window.localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(defaultGoogleMock));
          logger.info(`Google Mock login completed as: ${defaultGoogleMock.fullName}`);
          resolve(defaultGoogleMock);
        }, 800);
      });
    }
  },

  /**
   * Complete Google Sign-In redirect check on App load
   */
  async handleRedirectResult(): Promise<AuthUser | null> {
    if (!this.isFirebaseMode()) return null;
    
    try {
      const auth = getFirebaseAuth();
      const db = getFirebaseFirestore();
      const result = await getRedirectResult(auth);
      
      if (result?.user) {
        const fbUser = result.user;
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDoc = await getDoc(userDocRef);
        let role = UserRole.PUBLIC_USER;
        
        if (userDoc.exists()) {
          role = (userDoc.data().role || UserRole.PUBLIC_USER) as UserRole;
        } else {
          await setDoc(userDocRef, {
            uid: fbUser.uid,
            email: fbUser.email || '',
            fullName: fbUser.displayName || 'Google User',
            role: UserRole.PUBLIC_USER,
            createdAt: serverTimestamp()
          });
        }
        
        logger.info(`Handled Google Redirect login successfully for: ${fbUser.email}`);
        return {
          uid: fbUser.uid,
          email: fbUser.email || '',
          fullName: fbUser.displayName || 'Google User',
          role,
          createdAt: new Date().toISOString()
        };
      }
    } catch (error) {
      logger.error('Error handling Google redirect login:', error);
    }
    return null;
  },

  /**
   * Reset user password
   */
  async resetPassword(email: string): Promise<void> {
    logger.info(`AuthService.resetPassword requested for: ${email}`);
    
    if (this.isFirebaseMode()) {
      try {
        const auth = getFirebaseAuth();
        await sendPasswordResetEmail(auth, email);
        logger.info(`Password reset email triggered successfully for: ${email}`);
      } catch (error: any) {
        logger.error('Firebase Password Reset Failure:', error);
        throw this.translateAuthError(error);
      }
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const users = getMockUsersList();
          const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
          if (!exists) {
            reject(new Error('Gagal: Alamat email tidak ditemukan.'));
            return;
          }
          logger.info(`Mock reset password instructions sent for: ${email}`);
          resolve();
        }, 500);
      });
    }
  },

  /**
   * Update active user profile details
   */
  async updateProfile(
    fullName: string, 
    photoURL?: string, 
    additionalData: { phoneNumber?: string; dusunId?: string } = {}
  ): Promise<AuthUser> {
    logger.info('AuthService.updateProfile requested');
    
    if (this.isFirebaseMode()) {
      try {
        const auth = getFirebaseAuth();
        const db = getFirebaseFirestore();
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          throw new Error('Sesi kedaluwarsa: Harap masuk kembali.');
        }
        
        // Update user auth profile
        await firebaseUpdateProfile(currentUser, {
          displayName: fullName,
          photoURL: photoURL || currentUser.photoURL
        });
        
        // Update user Firestore document
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, {
          fullName,
          phoneNumber: additionalData.phoneNumber || '',
          dusunId: additionalData.dusunId || '',
          updatedAt: serverTimestamp()
        });
        
        // Fetch current doc to rebuild profile safely
        const updatedDoc = await getDoc(userDocRef);
        const data = updatedDoc.data() || {};
        
        return {
          uid: currentUser.uid,
          email: currentUser.email || '',
          fullName,
          role: (data.role || UserRole.PUBLIC_USER) as UserRole,
          photoURL: photoURL || currentUser.photoURL || undefined,
          phoneNumber: data.phoneNumber || undefined,
          dusunId: data.dusunId || undefined,
          createdAt: data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000).toISOString() : new Date().toISOString()
        };
      } catch (error: any) {
        logger.error('Firebase profile update failure:', error);
        throw this.translateAuthError(error);
      }
    } else {
      // Mock update profile
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const session = window.localStorage.getItem(MOCK_SESSION_KEY);
          if (!session) {
            reject(new Error('Sesi tidak ditemukan. Harap login kembali.'));
            return;
          }
          
          try {
            const current: AuthUser = JSON.parse(session);
            const updated: AuthUser = {
              ...current,
              fullName,
              photoURL,
              phoneNumber: additionalData.phoneNumber,
              dusunId: additionalData.dusunId
            };
            
            // Save inside mock users DB too
            const users = getMockUsersList();
            const index = users.findIndex(u => u.uid === current.uid);
            if (index !== -1) {
              users[index] = updated;
              window.localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
            }
            
            // Save active session
            window.localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(updated));
            logger.info(`Mock user profile updated successfully: ${fullName}`);
            resolve(updated);
          } catch (e) {
            reject(new Error('Gagal memproses pembaruan draf profil.'));
          }
        }, 500);
      });
    }
  },

  /**
   * Log out active session
   */
  async logout(): Promise<void> {
    logger.info('AuthService.logout requested');
    
    if (this.isFirebaseMode()) {
      try {
        const auth = getFirebaseAuth();
        await signOut(auth);
        logger.info('Firebase user logged out successfully.');
      } catch (error) {
        logger.error('Firebase Auth logout error:', error);
        throw error;
      }
    } else {
      window.localStorage.removeItem(MOCK_SESSION_KEY);
      logger.info('Mock session removed from Local Storage.');
    }
  },

  /**
   * Get active logged user session on refresh
   */
  async getPersistedSession(): Promise<AuthUser | null> {
    if (this.isFirebaseMode()) {
      return new Promise((resolve) => {
        const auth = getFirebaseAuth();
        const unsubscribe = auth.onAuthStateChanged(async (fbUser) => {
          unsubscribe();
          if (fbUser) {
            try {
              const db = getFirebaseFirestore();
              const userDocRef = doc(db, 'users', fbUser.uid);
              const userDoc = await getDoc(userDocRef);
              
              if (userDoc.exists()) {
                const data = userDoc.data();
                resolve({
                  uid: fbUser.uid,
                  email: fbUser.email || '',
                  fullName: data.fullName || fbUser.displayName || 'Pengguna',
                  role: (data.role || UserRole.PUBLIC_USER) as UserRole,
                  phoneNumber: data.phoneNumber || undefined,
                  dusunId: data.dusunId || undefined,
                  createdAt: data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000).toISOString() : new Date().toISOString()
                });
              } else {
                resolve({
                  uid: fbUser.uid,
                  email: fbUser.email || '',
                  fullName: fbUser.displayName || 'Pengguna Baru',
                  role: UserRole.PUBLIC_USER,
                  createdAt: new Date().toISOString()
                });
              }
            } catch (err) {
              logger.error('Error fetching persistent session profile:', err);
              resolve({
                uid: fbUser.uid,
                email: fbUser.email || '',
                fullName: fbUser.displayName || 'Pengguna',
                role: UserRole.PUBLIC_USER,
                createdAt: new Date().toISOString()
              });
            }
          } else {
            resolve(null);
          }
        });
      });
    } else {
      const session = window.localStorage.getItem(MOCK_SESSION_KEY);
      if (session) {
        try {
          return JSON.parse(session);
        } catch {
          return null;
        }
      }
      return null;
    }
  },

  /**
   * Translate system Firebase errors to human-readable Indonesian responses
   */
  translateAuthError(error: any): Error {
    const code = error?.code || '';
    let message = 'Terjadi kesalahan sistem autentikasi. Silakan coba kembali.';

    switch (code) {
      case 'auth/invalid-email':
        message = 'Format alamat email tidak valid.';
        break;
      case 'auth/user-disabled':
        message = 'Akun ini telah dinonaktifkan oleh administrator.';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        message = 'Kredensial salah: Email atau password tidak sesuai.';
        break;
      case 'auth/email-already-in-use':
        message = 'Alamat email sudah terdaftar dan digunakan akun lain.';
        break;
      case 'auth/weak-password':
        message = 'Kombinasi password terlalu lemah. Silakan gunakan minimal 6 karakter.';
        break;
      case 'auth/network-request-failed':
        message = 'Koneksi jaringan terputus. Mohon periksa internet Anda.';
        break;
      case 'auth/too-many-requests':
        message = 'Terlalu banyak percobaan masuk yang salah. Akun diblokir sementara.';
        break;
      default:
        if (error?.message) {
          message = error.message;
        }
        break;
    }
    return new Error(message);
  }
};
