/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { BentoCard } from '../components/bento/BentoCard';
import { Package, ShieldCheck, QrCode, Search, FileSpreadsheet, Plus } from 'lucide-react';

export const Assets: React.FC = () => {
  const { assets, addAsset, currentRole } = useApp();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  // Stats
  const totalValue = assets.reduce((sum, a) => sum + a.value, 0);
  const goodConditionCount = assets.filter(a => a.condition === 'Good').length;

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      
      {/* GLANCE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total Aset Desa</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-zinc-800 dark:text-zinc-100">
              {assets.length} Item
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Sertifikasi Legal Desa Bongas Kulon</p>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Nilai Buku Aset</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-emerald-500">
              Rp {totalValue.toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Audit Terakhir: <strong className="text-emerald-500">Kemenkeu 2026</strong></p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Kondisi Layak Pakai</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-indigo-500">
              {goodConditionCount} / {assets.length} Item
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Rasio Kemanfaatan: <strong className="text-indigo-500">Sangat Sehat</strong></p>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        
        {/* Assets detailed table */}
        <BentoCard
          title="Buku Inventarisasi Kekayaan Desa"
          subtitle="Pelaporan Aset Bongas Kulon Terdaftar"
          className="col-span-12 lg:col-span-8 min-h-[400px]"
        >
          {/* Search bar */}
          <div className="flex flex-wrap items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-150 dark:border-zinc-800 text-xs mb-4">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Masukkan Kode Register Aset atau Nama Inventaris..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 py-1.5 pl-9 pr-3 rounded-lg outline-none focus:border-indigo-500 text-zinc-700 dark:text-zinc-200"
              />
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[300px] border border-zinc-150 dark:border-zinc-800 rounded-xl custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-400 font-bold uppercase border-b border-zinc-150 dark:border-zinc-800">
                <tr>
                  <th className="p-3">Kode Inventaris</th>
                  <th className="p-3">Nama Kekayaan Desa</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Nilai Buku (Rp)</th>
                  <th className="p-3">Kondisi</th>
                  <th className="p-3 text-center">QR Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-200">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-zinc-400">
                      Aset tidak terdaftar dalam buku inventarisasi.
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <tr key={asset.assetId} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-850/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-zinc-800 dark:text-zinc-100">{asset.code}</td>
                      <td className="p-3 font-semibold text-zinc-700 dark:text-zinc-200">{asset.name}</td>
                      <td className="p-3 text-zinc-500 font-medium">{asset.category}</td>
                      <td className="p-3 font-mono font-bold text-indigo-500">
                        Rp {asset.value.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase leading-none ${
                          asset.condition === 'Good' 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {asset.condition === 'Good' ? 'Sangat Layak' : 'Butuh Servis'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedAssetId(asset.assetId)}
                          className="p-1 text-zinc-500 hover:text-indigo-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                          title="Tampilkan QR Barcode Tracker"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </BentoCard>

        {/* QR Scan panel card */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          <BentoCard
            title="Sistem QR Asset Tracking"
            subtitle="Pindai Fisik Inventaris Lapangan"
            className="flex-1 flex flex-col justify-between"
          >
            <div className="space-y-4 text-xs text-zinc-700 dark:text-zinc-300">
              <p className="leading-relaxed">
                Setiap kendaraan operasional, peralatan kantor, dan gedung dipasangi label QR fisik. Memudahkan inventarisasi berkala.
              </p>

              {selectedAssetId ? (
                (() => {
                  const target = assets.find(a => a.assetId === selectedAssetId);
                  return target ? (
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 rounded-xl space-y-3 text-center flex flex-col items-center">
                      <div className="w-24 h-24 bg-white p-2 border border-zinc-200 rounded-lg flex items-center justify-center relative">
                        {/* simulated QR block */}
                        <div className="grid grid-cols-5 gap-0.5 w-20 h-20">
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} className={`w-3.5 h-3.5 ${Math.random() > 0.4 ? 'bg-black' : 'bg-white'}`} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-800 dark:text-zinc-200 leading-tight">{target.name}</h4>
                        <span className="font-mono text-[10px] text-zinc-400 mt-1 block">{target.code}</span>
                      </div>
                      <button
                        onClick={() => toast(`Format cetak label QR untuk ${target.code} terkirim ke printer Balai Desa.`, 'success', 'Cetak Label QR')}
                        className="py-1.5 px-4 bg-zinc-900 text-white rounded-lg text-[10px] font-bold"
                      >
                        Cetak Stiker QR
                      </button>
                    </div>
                  ) : null;
                })()
              ) : (
                <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 border-dashed rounded-xl text-center text-zinc-400 text-[11px]">
                  Silakan klik tombol QR di baris tabel untuk meninjau cetakan barcode aset.
                </div>
              )}
            </div>
          </BentoCard>
        </div>

      </div>

    </div>
  );
};
