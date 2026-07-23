/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  getFirebaseFirestore 
} from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  writeBatch, 
  runTransaction 
} from 'firebase/firestore';
import { logger } from '../utils/logger';
import {
  ICitizenRepository,
  IEmployeeRepository,
  IAttendanceRepository,
  ILetterRepository,
  ITaxpayerRepository,
  IVillageProjectRepository,
  IComplaintRepository,
  IVillageAssetRepository,
  INotificationRepository,
  IVillageMetricRepository
} from '../interfaces/repositories';

import {
  Citizen,
  Employee,
  Attendance,
  Letter,
  Taxpayer,
  VillageProject,
  Complaint,
  VillageAsset,
  VillageNotification,
  APBDesBudget,
  WeatherData,
  AuthUser
} from '../types';

import {
  mockCitizens,
  mockEmployees,
  mockAttendanceList,
  mockLetters,
  mockTaxpayers,
  mockProjects,
  mockComplaints,
  mockAssets,
  mockNotifications,
  mockWeather,
  mockBudget,
  mockCctvList
} from '../utils/mockData';

// Automatic Retry Utility for resilience
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      logger.warn(`Firestore operation failed, retrying (${i + 1}/${retries})...`, err);
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delayMs * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}

// ==========================================
// Base Firestore Repository Class
// ==========================================
export class BaseFirebaseRepository<T extends Record<string, any>> {
  protected collectionName: string;
  protected cache: T[] = [];
  protected defaultSeedData: T[];
  protected keyField: keyof T;
  protected unsubscribe: (() => void) | null = null;

  constructor(collectionName: string, defaultSeedData: T[], keyField: keyof T) {
    this.collectionName = collectionName;
    this.defaultSeedData = defaultSeedData;
    this.keyField = keyField;
    this.initializeSync();
  }

  private async initializeSync() {
    try {
      const db = getFirebaseFirestore();
      const colRef = collection(db, this.collectionName);

      // Realtime Synchronization via onSnapshot
      this.unsubscribe = onSnapshot(colRef, (snapshot) => {
        if (snapshot.empty && this.defaultSeedData.length > 0) {
          logger.info(`Collection ${this.collectionName} is empty. Seeding with mock data...`);
          this.seedCollection();
          return;
        }

        const items: T[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as T;
          if (this.keyField && !data[this.keyField]) {
            data[this.keyField] = doc.id as any;
          }
          items.push(data);
        });

        // Filter soft-deleted items out of standard views
        this.cache = items.filter(item => !item.isDeleted);
        logger.info(`Collection ${this.collectionName} synchronized. Loaded ${this.cache.length} active records.`);
      }, (error) => {
        logger.error(`Error synchronizing collection ${this.collectionName}:`, error);
      });
    } catch (err) {
      logger.error(`Could not initialize Firestore sync for ${this.collectionName}:`, err);
      // Fallback L1 Cache seeding
      this.cache = [...this.defaultSeedData];
    }
  }

  private async seedCollection() {
    try {
      const db = getFirebaseFirestore();
      const colRef = collection(db, this.collectionName);
      const batch = writeBatch(db);

      this.defaultSeedData.forEach((item) => {
        const id = String(item[this.keyField]);
        const docRef = doc(colRef, id);
        batch.set(docRef, { ...item, createdAt: new Date().toISOString() });
      });

      await withRetry(() => batch.commit());
      logger.info(`Successfully seeded ${this.defaultSeedData.length} records into ${this.collectionName}`);
    } catch (err) {
      logger.error(`Error seeding collection ${this.collectionName}:`, err);
    }
  }

  // --- Read Methods ---
  public getAll(): T[] {
    return this.cache;
  }

  // Search
  public search(queryStr: string, fields: (keyof T)[]): T[] {
    if (!queryStr) return this.cache;
    const lower = queryStr.toLowerCase();
    return this.cache.filter((item) => 
      fields.some((field) => String(item[field] || '').toLowerCase().includes(lower))
    );
  }

  // Filtering
  public filter(predicate: (item: T) => boolean): T[] {
    return this.cache.filter(predicate);
  }

  // Sorting
  public sort(compareFn: (a: T, b: T) => number): T[] {
    return [...this.cache].sort(compareFn);
  }

  // Pagination
  public paginate(page: number, limitVal: number): { items: T[]; total: number; pages: number } {
    const total = this.cache.length;
    const pages = Math.ceil(total / limitVal);
    const start = (page - 1) * limitVal;
    const items = this.cache.slice(start, start + limitVal);
    return { items, total, pages };
  }

  // --- Mutation Methods (Optimistic UI Support) ---
  public async create(item: T): Promise<void> {
    const id = String(item[this.keyField]);
    
    // Prepend locally for instant snappy UI response
    this.cache = [item, ...this.cache];

    try {
      const db = getFirebaseFirestore();
      const docRef = doc(db, this.collectionName, id);
      await withRetry(() => setDoc(docRef, { ...item, createdAt: new Date().toISOString() }));
      logger.info(`Document ${id} written successfully in ${this.collectionName}`);
    } catch (err) {
      logger.error(`Failed to write document ${id} to ${this.collectionName}, rolling back optimistic update...`, err);
      // Rollback
      this.cache = this.cache.filter(cached => cached[this.keyField] !== item[this.keyField]);
      throw err;
    }
  }

  public async update(id: string, updates: Partial<T>): Promise<void> {
    const originalCache = [...this.cache];
    
    // Local optimistic update
    this.cache = this.cache.map((item) => 
      String(item[this.keyField]) === id ? { ...item, ...updates } : item
    );

    try {
      const db = getFirebaseFirestore();
      const docRef = doc(db, this.collectionName, id);
      await withRetry(() => updateDoc(docRef, updates as any));
      logger.info(`Document ${id} updated successfully in ${this.collectionName}`);
    } catch (err) {
      logger.error(`Failed to update document ${id} in ${this.collectionName}, rolling back update...`, err);
      this.cache = originalCache;
      throw err;
    }
  }

  public async delete(id: string): Promise<void> {
    const originalCache = [...this.cache];
    this.cache = this.cache.filter((item) => String(item[this.keyField]) !== id);

    try {
      const db = getFirebaseFirestore();
      const docRef = doc(db, this.collectionName, id);
      await withRetry(() => deleteDoc(docRef));
      logger.info(`Document ${id} deleted successfully from ${this.collectionName}`);
    } catch (err) {
      logger.error(`Failed to delete document ${id} from ${this.collectionName}, rolling back delete...`, err);
      this.cache = originalCache;
      throw err;
    }
  }

  public async softDelete(id: string): Promise<void> {
    logger.info(`Soft deleting document ${id} in ${this.collectionName}`);
    await this.update(id, { 
      isDeleted: true, 
      deletedAt: new Date().toISOString() 
    } as any);
  }

  public async runInTransaction(action: (transaction: any, docRef: any) => Promise<void>, docId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, this.collectionName, docId);
    try {
      await runTransaction(db, async (transaction) => {
        await action(transaction, docRef);
      });
      logger.info(`Transaction completed successfully for document ${docId}`);
    } catch (err) {
      logger.error(`Transaction failed for document ${docId}:`, err);
      throw err;
    }
  }

  public async executeBatchWrite(actions: { type: 'create' | 'update' | 'delete'; id: string; item?: T; updates?: Partial<T> }[]): Promise<void> {
    const db = getFirebaseFirestore();
    const batch = writeBatch(db);
    const colRef = collection(db, this.collectionName);

    actions.forEach((action) => {
      const docRef = doc(colRef, action.id);
      if (action.type === 'create' && action.item) {
        batch.set(docRef, action.item);
      } else if (action.type === 'update' && action.updates) {
        batch.update(docRef, action.updates as any);
      } else if (action.type === 'delete') {
        batch.delete(docRef);
      }
    });

    try {
      await withRetry(() => batch.commit());
      logger.info(`Batch write committed successfully for ${actions.length} operations`);
    } catch (err) {
      logger.error(`Batch write failed:`, err);
      throw err;
    }
  }

  public destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

// ==========================================
// Concrete Firebase Repository Implementations
// ==========================================

export class FirebaseCitizenRepository extends BaseFirebaseRepository<Citizen> implements ICitizenRepository {
  constructor() {
    super('citizens', mockCitizens, 'nik');
  }

  getCitizens(): Citizen[] {
    return this.getAll();
  }

  async addCitizen(citizen: Citizen): Promise<void> {
    await this.create(citizen);
  }

  async updateCitizen(citizen: Citizen): Promise<void> {
    await this.update(citizen.nik, citizen);
  }

  async deleteCitizen(nik: string): Promise<void> {
    await this.delete(nik);
  }
}
export class FirebaseEmployeeRepository extends BaseFirebaseRepository<Employee> implements IEmployeeRepository {
  constructor() {
    super('employees', mockEmployees, 'uid');
  }

  getEmployees(): Employee[] {
    return this.getAll();
  }
}

export class FirebaseAttendanceRepository extends BaseFirebaseRepository<Attendance> implements IAttendanceRepository {
  constructor() {
    super('attendance', mockAttendanceList, 'attendanceId');
  }

  getAttendance(): Attendance[] {
    return this.getAll();
  }

  async addAttendance(record: Attendance): Promise<void> {
    await this.create(record);
  }
}

export class FirebaseLetterRepository extends BaseFirebaseRepository<Letter> implements ILetterRepository {
  constructor() {
    super('letters', mockLetters, 'letterId');
  }

  getLetters(): Letter[] {
    return this.getAll();
  }

  async addLetter(letter: Letter): Promise<void> {
    await this.create(letter);
  }

  async updateLetterStatus(
    letterId: string,
    status: 'Pending' | 'Verified' | 'Completed',
    signedBy?: string,
    qrCode?: string
  ): Promise<void> {
    await this.update(letterId, {
      status,
      completedAt: status === 'Completed' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : undefined,
      signedBy,
      qrVerificationCode: qrCode
    });
  }
}

export class FirebaseTaxpayerRepository extends BaseFirebaseRepository<Taxpayer> implements ITaxpayerRepository {
  constructor() {
    super('taxpayers', mockTaxpayers, 'nop');
  }

  getTaxpayers(): Taxpayer[] {
    return this.getAll();
  }

  async updateTaxStatus(nop: string, status: 'Paid' | 'Unpaid'): Promise<void> {
    await this.update(nop, {
      status,
      paidAt: status === 'Paid' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : undefined
    });
  }
}

export class FirebaseVillageProjectRepository extends BaseFirebaseRepository<VillageProject> implements IVillageProjectRepository {
  constructor() {
    super('projects', mockProjects, 'projectId');
  }

  getProjects(): VillageProject[] {
    return this.getAll();
  }

  async addProject(project: VillageProject): Promise<void> {
    await this.create(project);
  }
}

export class FirebaseComplaintRepository extends BaseFirebaseRepository<Complaint> implements IComplaintRepository {
  constructor() {
    super('complaints', mockComplaints, 'complaintId');
  }

  getComplaints(): Complaint[] {
    return this.getAll();
  }

  async addComplaint(complaint: Complaint): Promise<void> {
    await this.create(complaint);
  }

  async updateComplaintStatus(
    complaintId: string,
    status: 'Submitted' | 'In Progress' | 'Resolved'
  ): Promise<void> {
    await this.update(complaintId, {
      status,
      responseTimeHours: status === 'Resolved' ? Math.floor(Math.random() * 24) + 12 : undefined
    });
  }
}

export class FirebaseAssetRepository extends BaseFirebaseRepository<VillageAsset> implements IVillageAssetRepository {
  constructor() {
    super('assets', mockAssets, 'assetId');
  }

  getAssets(): VillageAsset[] {
    return this.getAll();
  }

  async addAsset(asset: VillageAsset): Promise<void> {
    await this.create(asset);
  }
}

export class FirebaseNotificationRepository extends BaseFirebaseRepository<VillageNotification> implements INotificationRepository {
  constructor() {
    super('notifications', mockNotifications, 'id');
  }

  getNotifications(): VillageNotification[] {
    return this.getAll();
  }

  async addNotification(notif: VillageNotification): Promise<void> {
    await this.create(notif);
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.update(id, { read: true });
  }
}

export class FirebaseVillageMetricRepository implements IVillageMetricRepository {
  private budget: APBDesBudget = mockBudget;
  private weather: WeatherData = mockWeather;
  private unsubscribeBudget: (() => void) | null = null;
  private unsubscribeWeather: (() => void) | null = null;

  constructor() {
    this.initializeSync();
  }

  private async initializeSync() {
    try {
      const db = getFirebaseFirestore();
      
      // Real-time synchronization of Finance budget document
      const budgetDocRef = doc(db, 'finance', 'budget_2026');
      this.unsubscribeBudget = onSnapshot(budgetDocRef, (snapshot) => {
        if (snapshot.exists()) {
          this.budget = snapshot.data() as APBDesBudget;
        } else {
          logger.info('Budget data not found in Firestore. Seeding default...');
          setDoc(budgetDocRef, mockBudget).catch(err => logger.error('Error seeding budget:', err));
        }
      });

      // Real-time synchronization of Weather document
      const weatherDocRef = doc(db, 'weather', 'current');
      this.unsubscribeWeather = onSnapshot(weatherDocRef, (snapshot) => {
        if (snapshot.exists()) {
          this.weather = snapshot.data() as WeatherData;
        } else {
          logger.info('Weather data not found in Firestore. Seeding default...');
          setDoc(weatherDocRef, mockWeather).catch(err => logger.error('Error seeding weather:', err));
        }
      });
    } catch (err) {
      logger.error('Failed to initialize metrics Firestore sync, using fallback mock data:', err);
    }
  }

  getBudget(): APBDesBudget {
    return this.budget;
  }

  getWeather(): WeatherData {
    return this.weather;
  }

  public async updateBudget(budget: APBDesBudget): Promise<void> {
    this.budget = budget;
    try {
      const db = getFirebaseFirestore();
      const budgetDocRef = doc(db, 'finance', 'budget_2026');
      await withRetry(() => setDoc(budgetDocRef, budget));
    } catch (err) {
      logger.error('Failed to update budget in Firestore:', err);
      throw err;
    }
  }

  public async updateWeather(weather: WeatherData): Promise<void> {
    this.weather = weather;
    try {
      const db = getFirebaseFirestore();
      const weatherDocRef = doc(db, 'weather', 'current');
      await withRetry(() => setDoc(weatherDocRef, weather));
    } catch (err) {
      logger.error('Failed to update weather in Firestore:', err);
      throw err;
    }
  }

  destroy() {
    if (this.unsubscribeBudget) this.unsubscribeBudget();
    if (this.unsubscribeWeather) this.unsubscribeWeather();
  }
}

// Additional Repositories for compliance with entity coverage requested in requirements
export class FirebasePopulationRepository extends BaseFirebaseRepository<any> {
  constructor() {
    super('population', [], 'id');
  }
}

export class FirebaseAgendaRepository extends BaseFirebaseRepository<any> {
  constructor() {
    super('agenda', [], 'id');
  }
}

export class FirebaseCctvRepository extends BaseFirebaseRepository<any> {
  constructor() {
    super('cctv', mockCctvList, 'id');
  }
}

export class FirebaseUserRepository extends BaseFirebaseRepository<AuthUser> {
  constructor() {
    super('users', [], 'uid');
  }
}
