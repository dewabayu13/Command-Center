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
  private citizenRepository?: ICitizenRepository;
  private employeeRepository?: IEmployeeRepository;
  private attendanceRepository?: IAttendanceRepository;
  private letterRepository?: ILetterRepository;
  private taxpayerRepository?: ITaxpayerRepository;
  private projectRepository?: IVillageProjectRepository;
  private complaintRepository?: IComplaintRepository;
  private assetRepository?: IVillageAssetRepository;
  private notificationRepository?: INotificationRepository;
  private metricRepository?: IVillageMetricRepository;

  constructor() {
    this.dbType = APP_CONFIG.DB_TYPE;
    logger.info(`RepositoryFactory initialized with database mode: ${this.dbType.toUpperCase()}`);
  }

  getCitizenRepository(): ICitizenRepository {
    if (!this.citizenRepository) {
      if (this.dbType === 'firebase') {
        logger.info('Using Firebase Citizen Repository');
        this.citizenRepository = new FirebaseCitizenRepository();
      } else {
        this.citizenRepository = new LocalStorageCitizenRepository();
      }
    }
    return this.citizenRepository;
  }

  getEmployeeRepository(): IEmployeeRepository {
    if (!this.employeeRepository) {
      if (this.dbType === 'firebase') {
        logger.info('Using Firebase Employee Repository');
        this.employeeRepository = new FirebaseEmployeeRepository();
      } else {
        this.employeeRepository = new LocalStorageEmployeeRepository();
      }
    }
    return this.employeeRepository;
  }

  getAttendanceRepository(): IAttendanceRepository {
    if (!this.attendanceRepository) {
      if (this.dbType === 'firebase') {
        logger.info('Using Firebase Attendance Repository');
        this.attendanceRepository = new FirebaseAttendanceRepository();
      } else {
        this.attendanceRepository = new LocalStorageAttendanceRepository();
      }
    }
    return this.attendanceRepository;
  }

  getLetterRepository(): ILetterRepository {
    if (!this.letterRepository) {
      if (this.dbType === 'firebase') {
        logger.info('Using Firebase Letter Repository');
        this.letterRepository = new FirebaseLetterRepository();
      } else {
        this.letterRepository = new LocalStorageLetterRepository();
      }
    }
    return this.letterRepository;
  }

  getTaxpayerRepository(): ITaxpayerRepository {
    if (!this.taxpayerRepository) {
      if (this.dbType === 'firebase') {
        logger.info('Using Firebase Taxpayer Repository');
        this.taxpayerRepository = new FirebaseTaxpayerRepository();
      } else {
        this.taxpayerRepository = new LocalStorageTaxpayerRepository();
      }
    }
    return this.taxpayerRepository;
  }

  getProjectRepository(): IVillageProjectRepository {
    if (!this.projectRepository) {
      if (this.dbType === 'firebase') {
        logger.info('Using Firebase Project Repository');
        this.projectRepository = new FirebaseVillageProjectRepository();
      } else {
        this.projectRepository = new LocalStorageVillageProjectRepository();
      }
    }
    return this.projectRepository;
  }

  getComplaintRepository(): IComplaintRepository {
    if (!this.complaintRepository) {
      if (this.dbType === 'firebase') {
        logger.info('Using Firebase Complaint Repository');
        this.complaintRepository = new FirebaseComplaintRepository();
      } else {
        this.complaintRepository = new LocalStorageComplaintRepository();
      }
    }
    return this.complaintRepository;
  }

  getAssetRepository(): IVillageAssetRepository {
    if (!this.assetRepository) {
      if (this.dbType === 'firebase') {
        logger.info('Using Firebase Asset Repository');
        this.assetRepository = new FirebaseAssetRepository();
      } else {
        this.assetRepository = new LocalStorageAssetRepository();
      }
    }
    return this.assetRepository;
  }

  getNotificationRepository(): INotificationRepository {
    if (!this.notificationRepository) {
      if (this.dbType === 'firebase') {
        logger.info('Using Firebase Notification Repository');
        this.notificationRepository = new FirebaseNotificationRepository();
      } else {
        this.notificationRepository = new LocalStorageNotificationRepository();
      }
    }
    return this.notificationRepository;
  }

  getMetricRepository(): IVillageMetricRepository {
    if (!this.metricRepository) {
      if (this.dbType === 'firebase') {
        logger.info('Using Firebase Metric Repository');
        this.metricRepository = new FirebaseVillageMetricRepository();
      } else {
        this.metricRepository = new LocalStorageVillageMetricRepository();
      }
    }
    return this.metricRepository;
  }
}

export const repositoryFactory = new RepositoryFactory();
export default repositoryFactory;
