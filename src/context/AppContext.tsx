/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  WeatherData,
  APBDesBudget,
  UserRole
} from '../types';

import { repositoryFactory } from '../repositories/RepositoryFactory';
import { logger } from '../utils/logger';
import { useAuth } from './AuthContext';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  
  citizens: Citizen[];
  employees: Employee[];
  attendanceList: Attendance[];
  letters: Letter[];
  taxpayers: Taxpayer[];
  projects: VillageProject[];
  complaints: Complaint[];
  assets: VillageAsset[];
  notifications: VillageNotification[];
  weather: WeatherData;
  budget: APBDesBudget;

  refreshData: () => void;
  addCitizen: (citizen: Citizen) => Promise<void>;
  updateCitizen: (citizen: Citizen) => Promise<void>;
  deleteCitizen: (nik: string) => Promise<void>;
  addAttendance: (record: Attendance) => Promise<void>;
  addLetter: (letter: Letter) => Promise<void>;
  updateLetterStatus: (id: string, status: 'Pending' | 'Verified' | 'Completed', signedBy?: string, qrCode?: string) => Promise<void>;
  updateTaxStatus: (nop: string, status: 'Paid' | 'Unpaid') => Promise<void>;
  addProject: (project: VillageProject) => Promise<void>;
  addComplaint: (complaint: Complaint) => Promise<void>;
  updateComplaintStatus: (id: string, status: 'Submitted' | 'In Progress' | 'Resolved') => Promise<void>;
  addAsset: (asset: VillageAsset) => Promise<void>;
  addNotification: (title: string, desc: string, category: VillageNotification['category']) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Access repositories via the repository factory
  const citizenRepo = repositoryFactory.getCitizenRepository();
  const employeeRepo = repositoryFactory.getEmployeeRepository();
  const attendanceRepo = repositoryFactory.getAttendanceRepository();
  const letterRepo = repositoryFactory.getLetterRepository();
  const taxpayerRepo = repositoryFactory.getTaxpayerRepository();
  const projectRepo = repositoryFactory.getProjectRepository();
  const complaintRepo = repositoryFactory.getComplaintRepository();
  const assetRepo = repositoryFactory.getAssetRepository();
  const notificationRepo = repositoryFactory.getNotificationRepository();
  const metricRepo = repositoryFactory.getMetricRepository();

  // Start with Secretary as default for full write privileges, but selectable
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.SECRETARY);
  const [activePage, setActivePage] = useState<string>('dashboard');

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setCurrentRole(user.role);
    }
  }, [user]);

  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [taxpayers, setTaxpayers] = useState<Taxpayer[]>([]);
  const [projects, setProjects] = useState<VillageProject[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [assets, setAssets] = useState<VillageAsset[]>([]);
  const [notifications, setNotifications] = useState<VillageNotification[]>([]);
  const [weather, setWeather] = useState<WeatherData>(metricRepo.getWeather());
  const [budget, setBudget] = useState<APBDesBudget>(metricRepo.getBudget());

  const refreshData = useCallback(() => {
    logger.debug('AppContext refreshing all repository data');
    setCitizens(citizenRepo.getCitizens());
    setEmployees(employeeRepo.getEmployees());
    setAttendanceList(attendanceRepo.getAttendance());
    setLetters(letterRepo.getLetters());
    setTaxpayers(taxpayerRepo.getTaxpayers());
    setProjects(projectRepo.getProjects());
    setComplaints(complaintRepo.getComplaints());
    setAssets(assetRepo.getAssets());
    setNotifications(notificationRepo.getNotifications());
    setWeather(metricRepo.getWeather());
    setBudget(metricRepo.getBudget());
  }, [
    citizenRepo,
    employeeRepo,
    attendanceRepo,
    letterRepo,
    taxpayerRepo,
    projectRepo,
    complaintRepo,
    assetRepo,
    notificationRepo,
    metricRepo
  ]);

  // Fetch initial data
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addCitizen = async (citizen: Citizen) => {
    logger.info(`Adding citizen: ${citizen.fullName}`);
    try {
      await citizenRepo.addCitizen(citizen);
      refreshData();
      await addNotification('Warga Baru Terdaftar', `${citizen.fullName} berhasil ditambahkan ke database kependudukan.`, 'attendance');
    } catch (error) {
      logger.error('Error adding citizen:', error);
      throw error;
    }
  };

  const updateCitizen = async (citizen: Citizen) => {
    logger.info(`Updating citizen: ${citizen.fullName}`);
    try {
      await citizenRepo.updateCitizen(citizen);
      refreshData();
    } catch (error) {
      logger.error('Error updating citizen:', error);
      throw error;
    }
  };

  const deleteCitizen = async (nik: string) => {
    logger.info(`Deleting citizen: ${nik}`);
    try {
      await citizenRepo.deleteCitizen(nik);
      refreshData();
    } catch (error) {
      logger.error('Error deleting citizen:', error);
      throw error;
    }
  };

  const addAttendance = async (record: Attendance) => {
    logger.info(`Adding attendance record for: ${record.fullName}`);
    try {
      await attendanceRepo.addAttendance(record);
      refreshData();
    } catch (error) {
      logger.error('Error adding attendance:', error);
      throw error;
    }
  };

  const addLetter = async (letter: Letter) => {
    logger.info(`Submitting new letter: ${letter.title}`);
    try {
      await letterRepo.addLetter(letter);
      refreshData();
      await addNotification('Permohonan Surat Baru', `Permohonan ${letter.title} diajukan oleh ${letter.applicantName}.`, 'letter');
    } catch (error) {
      logger.error('Error adding letter:', error);
      throw error;
    }
  };

  const updateLetterStatus = async (
    id: string, 
    status: 'Pending' | 'Verified' | 'Completed', 
    signedBy?: string, 
    qrCode?: string
  ) => {
    logger.info(`Updating letter ${id} status to ${status}`);
    try {
      await letterRepo.updateLetterStatus(id, status, signedBy, qrCode);
      refreshData();
      const l = letterRepo.getLetters().find(item => item.letterId === id);
      if (l) {
        await addNotification('Status Surat Diperbarui', `Surat ${l.title} milik ${l.applicantName} berstatus ${status}.`, 'letter');
      }
    } catch (error) {
      logger.error('Error updating letter status:', error);
      throw error;
    }
  };

  const updateTaxStatus = async (nop: string, status: 'Paid' | 'Unpaid') => {
    logger.info(`Updating tax status for ${nop} to ${status}`);
    try {
      await taxpayerRepo.updateTaxStatus(nop, status);
      refreshData();
      const t = taxpayerRepo.getTaxpayers().find(item => item.nop === nop);
      if (t) {
        await addNotification('Pembayaran Pajak', `Pajak PBB atas nama ${t.taxpayerName} ditandai ${status === 'Paid' ? 'LUNAS' : 'BELUM LUNAS'}.`, 'tax');
      }
    } catch (error) {
      logger.error('Error updating tax status:', error);
      throw error;
    }
  };

  const addProject = async (project: VillageProject) => {
    logger.info(`Adding new project: ${project.name}`);
    try {
      await projectRepo.addProject(project);
      refreshData();
      await addNotification('Proyek Pembangunan', `Proyek "${project.name}" telah ditambahkan.`, 'finance');
    } catch (error) {
      logger.error('Error adding project:', error);
      throw error;
    }
  };

  const addComplaint = async (complaint: Complaint) => {
    logger.info(`Adding complaint: ${complaint.title}`);
    try {
      await complaintRepo.addComplaint(complaint);
      refreshData();
      await addNotification('Laporan Keluhan Warga', `Aduan "${complaint.title}" diajukan oleh ${complaint.reporterName}.`, 'complaint');
    } catch (error) {
      logger.error('Error adding complaint:', error);
      throw error;
    }
  };

  const updateComplaintStatus = async (id: string, status: 'Submitted' | 'In Progress' | 'Resolved') => {
    logger.info(`Updating complaint ${id} status to ${status}`);
    try {
      await complaintRepo.updateComplaintStatus(id, status);
      refreshData();
      const c = complaintRepo.getComplaints().find(item => item.complaintId === id);
      if (c) {
        await addNotification('Status Aduan Diperbarui', `Aduan "${c.title}" sekarang berstatus ${status}.`, 'complaint');
      }
    } catch (error) {
      logger.error('Error updating complaint status:', error);
      throw error;
    }
  };

  const addAsset = async (asset: VillageAsset) => {
    logger.info(`Adding new asset: ${asset.name}`);
    try {
      await assetRepo.addAsset(asset);
      refreshData();
      await addNotification('Aset Desa Ditambahkan', `Aset "${asset.name}" berhasil terdaftar dengan kode pelacakan QR.`, 'finance');
    } catch (error) {
      logger.error('Error adding asset:', error);
      throw error;
    }
  };

  const addNotification = async (title: string, desc: string, category: VillageNotification['category']) => {
    const newNotif: VillageNotification = {
      id: `notif_${Date.now()}`,
      title,
      description: desc,
      category,
      timestamp: 'Baru saja',
      read: false
    };
    logger.info(`Pushing notification: ${title}`);
    try {
      await notificationRepo.addNotification(newNotif);
      refreshData();
    } catch (error) {
      logger.error('Error adding notification:', error);
      throw error;
    }
  };

  const markNotificationAsRead = async (id: string) => {
    logger.info(`Marking notification ${id} as read`);
    try {
      await notificationRepo.markNotificationRead(id);
      refreshData();
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activePage,
        setActivePage,
        
        citizens,
        employees,
        attendanceList,
        letters,
        taxpayers,
        projects,
        complaints,
        assets,
        notifications,
        weather,
        budget,

        refreshData,
        addCitizen,
        updateCitizen,
        deleteCitizen,
        addAttendance,
        addLetter,
        updateLetterStatus,
        updateTaxStatus,
        addProject,
        addComplaint,
        updateComplaintStatus,
        addAsset,
        addNotification,
        markNotificationAsRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
