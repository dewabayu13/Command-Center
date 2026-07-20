/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { BentoCard } from '../components/bento/BentoCard';
import { Hammer, Landmark, ShieldCheck, MapPin, Calendar, HardHat } from 'lucide-react';

export const Projects: React.FC = () => {
  const { projects } = useApp();

  return (
    <div className="p-6 space-y-6">
      
      {/* SUMMARIES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total Proyek Fisik</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-zinc-800 dark:text-zinc-100">
              {projects.length} Proyek
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">APBDDes Sektor Pembangunan</p>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
            <Hammer className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Anggaran Dialokasikan</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-emerald-500">
              Rp 450.000.000
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Status Dana: <strong className="text-emerald-500">Disalurkan 100%</strong></p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Kepatuhan K3 & Audit</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-indigo-500">
              100% LAYAN
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Standar: <strong className="text-indigo-500">Kementerian PUPR</strong></p>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-12 gap-5">
        
        {/* Main Projects list with progress bars */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
          {projects.map((proj) => (
            <BentoCard
              key={proj.projectId}
              title={`Proyek ID: ${proj.projectId}`}
              subtitle={proj.name}
              headerAction={
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  proj.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {proj.status === 'Completed' ? 'Selesai PUPR' : 'Sedang Berjalan'}
                </span>
              }
            >
              <div className="space-y-4 text-xs text-zinc-700 dark:text-zinc-300">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase font-mono block">Anggaran Sektor</span>
                    <strong className="text-[11px] text-zinc-800 dark:text-zinc-200">Rp {proj.budget.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase font-mono block">Mitra Pelaksana</span>
                    <strong className="text-[11px] text-zinc-800 dark:text-zinc-200">{proj.contractor}</strong>
                  </div>
                  <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase font-mono block">Tanggal Selesai</span>
                    <strong className="text-[11px] text-zinc-800 dark:text-zinc-200">15 Desember 2026</strong>
                  </div>
                  <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase font-mono block">Kordinat GPS</span>
                    <strong className="text-[11px] text-zinc-800 dark:text-zinc-200 font-mono">
                      {proj.location.lat.toFixed(4)}, {proj.location.lng.toFixed(4)}
                    </strong>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span>Kemajuan Konstruksi Fisik</span>
                    <span className="font-mono text-indigo-500">{proj.progress}% Selesai</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500" 
                      style={{ width: `${proj.progress}%` }} 
                    />
                  </div>
                </div>

                {/* Before vs After mock visual block */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="h-16 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] text-zinc-400 uppercase font-black font-mono">FOTO SEBELUM (0%)</span>
                    <p className="text-[10px] text-zinc-500">Kondisi Rusak / Berlubang</p>
                  </div>
                  <div className="h-16 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] text-emerald-500 uppercase font-black font-mono">KONDISI SAAT INI ({proj.progress}%)</span>
                    <p className="text-[10px] text-zinc-500">Pengecoran Beton / Finishing</p>
                  </div>
                </div>
              </div>
            </BentoCard>
          ))}
        </div>

        {/* Informative Side Panels */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          <BentoCard
            title="Tata Kelola Pembangunan"
            subtitle="Regulasi Pemda Majalengka"
            className="flex-1"
          >
            <div className="space-y-3.5 text-xs text-zinc-600 dark:text-zinc-400">
              <p>
                Setiap pengadaan fisik di Bongas Kulon terdaftar resmi pada LKPP/Sistem Informasi Rencana Umum Pengadaan (SIRUP) Kabupaten Majalengka untuk transparansi audit.
              </p>
              
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 rounded-xl space-y-1.5 font-medium">
                <span className="text-[9px] text-indigo-500 font-bold uppercase font-mono">Standar Transparansi</span>
                <p className="text-zinc-700 dark:text-zinc-300 text-[11px]">Plang Proyek Konstruksi terpasang di lapangan 100%.</p>
              </div>
            </div>
          </BentoCard>

          <BentoCard
            title="Agenda Monitoring Terdekat"
            subtitle="Kunjungan Lapangan Dinas PUPR"
            className="flex-1"
          >
            <div className="space-y-3">
              {[
                { date: 'Selasa, 11 Agt', task: 'Pengecekan Aspal Dusun Krajan', icon: HardHat },
                { date: 'Jumat, 14 Agt', task: 'Audit Laporan Pertanggungjawaban', icon: Calendar }
              ].map(agenda => {
                const Icon = agenda.icon;
                return (
                  <div key={agenda.task} className="flex gap-2.5 items-center p-2.5 rounded-xl border border-zinc-150 dark:border-zinc-800 text-xs">
                    <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">{agenda.task}</p>
                      <span className="text-[10px] text-zinc-500 font-mono">{agenda.date} • 09:00 WIB</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </BentoCard>
        </div>

      </div>

    </div>
  );
};
