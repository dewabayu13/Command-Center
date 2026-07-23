/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  WeatherData
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
  mockBudget
} from '../utils/mockData';

import { APP_CONFIG } from '../config/appConfig';
import { logger } from '../utils/logger';

// Storage Helper
const getStored = <T>(key: string, fallback: T): T => {
  const fullKey = `${APP_CONFIG.LOCAL_STORAGE_PREFIX}${key}`;
  try {
    const data = localStorage.getItem(fullKey);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    logger.error(`Error reading key "${fullKey}" from localStorage`, err);
    return fallback;
  }
};

const setStored = <T>(key: string, value: T): void => {
  const fullKey = `${APP_CONFIG.LOCAL_STORAGE_PREFIX}${key}`;
  try {
    localStorage.setItem(fullKey, JSON.stringify(value));
  } catch (err) {
    logger.error(`Error writing key "${fullKey}" to localStorage`, err);
  }
};

export class LocalStorageCitizenRepository implements ICitizenRepository {
  getCitizens(): Citizen[] {
    logger.info('LocalStorageCitizenRepository.getCitizens called');
    return getStored('citizens', mockCitizens);
  }

  async addCitizen(citizen: Citizen): Promise<void> {
    logger.info(`LocalStorageCitizenRepository.addCitizen for: ${citizen.fullName}`);
    const list = this.getCitizens();
    list.unshift(citizen);
    setStored('citizens', list);
  }

  async updateCitizen(citizen: Citizen): Promise<void> {
    logger.info(`LocalStorageCitizenRepository.updateCitizen: ${citizen.nik}`);
    const list = this.getCitizens();
    const index = list.findIndex(c => c.nik === citizen.nik);
    if (index !== -1) {
      list[index] = citizen;
      setStored('citizens', list);
    }
  }

  async deleteCitizen(nik: string): Promise<void> {
    logger.info(`LocalStorageCitizenRepository.deleteCitizen: ${nik}`);
    const list = this.getCitizens().filter(c => c.nik !== nik);
    setStored('citizens', list);
  }
}

export class LocalStorageEmployeeRepository implements IEmployeeRepository {
  getEmployees(): Employee[] {
    logger.info('LocalStorageEmployeeRepository.getEmployees called');
    // static roles listing
    return mockEmployees;
  }
}

export class LocalStorageAttendanceRepository implements IAttendanceRepository {
  getAttendance(): Attendance[] {
    logger.info('LocalStorageAttendanceRepository.getAttendance called');
    return getStored('attendance', mockAttendanceList);
  }

  async addAttendance(record: Attendance): Promise<void> {
    logger.info(`LocalStorageAttendanceRepository.addAttendance for: ${record.fullName}`);
    const list = this.getAttendance();
    list.unshift(record);
    setStored('attendance', list);
  }
}

export class LocalStorageLetterRepository implements ILetterRepository {
  getLetters(): Letter[] {
    logger.info('LocalStorageLetterRepository.getLetters called');
    return getStored('letters', mockLetters);
  }

  async addLetter(letter: Letter): Promise<void> {
    logger.info(`LocalStorageLetterRepository.addLetter for: ${letter.title}`);
    const list = this.getLetters();
    list.unshift(letter);
    setStored('letters', list);
  }

  async updateLetterStatus(
    letterId: string,
    status: 'Pending' | 'Verified' | 'Completed',
    signedBy?: string,
    qrCode?: string
  ): Promise<void> {
    logger.info(`LocalStorageLetterRepository.updateLetterStatus id: ${letterId} status: ${status}`);
    const list = this.getLetters();
    const updated = list.map(l => {
      if (l.letterId === letterId) {
        return {
          ...l,
          status,
          completedAt: status === 'Completed' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : undefined,
          signedBy,
          qrVerificationCode: qrCode
        };
      }
      return l;
    });
    setStored('letters', updated);
  }
}

export class LocalStorageTaxpayerRepository implements ITaxpayerRepository {
  getTaxpayers(): Taxpayer[] {
    logger.info('LocalStorageTaxpayerRepository.getTaxpayers called');
    return getStored('taxpayers', mockTaxpayers);
  }

  async updateTaxStatus(nop: string, status: 'Paid' | 'Unpaid'): Promise<void> {
    logger.info(`LocalStorageTaxpayerRepository.updateTaxStatus nop: ${nop} status: ${status}`);
    const list = this.getTaxpayers();
    const updated = list.map(t => {
      if (t.nop === nop) {
        return {
          ...t,
          status,
          paidAt: status === 'Paid' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : undefined
        };
      }
      return t;
    });
    setStored('taxpayers', updated);
  }
}

export class LocalStorageVillageProjectRepository implements IVillageProjectRepository {
  getProjects(): VillageProject[] {
    logger.info('LocalStorageVillageProjectRepository.getProjects called');
    return getStored('projects', mockProjects);
  }

  async addProject(project: VillageProject): Promise<void> {
    logger.info(`LocalStorageVillageProjectRepository.addProject for: ${project.name}`);
    const list = this.getProjects();
    list.unshift(project);
    setStored('projects', list);
  }
}

export class LocalStorageComplaintRepository implements IComplaintRepository {
  getComplaints(): Complaint[] {
    logger.info('LocalStorageComplaintRepository.getComplaints called');
    return getStored('complaints', mockComplaints);
  }

  async addComplaint(complaint: Complaint): Promise<void> {
    logger.info(`LocalStorageComplaintRepository.addComplaint for: ${complaint.title}`);
    const list = this.getComplaints();
    list.unshift(complaint);
    setStored('complaints', list);
  }

  async updateComplaintStatus(
    complaintId: string,
    status: 'Submitted' | 'In Progress' | 'Resolved'
  ): Promise<void> {
    logger.info(`LocalStorageComplaintRepository.updateComplaintStatus id: ${complaintId} status: ${status}`);
    const list = this.getComplaints();
    const updated = list.map(c => {
      if (c.complaintId === complaintId) {
        return {
          ...c,
          status,
          responseTimeHours: status === 'Resolved' ? Math.floor(Math.random() * 24) + 12 : undefined
        };
      }
      return c;
    });
    setStored('complaints', updated);
  }
}

export class LocalStorageAssetRepository implements IVillageAssetRepository {
  getAssets(): VillageAsset[] {
    logger.info('LocalStorageAssetRepository.getAssets called');
    return getStored('assets', mockAssets);
  }

  async addAsset(asset: VillageAsset): Promise<void> {
    logger.info(`LocalStorageAssetRepository.addAsset for: ${asset.name}`);
    const list = this.getAssets();
    list.unshift(asset);
    setStored('assets', list);
  }
}

export class LocalStorageNotificationRepository implements INotificationRepository {
  getNotifications(): VillageNotification[] {
    logger.info('LocalStorageNotificationRepository.getNotifications called');
    return getStored('notifications', mockNotifications);
  }

  async addNotification(notif: VillageNotification): Promise<void> {
    logger.info(`LocalStorageNotificationRepository.addNotification for: ${notif.title}`);
    const list = this.getNotifications();
    list.unshift(notif);
    setStored('notifications', list);
  }

  async markNotificationRead(id: string): Promise<void> {
    logger.info(`LocalStorageNotificationRepository.markNotificationRead id: ${id}`);
    const list = this.getNotifications();
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    setStored('notifications', updated);
  }
}

export class LocalStorageVillageMetricRepository implements IVillageMetricRepository {
  getBudget(): APBDesBudget {
    logger.info('LocalStorageVillageMetricRepository.getBudget called');
    return mockBudget;
  }

  getWeather(): WeatherData {
    logger.info('LocalStorageVillageMetricRepository.getWeather called');
    return mockWeather;
  }
}
