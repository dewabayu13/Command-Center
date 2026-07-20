/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from '../types';

export const DUSUN_LIST = [
  { id: 'dusun_01', name: 'Blok Sabtu' },
  { id: 'dusun_02', name: 'Blok Selasa' },
  { id: 'dusun_03', name: 'Blok Rabu' },
  { id: 'dusun_04', name: 'Blok Karang Kencana' }
];

export const CCTV_LIST = [
  { id: 'cctv_01', name: 'Simpang Balai Desa Bongas Kulon', url: 'live_gate', status: 'Online' },
  { id: 'cctv_02', name: 'Pintu Masuk Blok Krajan / Sabtu', url: 'live_krajan', status: 'Online' },
  { id: 'cctv_03', name: 'Pos Ronda Blok Selasa', url: 'live_ngemplak', status: 'Online' },
  { id: 'cctv_04', name: 'Area PAUD Blok Kencana', url: 'live_paud', status: 'Offline' }
];

export const SYSTEM_ROLES = [
  { role: UserRole.ADMIN, label: 'Super Admin (Administrator)', color: 'border-purple-500/30 text-purple-500 bg-purple-500/5' },
  { role: UserRole.VILLAGE_HEAD, label: 'Kepala Desa (Village Head)', color: 'border-rose-500/30 text-rose-500 bg-rose-500/5' },
  { role: UserRole.SECRETARY, label: 'Sekretaris Desa (Secretary)', color: 'border-indigo-500/30 text-indigo-500 bg-indigo-500/5' },
  { role: UserRole.TREASURER, label: 'Kaur Keuangan (Treasurer)', color: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' },
  { role: UserRole.KASI_PEMERINTAHAN, label: 'Kasi Pemerintahan', color: 'border-teal-500/30 text-teal-500 bg-teal-500/5' },
  { role: UserRole.KASI_PELAYANAN, label: 'Kasi Pelayanan', color: 'border-cyan-500/30 text-cyan-500 bg-cyan-500/5' },
  { role: UserRole.KASI_KESEJAHTERAAN, label: 'Kasi Kesejahteraan', color: 'border-lime-500/30 text-lime-500 bg-lime-500/5' },
  { role: UserRole.HAMLET_HEAD, label: 'Kadus (Hamlet Head)', color: 'border-amber-500/30 text-amber-500 bg-amber-500/5' },
  { role: UserRole.OPERATOR, label: 'Operator Command Center', color: 'border-sky-500/30 text-sky-500 bg-sky-500/5' },
  { role: UserRole.TAX_COLLECTOR, label: 'Kolektor PBB (Tax Collector)', color: 'border-orange-500/30 text-orange-500 bg-orange-500/5' },
  { role: UserRole.PUBLIC_USER, label: 'Public (Masyarakat)', color: 'border-zinc-500/30 text-zinc-500 bg-zinc-500/5' }
];

export const LETTER_CATEGORIES = [
  'Surat Keterangan Usaha (SKU)',
  'Surat Keterangan Tidak Mampu (SKTM)',
  'Surat Keterangan Domisili',
  'Surat Keterangan Kelahiran',
  'Surat Keterangan Kematian',
  'Surat Pengantar Kepolisian'
];

export const COMPLAINT_CATEGORIES = [
  'Fasilitas Umum',
  'Bencana Alam',
  'Administrasi Layanan',
  'Sosial & Keamanan'
];

export const ASSET_TYPES = [
  { value: 'Land', label: 'Tanah Bengkok/Desa' },
  { value: 'Building', label: 'Bangunan/Fasilitas' },
  { value: 'Vehicle', label: 'Kendaraan Siaga/Dinas' },
  { value: 'Equipment', label: 'Peralatan Balai Desa' },
  { value: 'Inventory', label: 'Inventaris Operasional' }
];

export const REFRESH_TRIGGERS = {
  MANUAL: 'manual',
  AUTO: 'auto'
};
