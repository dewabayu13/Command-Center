/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { BentoCard } from '../components/bento/BentoCard';
import { Camera, RefreshCw, Maximize2, MoveLeft, MoveRight, MoveUp, MoveDown, Compass, Play } from 'lucide-react';

export const CCTV: React.FC = () => {
  const { toast } = useToast();
  const [activeCam, setActiveCam] = useState<number>(0);
  const [ptzMessage, setPtzMessage] = useState<string>('Pilih arah untuk mengendalikan PTZ kamera aktif');
  const [snapshotTaken, setSnapshotTaken] = useState<string | null>(null);

  const cameras = [
    { id: 0, name: 'Simpang Tiga Utama', ip: '192.168.1.10', location: 'Gapura Masuk Blok Sabtu', status: 'Online', feed: 'bg-indigo-950/50' },
    { id: 1, name: 'Halaman Balai Desa', ip: '192.168.1.11', location: 'Parkir Depan', status: 'Online', feed: 'bg-teal-950/50' },
    { id: 2, name: 'Gedung Serbaguna', ip: '192.168.1.12', location: 'Pintu Samping', status: 'Online', feed: 'bg-sky-950/50' },
    { id: 3, name: 'PAUD Kasih Ibu Kencana', ip: '192.168.1.13', location: 'Taman Bermain', status: 'Online', feed: 'bg-violet-950/50' },
    { id: 4, name: 'Pos Kamling RT 03', ip: '192.168.1.14', location: 'Blok Selasa', status: 'Online', feed: 'bg-emerald-950/50' },
    { id: 5, name: 'Pintu Irigasi Sawah', ip: '192.168.1.15', location: 'Sektor Selatan', status: 'Offline', feed: 'bg-zinc-900/80' }
  ];

  const handlePTZ = (direction: string) => {
    const active = cameras.find(c => c.id === activeCam);
    if (!active || active.status === 'Offline') {
      setPtzMessage('Gagal: Kamera offline tidak dapat dikendalikan!');
      return;
    }
    setPtzMessage(`Kamera "${active.name}" diputar 5° ke arah ${direction.toUpperCase()}`);
    setTimeout(() => {
      setPtzMessage('Kembali ke posisi diam. Menunggu perintah PTZ...');
    }, 2000);
  };

  const takeSnapshot = () => {
    const active = cameras.find(c => c.id === activeCam);
    if (!active || active.status === 'Offline') {
      toast('Gagal mengambil cuplikan: Kamera offline!', 'error', 'Koneksi Gagal');
      return;
    }
    const timestamp = new Date().toLocaleString('id-ID');
    const filename = `SNAP_${active.id}_${Date.now()}.png`;
    setSnapshotTaken(`Cuplikan layar "${active.name}" berhasil disimpan pada ${timestamp}. (File: ${filename})`);
    toast(`Cuplikan layar "${active.name}" berhasil disimpan!`, 'success', 'Snapshot Berhasil');
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* SECTION 1: Surveillance Viewports Matrix */}
      <div className="grid grid-cols-12 gap-5">
        
        {/* Main CCTV Viewer */}
        <BentoCard
          title="Saluran Pengawasan Aktif"
          subtitle={cameras[activeCam].name}
          className="col-span-12 lg:col-span-8 h-[440px] flex flex-col justify-between"
          headerAction={
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                cameras[activeCam].status === 'Online' ? 'bg-emerald-500/10 text-emerald-500 animate-pulse' : 'bg-rose-500/10 text-rose-500'
              }`}>
                {cameras[activeCam].status}
              </span>
            </div>
          }
        >
          {/* Main Feed Viewfinder */}
          <div className={`flex-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 ${cameras[activeCam].feed} relative flex flex-col items-center justify-center text-white overflow-hidden shadow-inner`}>
            {/* Scanlines Effect overlay */}
            <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            
            <div className="absolute top-4 left-4 flex flex-col font-mono text-[9px] text-zinc-300">
              <span>KAMERA ID: #0{cameras[activeCam].id}</span>
              <span>LOKASI: {cameras[activeCam].location}</span>
              <span>IP: {cameras[activeCam].ip}</span>
            </div>

            {cameras[activeCam].status === 'Online' ? (
              <div className="text-center space-y-2 z-10">
                <Play className="w-12 h-12 text-white/90 hover:scale-110 cursor-pointer drop-shadow-md mx-auto transition-transform" />
                <p className="text-[10px] text-zinc-300 font-bold font-mono uppercase tracking-wider">Sedang Streaming (Bongas Kulon Cloud-Net)</p>
              </div>
            ) : (
              <div className="text-center space-y-1.5 text-rose-500 font-mono z-10">
                <p className="text-sm font-bold uppercase tracking-widest">Koneksi Terputus</p>
                <p className="text-[10px] text-zinc-400">Silakan periksa sambungan kabel LAN / Catu Daya Router.</p>
              </div>
            )}

            <div className="absolute bottom-4 right-4 flex items-center gap-3">
              <button 
                onClick={takeSnapshot}
                className="bg-black/60 hover:bg-black text-white px-2.5 py-1 rounded-lg text-[10px] font-bold border border-white/15 flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Ambil Foto</span>
              </button>
            </div>
          </div>
        </BentoCard>

        {/* PTZ Console panel */}
        <BentoCard
          title="Panel Pengendali PTZ Kamera"
          subtitle="Arahkan Pandangan Kamera Lapangan"
          className="col-span-12 lg:col-span-4 flex flex-col justify-between"
        >
          <div className="space-y-4 text-xs text-zinc-700 dark:text-zinc-300">
            <p className="leading-relaxed">
              Konsol kontrol PTZ (Pan, Tilt, Zoom) terintegrasi langsung ke penggerak mekanis motor di tiang pemancar CCTV desa.
            </p>

            {/* Simulated Joystick Interface */}
            <div className="py-4 flex flex-col items-center">
              <div className="w-36 h-36 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-full relative flex items-center justify-center shadow-inner">
                <button 
                  onClick={() => handlePTZ('Atas')}
                  className="absolute top-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-indigo-500 hover:text-white"
                  title="Tilt Atas"
                >
                  <MoveUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handlePTZ('Bawah')}
                  className="absolute bottom-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-indigo-500 hover:text-white"
                  title="Tilt Bawah"
                >
                  <MoveDown className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handlePTZ('Kiri')}
                  className="absolute left-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-indigo-500 hover:text-white"
                  title="Pan Kiri"
                >
                  <MoveLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handlePTZ('Kanan')}
                  className="absolute right-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-indigo-500 hover:text-white"
                  title="Pan Kanan"
                >
                  <MoveRight className="w-4 h-4" />
                </button>

                <div className="w-12 h-12 rounded-full bg-indigo-600/10 border border-indigo-500 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-indigo-500 animate-spin-slow" />
                </div>
              </div>
            </div>

            {/* PTZ Status Feedback Bar */}
            <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-center">
              <span className="text-[10px] text-indigo-500 font-bold uppercase font-mono tracking-wider">Status Pemancar PTZ</span>
              <p className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mt-1">{ptzMessage}</p>
            </div>
          </div>
        </BentoCard>

      </div>

      {/* SECTION 2: Grid list of all viewports */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono">Daftar Matrix Kamera Saluran Desa</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cameras.map(cam => (
            <div
              key={cam.id}
              onClick={() => setActiveCam(cam.id)}
              className={`p-3 rounded-2xl border transition-all duration-300 cursor-pointer text-xs flex flex-col justify-between h-28 relative overflow-hidden ${
                activeCam === cam.id
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span className="line-clamp-1">{cam.name}</span>
                <Camera className={`w-3.5 h-3.5 ${activeCam === cam.id ? 'text-white' : 'text-zinc-400'}`} />
              </div>
              <p className={`text-[10px] ${activeCam === cam.id ? 'text-indigo-200' : 'text-zinc-500'} mt-1 truncate`}>
                {cam.location}
              </p>
              
              <div className="flex items-center justify-between border-t border-zinc-100/10 pt-1.5 mt-2">
                <span className="font-mono text-[9px] opacity-75">{cam.ip}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${cam.status === 'Online' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Snapshot log banner if taken */}
      {snapshotTaken && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          {snapshotTaken}
        </div>
      )}

    </div>
  );
};
