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
  addCitizen(citizen: Citizen): Citizen[];
}

export interface IEmployeeRepository {
  getEmployees(): Employee[];
}

export interface IAttendanceRepository {
  getAttendance(): Attendance[];
  addAttendance(record: Attendance): Attendance[];
}

export interface ILetterRepository {
  getLetters(): Letter[];
  addLetter(letter: Letter): Letter[];
  updateLetterStatus(
    letterId: string,
    status: 'Pending' | 'Verified' | 'Completed',
    signedBy?: string,
    qrCode?: string
  ): Letter[];
}

export interface ITaxpayerRepository {
  getTaxpayers(): Taxpayer[];
  updateTaxStatus(nop: string, status: 'Paid' | 'Unpaid'): Taxpayer[];
}

export interface IVillageProjectRepository {
  getProjects(): VillageProject[];
  addProject(project: VillageProject): VillageProject[];
}

export interface IComplaintRepository {
  getComplaints(): Complaint[];
  addComplaint(complaint: Complaint): Complaint[];
  updateComplaintStatus(
    complaintId: string,
    status: 'Submitted' | 'In Progress' | 'Resolved'
  ): Complaint[];
}

export interface IVillageAssetRepository {
  getAssets(): VillageAsset[];
  addAsset(asset: VillageAsset): VillageAsset[];
}

export interface INotificationRepository {
  getNotifications(): VillageNotification[];
  addNotification(notif: VillageNotification): VillageNotification[];
  markNotificationRead(id: string): VillageNotification[];
}

export interface IVillageMetricRepository {
  getBudget(): APBDesBudget;
  getWeather(): WeatherData;
}
