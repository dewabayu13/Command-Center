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
  addCitizen: (citizen: Citizen) => void;
  addAttendance: (record: Attendance) => void;
  addLetter: (letter: Letter) => void;
  updateLetterStatus: (id: string, status: 'Pending' | 'Verified' | 'Completed', signedBy?: string, qrCode?: string) => void;
  updateTaxStatus: (nop: string, status: 'Paid' | 'Unpaid') => void;
  addProject: (project: VillageProject) => void;
  addComplaint: (complaint: Complaint) => void;
  updateComplaintStatus: (id: string, status: 'Submitted' | 'In Progress' | 'Resolved') => void;
  addAsset: (asset: VillageAsset) => void;
  addNotification: (title: string, desc: string, category: VillageNotification['category']) => void;
  markNotificationAsRead: (id: string) => void;
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

  const addCitizen = (citizen: Citizen) => {
    logger.info(`Adding citizen: ${citizen.fullName}`);
    citizenRepo.addCitizen(citizen);
    refreshData();
    addNotification('Warga Baru Terdaftar', `${citizen.fullName} berhasil ditambahkan ke database kependudukan.`, 'attendance');
  };

  const addAttendance = (record: Attendance) => {
    logger.info(`Adding attendance record for: ${record.fullName}`);
    attendanceRepo.addAttendance(record);
    refreshData();
  };

  const addLetter = (letter: Letter) => {
    logger.info(`Submitting new letter: ${letter.title}`);
    letterRepo.addLetter(letter);
    refreshData();
    addNotification('Permohonan Surat Baru', `Permohonan ${letter.title} diajukan oleh ${letter.applicantName}.`, 'letter');
  };

  const updateLetterStatus = (
    id: string, 
    status: 'Pending' | 'Verified' | 'Completed', 
    signedBy?: string, 
    qrCode?: string
  ) => {
    logger.info(`Updating letter ${id} status to ${status}`);
    letterRepo.updateLetterStatus(id, status, signedBy, qrCode);
    refreshData();
    const l = letterRepo.getLetters().find(item => item.letterId === id);
    if (l) {
      addNotification('Status Surat Diperbarui', `Surat ${l.title} milik ${l.applicantName} berstatus ${status}.`, 'letter');
    }
  };

  const updateTaxStatus = (nop: string, status: 'Paid' | 'Unpaid') => {
    logger.info(`Updating tax status for ${nop} to ${status}`);
    taxpayerRepo.updateTaxStatus(nop, status);
    refreshData();
    const t = taxpayerRepo.getTaxpayers().find(item => item.nop === nop);
    if (t) {
      addNotification('Pembayaran Pajak', `Pajak PBB atas nama ${t.taxpayerName} ditandai ${status === 'Paid' ? 'LUNAS' : 'BELUM LUNAS'}.`, 'tax');
    }
  };

  const addProject = (project: VillageProject) => {
    logger.info(`Adding new project: ${project.name}`);
    projectRepo.addProject(project);
    refreshData();
    addNotification('Proyek Pembangunan', `Proyek "${project.name}" telah ditambahkan.`, 'finance');
  };

  const addComplaint = (complaint: Complaint) => {
    logger.info(`Adding complaint: ${complaint.title}`);
    complaintRepo.addComplaint(complaint);
    refreshData();
    addNotification('Laporan Keluhan Warga', `Aduan "${complaint.title}" diajukan oleh ${complaint.reporterName}.`, 'complaint');
  };

  const updateComplaintStatus = (id: string, status: 'Submitted' | 'In Progress' | 'Resolved') => {
    logger.info(`Updating complaint ${id} status to ${status}`);
    complaintRepo.updateComplaintStatus(id, status);
    refreshData();
    const c = complaintRepo.getComplaints().find(item => item.complaintId === id);
    if (c) {
      addNotification('Status Aduan Diperbarui', `Aduan "${c.title}" sekarang berstatus ${status}.`, 'complaint');
    }
  };

  const addAsset = (asset: VillageAsset) => {
    logger.info(`Adding new asset: ${asset.name}`);
    assetRepo.addAsset(asset);
    refreshData();
    addNotification('Aset Desa Ditambahkan', `Aset "${asset.name}" berhasil terdaftar dengan kode pelacakan QR.`, 'finance');
  };

  const addNotification = useCallback((title: string, desc: string, category: VillageNotification['category']) => {
    const newNotif: VillageNotification = {
      id: `notif_${Date.now()}`,
      title,
      description: desc,
      category,
      timestamp: 'Baru saja',
      read: false
    };
    logger.info(`Pushing notification: ${title}`);
    notificationRepo.addNotification(newNotif);
    refreshData();
  }, [notificationRepo, refreshData]);

  const markNotificationAsRead = (id: string) => {
    logger.info(`Marking notification ${id} as read`);
    notificationRepo.markNotificationRead(id);
    refreshData();
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
