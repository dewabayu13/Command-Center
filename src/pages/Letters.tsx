/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Letter } from '../types';
import { BentoCard } from '../components/bento/BentoCard';
import { FileText, Send, CheckCircle, Clock, Eye, ShieldCheck, Printer, FileDown } from 'lucide-react';

export const Letters: React.FC = () => {
  const { letters, addLetter, updateLetterStatus, currentRole } = useApp();
  const { toast } = useToast();

  const [showDraftForm, setShowDraftForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  
  // Selected letter for Print Preview
  const [viewingLetter, setViewingLetter] = useState<Letter | null>(null);

  // New Draft Form State
  const [form, setForm] = useState({
    title: 'Surat Keterangan Usaha (SKU)',
    applicantNIK: '',
    applicantName: '',
    type: 'Incoming' as 'Incoming' | 'Outgoing'
  });

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.applicantName || !form.applicantNIK) {
      toast('Nama pemohon dan NIK wajib diisi!', 'warning', 'Formulir Belum Lengkap');
      return;
    }
    const newLetter: Letter = {
      letterId: `LET-${Date.now().toString().slice(-4)}`,
      letterNo: `140/${Math.floor(Math.random() * 900) + 100}/SRM/VII/2026`,
      title: form.title,
      applicantNIK: form.applicantNIK,
      applicantName: form.applicantName,
      type: form.type,
      status: 'Pending',
      requestedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    addLetter(newLetter);
    setShowDraftForm(false);
    setForm({
      title: 'Surat Keterangan Usaha (SKU)',
      applicantNIK: '',
      applicantName: '',
      type: 'Incoming'
    });
    toast('Draf surat berhasil dibuat dalam antrean Pending!', 'success', 'Draf Berhasil');
  };

  const handleVerify = (id: string) => {
    updateLetterStatus(id, 'Verified');
    toast('Surat berhasil diverifikasi oleh Operator. Menunggu persetujuan tanda tangan Kepala Desa.', 'success', 'Diverifikasi');
  };

  const handleSign = (id: string) => {
    const code = `VER-${Math.floor(Math.random() * 9000) + 1000}-SRM`;
    updateLetterStatus(id, 'Completed', currentRole, code);
    toast(`Surat berhasil disetujui & ditandatangani secara digital oleh ${currentRole}! Kode QR terlampir.`, 'success', 'Tanda Tangan Digital');
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredLetters = letters.filter(l => {
    if (activeTab === 'pending') return l.status !== 'Completed';
    if (activeTab === 'completed') return l.status === 'Completed';
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      
      {/* FLOW METRIC HEADERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Antrean Masuk</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-zinc-800 dark:text-zinc-100">
              {letters.filter(l => l.status === 'Pending').length} Surat
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Selesai Diverifikasi Operator</p>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Siap Tanda Tangan</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-amber-500">
              {letters.filter(l => l.status === 'Verified').length} Surat
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Menunggu Acc Kades / Sekdes</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Selesai (Digital Signed)</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-emerald-500">
              {letters.filter(l => l.status === 'Completed').length} Surat
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Telah Diterbitkan dengan Kode QR</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        
        {/* Antrean Surat Table */}
        <BentoCard
          title="Sistem Alur Kerja Surat Digital"
          subtitle="Manajemen Dokumen & Persetujuan Mandiri"
          className="col-span-12 lg:col-span-8 min-h-[400px]"
          headerAction={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDraftForm(!showDraftForm)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Buat Draf Surat</span>
              </button>
            </div>
          }
        >
          {/* Tabs Filter */}
          <div className="flex gap-2 text-xs border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
            {(['all', 'pending', 'completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg font-bold uppercase transition-all ${
                  activeTab === tab 
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400' 
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                {tab === 'all' ? 'Semua Dokumen' : tab === 'pending' ? 'Butuh Tindakan' : 'Selesai Terbit'}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[300px] border border-zinc-150 dark:border-zinc-800 rounded-xl custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-400 font-bold uppercase border-b border-zinc-150 dark:border-zinc-800">
                <tr>
                  <th className="p-3">ID / No. Surat</th>
                  <th className="p-3">Judul Dokumen</th>
                  <th className="p-3">Pemohon / NIK</th>
                  <th className="p-3">Tanggal Pengajuan</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Tindakan Alur Kerja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-200">
                {filteredLetters.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-zinc-400">
                      Tidak ada antrean dokumen surat di kategori ini.
                    </td>
                  </tr>
                ) : (
                  filteredLetters.map((letter) => (
                    <tr key={letter.letterId} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-850/50 transition-colors">
                      <td className="p-3">
                        <p className="font-bold text-zinc-800 dark:text-zinc-100">{letter.letterId}</p>
                        <span className="font-mono text-[10px] text-zinc-400">{letter.letterNo}</span>
                      </td>
                      <td className="p-3 font-semibold text-zinc-700 dark:text-zinc-200">{letter.title}</td>
                      <td className="p-3">
                        <p className="font-bold">{letter.applicantName}</p>
                        <span className="font-mono text-[10px] text-zinc-400">{letter.applicantNIK}</span>
                      </td>
                      <td className="p-3 font-medium text-zinc-500">{letter.requestedAt}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          letter.status === 'Completed' 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : letter.status === 'Verified' 
                              ? 'bg-amber-500/10 text-amber-500' 
                              : 'bg-indigo-500/10 text-indigo-500'
                        }`}>
                          {letter.status === 'Completed' ? 'Selesai Sign' : letter.status === 'Verified' ? 'Terverifikasi' : 'Draf Pending'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Operators & Admins can verify draft */}
                          {letter.status === 'Pending' && ['Secretary', 'Admin', 'Operator'].includes(currentRole) && (
                            <button
                              onClick={() => handleVerify(letter.letterId)}
                              className="px-2 py-1 bg-amber-500 text-white font-bold text-[10px] rounded-lg shadow-sm hover:shadow"
                            >
                              Verifikasi
                            </button>
                          )}

                          {/* Kades & Sekdes can approve & sign */}
                          {letter.status === 'Verified' && ['Village Head', 'Secretary'].includes(currentRole) && (
                            <button
                              onClick={() => handleSign(letter.letterId)}
                              className="px-2 py-1 bg-indigo-600 text-white font-bold text-[10px] rounded-lg shadow-sm hover:shadow"
                            >
                              Digital Sign
                            </button>
                          )}

                          <button
                            onClick={() => setViewingLetter(letter)}
                            className="p-1.5 text-zinc-500 hover:text-indigo-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                            title="Pratinjau Cetak Surat Resmi"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </BentoCard>

        {/* Form Draft Baru / Pratinjau Surat Resmi */}
        <div className="col-span-12 lg:col-span-4">
          {showDraftForm ? (
            <BentoCard
              title="Formulir Surat Baru"
              subtitle="Penyusunan Draf Administrasi"
              className="h-full"
            >
              <form onSubmit={handleCreateDraft} className="space-y-4 text-xs text-zinc-700 dark:text-zinc-300">
                <div>
                  <label className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">Jenis Dokumen Surat</label>
                  <select
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-2 rounded-xl outline-none"
                  >
                    <option value="Surat Keterangan Usaha (SKU)">Surat Keterangan Usaha (SKU)</option>
                    <option value="Surat Keterangan Tidak Mampu (SKTM)">Surat Keterangan Tidak Mampu (SKTM)</option>
                    <option value="Surat Keterangan Domisili">Surat Keterangan Domisili</option>
                    <option value="Surat Pengantar KTP / KK Baru">Surat Pengantar KTP / KK Baru</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">Nama Pemohon (Warga Desa)</label>
                  <input
                    type="text"
                    value={form.applicantName}
                    onChange={(e) => setForm(prev => ({ ...prev, applicantName: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-2 rounded-xl outline-none"
                    placeholder="Masukkan nama warga..."
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">NIK Pemohon (16 Digit)</label>
                  <input
                    type="text"
                    value={form.applicantNIK}
                    onChange={(e) => setForm(prev => ({ ...prev, applicantNIK: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-2 rounded-xl outline-none"
                    placeholder="3404..."
                    maxLength={16}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Pengajuan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDraftForm(false)}
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-300 rounded-xl hover:bg-zinc-200 font-semibold"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </BentoCard>
          ) : viewingLetter ? (
            <BentoCard
              title="Arsip & Pratinjau Surat Resmi"
              subtitle="Cetak Salinan Dokumen Berstempel QR"
              className="h-full flex flex-col justify-between"
              headerAction={
                <button
                  onClick={() => setViewingLetter(null)}
                  className="text-xs text-rose-500 font-bold hover:underline"
                >
                  Tutup
                </button>
              }
            >
              {/* Official Letterhead Mockup inside card */}
              <div className="bg-white text-zinc-900 p-4 border border-zinc-200 rounded-xl space-y-3 font-serif leading-tight shadow-sm text-[11px] h-[240px] overflow-y-auto custom-scrollbar select-none">
                <div className="text-center border-b-2 border-black pb-1.5">
                  <h4 className="font-bold text-[12px] uppercase">Pemerintah Kabupaten Majalengka</h4>
                  <h5 className="font-bold text-[11px] uppercase">Kecamatan Sumberjaya • Desa Bongas Kulon</h5>
                  <p className="text-[8px] italic font-sans">Jl. Ki Jaga Jaga, Bongas Kulon, Sumberjaya, Majalengka 45455</p>
                </div>

                <div className="text-center space-y-0.5">
                  <h5 className="font-bold underline uppercase">{viewingLetter.title}</h5>
                  <p className="font-mono text-[9px] text-zinc-500">Nomor: {viewingLetter.letterNo}</p>
                </div>

                <div className="space-y-1.5 font-sans">
                  <p className="text-zinc-600">Yang bertanda tangan di bawah ini menerangkan bahwa:</p>
                  <table className="w-full text-[10px] pl-2 font-medium">
                    <tbody>
                      <tr>
                        <td className="w-24 text-zinc-500">Nama Lengkap</td>
                        <td>: <strong>{viewingLetter.applicantName}</strong></td>
                      </tr>
                      <tr>
                        <td className="text-zinc-500">No. NIK</td>
                        <td className="font-mono">: {viewingLetter.applicantNIK}</td>
                      </tr>
                      <tr>
                        <td className="text-zinc-500">Status Layanan</td>
                        <td>: {viewingLetter.status === 'Completed' ? 'DISETUJUI (TERBIT)' : 'DRAF / PROSES VERIFIKASI'}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-zinc-600 leading-snug">Demikian surat keterangan ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagaimana mestinya.</p>
                </div>

                {/* Digital Signature box with simulated QR */}
                <div className="flex justify-end pt-2 font-sans">
                  <div className="text-center w-36 space-y-1.5">
                    <p className="text-[9px] text-zinc-500">Bongas Kulon, {viewingLetter.requestedAt.split(' ')[0]}</p>
                    <p className="font-bold text-[10px]">Kepala Desa Bongas Kulon</p>
                    {viewingLetter.status === 'Completed' ? (
                      <div className="mx-auto w-12 h-12 bg-zinc-100 border border-zinc-300 p-1 rounded flex items-center justify-center relative group">
                        {/* simulated QR barcode block */}
                        <div className="grid grid-cols-4 gap-0.5 w-10 h-10 opacity-80">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className={`w-2.5 h-2.5 ${Math.random() > 0.45 ? 'bg-black' : 'bg-white'}`} />
                          ))}
                        </div>
                        <span className="absolute -top-3 text-[7px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-300 px-1 rounded scale-90 uppercase">Signed</span>
                      </div>
                    ) : (
                      <div className="h-10 border-2 border-dashed border-zinc-200 rounded flex items-center justify-center text-[9px] text-zinc-400 font-mono">
                        Belum Ditandatangani
                      </div>
                    )}
                    <p className="font-bold underline text-[9px]">{viewingLetter.signedBy || 'Ir. H. Suparman'}</p>
                  </div>
                </div>
              </div>

              {/* Action triggers */}
              <div className="flex gap-2 text-xs">
                <button
                  onClick={handlePrint}
                  disabled={viewingLetter.status !== 'Completed'}
                  className="flex-1 py-1.5 px-3 bg-zinc-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 disabled:opacity-40"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak PDF</span>
                </button>
              </div>
            </BentoCard>
          ) : (
            <BentoCard
              title="Informasi Alur Pelayanan"
              subtitle="Standar Waktu Penyelesaian"
              className="h-full flex flex-col justify-between"
            >
              <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-400">
                <p className="leading-relaxed">
                  Sistem Surat Digital EasyDes mempercepat proses verifikasi data NIK langsung dari database utama kependudukan desa.
                </p>

                <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl space-y-2">
                  <h4 className="font-bold text-indigo-500 font-mono uppercase text-[9px]">SOP & Target Waktu</h4>
                  <ul className="space-y-1.5 text-[11px] font-medium">
                    <li className="flex justify-between">
                      <span>Draf Masuk (Operator)</span>
                      <span className="font-bold text-zinc-800 dark:text-white">Max 15 Menit</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Verifikasi (Sekretaris)</span>
                      <span className="font-bold text-zinc-800 dark:text-white">Max 30 Menit</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Tanda Tangan (Kades)</span>
                      <span className="font-bold text-zinc-800 dark:text-white">Instan via QR</span>
                    </li>
                  </ul>
                </div>
              </div>
            </BentoCard>
          )}
        </div>

      </div>

    </div>
  );
};
