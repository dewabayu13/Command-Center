/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Citizen } from '../types';
import { BentoCard } from '../components/bento/BentoCard';
import { Search, UserPlus, Heart, Award, Filter, ShieldCheck } from 'lucide-react';

export const Population: React.FC = () => {
  const { citizens, addCitizen, currentRole } = useApp();
  const { toast } = useToast();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [dusunFilter, setDusunFilter] = useState('all');
  const [povertyFilter, setPovertyFilter] = useState('all');

  // New Citizen Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<Omit<Citizen, 'location' | 'status'>>({
    nik: '',
    noKK: '',
    fullName: '',
    gender: 'Male',
    birthPlace: 'Sleman',
    birthDate: '1995-01-01',
    address: '',
    dusunId: 'dusun_01',
    education: 'SMA',
    occupation: 'Wiraswasta',
    poorStatus: false,
    aidRecipients: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setForm(prev => {
      const current = [...prev.aidRecipients];
      if (checked) {
        current.push(value);
      } else {
        const index = current.indexOf(value);
        if (index > -1) current.splice(index, 1);
      }
      return { ...prev, aidRecipients: current };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nik || !form.fullName || !form.noKK) {
      toast('NIK, KK, dan Nama Lengkap wajib diisi!', 'warning', 'Validasi Gagal');
      return;
    }
    const citizen: Citizen = {
      ...form,
      location: { 
        lat: -7.712345 + (Math.random() - 0.5) * 0.01, 
        lng: 110.412345 + (Math.random() - 0.5) * 0.01 
      },
      status: 'Alive'
    };
    addCitizen(citizen);
    setShowAddForm(false);
    // Reset form
    setForm({
      nik: '',
      noKK: '',
      fullName: '',
      gender: 'Male',
      birthPlace: 'Sleman',
      birthDate: '1995-01-01',
      address: '',
      dusunId: 'dusun_01',
      education: 'SMA',
      occupation: 'Wiraswasta',
      poorStatus: false,
      aidRecipients: []
    });
  };

  // Filter logic
  const filteredCitizens = citizens.filter(c => {
    const matchesSearch = c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.nik.includes(searchTerm) || 
                          c.occupation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDusun = dusunFilter === 'all' || c.dusunId === dusunFilter;
    const matchesPoverty = povertyFilter === 'all' || 
                            (povertyFilter === 'poor' && c.poorStatus) || 
                            (povertyFilter === 'non-poor' && !c.poorStatus);
    return matchesSearch && matchesDusun && matchesPoverty;
  });

  // Aggregates
  const totalCitizens = citizens.length;
  const poorCount = citizens.filter(c => c.poorStatus).length;
  const activeAidCount = citizens.filter(c => c.aidRecipients.length > 0).length;

  return (
    <div className="p-6 space-y-6">
      
      {/* SECTION 1: METRIC AGGREGATIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-indigo-600 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider opacity-80">Populasi Terdaftar</span>
            <h3 className="text-2xl font-black font-mono tracking-tight">{totalCitizens} Jiwa</h3>
            <p className="text-[10px] opacity-90 mt-1">Sensus Terintegrasi Bongas Kulon</p>
          </div>
          <div className="p-3 bg-white/15 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Keluarga Prasejahtera</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-rose-500">{poorCount} KK</h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Prioritas Bantuan Sosial (DTKS)</p>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
            <Heart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Penerima Manfaat</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-emerald-500">{activeAidCount} Jiwa</h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Bantuan BLT, PKH, & BPNT</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SECTION 2: SEARCH & TABLE CONTAINER */}
      <div className="grid grid-cols-12 gap-5">
        
        {/* Table List of Citizens */}
        <BentoCard
          title="Master Database Kependudukan"
          subtitle="Daftar Warga Bongas Kulon Terdaftar"
          className="col-span-12 lg:col-span-8 flex flex-col min-h-[420px]"
          headerAction={
            <div className="flex items-center gap-3">
              {['Secretary', 'Admin', 'Operator'].includes(currentRole) && (
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar Warga Baru</span>
                </button>
              )}
            </div>
          }
        >
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-150 dark:border-zinc-800 text-xs mb-4">
            <div className="flex-1 min-w-[180px] relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari warga berdasarkan Nama atau NIK..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 py-1.5 pl-9 pr-3 rounded-lg outline-none focus:border-indigo-500 text-zinc-700 dark:text-zinc-200"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-zinc-400" />
              <select
                value={dusunFilter}
                onChange={(e) => setDusunFilter(e.target.value)}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 outline-none"
              >
                <option value="all">Semua Dusun</option>
                <option value="dusun_01">Blok Sabtu</option>
                <option value="dusun_02">Blok Selasa</option>
                <option value="dusun_03">Blok Rabu</option>
                <option value="dusun_04">Blok Karang Kencana</option>
              </select>
            </div>

            <div>
              <select
                value={povertyFilter}
                onChange={(e) => setPovertyFilter(e.target.value)}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 outline-none"
              >
                <option value="all">Semua Status Ekonomi</option>
                <option value="poor">Keluarga Prasejahtera</option>
                <option value="non-poor">Keluarga Mampu</option>
              </select>
            </div>
          </div>

          {/* Citizen Table List */}
          <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[300px] border border-zinc-150 dark:border-zinc-800 rounded-xl custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-400 font-bold uppercase border-b border-zinc-150 dark:border-zinc-800">
                <tr>
                  <th className="p-3">Nama Lengkap / NIK</th>
                  <th className="p-3">Gender / Umur</th>
                  <th className="p-3">Dusun</th>
                  <th className="p-3">Pekerjaan</th>
                  <th className="p-3">Bantuan</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-200">
                {filteredCitizens.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-zinc-400">
                      Warga tidak ditemukan atau filter tidak sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredCitizens.map((item) => (
                    <tr key={item.nik} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-850/50 transition-colors">
                      <td className="p-3">
                        <p className="font-bold text-zinc-800 dark:text-zinc-100">{item.fullName}</p>
                        <span className="font-mono text-[10px] text-zinc-400">{item.nik}</span>
                      </td>
                      <td className="p-3">
                        <p className="font-medium">{item.gender === 'Male' ? 'L' : 'P'}</p>
                        <span className="text-[10px] text-zinc-500">{item.birthDate}</span>
                      </td>
                      <td className="p-3 font-medium">
                        {item.dusunId === 'dusun_01' ? 'Blok Sabtu' : item.dusunId === 'dusun_02' ? 'Blok Selasa' : item.dusunId === 'dusun_03' ? 'Blok Rabu' : 'Blok Karang Kencana'}
                      </td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-300 font-medium">
                        {item.occupation}
                      </td>
                      <td className="p-3">
                        {item.aidRecipients.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {item.aidRecipients.map(aid => (
                              <span key={aid} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-bold">
                                {aid}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-400 italic">Mandiri</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.poorStatus ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {item.poorStatus ? 'Prasejahtera' : 'Mampu'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </BentoCard>

        {/* Form panel to add citizen */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          {showAddForm ? (
            <BentoCard
              title="Registrasi Kependudukan"
              subtitle="Pendaftaran NIK & KK Baru"
              className="flex-1"
            >
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-zinc-700 dark:text-zinc-300">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">Nomor NIK (16 digit)</label>
                    <input
                      type="text"
                      name="nik"
                      value={form.nik}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-2 rounded-lg outline-none"
                      placeholder="3404..."
                      maxLength={16}
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">Nomor KK (16 digit)</label>
                    <input
                      type="text"
                      name="noKK"
                      value={form.noKK}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-2 rounded-lg outline-none"
                      placeholder="3404..."
                      maxLength={16}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">Nama Lengkap Sesuai KTP</label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-2 rounded-lg outline-none"
                    placeholder="Masukkan nama lengkap..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-2 rounded-lg outline-none"
                    >
                      <option value="Male">Laki-laki</option>
                      <option value="Female">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">Dusun Tinggal</label>
                    <select
                      name="dusunId"
                      value={form.dusunId}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-2 rounded-lg outline-none"
                    >
                      <option value="dusun_01">Blok Sabtu</option>
                      <option value="dusun_02">Blok Selasa</option>
                      <option value="dusun_03">Blok Rabu</option>
                      <option value="dusun_04">Blok Karang Kencana</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">Pendidikan</label>
                    <input
                      type="text"
                      name="education"
                      value={form.education}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-2 rounded-lg outline-none"
                      placeholder="SMA / S1..."
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">Pekerjaan</label>
                    <input
                      type="text"
                      name="occupation"
                      value={form.occupation}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-2 rounded-lg outline-none"
                      placeholder="Tani / Karyawan..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">Alamat Domisili Detail</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-2 rounded-lg outline-none"
                    placeholder="RT/RW, Dusun..."
                  />
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id="poorStatus"
                      name="poorStatus"
                      checked={form.poorStatus}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-indigo-600 border-zinc-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="poorStatus" className="font-bold text-zinc-800 dark:text-zinc-200">
                      Terdaftar sebagai Keluarga Prasejahtera
                    </label>
                  </div>

                  <div className="space-y-1.5 pl-6">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">Bantuan Sosial Aktif (DTKS)</span>
                    <div className="flex flex-wrap gap-3">
                      {['BLT DD', 'PKH', 'BPNT'].map(aid => (
                        <div key={aid} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            id={`aid_${aid}`}
                            value={aid}
                            checked={form.aidRecipients.includes(aid)}
                            onChange={handleAidChange}
                            disabled={!form.poorStatus}
                            className="w-3.5 h-3.5"
                          />
                          <label htmlFor={`aid_${aid}`} className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
                            {aid}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl active:scale-95 transition-all shadow-md shadow-indigo-600/10"
                  >
                    Daftarkan Warga
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-300 rounded-xl hover:bg-zinc-200 font-semibold"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </BentoCard>
          ) : (
            <BentoCard
              title="Statistik Sektor"
              subtitle="Pendidikan & Tenaga Kerja"
              className="flex-1"
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-mono">Pendidikan Terbanyak</h4>
                  <div className="space-y-2 text-xs">
                    {[
                      { name: 'Sarjana (S1)', value: '35%', bar: 'w-[35%]' },
                      { name: 'Diploma (D3)', value: '15%', bar: 'w-[15%]' },
                      { name: 'Menengah Atas (SMA)', value: '40%', bar: 'w-[40%]' },
                      { name: 'Sekolah Dasar (SD)', value: '10%', bar: 'w-[10%]' }
                    ].map(edu => (
                      <div key={edu.name} className="space-y-1">
                        <div className="flex justify-between font-medium">
                          <span>{edu.name}</span>
                          <span className="font-mono text-indigo-500">{edu.value}</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className={`h-full bg-indigo-500 ${edu.bar}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-mono">Mata Pencaharian Utama</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Tani & Kebun', 'Wiraswasta Mandiri', 'Karyawan Swasta', 'PNS Kedinasan', 'Nelayan Air Tawar'].map(job => (
                      <span key={job} className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-850 rounded-lg text-[10px] font-semibold text-zinc-600 dark:text-zinc-300">
                        {job}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </BentoCard>
          )}
        </div>

      </div>

    </div>
  );
};
