/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { BentoCard } from '../components/bento/BentoCard';
import { Search, Map, CheckCircle2, AlertCircle, Award, Compass, DollarSign } from 'lucide-react';

export const TaxMonitor: React.FC = () => {
  const { taxpayers, updateTaxStatus, currentRole } = useApp();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Paid' | 'Unpaid'>('all');

  // Calculations
  const totalBill = taxpayers.reduce((sum, t) => sum + t.amount, 0);
  const paidBill = taxpayers.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);
  const achievementRate = Math.round((paidBill / (totalBill || 1)) * 100);

  const filteredTaxpayers = taxpayers.filter(t => {
    const matchesSearch = t.taxpayerName.toLowerCase().includes(searchTerm.toLowerCase()) || t.nop.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const togglePayment = (nop: string, currentStatus: 'Paid' | 'Unpaid') => {
    if (!['Treasurer', 'Tax Collector', 'Admin'].includes(currentRole)) {
      toast('Akses Ditolak: Hanya Bendahara, Kolektor Pajak, atau Admin yang dapat memproses transaksi pembayaran PBB.', 'error', 'Akses Ditolak');
      return;
    }
    const nextStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
    updateTaxStatus(nop, nextStatus);
    toast(`Status pembayaran PBB dengan NOP ${nop} berhasil dirubah menjadi ${nextStatus === 'Paid' ? 'LUNAS' : 'BELUM LUNAS'}.`, 'success', 'Pajak Diperbarui');
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* SUMMARIES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Target PBB Bongas Kulon</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-zinc-800 dark:text-zinc-100">
              Rp {totalBill.toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Total Wajib Pajak: <strong className="text-zinc-700 dark:text-zinc-300">{taxpayers.length} Objek</strong></p>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Realisasi Capaian</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-emerald-500">
              Rp {paidBill.toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Capaian: <strong className="text-emerald-500">{achievementRate}% lunas</strong></p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Sisa Tunggakan</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-rose-500">
              Rp {(totalBill - paidBill).toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Belum Terbayar: <strong className="text-rose-500">{taxpayers.filter(t => t.status === 'Unpaid').length} Objek</strong></p>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        
        {/* Taxpayers list table */}
        <BentoCard
          title="Daftar Pembayaran Pajak Bumi & Bangunan"
          subtitle="Pencarian Berdasarkan NOP / Nama Wajib Pajak"
          className="col-span-12 lg:col-span-8 min-h-[400px]"
        >
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-150 dark:border-zinc-800 text-xs mb-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Masukkan Nomor NOP (34.04...) atau Nama Wajib Pajak..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 py-1.5 pl-9 pr-3 rounded-lg outline-none focus:border-indigo-500 text-zinc-700 dark:text-zinc-200"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 outline-none"
              >
                <option value="all">Semua Status Bayar</option>
                <option value="Paid">Lunas</option>
                <option value="Unpaid">Belum Bayar</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[300px] border border-zinc-150 dark:border-zinc-800 rounded-xl custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-400 font-bold uppercase border-b border-zinc-150 dark:border-zinc-800">
                <tr>
                  <th className="p-3">Nomor Objek Pajak (NOP)</th>
                  <th className="p-3">Wajib Pajak</th>
                  <th className="p-3">Dusun</th>
                  <th className="p-3">Ketetapan Pokok</th>
                  <th className="p-3">Tanggal Bayar</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-200">
                {filteredTaxpayers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-400">
                      Wajib Pajak tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredTaxpayers.map((wp) => (
                    <tr key={wp.nop} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-850/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-zinc-800 dark:text-zinc-100">{wp.nop}</td>
                      <td className="p-3 font-semibold text-zinc-700 dark:text-zinc-200">{wp.taxpayerName}</td>
                      <td className="p-3 font-medium">
                        {wp.dusunId === 'dusun_01' ? 'Blok Sabtu' : wp.dusunId === 'dusun_02' ? 'Blok Selasa' : wp.dusunId === 'dusun_03' ? 'Blok Rabu' : 'Blok Karang Kencana'}
                      </td>
                      <td className="p-3 font-mono font-bold text-indigo-500">
                        Rp {wp.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 text-zinc-400 font-mono text-[10px]">{wp.paidAt || '-'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase leading-none ${
                          wp.status === 'Paid' 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {wp.status === 'Paid' ? 'LUNAS' : 'BELUM BAYAR'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => togglePayment(wp.nop, wp.status)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-colors ${
                            wp.status === 'Paid'
                              ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white'
                              : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                          }`}
                        >
                          {wp.status === 'Paid' ? 'Batal Lunas' : 'Bayar'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </BentoCard>

        {/* Best Collector Dusun & Route info */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          <BentoCard
            title="Ranking Target Dusun"
            subtitle="Kinerja Penagihan PBB Tercepat"
            className="flex-1"
          >
            <div className="space-y-3">
              {[
                { name: 'Blok Sabtu', rate: '85%', color: 'bg-emerald-500', money: 'Rp 665.000' },
                { name: 'Blok Rabu', rate: '72%', color: 'bg-emerald-400', money: 'Rp 540.000' },
                { name: 'Blok Selasa', rate: '45%', color: 'bg-amber-500', money: 'Rp 280.000' },
                { name: 'Blok Karang Kencana', rate: '35%', color: 'bg-rose-500', money: 'Rp 85.000' }
              ].map((item, index) => (
                <div key={item.name} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="flex items-center gap-1.5">
                      <Award className={`w-4 h-4 ${index === 0 ? 'text-amber-500 animate-pulse' : 'text-zinc-400'}`} />
                      {item.name}
                    </span>
                    <span className="font-mono text-zinc-500">
                      {item.money} <strong className="text-zinc-800 dark:text-zinc-200">({item.rate})</strong>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: item.rate }} />
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard
            title="Navigasi Rute Kolektor"
            subtitle="Pelacakan Lapangan Terbimbing GPS"
            className="flex-1"
          >
            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
              <p>
                Rute kolektor pajak dituntun cerdas untuk memprioritaskan wajib pajak bernilai ketetapan besar dengan akses rute terdekat.
              </p>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 rounded-xl space-y-2 flex items-start gap-2">
                <Compass className="w-5 h-5 text-indigo-500 flex-shrink-0 animate-spin-slow" />
                <div>
                  <h4 className="font-bold text-zinc-800 dark:text-white">Rute Aktif Hari Ini</h4>
                  <p className="text-[11px] text-zinc-500">Dusun Krajan Utara → RT 02 (Slamet Rahardjo) → RT 03 (Dewi Lestari).</p>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>

      </div>

    </div>
  );
};
