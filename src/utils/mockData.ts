/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Citizen, 
  Employee, 
  Attendance, 
  Letter, 
  Taxpayer, 
  VillageProject, 
  Complaint, 
  VillageAsset, 
  VillageNotification,
  WeatherData,
  APBDesBudget,
  UserRole
} from '../types';

// Coordinates centered around Balai Desa Bongas Kulon, Sumberjaya, Majalengka, Jawa Barat
export const VILLAGE_CENTER = { lat: -6.703128, lng: 108.321618 };

export const mockDusun = [
  { id: 'dusun_01', name: 'Blok Sabtu' },
  { id: 'dusun_02', name: 'Blok Selasa' },
  { id: 'dusun_03', name: 'Blok Rabu' },
  { id: 'dusun_04', name: 'Blok Karang Kencana' }
];

export const mockCitizens: Citizen[] = [
  {
    nik: '3210175105890121',
    noKK: '3210170712180004',
    fullName: 'Mei Saemurni',
    gender: 'Female',
    birthPlace: 'Majalengka',
    birthDate: '1989-05-11',
    address: 'RT 01 RW 01 Blok Sabtu',
    dusunId: 'dusun_01',
    education: 'Tamat SLTP/sederajat',
    occupation: 'Ibu Rumah Tangga',
    poorStatus: true,
    aidRecipients: ['BLT DD', 'PKH'],
    location: { lat: -6.702810, lng: 108.320950 },
    status: 'Alive'
  },
  {
    nik: '3210176906450001',
    noKK: '3210171903130010',
    fullName: 'Edah Djubaedah',
    gender: 'Female',
    birthPlace: 'Ciamis',
    birthDate: '1945-06-29',
    address: 'RT 03 RW 01 Blok Sabtu',
    dusunId: 'dusun_01',
    education: 'Tamat SD/sederajat',
    occupation: 'Ibu Rumah Tangga',
    poorStatus: true,
    aidRecipients: ['PKH', 'BPNT'],
    location: { lat: -6.702950, lng: 108.321200 },
    status: 'Alive'
  },
  {
    nik: '3210172907680001',
    noKK: '3210172108070034',
    fullName: 'Ade Caswadi',
    gender: 'Male',
    birthPlace: 'Majalengka',
    birthDate: '1968-07-29',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Wiraswasta',
    poorStatus: false,
    aidRecipients: [],
    location: { lat: -6.703500, lng: 108.322500 },
    status: 'Alive'
  },
  {
    nik: '3210172006520001',
    noKK: '3210171008060006',
    fullName: 'Carim',
    gender: 'Male',
    birthPlace: 'Indramayu',
    birthDate: '1952-06-20',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Buruh Harian Lepas',
    poorStatus: true,
    aidRecipients: ['BLT DD'],
    location: { lat: -6.703620, lng: 108.322610 },
    status: 'Alive'
  },
  {
    nik: '3210171205610022',
    noKK: '3210171209070005',
    fullName: 'Dama',
    gender: 'Male',
    birthPlace: 'Majalengka',
    birthDate: '1961-05-12',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Buruh Harian Lepas',
    poorStatus: true,
    aidRecipients: ['BPNT'],
    location: { lat: -6.703710, lng: 108.322730 },
    status: 'Alive'
  },
  {
    nik: '3210175901570001',
    noKK: '3210172602190008',
    fullName: 'Darwinah',
    gender: 'Female',
    birthPlace: 'Majalengka',
    birthDate: '1957-01-19',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Ibu Rumah Tangga',
    poorStatus: true,
    aidRecipients: ['PKH'],
    location: { lat: -6.703810, lng: 108.322810 },
    status: 'Alive'
  },
  {
    nik: '3210176712530001',
    noKK: '3210171005060021',
    fullName: 'Hj Sri Winarsih',
    gender: 'Female',
    birthPlace: 'Klaten',
    birthDate: '1953-12-27',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Ibu Rumah Tangga',
    poorStatus: true,
    aidRecipients: ['PKH', 'BPNT'],
    location: { lat: -6.703920, lng: 108.322920 },
    status: 'Alive'
  },
  {
    nik: '3210172403760001',
    noKK: '3210170711080011',
    fullName: 'Iko Susanto',
    gender: 'Male',
    birthPlace: 'Majalengka',
    birthDate: '1976-03-24',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SLTA/sederajat',
    occupation: 'Wiraswasta',
    poorStatus: false,
    aidRecipients: [],
    location: { lat: -6.704100, lng: 108.323100 },
    status: 'Alive'
  },
  {
    nik: '3210110107790601',
    noKK: '321011130511006',
    fullName: 'Jaja',
    gender: 'Male',
    birthPlace: 'Majalengka',
    birthDate: '1979-07-01',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Buruh Harian Lepas',
    poorStatus: true,
    aidRecipients: ['BLT DD'],
    location: { lat: -6.704250, lng: 108.323250 },
    status: 'Alive'
  },
  {
    nik: '3210176510400001',
    noKK: '3210172408070004',
    fullName: 'Jariah',
    gender: 'Female',
    birthPlace: 'Majalengka',
    birthDate: '1940-10-25',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Ibu Rumah Tangga',
    poorStatus: true,
    aidRecipients: ['PKH'],
    location: { lat: -6.704380, lng: 108.323380 },
    status: 'Alive'
  },
  {
    nik: '3210171206920101',
    noKK: '3210173112190002',
    fullName: 'Junaedi',
    gender: 'Male',
    birthPlace: 'Majalengka',
    birthDate: '1992-06-12',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SLTA/sederajat',
    occupation: 'Kolektor PBB',
    poorStatus: false,
    aidRecipients: [],
    location: { lat: -6.704510, lng: 108.323510 },
    status: 'Alive'
  },
  {
    nik: '3210175506450523',
    noKK: '3210171011080003',
    fullName: 'Karsiti',
    gender: 'Female',
    birthPlace: 'Majalengka',
    birthDate: '1945-06-15',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Ibu Rumah Tangga',
    poorStatus: true,
    aidRecipients: ['PKH'],
    location: { lat: -6.704620, lng: 108.323620 },
    status: 'Alive'
  },
  {
    nik: '3210171504730021',
    noKK: '3210170304080019',
    fullName: 'Kastam Suharto',
    gender: 'Male',
    birthPlace: 'Majalengka',
    birthDate: '1973-04-15',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Wiraswasta',
    poorStatus: false,
    aidRecipients: [],
    location: { lat: -6.704780, lng: 108.323780 },
    status: 'Alive'
  },
  {
    nik: '3210174107410563',
    noKK: '3210170709060015',
    fullName: 'Kesih',
    gender: 'Female',
    birthPlace: 'Majalengka',
    birthDate: '1941-07-01',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Ibu Rumah Tangga',
    poorStatus: true,
    aidRecipients: ['BPNT'],
    location: { lat: -6.704910, lng: 108.323910 },
    status: 'Alive'
  },
  {
    nik: '3210173003780021',
    noKK: '3210171109070003',
    fullName: 'Kurniawan',
    gender: 'Male',
    birthPlace: 'Majalengka',
    birthDate: '1978-03-30',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SLTA/sederajat',
    occupation: 'Karyawan Swasta',
    poorStatus: false,
    aidRecipients: [],
    location: { lat: -6.705120, lng: 108.324120 },
    status: 'Alive'
  },
  {
    nik: '3507310907770002',
    noKK: '3210172804170006',
    fullName: 'Misadianto',
    gender: 'Male',
    birthPlace: 'Malang',
    birthDate: '1977-07-09',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SLTA/sederajat',
    occupation: 'Karyawan Swasta',
    poorStatus: false,
    aidRecipients: [],
    location: { lat: -6.705250, lng: 108.324250 },
    status: 'Alive'
  },
  {
    nik: '3210171708690121',
    noKK: '3210170711080003',
    fullName: 'Muk Roy',
    gender: 'Male',
    birthPlace: 'Majalengka',
    birthDate: '1969-08-17',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SLTA/sederajat',
    occupation: 'Karyawan Swasta',
    poorStatus: false,
    aidRecipients: [],
    location: { lat: -6.705380, lng: 108.324380 },
    status: 'Alive'
  },
  {
    nik: '3210101505800012',
    noKK: '3210102408090030',
    fullName: 'Nana Supriatna',
    gender: 'Male',
    birthPlace: 'Majalengka',
    birthDate: '1980-05-15',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SLTA/sederajat',
    occupation: 'Wiraswasta',
    poorStatus: false,
    aidRecipients: [],
    location: { lat: -6.705510, lng: 108.324510 },
    status: 'Alive'
  },
  {
    nik: '3210173105820081',
    noKK: '3210171104090026',
    fullName: 'Nanang Raharso',
    gender: 'Male',
    birthPlace: 'Majalengka',
    birthDate: '1982-05-31',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SLTP/sederajat',
    occupation: 'Buruh Harian Lepas',
    poorStatus: true,
    aidRecipients: ['BLT DD'],
    location: { lat: -6.705630, lng: 108.324630 },
    status: 'Alive'
  },
  {
    nik: '3210174811840041',
    noKK: '3210170110070001',
    fullName: 'Nina Nursasih',
    gender: 'Female',
    birthPlace: 'Majalengka',
    birthDate: '1984-11-18',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SLTA/sederajat',
    occupation: 'Ibu Rumah Tangga',
    poorStatus: false,
    aidRecipients: [],
    location: { lat: -6.705750, lng: 108.324750 },
    status: 'Alive'
  },
  {
    nik: '3210175112510001',
    noKK: '3210171808050002',
    fullName: 'Ny Sutini',
    gender: 'Female',
    birthPlace: 'Majalengka',
    birthDate: '1951-12-11',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Ibu Rumah Tangga',
    poorStatus: true,
    aidRecipients: ['PKH'],
    location: { lat: -6.705880, lng: 108.324880 },
    status: 'Alive'
  },
  {
    nik: '3210176411190001',
    noKK: '3210171111190001',
    fullName: 'Sarah',
    gender: 'Female',
    birthPlace: 'Majalengka',
    birthDate: '1977-11-24',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Ibu Rumah Tangga',
    poorStatus: true,
    aidRecipients: ['PKH', 'BPNT'],
    location: { lat: -6.706010, lng: 108.325010 },
    status: 'Alive'
  },
  {
    nik: '3210171208570061',
    noKK: '3210171608110022',
    fullName: 'Slamet Wing',
    gender: 'Male',
    birthPlace: 'Klaten',
    birthDate: '1957-08-12',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Buruh Harian Lepas',
    poorStatus: true,
    aidRecipients: ['BLT DD'],
    location: { lat: -6.706120, lng: 108.325120 },
    status: 'Alive'
  },
  {
    nik: '3210171510670101',
    noKK: '3210172711080006',
    fullName: 'Sudirja',
    gender: 'Male',
    birthPlace: 'Majalengka',
    birthDate: '1967-10-15',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Buruh Harian Lepas',
    poorStatus: true,
    aidRecipients: ['BPNT'],
    location: { lat: -6.706250, lng: 108.325250 },
    status: 'Alive'
  },
  {
    nik: '3210170106720061',
    noKK: '3210170111105002',
    fullName: 'Sumarna',
    gender: 'Male',
    birthPlace: 'Majalengka',
    birthDate: '1972-06-01',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Tani',
    poorStatus: true,
    aidRecipients: ['BLT DD'],
    location: { lat: -6.706380, lng: 108.325380 },
    status: 'Alive'
  },
  {
    nik: '3210175809700041',
    noKK: '3210170309120008',
    fullName: 'Suparsih',
    gender: 'Female',
    birthPlace: 'Majalengka',
    birthDate: '1970-09-18',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Ibu Rumah Tangga',
    poorStatus: true,
    aidRecipients: ['PKH'],
    location: { lat: -6.706510, lng: 108.325510 },
    status: 'Alive'
  },
  {
    nik: '3210172810630021',
    noKK: '3210172209080043',
    fullName: 'Tata Sunata Pawira',
    gender: 'Male',
    birthPlace: 'Majalengka',
    birthDate: '1963-10-28',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Tani',
    poorStatus: true,
    aidRecipients: ['BLT DD'],
    location: { lat: -6.706630, lng: 108.325630 },
    status: 'Alive'
  },
  {
    nik: '3210174107350865',
    noKK: '3210171001240005',
    fullName: 'Timu',
    gender: 'Male',
    birthPlace: 'Majalengka',
    birthDate: '1935-07-01',
    address: 'RT 01 RW 02 Blok Selasa',
    dusunId: 'dusun_02',
    education: 'Tamat SD/sederajat',
    occupation: 'Tani',
    poorStatus: true,
    aidRecipients: ['BPNT'],
    location: { lat: -6.706780, lng: 108.325780 },
    status: 'Alive'
  }
];

export const mockEmployees: Employee[] = [
  {
    uid: 'emp_01',
    fullName: 'Abdul Jaelani',
    role: UserRole.VILLAGE_HEAD,
    email: 'kades.bongaskulon@easydes.id',
    phoneNumber: '081122334455'
  },
  {
    uid: 'emp_02',
    fullName: 'Tasdik',
    role: UserRole.SECRETARY,
    email: 'sekdes.bongaskulon@easydes.id',
    phoneNumber: '081234567890'
  },
  {
    uid: 'emp_03',
    fullName: 'Sumarna',
    role: UserRole.TREASURER,
    email: 'bendahara.bongaskulon@easydes.id',
    phoneNumber: '081398765432'
  },
  {
    uid: 'emp_04',
    fullName: 'Dani Sahroni',
    role: UserRole.ADMIN,
    email: 'admin.bongaskulon@easydes.id',
    phoneNumber: '081544332211'
  },
  {
    uid: 'emp_05',
    fullName: 'Hidayatullah',
    role: UserRole.OPERATOR,
    email: 'operator.bongaskulon@easydes.id',
    phoneNumber: '081722883399'
  },
  {
    uid: 'emp_06',
    fullName: 'Ade Caswadi',
    role: UserRole.HAMLET_HEAD,
    email: 'kadus.selasa@easydes.id',
    dusunId: 'dusun_02',
    phoneNumber: '081955443322'
  },
  {
    uid: 'emp_07',
    fullName: 'Junaedi',
    role: UserRole.TAX_COLLECTOR,
    email: 'kolektor.pbb@easydes.id',
    phoneNumber: '085211223344'
  }
];

export const mockAttendanceList: Attendance[] = [
  {
    attendanceId: 'att_20260720_01',
    uid: 'emp_01',
    fullName: 'Abdul Jaelani',
    role: 'Village Head',
    date: '2026-07-20',
    checkIn: '07:15:23',
    status: 'Present',
    location: { lat: -6.703128, lng: 108.321618 },
    notes: 'Presensi Kantor Balai Desa Bongas Kulon'
  },
  {
    attendanceId: 'att_20260720_02',
    uid: 'emp_02',
    fullName: 'Tasdik',
    role: 'Secretary',
    date: '2026-07-20',
    checkIn: '07:28:10',
    status: 'Present',
    location: { lat: -6.703125, lng: 108.321615 },
    notes: 'Presensi Balai Desa'
  },
  {
    attendanceId: 'att_20260720_03',
    uid: 'emp_03',
    fullName: 'Sumarna',
    role: 'Treasurer',
    date: '2026-07-20',
    checkIn: '07:46:15',
    status: 'Late',
    location: { lat: -6.703140, lng: 108.321630 },
    notes: 'Terlambat karena macet di jalan raya Sumberjaya'
  },
  {
    attendanceId: 'att_20260720_04',
    uid: 'emp_04',
    fullName: 'Dani Sahroni',
    role: 'Admin',
    date: '2026-07-20',
    checkIn: '07:10:05',
    status: 'Present',
    location: { lat: -6.703120, lng: 108.321600 }
  },
  {
    attendanceId: 'att_20260720_05',
    uid: 'emp_05',
    fullName: 'Hidayatullah',
    role: 'Operator',
    date: '2026-07-20',
    checkIn: '07:22:40',
    status: 'Present',
    location: { lat: -6.703110, lng: 108.321590 }
  },
  {
    attendanceId: 'att_20260720_06',
    uid: 'emp_06',
    fullName: 'Ade Caswadi',
    role: 'Head of Hamlet',
    date: '2026-07-20',
    checkIn: '07:35:12',
    status: 'Late',
    location: { lat: -6.703500, lng: 108.322500 },
    notes: 'Mengecek saluran air di Blok Selasa'
  }
];

export const mockLetters: Letter[] = [
  {
    letterId: 'LET-202607-001',
    letterNo: '140/012/BKL/VII/2026',
    title: 'Surat Keterangan Usaha (SKU)',
    applicantNIK: '3210172403760001',
    applicantName: 'Iko Susanto',
    type: 'Incoming',
    status: 'Completed',
    requestedAt: '2026-07-19 09:15',
    completedAt: '2026-07-20 08:30',
    signedBy: 'Abdul Jaelani',
    qrVerificationCode: 'VER-9821-SKU',
    fileURL: '#'
  },
  {
    letterId: 'LET-202607-002',
    letterNo: '140/013/BKL/VII/2026',
    title: 'Surat Keterangan Tidak Mampu (SKTM)',
    applicantNIK: '3210175105890121',
    applicantName: 'Mei Saemurni',
    type: 'Incoming',
    status: 'Pending',
    requestedAt: '2026-07-20 08:05'
  },
  {
    letterId: 'LET-202607-003',
    letterNo: '140/014/BKL/VII/2026',
    title: 'Surat Keterangan Domisili',
    applicantNIK: '3210172907680001',
    applicantName: 'Ade Caswadi',
    type: 'Incoming',
    status: 'Verified',
    requestedAt: '2026-07-20 08:12'
  }
];

export const mockTaxpayers: Taxpayer[] = [
  {
    nop: '32.10.170.012.001-0042.0',
    nik: '3210172907680001',
    taxpayerName: 'Ade Caswadi',
    amount: 125000,
    status: 'Paid',
    dusunId: 'dusun_02',
    collectorId: 'emp_07',
    location: { lat: -6.703500, lng: 108.322500 },
    paidAt: '2026-07-15 10:30'
  },
  {
    nop: '32.10.170.012.001-0043.0',
    nik: '3210172403760001',
    taxpayerName: 'Iko Susanto',
    amount: 280000,
    status: 'Unpaid',
    dusunId: 'dusun_02',
    collectorId: 'emp_07',
    location: { lat: -6.704100, lng: 108.323100 }
  },
  {
    nop: '32.10.170.012.001-0044.0',
    nik: '3210170106720061',
    taxpayerName: 'Sumarna',
    amount: 140000,
    status: 'Paid',
    dusunId: 'dusun_02',
    collectorId: 'emp_07',
    location: { lat: -6.706380, lng: 108.325380 },
    paidAt: '2026-07-18 14:15'
  },
  {
    nop: '32.10.170.012.001-0045.0',
    nik: '3210174107350865',
    taxpayerName: 'Timu',
    amount: 85000,
    status: 'Unpaid',
    dusunId: 'dusun_02',
    collectorId: 'emp_07',
    location: { lat: -6.706780, lng: 108.325780 }
  }
];

export const mockProjects: VillageProject[] = [
  {
    projectId: 'PROJ-01',
    name: 'Pavingisasi Jalan Desa Blok Selasa',
    budget: 85000000,
    expenditure: 82500000,
    contractor: 'CV Karya Mandiri Majalengka',
    progress: 100,
    startDate: '2026-05-10',
    endDate: '2026-06-15',
    location: { lat: -6.703500, lng: 108.322500 },
    photoBefore: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80',
    photoAfter: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80',
    status: 'Completed'
  },
  {
    projectId: 'PROJ-02',
    name: 'Pembangunan Saluran Irigasi Persawahan Blok Sabtu',
    budget: 150000000,
    expenditure: 120000000,
    contractor: 'CV Tirta Abadi Majalengka',
    progress: 75,
    startDate: '2026-06-01',
    endDate: '2026-08-30',
    location: { lat: -6.702950, lng: 108.321200 },
    photoBefore: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
    photoAfter: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=400&q=80',
    status: 'On Progress'
  },
  {
    projectId: 'PROJ-03',
    name: 'Rehabilitasi Gedung PAUD Kasih Ibu Blok Kencana',
    budget: 45000000,
    expenditure: 10000000,
    contractor: 'Gotong Royong Blok Karang Kencana',
    progress: 20,
    startDate: '2026-07-05',
    endDate: '2026-08-05',
    location: { lat: -6.705800, lng: 108.324800 },
    photoBefore: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=400&q=80',
    photoAfter: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=400&q=80',
    status: 'On Progress'
  }
];

export const mockComplaints: Complaint[] = [
  {
    complaintId: 'COMP-01',
    reporterName: 'Sumarna',
    category: 'Fasilitas Umum',
    title: 'Lampu Penerangan RT 03 RW 01 Blok Sabtu Padam',
    description: 'Sudah mati 4 hari terakhir, jalanan sangat gelap jika malam hari dan rawan keamanan.',
    location: { lat: -6.702900, lng: 108.321100 },
    status: 'In Progress',
    createdAt: '2026-07-18 19:45',
    responseTimeHours: 12
  },
  {
    complaintId: 'COMP-02',
    reporterName: 'Wahyudi',
    category: 'Sosial & Keamanan',
    title: 'Penumpukan Sampah Liar di Pinggir Jalan Blok Rabu',
    description: 'Banyak sampah plastik menumpuk berbau busuk, mohon dibersihkan.',
    location: { lat: -6.704500, lng: 108.323500 },
    status: 'Submitted',
    createdAt: '2026-07-20 06:30'
  },
  {
    complaintId: 'COMP-03',
    reporterName: 'Edah Djubaedah',
    category: 'Bencana Alam',
    title: 'Lubang Jembatan Irigasi Blok Krajan',
    description: 'Jembatan penghubung persawahan berlubang cukup besar, berbahaya bagi petani.',
    location: { lat: -6.702950, lng: 108.321200 },
    status: 'Resolved',
    createdAt: '2026-07-15 08:00',
    responseTimeHours: 36
  }
];

export const mockAssets: VillageAsset[] = [
  {
    assetId: 'AST-BUILD-01',
    name: 'Gedung Kantor Balai Desa Bongas Kulon',
    type: 'Building',
    value: 1200000000,
    condition: 'Good',
    location: { lat: -6.703128, lng: 108.321618 },
    qrTrackingCode: 'QR-BKL-B01',
    registeredAt: '1951-01-01'
  },
  {
    assetId: 'AST-VEHICLE-01',
    name: 'Mobil Ambulans Siaga Desa Bongas Kulon (Suzuki APV)',
    type: 'Vehicle',
    value: 185000000,
    condition: 'Good',
    location: { lat: -6.703150, lng: 108.321650 },
    qrTrackingCode: 'QR-BKL-V01',
    registeredAt: '2021-12-20'
  },
  {
    assetId: 'AST-LAND-01',
    name: 'Tanah Kas Desa Blok Krajan / Sabtu (Pertanian Sawah)',
    type: 'Land',
    value: 2500000000,
    condition: 'Good',
    location: { lat: -6.702950, lng: 108.321200 },
    qrTrackingCode: 'QR-BKL-L01',
    registeredAt: '1951-01-01'
  }
];

export const mockNotifications: VillageNotification[] = [
  {
    id: 'not_01',
    title: 'Permohonan Surat Baru',
    description: 'Mei Saemurni mengajukan SKTM di Letter Service.',
    category: 'letter',
    timestamp: '10 menit lalu',
    read: false
  },
  {
    id: 'not_02',
    title: 'Aduan Warga Baru',
    description: 'Aduan penerangan lampu padam dilaporkan di Blok Krajan.',
    category: 'complaint',
    timestamp: '2 jam lalu',
    read: false
  },
  {
    id: 'not_03',
    title: 'Peringatan Target PBB',
    description: 'Realisasi PBB Blok Selasa masih 45% dari target total.',
    category: 'tax',
    timestamp: '1 hari lalu',
    read: true
  }
];

export const mockWeather: WeatherData = {
  temp: 32, // matching average suhu harian in Prodeskel: 32 C
  condition: 'Cerah Berawan',
  humidity: 78,
  windSpeed: 12,
  rainProbability: 20,
  alert: 'Suhu stabil, tidak ada peringatan bencana cuaca ekstrem di Sumberjaya.'
};

export const mockBudget: APBDesBudget = {
  year: 2026,
  revenue: {
    total: 2150000000, // Upgraded APBDes with realistic village metrics
    sectors: [
      { name: 'Dana Desa (APBN)', value: 1100000000 },
      { name: 'Alokasi Dana Desa (ADD)', value: 650000000 },
      { name: 'Pendapatan Asli Desa (PADes)', value: 250000000 },
      { name: 'Bantuan Keuangan Provinsi', value: 150000000 }
    ]
  },
  expenditure: {
    total: 1980000000,
    sectors: [
      { name: 'Penyelenggaraan Pemerintahan', value: 550000000 },
      { name: 'Pembangunan Infrastruktur', value: 920000000 },
      { name: 'Pembinaan Kemasyarakatan', value: 250000000 },
      { name: 'Pemberdayaan Masyarakat', value: 180000000 },
      { name: 'Penanggulangan Bencana', value: 80000000 }
    ]
  },
  absorptionRate: 92.09
};

export const mockCctvList = [
  { id: 'cctv_01', name: 'Simpang Balai Desa Bongas Kulon', url: 'live_gate', status: 'Online' },
  { id: 'cctv_02', name: 'Pintu Masuk Blok Krajan / Sabtu', url: 'live_krajan', status: 'Online' },
  { id: 'cctv_03', name: 'Pos Ronda Blok Selasa', url: 'live_ngemplak', status: 'Online' },
  { id: 'cctv_04', name: 'Area PAUD Blok Kencana', url: 'live_paud', status: 'Offline' }
];
