/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint } from '../types';
import { useToast } from '../context/ToastContext';
import { BentoCard } from '../components/bento/BentoCard';
import { Megaphone, Search, AlertCircle, Plus, Camera, MapPin, Send } from 'lucide-react';

export const Complaints: React.FC = () => {
  const { complaints, addComplaint, updateComplaintStatus, currentRole } = useApp();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    reporterName: '',
    reporterPhone: '',
    category: 'Fasilitas Umum'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.reporterName) {
      toast('Nama, Judul, dan Keterangan aduan wajib diisi!', 'warning', 'Formulir Belum Lengkap');
      return;
    }

    const item: Complaint = {
      complaintId: `COM-${Date.now().toString().slice(-4)}`,
      title: form.title,
      description: form.description,
      reporterName: form.reporterName,
      category: form.category,
      status: 'Submitted',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      location: { lat: -7.712345, lng: 110.412345 }
    };

    addComplaint(item);
    setShowForm(false);
    setForm({
      title: '',
      description: '',
      reporterName: '',
      reporterPhone: '',
      category: 'Fasilitas Umum'
    });
    toast('Aduan berhasil dikirim ke Command Center. Tiket pengawasan diaktifkan!', 'success', 'Laporan Terkirim');
  };

  const handleUpdateStatus = (id: string, currentStatus: string) => {
    if (!['Secretary', 'Admin', 'Operator'].includes(currentRole)) {
      toast('Akses Ditolak: Hanya Sekretaris, Admin, atau Operator yang berhak memproses alur aduan warga.', 'error', 'Akses Ditolak');
      return;
    }
    const nextStatus = currentStatus === 'Submitted' ? 'In Progress' : 'Resolved';
    updateComplaintStatus(id, nextStatus as any);
    toast(`Status Tiket ${id} berhasil dirubah ke ${nextStatus.toUpperCase()}.`, 'success', 'Status Diperbarui');
  };

  const filteredComplaints = complaints.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.reporterName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      
      {/* SUMMARIES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total Tiket Masuk</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-zinc-800 dark:text-zinc-100">
              {complaints.length} Aduan
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Mekanisme Pengaduan Warga Terbuka</p>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
            <Megaphone className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Dalam Penanganan</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-amber-500">
              {complaints.filter(c => c.status === 'In Progress').length} Tiket
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Sedang Disurvei Aparatur Lapangan</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Diselesaikan (Resolved)</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-emerald-500">
              {complaints.filter(c => c.status === 'Resolved').length} Tiket
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Rasio Tanggapan: <strong className="text-emerald-500">Sangat Tinggi</strong></p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        
        {/* Complaints cards container */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-150 dark:border-zinc-800 gap-3 text-xs">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari laporan berdasarkan Kata Kunci atau Nama Pelapor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 py-1.5 pl-9 pr-3 rounded-lg outline-none focus:border-indigo-500 text-zinc-700 dark:text-zinc-200"
              />
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-1.5 rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Aduan Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredComplaints.length === 0 ? (
              <div className="col-span-12 py-12 text-center text-zinc-400 text-xs">
                Tidak ada laporan aduan dari warga.
              </div>
            ) : (
              filteredComplaints.map(ticket => (
                <div key={ticket.complaintId} className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex flex-col justify-between gap-4 shadow-sm relative">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-zinc-400 font-bold uppercase">{ticket.category}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase leading-none ${
                        ticket.status === 'Resolved' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : ticket.status === 'In Progress' 
                            ? 'bg-amber-500/10 text-amber-500 animate-pulse' 
                            : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-zinc-800 dark:text-zinc-100 leading-snug line-clamp-1">{ticket.title}</h4>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[11px] line-clamp-3">
                      "{ticket.description}"
                    </p>
                  </div>

                  <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 font-medium">
                      <span>Pelapor: <strong>{ticket.reporterName}</strong></span>
                      <span className="font-mono">{ticket.createdAt}</span>
                    </div>

                    <div className="flex gap-2 text-xs">
                      {ticket.status !== 'Resolved' && ['Secretary', 'Admin', 'Operator'].includes(currentRole) && (
                        <button
                          onClick={() => handleUpdateStatus(ticket.complaintId, ticket.status)}
                          className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[10px]"
                        >
                          {ticket.status === 'Submitted' ? 'Tandai Disurvei' : 'Tandai Selesai'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create complaint Form Panel */}
        <div className="col-span-12 lg:col-span-4">
          {showForm ? (
            <BentoCard
              title="Formulir Aduan Publik"
              subtitle="Pusat Pengaduan Bongas Kulon"
            >
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-zinc-700 dark:text-zinc-300">
                <div>
                  <label className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">Kategori Masalah</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-2 rounded-xl outline-none"
                  >
                    <option value="Fasilitas Umum">Fasilitas Umum / Rusak</option>
                    <option value="Bencana Alam">Bencana Alam / Cuaca Ekstrem</option>
                    <option value="Administrasi Layanan">Administrasi Layanan / Pungli</option>
                    <option value="Sosial & Keamanan">Sosial & Keamanan Masyarakat</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">Nama Lengkap Anda (Pelapor)</label>
                  <input
                    type="text"
                    value={form.reporterName}
                    onChange={(e) => setForm(prev => ({ ...prev, reporterName: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-2 rounded-xl outline-none"
                    placeholder="Masukkan nama pelapor..."
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">Nomor Kontak (WhatsApp API)</label>
                  <input
                    type="text"
                    value={form.reporterPhone}
                    onChange={(e) => setForm(prev => ({ ...prev, reporterPhone: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-2 rounded-xl outline-none"
                    placeholder="0812..."
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">Judul Aduan</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-2 rounded-xl outline-none"
                    placeholder="Misal: Jalan Berlubang Parah di RT 02"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">Deskripsi Detail Masalah</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-2 rounded-xl outline-none h-16 resize-none"
                    placeholder="Tuliskan kronologi dan rincian lokasi kerusakan..."
                  />
                </div>

                {/* photo & gps mockup */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-500">
                  <div className="p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 rounded-xl flex items-center gap-1.5 justify-center">
                    <Camera className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Upload Foto</span>
                  </div>
                  <div className="p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 rounded-xl flex items-center gap-1.5 justify-center">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Tag Lokasi GPS</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Laporan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-300 rounded-xl hover:bg-zinc-200 font-semibold"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </BentoCard>
          ) : (
            <BentoCard
              title="Informasi Penanganan Aduan"
              subtitle="SOP Penyelenggaraan"
              className="h-full flex flex-col justify-between"
            >
              <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-400">
                <p className="leading-relaxed">
                  Seluruh aduan yang dikirimkan warga otomatis masuk ke monitor pengawasan aparat di Command Center ini. Sesuai kesepakatan:
                </p>

                <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl space-y-1.5 font-medium text-[11px]">
                  <p className="text-zinc-700 dark:text-zinc-300">1. Respon survei lapangan maksimal <strong className="text-indigo-600 dark:text-indigo-400">1x24 jam</strong> sejak pengaduan terbit.</p>
                  <p className="text-zinc-700 dark:text-zinc-300">2. Penyelesaian perbaikan ringan dikoordinasikan maksimal <strong className="text-emerald-500">3 hari kerja</strong>.</p>
                </div>
              </div>
            </BentoCard>
          )}
        </div>

      </div>

    </div>
  );
};
