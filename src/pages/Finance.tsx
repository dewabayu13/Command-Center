/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { BentoCard } from '../components/bento/BentoCard';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Coins, 
  Briefcase, 
  ShieldCheck, 
  Percent, 
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

export const Finance: React.FC = () => {
  const { budget } = useApp();

  // APBDes Monthly Flow Simulation Data
  const monthlyFlowData = [
    { bulan: 'Jan', Pendapatan: 150, Pengeluaran: 80 },
    { bulan: 'Feb', Pendapatan: 220, Pengeluaran: 120 },
    { bulan: 'Mar', Pendapatan: 380, Pengeluaran: 210 },
    { bulan: 'Apr', Pendapatan: 410, Pengeluaran: 300 },
    { bulan: 'Mei', Pendapatan: 590, Pengeluaran: 440 },
    { bulan: 'Jun', Pendapatan: 710, Pengeluaran: 590 },
    { bulan: 'Jul', Pendapatan: 890, Pengeluaran: 710 }
  ];

  const padValue = budget.revenue.sectors?.find(s => s.name.includes('PADes'))?.value || 120000000;
  const ddValue = budget.revenue.sectors?.find(s => s.name.includes('Dana Desa'))?.value || 850000000;
  const otherValue = budget.revenue.sectors?.find(s => s.name.includes('Provinsi') || s.name.includes('Alokasi'))?.value || 420000000;

  return (
    <div className="p-6 space-y-6">
      
      {/* SECTION 1: FINANCE GLANCE COUNTERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total Pendapatan (Penduduk + DD)</span>
            <h3 className="text-xl font-black font-mono tracking-tight text-zinc-800 dark:text-zinc-100">
              Rp {budget.revenue.total.toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Capaian: <strong className="text-emerald-500">100% Target</strong></p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Realisasi Belanja Desa</span>
            <h3 className="text-xl font-black font-mono tracking-tight text-indigo-600 dark:text-indigo-400">
              Rp {budget.expenditure.total.toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Rasio Absorpsi: <strong className="text-indigo-500">{budget.absorptionRate}%</strong></p>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Sisa Saldo Kas Desa</span>
            <h3 className="text-xl font-black font-mono tracking-tight text-amber-500">
              Rp {(budget.revenue.total - budget.expenditure.total).toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Status Rekening: <strong className="text-amber-500">Surplus Aktif</strong></p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Persentase Serapan</span>
            <h3 className="text-xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              {budget.absorptionRate}%
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">SOP Audit: <strong className="text-emerald-500">Sehat / Hijau</strong></p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
            <Percent className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* SECTION 2: CHARTS */}
      <div className="grid grid-cols-12 gap-5">
        
        {/* Cumulative Flow graph */}
        <BentoCard
          title="Kumulatif Arus Kas Semester I"
          subtitle="Progres Realisasi Pendapatan vs Pengeluaran (Juta Rp)"
          className="col-span-12 lg:col-span-8 h-80"
        >
          <div className="w-full h-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="bulan" tick={{ fontSize: 10 }} stroke="#888888" />
                <YAxis tick={{ fontSize: 10 }} stroke="#888888" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Area type="monotone" dataKey="Pendapatan" stroke="#10B981" fillOpacity={0.1} fill="#10B981" />
                <Area type="monotone" dataKey="Pengeluaran" stroke="#3B82F6" fillOpacity={0.1} fill="#3B82F6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </BentoCard>

        {/* Ledger Category summary */}
        <BentoCard
          title="Audit Kepatuhan APBDes"
          subtitle="Verifikasi Transaksi Non-Tunai Bongas Kulon"
          className="col-span-12 lg:col-span-4 flex flex-col justify-between"
        >
          <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-400">
            <p className="leading-relaxed">
              Sesuai arahan Permendagri, seluruh administrasi dana desa disalurkan secara non-tunai terintegrasi langsung dengan Bank BJB.
            </p>

            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-wider text-[9px] font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Status Audit BPK 2026</span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 font-medium">
                Predikat: <strong className="text-emerald-500 font-black">Wajar Tanpa Pengecualian (WTP)</strong>
              </p>
              <span className="text-[10px] text-zinc-500 block">
                Sistem tertutup, mutasi terekam real-time di Google Sheets desa otomatis.
              </span>
            </div>
          </div>
        </BentoCard>

      </div>

      {/* SECTION 3: DETAILED TABLE */}
      <BentoCard
        title="Alokasi Pos Pembiayaan Detail"
        subtitle="Rincian Transparansi Penggunaan Anggaran Desa Bongas Kulon"
        className="w-full min-h-[300px]"
        headerAction={
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-750">
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span className="text-zinc-700 dark:text-zinc-200">Ekspor Excel</span>
          </div>
        }
      >
        <div className="overflow-x-auto border border-zinc-150 dark:border-zinc-800 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-400 font-bold uppercase border-b border-zinc-150 dark:border-zinc-800">
              <tr>
                <th className="p-3">Kode Rekening</th>
                <th className="p-3">Pos Anggaran / Bidang</th>
                <th className="p-3">Pagu Target (Rp)</th>
                <th className="p-3">Realisasi (Rp)</th>
                <th className="p-3">Persentase Selesai</th>
                <th className="p-3">Rekomendasi / Evaluasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium">
              <tr>
                <td className="p-3 font-mono">01.01</td>
                <td className="p-3 font-bold text-zinc-800 dark:text-zinc-100">Penyelenggaraan Pemerintahan Desa (Gaji & Siltap)</td>
                <td className="p-3 font-mono">Rp {padValue.toLocaleString('id-ID')}</td>
                <td className="p-3 font-mono">Rp {(padValue * 0.95).toLocaleString('id-ID')}</td>
                <td className="p-3 font-bold text-emerald-500">95%</td>
                <td className="p-3 text-zinc-500 text-[11px]">Siltap aparatur lancar disalurkan tiap bulan.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono">02.01</td>
                <td className="p-3 font-bold text-zinc-800 dark:text-zinc-100">Pelaksanaan Pembangunan Fisik (Infrastruktur)</td>
                <td className="p-3 font-mono">Rp {ddValue.toLocaleString('id-ID')}</td>
                <td className="p-3 font-mono">Rp {(ddValue * 0.88).toLocaleString('id-ID')}</td>
                <td className="p-3 font-bold text-indigo-500">88%</td>
                <td className="p-3 text-zinc-500 text-[11px]">Fokus aspal jalan di Dusun Krajan & Ngemplak.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono">03.01</td>
                <td className="p-3 font-bold text-zinc-800 dark:text-zinc-100">Pembinaan & Pemberdayaan Masyarakat (Bansos)</td>
                <td className="p-3 font-mono">Rp {otherValue.toLocaleString('id-ID')}</td>
                <td className="p-3 font-mono">Rp {(otherValue * 0.72).toLocaleString('id-ID')}</td>
                <td className="p-3 font-bold text-amber-500">72%</td>
                <td className="p-3 text-zinc-500 text-[11px]">Sisa BLT Triwulan III disiapkan September.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </BentoCard>

    </div>
  );
};
