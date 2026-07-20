/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Attendance } from '../types';
import { BentoCard } from '../components/bento/BentoCard';
import { ClipboardCheck, MapPin, ShieldAlert, CheckCircle, Fingerprint, Camera, Play } from 'lucide-react';

export const AttendanceMonitor: React.FC = () => {
  const { employees, attendanceList, addAttendance, currentRole } = useApp();
  const { toast } = useToast();

  const [simulating, setSimulating] = useState(false);
  const [simulatedStaff, setSimulatedStaff] = useState(employees[0]?.uid || '');
  const [gpsMatch, setGpsMatch] = useState(true);
  const [faceReady, setFaceReady] = useState(true);
  const [fingerprintMatch, setFingerprintMatch] = useState(true);

  // Stats
  const totalStaff = employees.length;
  const presentCount = attendanceList.filter(a => a.status === 'Present').length;
  const lateCount = attendanceList.filter(a => a.status === 'Late').length;

  const handleSimulateCheckIn = () => {
    const staff = employees.find(e => e.uid === simulatedStaff);
    if (!staff) return;

    // Check if already checked in today
    const exists = attendanceList.some(a => a.uid === simulatedStaff);
    if (exists) {
      toast(`Staff ${staff.fullName} sudah melakukan presensi hari ini.`, 'warning', 'Sudah Presensi');
      return;
    }

    setSimulating(true);

    setTimeout(() => {
      if (!gpsMatch || !faceReady || !fingerprintMatch) {
        toast('Gagal melakukan presensi: Validasi Biometrik / GPS tidak memenuhi syarat!', 'error', 'Validasi Gagal');
        setSimulating(false);
        return;
      }

      const now = new Date();
      const currentHour = now.getHours();
      const checkInStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const isLate = currentHour > 7 || (currentHour === 7 && now.getMinutes() > 30); // Late after 07:30 AM

      const record: Attendance = {
        attendanceId: `att_${Date.now()}`,
        uid: staff.uid,
        fullName: staff.fullName,
        role: staff.role,
        date: now.toISOString().split('T')[0],
        checkIn: checkInStr,
        status: isLate ? 'Late' : 'Present',
        location: { lat: -7.712345 + (Math.random() - 0.5) * 0.001, lng: 110.412345 + (Math.random() - 0.5) * 0.001 },
        notes: isLate ? 'Sistem: Masuk melampaui batas toleransi 07:30' : 'Simulasi: Presensi Mandiri GPS'
      };

      addAttendance(record);
      setSimulating(false);
      toast(`Presensi berhasil disimpan! ${staff.fullName} ditandai sebagai ${isLate ? 'TERLAMBAT' : 'HADIR'}.`, isLate ? 'warning' : 'success', 'Presensi Berhasil');
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* METRIC SUMMARIES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total Aparatur</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-zinc-800 dark:text-zinc-100">{totalStaff} Orang</h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Terdaftar Sektor Pemerintahan Desa</p>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
            <ClipboardCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Hadir Tepat Waktu</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-emerald-500">{presentCount} Jiwa</h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Presensi Terverifikasi Biometrik</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Keterlambatan</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-rose-500">{lateCount} Orang</h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Batas Presensi Maksimal 07:30 WIB</p>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        
        {/* Presensi Logs table */}
        <BentoCard
          title="Log Kehadiran Aparatur Hari Ini"
          subtitle="Jurnal Absensi Realtime Desa Bongas Kulon"
          className="col-span-12 lg:col-span-8 h-[400px]"
        >
          <div className="w-full h-full overflow-x-auto overflow-y-auto max-h-[300px] border border-zinc-150 dark:border-zinc-800 rounded-xl custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-400 font-bold uppercase border-b border-zinc-150 dark:border-zinc-800">
                <tr>
                  <th className="p-3">Aparatur Desa</th>
                  <th className="p-3">Jabatan</th>
                  <th className="p-3">Jam Masuk</th>
                  <th className="p-3">Lokasi GPS</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-200">
                {attendanceList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-zinc-400">
                      Belum ada aparatur melakukan presensi hari ini.
                    </td>
                  </tr>
                ) : (
                  attendanceList.map((log) => (
                    <tr key={log.attendanceId} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-850/50 transition-colors">
                      <td className="p-3 font-bold text-zinc-800 dark:text-zinc-100">{log.fullName}</td>
                      <td className="p-3 font-medium text-zinc-500">{log.role}</td>
                      <td className="p-3 font-mono font-bold text-indigo-500">{log.checkIn}</td>
                      <td className="p-3">
                        {log.location ? (
                          <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-500">
                            <MapPin className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                            <span>{log.location.lat.toFixed(5)}, {log.location.lng.toFixed(5)}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-400 italic">No GPS</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase leading-none ${
                          log.status === 'Present' 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {log.status === 'Present' ? 'Tepat Waktu' : 'Terlambat'}
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-zinc-500 max-w-[150px] truncate" title={log.notes}>
                        {log.notes || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </BentoCard>

        {/* Console Presensi Simulator */}
        <BentoCard
          title="Konsol Simulator Presensi"
          subtitle="Validasi Biometrik & GPS"
          className="col-span-12 lg:col-span-4 flex flex-col justify-between"
        >
          <div className="space-y-4 text-xs text-zinc-700 dark:text-zinc-300">
            <div>
              <label className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">Pilih Aparatur Desa</label>
              <select
                value={simulatedStaff}
                onChange={(e) => setSimulatedStaff(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-2 rounded-xl outline-none"
              >
                {employees.map(emp => (
                  <option key={emp.uid} value={emp.uid}>
                    {emp.fullName} ({emp.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <span className="block font-bold text-zinc-500 dark:text-zinc-400">Pemeriksaan Persyaratan Presensi</span>
              
              <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium">Lokasi GPS Di Balai Desa (Jari-jari 50m)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={gpsMatch}
                    onChange={(e) => setGpsMatch(e.target.checked)}
                    className="w-4 h-4"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-teal-500" />
                    <span className="font-medium">Sensor Sidik Jari Cocok</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={fingerprintMatch}
                    onChange={(e) => setFingerprintMatch(e.target.checked)}
                    className="w-4 h-4"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-rose-500" />
                    <span className="font-medium">Deteksi Wajah Face Match (AI Cam)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={faceReady}
                    onChange={(e) => setFaceReady(e.target.checked)}
                    className="w-4 h-4"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSimulateCheckIn}
              disabled={simulating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span>{simulating ? 'Menjalankan Autentikasi...' : 'Lakukan Presensi Mandiri'}</span>
            </button>
          </div>
        </BentoCard>

      </div>

    </div>
  );
};
