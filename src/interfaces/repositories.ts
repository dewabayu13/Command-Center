/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

export interface ICitizenRepository {
  getCitizens(): Citizen[];
  addCitizen(citizen: Citizen): Promise<void>;
  updateCitizen(citizen: Citizen): Promise<void>;
  deleteCitizen(nik: string): Promise<void>;
}

export interface IEmployeeRepository {
  getEmployees(): Employee[];
}

export interface IAttendanceRepository {
  getAttendance(): Attendance[];
  addAttendance(record: Attendance): Promise<void>;
}

export interface ILetterRepository {
  getLetters(): Letter[];
  addLetter(letter: Letter): Promise<void>;
  updateLetterStatus(
    letterId: string,
    status: 'Pending' | 'Verified' | 'Completed',
    signedBy?: string,
    qrCode?: string
  ): Promise<void>;
}

export interface ITaxpayerRepository {
  getTaxpayers(): Taxpayer[];
  updateTaxStatus(nop: string, status: 'Paid' | 'Unpaid'): Promise<void>;
}

export interface IVillageProjectRepository {
  getProjects(): VillageProject[];
  addProject(project: VillageProject): Promise<void>;
}

export interface IComplaintRepository {
  getComplaints(): Complaint[];
  addComplaint(complaint: Complaint): Promise<void>;
  updateComplaintStatus(
    complaintId: string,
    status: 'Submitted' | 'In Progress' | 'Resolved'
  ): Promise<void>;
}

export interface IVillageAssetRepository {
  getAssets(): VillageAsset[];
  addAsset(asset: VillageAsset): Promise<void>;
}

export interface INotificationRepository {
  getNotifications(): VillageNotification[];
  addNotification(notif: VillageNotification): Promise<void>;
  markNotificationRead(id: string): Promise<void>;
}

export interface IVillageMetricRepository {
  getBudget(): APBDesBudget;
  getWeather(): WeatherData;
}
