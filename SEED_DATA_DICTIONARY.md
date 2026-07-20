# EasyDes Smart Village Master Data Dictionary

This Data Dictionary defines the official Single Source of Truth for the **EasyDes Smart Village Command Center** deployment in **Desa Bongas Kulon, Kecamatan Sumberjaya, Kabupaten Majalengka, Jawa Barat**. 

All initial datasets are parsed and derived directly from the official **Prodeskel (Profil Desa dan Kelurahan)** master records.

---

## 1. Collection: `citizens`
- **Firestore Collection Name:** `citizens`
- **Primary Key:** `nik` (String, National Identity Number)
- **Source Document:** Prodeskel Kependudukan & DTKS Desa Bongas Kulon

| Field Name | Data Type | Constraint / Format | Description | Source Prodeskel Section |
| :--- | :--- | :--- | :--- | :--- |
| `nik` | `String` | 16 digits, Unique | National Identity Number | Buku Induk Penduduk |
| `noKK` | `String` | 16 digits | Family Card Number | Kartu Keluarga Warga |
| `fullName` | `String` | Capitalized | Full Name | Nama Lengkap |
| `gender` | `String` | `"Male" \| "Female"` | Gender | Jenis Kelamin |
| `birthPlace` | `String` | - | Place of Birth | Tempat Lahir |
| `birthDate` | `String` | `YYYY-MM-DD` | Date of Birth | Tanggal Lahir |
| `address` | `String` | - | Home Address details | Alamat Domisili |
| `dusunId` | `String` | `"dusun_01" \| "dusun_02"` | Block Identifier (Sabtu, Selasa, Rabu, Kencana) | Blok / Dusun Tinggal |
| `education` | `String` | - | Highest educational level | Pendidikan Terakhir |
| `occupation` | `String` | - | Primary economic activity | Mata Pencaharian |
| `poorStatus` | `Boolean` | `true \| false` | Pre-prosperous (poor) family status | Kategori Kesejahteraan (DTKS) |
| `aidRecipients`| `Array<String>` | - | Active social aid programs received | Daftar Penerima Bantuan (BLT, PKH, etc.) |
| `location` | `Object` | `{ lat: Float, lng: Float }` | Precise geocoded home coordinate | Peta Blok Spasial |
| `status` | `String` | `"Alive" \| "Deceased"` | Vital Status | Status Hidup |

---

## 2. Collection: `employees`
- **Firestore Collection Name:** `employees`
- **Primary Key:** `id` (String)
- **Source Document:** Struktur Organisasi Tata Kerja (SOTK) Desa Bongas Kulon

| Field Name | Data Type | Constraint / Format | Description | Source Section |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | Pattern `emp_xx` | Unique employee code | Registrasi SOTK |
| `nik` | `String` | 16 digits | National Identity Number | Identitas SOTK |
| `fullName` | `String` | - | Appointed official full name | Nama Aparatur |
| `role` | `String` | - | Official role / jabatan in the village | Jabatan Resmi |
| `phone` | `String` | E.164 | Mobile number | Kontak WA |
| `status` | `String` | `"Active" \| "Inactive"` | Service Status | Status Dinas |

---

## 3. Collection: `attendance`
- **Firestore Collection Name:** `attendance`
- **Primary Key:** `id` (String)
- **Source Document:** Daily Biometric Fingerprint & GPS Log

| Field Name | Data Type | Constraint / Format | Description | Source Section |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | Pattern `att_xx` | Unique attendance record identifier | Auto-generated ID |
| `nik` | `String` | 16 digits | Staff NIK reference | Aparatur ID |
| `fullName` | `String` | - | Employee Name | Nama Staff |
| `role` | `String` | - | Staff role | Jabatan |
| `date` | `String` | `YYYY-MM-DD` | Attendance log date | Jurnal Tanggal |
| `clockIn` | `String` | `HH:MM:SS` or empty | Check-in timestamp | Jam Masuk |
| `clockOut` | `String` | `HH:MM:SS` or empty | Check-out timestamp | Jam Pulang |
| `status` | `String` | `"Present" \| "Late" \| "Absent"` | Detailed daily status | Kehadiran Hari Ini |
| `performanceScore`| `Number` | `0 - 100` | Automated performance metric | Skor Kerja |
| `location` | `Object \| null` | `{ lat: Float, lng: Float }` | Geofenced coordinates at check-in | Verifikasi GPS Lokasi |

---

## 4. Collection: `letters`
- **Firestore Collection Name:** `letters`
- **Primary Key:** `id` (String)
- **Source Document:** Buku Register Persuratan Desa

| Field Name | Data Type | Constraint / Format | Description | Source Section |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | Pattern `let_xx` | Unique letter identifier | Buku Register |
| `letterNo` | `String` | Official format | State letter registration number | Nomor Surat |
| `title` | `String` | - | Name of letter certificate | Jenis Keterangan |
| `type` | `String` | `"Incoming" \| "Outgoing"` | Flow direction | Sifat Surat |
| `applicantName`| `String` | - | Name of citizen applying | Pemohon Surat |
| `applicantNIK` | `String` | 16 digits | Applicant national ID | NIK Pemohon |
| `status` | `String` | `"Pending" \| "Completed"` | Letter status | Progres Persuratan |
| `requestedAt` | `String` | `YYYY-MM-DD HH:MM:SS` | Submission timestamp | Tanggal Pengajuan |
| `completedAt` | `String` | `YYYY-MM-DD HH:MM:SS` | Fulfillment timestamp | Tanggal Selesai |
| `signedBy` | `String` | - | Signing officer name | Penandatangan |
| `qrCode` | `String` | URL format | Authenticity check url | QR Kode Verifikasi |

---

## 5. Collection: `taxpayers`
- **Firestore Collection Name:** `taxpayers`
- **Primary Key:** `nop` (String, Pajak Bumi dan Bangunan ID)
- **Source Document:** DHKP (Daftar Himpunan Ketetapan Pajak) PBB-P2 Bongas Kulon

| Field Name | Data Type | Constraint / Format | Description | Source Section |
| :--- | :--- | :--- | :--- | :--- |
| `nop` | `String` | `XX.XX.XXX.XXX.XXX-XXXX.X` | Tax Object Number | Nomor Objek Pajak (NOP) |
| `taxpayerName` | `String` | - | Registered tax object owner | Wajib Pajak |
| `nik` | `String` | 16 digits | Owner NIK | NIK WP |
| `address` | `String` | - | Real estate address | Letak Objek Pajak |
| `dusunId` | `String` | - | Block code reference | Sektor Blok Dusun |
| `amount` | `Number` | Rupiah | Annual tax bill | Jumlah PBB Ketetapan |
| `status` | `String` | `"Paid" \| "Unpaid"` | Tax settlement status | Keterangan Lunas |
| `paidAt` | `String \| null`| `YYYY-MM-DD HH:MM:SS` | Transaction completion timestamp | Tanggal Bayar |

---

## 6. Collection: `projects`
- **Firestore Collection Name:** `projects`
- **Primary Key:** `id` (String)
- **Source Document:** RKPDes (Rencana Kerja Pemerintah Desa) Bongas Kulon

| Field Name | Data Type | Constraint / Format | Description | Source Section |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | Pattern `proj_xx` | Unique project code | RKPDes ID |
| `name` | `String` | - | Official project title | Nama Kegiatan |
| `category` | `String` | `"Infrastruktur" \| "Kesejahteraan"` | Project category | Bidang Pembangunan |
| `budget` | `Number` | Rupiah | Allocated funds | Pagu Anggaran |
| `source` | `String` | - | Funding source (DD, ADD, Banprov) | Sumber Pembiayaan |
| `location` | `String` | - | Target location | Lokasi Kegiatan |
| `status` | `String` | `"In Progress" \| "Completed"`| Work progress status | Status Kegiatan |
| `progress` | `Number` | `0 - 100` percentage | Progress completion value | Progres Fisik (%) |
| `startDate` | `String` | `YYYY-MM-DD` | Start date | Tanggal Mulai |
| `endDate` | `String` | `YYYY-MM-DD` | Completion deadline | Tanggal Target |
| `contractor` | `String` | - | Executive organization or supplier | Pelaksana Kegiatan |
| `lat` | `Float` | Coordinate | Geolocation Latitude | GPS Latitude |
| `lng` | `Float` | Coordinate | Geolocation Longitude | GPS Longitude |

---

## 7. Collection: `complaints`
- **Firestore Collection Name:** `complaints`
- **Primary Key:** `id` (String)
- **Source Document:** Portal Pengaduan Masyarakat (EasyDes LAPOR!)

| Field Name | Data Type | Constraint / Format | Description | Source Section |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | Pattern `comp_xx` | Unique report identifier | Sistem LAPOR! ID |
| `reporterName` | `String` | - | Citizen reporter name | Nama Pengadu |
| `reporterNIK` | `String` | 16 digits | Reporter NIK | NIK Pengadu |
| `category` | `String` | - | Category of issue | Kategori Laporan |
| `title` | `String` | - | Short summary | Judul Aduan |
| `description` | `String` | - | Detailed text | Uraian Pengaduan |
| `location` | `String` | - | Target location of issue | Lokasi Aduan |
| `status` | `String` | `"Pending" \| "In Progress" \| "Completed"` | Processing status | Status Penanganan |
| `createdAt` | `String` | `YYYY-MM-DD HH:MM:SS` | Incident registration date | Tanggal Aduan Masuk |
| `updatedAt` | `String` | `YYYY-MM-DD HH:MM:SS` | Latest resolution update | Tanggal Update |
| `latitude` | `Float` | Coordinate | Geolocation Latitude | GPS Latitude |
| `longitude` | `Float` | Coordinate | Geolocation Longitude | GPS Longitude |

---

## 8. Collection: `assets`
- **Firestore Collection Name:** `assets`
- **Primary Key:** `id` (String)
- **Source Document:** Permendagri No. 110/2016 Tentang Pengelolaan Aset Desa

| Field Name | Data Type | Constraint / Format | Description | Source Section |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | Pattern `as_xx` | Unique asset code | Buku Inventaris Aset |
| `name` | `String` | - | Name of asset item | Nama Barang Aset |
| `category` | `String` | `"Land" \| "Buildings" \| "Vehicles" \| "Equipment"` | Type of asset | Golongan Aset |
| `condition` | `String` | `"Good" \| "Damaged"` | Quality condition | Keadaan Barang |
| `value` | `Number` | Rupiah | Current asset value | Nilai Buku Aset |
| `location` | `String` | - | Custody location | Tempat Penyimpanan |
| `status` | `String` | `"In Use" \| "Idle"` | Usage state | Penggunaan |
| `qrCode` | `String` | URL format | QR Tracker code | QR Registrasi Aset |
| `certified` | `Boolean`| `true \| false` | Certificate status for land/buildings | Legalitas Sertifikat |
| `certifiedNo` | `String` | - | Certificate code | Nomor Sertifikat |

---

## 9. Collection: `budget`
- **Firestore Collection Name:** `budget`
- **Primary Key:** `id` (String)
- **Source Document:** APBDes (Anggaran Pendapatan dan Belanja Desa) 2026

| Field Name | Data Type | Constraint / Format | Description | Source Section |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | Pattern `bud_xx` | Unique transaction budget identifier | Kode APBDes |
| `year` | `Number` | Year integer | Fiscal year | Tahun Anggaran |
| `type` | `String` | `"Revenue" \| "Expenditure"` | Financial classification | Klasifikasi (Pendapatan/Belanja) |
| `category` | `String` | - | Sector or account group name | Kode Rekening |
| `target` | `Number` | Rupiah | Target budget | Pagu Anggaran (Rp) |
| `realized` | `Number` | Rupiah | Realized budget | Realisasi Anggaran (Rp) |
| `percentage` | `Number` | `0 - 100` | Execution progress rate | Persentase Absorpsi (%) |

---
*EasyDes Command Center Seeding Data Dictionary — Confirmed Single Source of Truth.*
