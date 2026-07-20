/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { APP_CONFIG } from '../config/appConfig';
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
  LocalStorageCitizenRepository,
  LocalStorageEmployeeRepository,
  LocalStorageAttendanceRepository,
  LocalStorageLetterRepository,
  LocalStorageTaxpayerRepository,
  LocalStorageVillageProjectRepository,
  LocalStorageComplaintRepository,
  LocalStorageAssetRepository,
  LocalStorageNotificationRepository,
  LocalStorageVillageMetricRepository
} from './LocalStorageRepositories';

import {
  FirebaseCitizenRepository,
  FirebaseEmployeeRepository,
  FirebaseAttendanceRepository,
  FirebaseLetterRepository,
  FirebaseTaxpayerRepository,
  FirebaseVillageProjectRepository,
  FirebaseComplaintRepository,
  FirebaseAssetRepository,
  FirebaseNotificationRepository,
  FirebaseVillageMetricRepository
} from './FirebaseRepositories';

// Placeholder for Firebase Repositories (Phase 3)
// Once Firebase is implemented, we just create FirebaseRepositories.ts and import them here.

class RepositoryFactory {
  private dbType: 'local' | 'firebase';

  constructor() {
    this.dbType = APP_CONFIG.DB_TYPE;
    logger.info(`RepositoryFactory initialized with database mode: ${this.dbType.toUpperCase()}`);
  }

  getCitizenRepository(): ICitizenRepository {
    if (this.dbType === 'firebase') {
      logger.info('Using Firebase Citizen Repository');
      return new FirebaseCitizenRepository();
    }
    return new LocalStorageCitizenRepository();
  }

  getEmployeeRepository(): IEmployeeRepository {
    if (this.dbType === 'firebase') {
      logger.info('Using Firebase Employee Repository');
      return new FirebaseEmployeeRepository();
    }
    return new LocalStorageEmployeeRepository();
  }

  getAttendanceRepository(): IAttendanceRepository {
    if (this.dbType === 'firebase') {
      logger.info('Using Firebase Attendance Repository');
      return new FirebaseAttendanceRepository();
    }
    return new LocalStorageAttendanceRepository();
  }

  getLetterRepository(): ILetterRepository {
    if (this.dbType === 'firebase') {
      logger.info('Using Firebase Letter Repository');
      return new FirebaseLetterRepository();
    }
    return new LocalStorageLetterRepository();
  }

  getTaxpayerRepository(): ITaxpayerRepository {
    if (this.dbType === 'firebase') {
      logger.info('Using Firebase Taxpayer Repository');
      return new FirebaseTaxpayerRepository();
    }
    return new LocalStorageTaxpayerRepository();
  }

  getProjectRepository(): IVillageProjectRepository {
    if (this.dbType === 'firebase') {
      logger.info('Using Firebase Project Repository');
      return new FirebaseVillageProjectRepository();
    }
    return new LocalStorageVillageProjectRepository();
  }

  getComplaintRepository(): IComplaintRepository {
    if (this.dbType === 'firebase') {
      logger.info('Using Firebase Complaint Repository');
      return new FirebaseComplaintRepository();
    }
    return new LocalStorageComplaintRepository();
  }

  getAssetRepository(): IVillageAssetRepository {
    if (this.dbType === 'firebase') {
      logger.info('Using Firebase Asset Repository');
      return new FirebaseAssetRepository();
    }
    return new LocalStorageAssetRepository();
  }

  getNotificationRepository(): INotificationRepository {
    if (this.dbType === 'firebase') {
      logger.info('Using Firebase Notification Repository');
      return new FirebaseNotificationRepository();
    }
    return new LocalStorageNotificationRepository();
  }

  getMetricRepository(): IVillageMetricRepository {
    if (this.dbType === 'firebase') {
      logger.info('Using Firebase Metric Repository');
      return new FirebaseVillageMetricRepository();
    }
    return new LocalStorageVillageMetricRepository();
  }
}

export const repositoryFactory = new RepositoryFactory();
export default repositoryFactory;
