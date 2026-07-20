# EASYDES SMART VILLAGE COMMAND CENTER
## Master Project Blueprint & Software Architecture Document
**Version:** 1.0.0  
**Author:** Software Architect & Government Digital Transformation Consultant  
**Status:** Approved for Implementation (Design Theme: Bento Grid)

---

### 1. Ringkasan Tujuan Aplikasi (App Executive Summary)
**EasyDes Smart Village Command Center** adalah platform dasbor terintegrasi real-time yang dirancang khusus untuk Pemerintah Desa (Pemerintah Desa/Kelurahan). Platform ini mengonsolidasikan seluruh aspek operasional desa—mulai dari kependudukan, keuangan, pelayanan publik, pemantauan CCTV, pelacakan pajak daerah (PBB), manajemen aset, hingga mitigasi darurat—ke dalam satu pusat komando visual berkinerja tinggi. 
Aplikasi ini dioptimalkan untuk berbagai layar, khususnya layar besar **55-inch TV Command Center di Balai Desa**, serta responsif terhadap perangkat desktop, tablet, dan ponsel pintar. Desain visual mengadopsi estetika **Bento Grid** (terinspirasi dari Apple Dashboard, Vercel, Linear, Grafana, dan Notion) yang mengutamakan penyajian informasi modular, bersih, futuristik, kontras tinggi, dan kaya akan visualisasi data interaktif.

---

### 2. Analisis Kebutuhan Fungsional (Functional Requirements)
Aplikasi harus dapat memenuhi kebutuhan-kebutuhan fungsional spesifik berikut:
- **Kependudukan (Population):** Menampilkan metrik agregat penduduk secara real-time (jumlah jiwa, KK, rasio gender, laju lahir/mati, pola migrasi, keluarga prasejahtera, dan penerima bantuan).
- **Kehadiran Aparatur (Attendance Monitoring):** Melacak presensi perangkat desa menggunakan simulasi GPS, deteksi sidik jari (fingerprint), dan pengenalan wajah (face recognition ready) dengan analisis keterlambatan dan kinerja harian.
- **Surat Menyurat Digital (Digital Letter Service):** Manajemen surat masuk/keluar, pelacakan status permohonan, verifikasi tanda tangan digital menggunakan sistem QR Code.
- **Pusat Pajak Bumi & Bangunan (Village Tax - PBB):** Pencarian wajib pajak berdasarkan NOP (Nomor Objek Pajak) atau Nama, navigasi rute penagihan bagi petugas, visualisasi peta penagihan per dusun, dan ranking kolektor pajak terbaik.
- **Pusat Informasi & Berita (News Center):** Pengumuman agenda kegiatan desa, berita internal, galeri foto, dan pemutar video dokumentasi desa.
- **Keuangan Desa (APBDes Dashboard):** Menampilkan transparansi anggaran (Pendapatan, Belanja, Sisa Anggaran, dan persentase penyerapan) secara grafis interaktif.
- **Pembangunan Fisik (Village Development):** Pelacakan proyek infrastruktur fisik desa lengkap dengan koordinat spasial, dokumentasi foto Sebelum-Sesudah (Before-After), progres persentase, kontraktor pelaksana, dan status anggaran.
- **Peta GIS Desa (GIS Village Map):** Integrasi peta spasial berbasis Leaflet/OpenStreetMap untuk pemetaan batas wilayah, klasifikasi RT/RW, sebaran aset fisik, sekolah, rumah ibadah, jalan/jembatan, titik CCTV, fasilitas kesehatan, dan rumah wajib pajak (heatmaps).
- **Pemantauan CCTV (CCTV Monitoring):** Grid pemutar kamera pengawas desa dengan fitur putar otomatis, snapshot, dan kontrol arah kamera (PTZ Ready).
- **Informasi Cuaca & Bencana (Weather & Disaster Emergency):** Prakiraan cuaca real-time, tingkat curah hujan, angin, kelembaban, serta integrasi tombol panik (Panic Button) untuk pelaporan darurat bencana dan koordinasi ambulans/damkar/polisi terdekat.
- **Sistem Notifikasi Pintar (Smart Notifications):** Manajemen pengingat internal untuk agenda rapat, sisa target pajak, laporan keluhan warga, dan presensi perangkat desa.
- **Pusat Keluhan Warga (Complaint Center):** Tempat pelaporan keluhan masyarakat dilengkapi dengan unggah bukti foto, tag lokasi koordinat GPS, dan pelacakan respons waktu penanganan.
- **Asisten AI Desa (AI Village Assistant):** Chatbot pintar berbasis Gemini API yang mampu memproses pencarian data menggunakan bahasa alami (natural language), pembuatan draf surat otomatis, perumusan ringkasan regulasi, dan analisis perkiraan tren (budget, populasi, pajak).
- **Ekspor Laporan (Report Export):** Dukungan ekspor data dalam format PDF, Excel, CSV, dan tampilan ramah cetak (print-ready) untuk laporan bulanan.

---

### 3. Analisis Kebutuhan Non-Fungsional (Non-Functional Requirements)
- **Ketersediaan (Availability) & Keandalan:** SLA sistem minimal 99.9% menggunakan infrastruktur Firebase.
- **Kombinasi Desain (Aesthetic Theme):** Desain visual modular bergaya **Bento Grid** dengan kontras tinggi, menggunakan font modern (*Inter* & *Poppins*), animasi mikro (*Framer Motion*), serta transisi antar halaman yang sangat halus.
- **Responsivitas Perangkat:** Responsif di semua rasio layar (Mobile, Tablet, Desktop, dan TV Ultra-Wide 55-inch Command Center) dengan penskalaan layout yang dinamis dan bebas glitch.
- **Optimasi Performa (Performance):** Kecepatan pemuatan awal (LCP) < 2 detik. Mengimplementasikan teknik Lazy Loading, Virtual Scrolling pada daftar panjang (penduduk, wajib pajak), caching lokal, dan kompresi file media.
- **Dukungan Luring (Offline First):** Menyimpan cache lokal menggunakan SQLite/IndexedDB via SDK Firebase Firestore Offline Persistence agar data vital tetap dapat diakses meski koneksi internet terputus di area pelosok.
- **Keamanan Informasi (Security & Privacy):** Enkripsi transmisi data via HTTPS/SSL, enkripsi muatan data sensitif, penerapan Firestore Security Rules yang ketat berdasarkan otorisasi peran pengguna (role-based access).
- **Integrasi PWA (Progressive Web App):** Dapat diinstal langsung di layar beranda ponsel perangkat desa dan didukung sistem sinkronisasi latar belakang (background sync).

---

### 4. Daftar Seluruh Modul Aplikasi (App Modules)
1. **Modul Auth & Otorisasi:** Penanganan otentikasi login perangkat desa dan pembatasan halaman berdasarkan peran.
2. **Modul Executive KPI Board:** Dasbor utama visualisasi performa desa terintegrasi (Village Score, Kepuasan Warga, Penyerapan APBDes, Realisasi Pajak, Kecepatan Layanan).
3. **Modul Kependudukan (Population Desk):** Manajemen data warga, analisis demografis, dan grafik kependudukan.
4. **Modul Presensi Aparatur (Attendance Center):** Peta presensi perangkat desa, metrik keterlambatan, pengajuan cuti, dan skor performa.
5. **Modul Administrasi Persuratan (Letter Desk):** Pembuatan surat otomatis, QR-Code signer, dan pengelolaan alur persetujuan.
6. **Modul PBB Interaktif (Tax Command):** Dasbor pencarian wajib pajak, visualisasi geo-spasial tunggakan, rute kolektor.
7. **Modul Transparansi Anggaran (APBDes Monitor):** Rekapitulasi pendapatan vs belanja, diagram alokasi dana per sektor.
8. **Modul Pembangunan Desa (Project Tracker):** Status proyek fisik, integrasi foto Before-After progres pengerjaan, geo-tagging lokasi konstruksi.
9. **Modul Smart CCTV & GIS:** Peta interaktif batas wilayah desa dengan layer interaktif (CCTV, Aset, Fasilitas, Proyek).
10. **Modul Weather & Disaster Mitigation:** Widgets cuaca real-time, peta rawan bencana, dan manajemen posko darurat.
11. **Modul Integrated Asset Management:** Inventarisasi tanah kas desa, gedung, kendaraan operasional dilengkapi penempelan QR Code Aset.
12. **Modul Citizen Complaint Center:** Formulir laporan publik, alur kerja resolusi aduan oleh kades/operator.
13. **Modul AI Command Bot:** Konsol asisten berbasis LLM Gemini untuk query instan dan penyusunan dokumen desa secara otomatis.
14. **Modul Sinkronisasi Eksternal (Workspace Gateway):** Panel sinkronisasi otomatis data Firestore dengan Google Sheets, Google Drive (penyimpanan arsip surat/proyek), dan Google Calendar (agenda desa).

---

### 5. Hubungan Antar Modul (Module Interconnections)
```
                                 ┌───────────────────────┐
                                 │   Modul Auth & Role   │
                                 └───────────┬───────────┘
                                             │ (Otorisasi Akses)
                                             ▼
                               ┌──────────────────────────┐
      ┌───────────────────────►│  Modul Executive KPI   │◄───────────────────────┐
      │                        └─────────────┬────────────┘                        │
      │ (Metrik Progres)                     │ (Sinkronisasi Event & Log)          │ (Metrik Kinerja)
┌─────┴────────────────────┐                 ▼                               ┌─────┴────────────────────┐
│ Pembangunan (Project)   │      ┌───────────────────────┐                  │ Presensi & Aparatur      │
└─────┬────────────────────┘      │    Smart GIS Map &    │                  └──────────────────────────┘
      │                          │    CCTV Monitoring    │
      │ (Geo-tagging Lokasi)     └───────────▲───────────┘
      │                                      │ (Geo-tagging Aset & Wajib Pajak)
      ▼                                      │
┌──────────────────────────┐                 │                               ┌──────────────────────────┐
│ Kependudukan & Pajak PBB ├─────────────────┘                               │ Keluhan Warga (Complaint)│
└──────────────────────────┘                                                 └──────────────────────────┘
      │                                                                                    ▲
      │ (Data Warga / Pengaju)                                                             │
      ▼                                                                                    │
┌──────────────────────────┐                 ┌───────────────────────┐                     │
│ Administrasi Persuratan  ├────────────────►│ AI Assistant (Gemini) ├─────────────────────┘
└─────────────┬────────────┘                 └───────────────────────┘
              │ (Arsip PDF/Excel)
              ▼
┌──────────────────────────┐
│  Workspace Gateway API   │ ───► Sync ───► [ Google Sheets / Google Drive / Google Calendar ]
└──────────────────────────┘
```

---

### 6. User Role & Matriks Hak Akses (User Roles and Permissions)

| Modul / Fitur | Kepala Desa (Village Head) | Sekretaris Desa (Secretary) | Bendahara (Treasurer) | Operator / Admin | Kepala Dusun (Hamlet Head) | Kolektor Pajak (Tax Collector) | Masyarakat Umum (Public) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Executive KPI Board** | R/W (Full) | R/W (Full) | R/W (Full) | R/W (Full) | R | R | R (Filtered) |
| **Data Kependudukan** | R | R/W (Full) | R | R/W (Full) | R/W (Own Dusun) | R | R (Own Data) |
| **Presensi Aparatur** | R (Verify) | R/W (Full) | R | R/W (Full) | R/W (Own Presensi) | R/W (Own Presensi) | - |
| **Persuratan Digital** | Approve/Sign | R/W (Verify) | R | R/W (Drafting) | R (Submit) | - | R (Apply) |
| **Keuangan APBDes** | R | R | R/W (Full) | R | R | R | R (Transparansi)|
| **Pajak Bumi & Bangunan**| R | R | R/W (Verify) | R/W (Full) | R | R/W (Collect) | R (Check NOP) |
| **Peta GIS & CCTV** | R | R | R | R/W (Full) | R | R | R |
| **Aset Desa** | R | R/W (Full) | R/W (Full) | R/W (Full) | R | - | R (Transparansi)|
| **Laporan Keluhan** | R | R/W (Verify) | - | R/W (Full) | R/W (Resolve) | - | R/W (Own/Submit)|
| **AI Assistant** | Full | Full | Full | Full | Mid | Low | Low |

*Keterangan: **R** = Read Only, **R/W** = Read & Write, **Sign** = Otorisasi Tanda Tangan Digital.*

---

### 7. Alur Aplikasi (Application Flow: Login to Dashboard)
1. **Tahap 1: Otentikasi Terproteksi**
   - User mengakses halaman landing EasyDes.
   - User memasukkan kredensial (Email & Password) atau login SSO menggunakan akun Google kedinasan desa.
2. **Tahap 2: Resolusi Peran & Verifikasi**
   - Firebase Auth berhasil memverifikasi kredensial.
   - Sistem melakukan query ke Firestore `/users/{uid}` untuk mendapatkan atribut `role` dan `dusunId` (jika Kadus).
   - Memasukkan status "Session Live" dan memperbarui status kehadiran aparatur (jika login di pagi hari, otomatis mencatat log waktu kedatangan berdasarkan lokasi koordinat presensi GPS).
3. **Tahap 3: Hydration State & Sinkronisasi Luring**
   - Aplikasi memuat state global menggunakan React Context / Zustand.
   - Mengambil data cache lokal untuk modul yang diakses (jika offline). Jika online, menyinkronkan data perubahan terbaru dari Firestore.
4. **Tahap 4: Redireksi Halaman Dashboard Utama**
   - Pengguna diarahkan ke layout dasbor sesuai role.
   - Layout dasbor tersusun dalam **Bento Grid** interaktif yang menyajikan ringkasan KPI eksekutif, peta GIS desa, grafik APBDes, widget cuaca real-time, dan status aduan warga terpopuler.

---

### 8. Arsitektur Sistem Secara Keseluruhan (System Architecture)
```
   ┌──────────────────────────────────────────────────────────────────┐
   │                       CLIENT-SIDE (BROWSER)                      │
   │                                                                  │
   │      ┌────────────────────────────────────────────────────┐      │
   │      │                React SPA (Vite)                    │      │
   │      ├────────────────────────────────────────────────────┤      │
   │      │  - Bento Grid UI Layout (TailwindCSS)              │      │
   │      │  - Spasial Map Interface (React Leaflet)           │      │
   │      │  - Visualisasi Charts (Recharts / D3)              │      │
   │      │  - State Management & Custom Hooks                 │      │
   │      │  - Firebase Client Web SDK                         │      │
   │      └──────────┬──────────────────────────────▲──────────┘      │
   │                 │                              │                 │
   │                 ▼ (Write Offline First)        │ (Realtime Sync) │
   │      ┌────────────────────┐                    │                 │
   │      │ Offline Cache      │                    │                 │
   │      │ (Firestore Cache)  │                    │                 │
   │      └────────────────────┘                    │                 │
   └─────────────────┼──────────────────────────────┼─────────────────┘
                     │ (HTTPS Transmit)             │
                     ▼                              │
   ┌────────────────────────────────────────────────┼─────────────────┐
   │                        BACKEND SERVICES        │                 │
   │                                                │                 │
   │  ┌────────────────────────┐       ┌────────────┴───────────┐     │
   │  │ Firebase Auth          │       │ Firestore Database     │     │
   │  │ (Otentikasi Pengguna)  │       │ (Penyimpanan Utama)    │     │
   │  └────────────────────────┘       └────────────▲───────────┘     │
   │                                                │                 │
   │  ┌────────────────────────┐       ┌────────────┴───────────┐     │
   │  │ Firebase Storage       │◄─────►│ Express Server (Node)  │     │
   │  │ (Foto / Arsip Surat)   │       │ (Vite Middleware/API)  │     │
   │  └────────────────────────┘       └────────────▲───────────┘     │
   │                                                │ (API Calls)     │
   │                                                ▼                 │
   │  ┌─────────────────────────────────────────────────────────────┐ │
   │  │                    GOOGLE WORKSPACE INTEGRATION             │ │
   │  │  - Google Sheets API (Sinkronisasi database kependudukan)   │ │
   │  │  - Google Drive API (Penyimpanan permanen arsip PDF)        │ │
   │  │  - Google Calendar API (Jadwal agenda & musyawarah desa)    │ │
   │  └─────────────────────────────────────────────────────────────┘ │
   │                                                                  │
   │  ┌─────────────────────────────────────────────────────────────┐ │
   │  │                   GEMINI AI ENGINE                          │ │
   │  │  - @google/genai SDK (Pemrosesan Asisten Bot Pintar)        │ │
   │  └─────────────────────────────────────────────────────────────┘ │
   └──────────────────────────────────────────────────────────────────┘
```

---

### 9. Struktur Folder Proyek React + Firebase (Project Folder Structure)
```
/
├── .env.example                # Templat konfigurasi lingkungan (API Keys, Client ID)
├── .gitignore                  # Berkas abaikan Git
├── index.html                  # Berkas HTML utama
├── metadata.json               # Metadata aplikasi untuk AI Studio
├── package.json                # Pengelola dependensi npm & skrip build/run
├── tsconfig.json               # Konfigurasi kompilator TypeScript
├── vite.config.ts              # Konfigurasi Vite & Tailwind CSS plugins
├── firestore.rules             # Aturan keamanan database Firestore
├── BLUEPRINT.md                # Dokumen Blueprint Arsitektur ini (Master Reference)
│
├── src/
│   ├── main.tsx                # Titik entri utama React
│   ├── index.css               # CSS global mengimpor Tailwind CSS & Custom Fonts
│   ├── App.tsx                 # Komponen Root App (Manajer Router & Providers)
│   ├── types.ts                # Definisi Interface & Enum TypeScript Global
│   │
│   ├── components/             # Reusable UI Components
│   │   ├── bento/              # Komponen khusus tata letak Bento Grid
│   │   │   ├── BentoCard.tsx   # Wrapper kartu bento dengan transisi animasi
│   │   │   └── BentoHeader.tsx # Header modul di dalam kartu bento
│   │   ├── ui/                 # Komponen UI Dasar (Form, Button, Modal, Badge)
│   │   ├── charts/             # Komponen grafik (APBDesChart, DemografiChart, dll.)
│   │   ├── map/                # Komponen Peta GIS (LeafletMap, AssetMarker, TaxHeatmap)
│   │   └── common/             # Komponen umum (Sidebar, Header, Footer, Clock, Weather)
│   │
│   ├── pages/                  # Halaman Aplikasi Utama
│   │   ├── Login.tsx           # Halaman Masuk Aplikasi
│   │   ├── Dashboard.tsx       # Halaman Dasbor Eksekutif (Bento Layout)
│   │   ├── Population.tsx      # Manajemen & Visualisasi Kependudukan
│   │   ├── Attendance.tsx      # Pemantauan Kehadiran Perangkat Desa
│   │   ├── Letters.tsx         # Layanan Persuratan Digital & Tanda Tangan
│   │   ├── TaxMonitor.tsx      # Dasbor Pajak PBB & Rute Kolektor
│   │   ├── Finance.tsx         # Transparansi APBDes & Realisasi Anggaran
│   │   ├── Projects.tsx        # Monitoring Proyek Fisik & Pembangunan
│   │   ├── CCTV.tsx            # Grid Streaming CCTV Desa
│   │   ├── Assets.tsx          # Manajemen Inventarisasi & Aset Desa
│   │   └── Complaints.tsx      # Pengelolaan Laporan Keluhan Warga
│   │
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useAuth.ts          # Hook manajemen sesi otentikasi & peran user
│   │   ├── useFirestore.ts     # Hook pembungkus operasi CRUD Firestore
│   │   ├── useWorkspace.ts     # Hook integrasi Google Sheets & Drive
│   │   ├── useWeather.ts       # Hook fetching data cuaca & mitigasi cuaca
│   │   └── useAI.ts            # Hook komunikasi asisten pintar Gemini
│   │
│   ├── services/               # Integrasi API & Inisialisasi SDK
│   │   ├── firebase.ts         # Konfigurasi & Inisialisasi Firebase App
│   │   ├── googleWorkspace.ts  # Layanan OAuth & API Call Workspace
│   │   └── gemini.ts           # Konfigurasi SDK AI Gemini
│   │
│   └── utils/                  # Fungsi Helper & Formatters
│       ├── formatter.ts        # Helper format Rupiah, Tanggal, Angka Kependudukan
│       └── mockData.ts         # Generator data dummy komprehensif untuk fallback luring
```

---

### 10. Struktur Firestore Collections & Subcollections (Database Schema)
Untuk mendukung skalabilitas, fleksibilitas kueri, dan mode luring, skema database dirancang sebagai berikut:

#### a. Koleksi `users`
*Menyimpan informasi perangkat desa yang terdaftar.*
```json
{
  "uid": "USER_ID_123",
  "email": "sekdes.srimulyo@easydes.id",
  "displayName": "Budi Setiawan",
  "role": "Secretary",
  "dusunId": "dusun_01",
  "phoneNumber": "081234567890",
  "photoURL": "https://firebasestorage.com/.../budi.jpg",
  "createdAt": "2026-07-20T00:00:00Z"
}
```

#### b. Koleksi `citizens`
*Menyimpan master data kependudukan desa.*
```json
{
  "nik": "3404123456780001",
  "noKK": "3404123456781111",
  "fullName": "Slamet Rahardjo",
  "gender": "Male",
  "birthPlace": "Sleman",
  "birthDate": "1980-05-12",
  "address": "RT 02 RW 01 Dusun Krajan",
  "dusunId": "dusun_01",
  "education": "SMA",
  "occupation": "Tani",
  "poorStatus": true,
  "aidRecipients": ["PKH", "BLT"],
  "location": {
    "lat": -7.712345,
    "lng": 110.412345
  },
  "status": "Alive" // Alive, Deceased, Migrated
}
```

#### c. Koleksi `attendance`
*Menyimpan log kehadiran harian aparatur desa.*
```json
{
  "attendanceId": "att_20260720_USER_123",
  "uid": "USER_ID_123",
  "date": "2026-07-20",
  "checkIn": "2026-07-20T07:15:23Z",
  "checkOut": "2026-07-20T16:02:11Z",
  "status": "Present", // Present, Late, Leave, Absent
  "location": {
    "lat": -7.714522,
    "lng": 110.413211
  },
  "notes": "Hadir tepat waktu di balai desa"
}
```

#### d. Koleksi `letters`
*Mengelola alur surat administrasi desa.*
```json
{
  "letterId": "LET-202607-0042",
  "letterNo": "140/042/SRM/VII/2026",
  "title": "Surat Keterangan Usaha (SKU)",
  "applicantNIK": "3404123456780001",
  "applicantName": "Slamet Rahardjo",
  "type": "Incoming", // Incoming, Outgoing
  "status": "Completed", // Pending, Verified, Completed
  "requestedAt": "2026-07-19T09:00:00Z",
  "completedAt": "2026-07-20T02:00:00Z",
  "signedBy": "USER_ID_HEAD_OF_VILLAGE",
  "qrVerificationCode": "VER-9821-SKU",
  "fileURL": "https://firebasestorage.com/.../sku_slamet.pdf"
}
```

#### e. Koleksi `tax`
*Menampung basis data pembayaran PBB desa.*
```json
{
  "nop": "34.04.120.012.001-0042.0",
  "nik": "3404123456780001",
  "taxpayerName": "Slamet Rahardjo",
  "amount": 150000,
  "status": "Unpaid", // Paid, Unpaid
  "dusunId": "dusun_01",
  "collectorId": "USER_ID_COLLECTOR_1",
  "location": {
    "lat": -7.712345,
    "lng": 110.412345
  },
  "paidAt": null
}
```

#### f. Koleksi `projects`
*Menyimpan data pembangunan fisik desa.*
```json
{
  "projectId": "PROJ-2026-003",
  "name": "Pavingisasi Jalan Lingkungan Dusun Krajan",
  "budget": 75000000,
  "expenditure": 72000000,
  "contractor": "CV Sinar Mandiri",
  "progress": 85, // Persentase progres
  "startDate": "2026-05-10",
  "endDate": "2026-08-10",
  "location": {
    "lat": -7.713888,
    "lng": 110.411111
  },
  "photoBefore": "https://firebasestorage.com/.../proj3_before.jpg",
  "photoAfter": "https://firebasestorage.com/.../proj3_after.jpg",
  "status": "On Progress" // Planned, On Progress, Completed, Delayed
}
```

#### g. Koleksi `complaints`
*Menyimpan pengaduan masyarakat.*
```json
{
  "complaintId": "COMP-9831",
  "reporterName": "Agus Salim",
  "category": "Infrastruktur", // Jalan rusak, Lampu mati, Sampah, dll.
  "title": "Lubang Besar di Jembatan Krajan Kidul",
  "description": "Lubang sedalam 20cm membahayakan pengendara motor di malam hari.",
  "location": {
    "lat": -7.715111,
    "lng": 110.416222
  },
  "photoURL": "https://firebasestorage.com/.../complaint9831.jpg",
  "status": "In Progress", // Submitted, In Progress, Resolved
  "createdAt": "2026-07-18T14:30:00Z",
  "responseTimeHours": 12
}
```

#### h. Koleksi `assets`
*Menyimpan inventaris dan aset fisik desa.*
```json
{
  "assetId": "AST-LAND-01",
  "name": "Tanah Kas Desa - Area Pertanian Krajan",
  "type": "Land", // Land, Building, Vehicle, Equipment, Inventory
  "value": 1200000000,
  "condition": "Good", // Good, Minor Damage, Hard Damage
  "location": {
    "lat": -7.711100,
    "lng": 110.410100
  },
  "qrTrackingCode": "QR-AST-LAND-01",
  "registeredAt": "2022-01-15"
}
```

---

### 11. Struktur Google Sheets yang Akan Digunakan (Google Sheets Schema)
Sebagai media cadangan data (backup) dan sinkronisasi laporan yang ramah bagi pengguna awam, sebuah Spreadsheet Google Sheets bertajuk **`EasyDes_Master_Database`** akan dibuat dengan lembar kerja (Tab/Sheet) sebagai berikut:

1. **Tab `Penduduk`:**
   *Kolom:* `NIK` | `No_KK` | `Nama_Lengkap` | `Gender` | `Tanggal_Lahir` | `Pekerjaan` | `Status_Miskin` | `Penerima_Bantuan` | `Sektor_Pendidikan` | `Dusun`
2. **Tab `Presensi_Aparatur`:**
   *Kolom:* `ID_Presensi` | `Nama_Aparatur` | `Role` | `Tanggal` | `Jam_Masuk` | `Jam_Keluar` | `Status` | `Catatan`
3. **Tab `Keuangan_APBDes`:**
   *Kolom:* `Tahun_Anggaran` | `Sektor` | `Kategori` (Pendapatan/Belanja) | `Sub_Kategori` | `Target_Anggaran` | `Realisasi` | `Sisa_Anggaran`
4. **Tab `Pajak_PBB`:**
   *Kolom:* `NOP` | `Nama_Wajib_Pajak` | `Dusun` | `Jumlah_Tagihan` | `Status_Bayar` | `Tanggal_Bayar` | `Kolektor`
5. **Tab `Proyek_Pembangunan`:**
   *Kolom:* `ID_Proyek` | `Nama_Kegiatan` | `Sumber_Dana` | `Pagu_Anggaran` | `Realisasi` | `Persentase_Fisik` | `Pelaksana` | `Tanggal_Selesai`

---

### 12. Struktur Google Drive (Google Drive Directory Structure)
Penyimpanan file arsip PDF dan dokumen pendukung diorganisasi secara hierarkis di Google Drive dalam folder utama bernama **`EasyDes_Village_Repository`**:
```
/EasyDes_Village_Repository/
├── 01_Surat_Administrasi/      # File PDF dari Modul Persuratan Digital
│   ├── Masuk/                  # Arsip surat dinas yang diterima desa
│   └── Keluar/                 # Draf dan surat yang ditandatangani digital
├── 02_Dokumentasi_Proyek/      # Foto-foto Before-After konstruksi fisik desa
│   ├── Proyek_2026/
│   └── Proyek_Lalu/
├── 03_Laporan_Bulanan/         # Hasil ekspor PDF laporan performa bulanan Command Center
└── 04_Inventaris_Aset/         # Daftar rincian aset dan gambar QR Code label aset
```

---

### 13. Daftar Reusable Components (Reusable Components List)
1. **`BentoContainer`**: Komponen pembungkus grid bento utama yang responsif.
2. **`BentoItem`**: Komponen sel grid bento individual yang mendukung transisi *Framer Motion* hover dan entri.
3. **`MetricBadge`**: Lencana kecil untuk menyajikan metrik pertumbuhan penduduk atau persentase realisasi pajak dengan indikator warna statis (Green/Yellow/Red).
4. **`KpiIndicator`**: Visualisasi mirip speedometer atau diagram donat ringkas untuk performa aparat, kepuasan warga, atau penyerapan anggaran.
5. **`InteractiveLeafletMap`**: Komponen peta Leaflet yang dapat dikonfigurasi layernya menggunakan prop khusus (Assets, CCTV, Projects, Heatmaps).
6. **`DataViewerTable`**: Komponen tabel terintegrasi berbasis TanStack Table untuk pencarian warga, wajib pajak, atau log presensi dengan fitur filter cepat, ekspor instan, dan paginasi virtual.
7. **`MediaViewer`**: Komponen modal responsif untuk memutar video CCTV desa secara live-stream simulatif atau melihat dokumentasi foto *Before-After*.
8. **`ChatInterface`**: Panel chatbot asisten AI untuk memproses query teks maupun input suara (voice command ready).
9. **`ClockWidget`**: Jam analog/digital real-time yang memuat tanggal lokal dan indikator waktu kerja aktif.
10. **`WeatherWidget`**: Panel prakiraan cuaca lokal komprehensif dengan parameter peringatan dini bencana alam.

---

### 14. Daftar Halaman yang Akan Dibuat (Pages and Views)
1. **Halaman `Login`:** Sederhana, elegan, mengadopsi elemen visual glassmorphism dengan ilustrasi lanskap desa modern.
2. **Halaman `Dashboard (Command Center Board)`:** Tampilan utama bento grid yang dioptimalkan untuk TV 55-inch. Menampilkan agregasi data cuaca, KPI aparat, penyerapan dana, peta batas desa, aduan terbaru, dan antrean persuratan dalam satu layar terpadu tanpa scrolling berat.
3. **Halaman `Population Desk`:** Panel manajemen data penduduk, grafik piramida penduduk, tabulasi data warga prasejahtera.
4. **Halaman `Attendance Monitoring`:** Log visual presensi harian aparatur, statistik tingkat keterlambatan per minggu, peta penanda posisi check-in aparat.
5. **Halaman `Letter Center`:** Daftar permohonan surat masuk, tombol buat draf surat cerdas (diintegrasikan dengan AI Gemini), dan generator tanda tangan kode QR.
6. **Halaman `APBDes Dashboard`:** Visualisasi laporan keuangan komprehensif, sisa kas, grafik belanja modal per dusun.
7. **Halaman `Tax Command`:** Peta geospasial wajib pajak, formulir pencarian NOP/Nama wajib pajak, rute penagihan kolektor.
8. **Halaman `Village Development`:** Timeline pengerjaan fisik desa, grid dokumentasi foto progres, peta sebaran titik proyek.
9. **Halaman `CCTV Dashboard`:** Tata letak grid multifungsi (2x2 atau 3x3) kamera pemantau langsung lingkungan strategis desa.
10. **Halaman `Asset Management`:** Tabel daftar aset desa, pelacakan kondisi fisik, ekspor label barcode/QR untuk inventarisasi.
11. **Halaman `Complaint Desk`:** Log tiket pengaduan masyarakat, diagram kategorisasi aduan, status penanganan tiket oleh kepala dusun.

---

### 15. Daftar API dan Service (Services & API Gateways)
Aplikasi menggunakan pola arsitektur full-stack dengan perantara backend Express (Vite Middleware) untuk mengamankan API key sensitif:
- **`GoogleAuthService`**: Mengelola token OAuth2 dan izin otorisasi untuk Google Workspace.
- **`FirestoreService`**: Melakukan operasi CRUD real-time dan konfigurasi query caching.
- **`GoogleSheetsService`**: Menyediakan endpoint `/api/sync-sheets` untuk ekspor/impor batch data kependudukan dan keuangan.
- **`GoogleDriveService`**: Menyediakan endpoint `/api/upload-archive` untuk memindahkan salinan PDF surat resmi ke folder Google Drive yang sesuai.
- **`GeminiAIService`**: Menyediakan endpoint `/api/ai-assistant` untuk berkomunikasi secara aman dengan model `gemini-2.5-flash` tanpa membocorkan kunci rahasia API ke klien.
- **`OpenWeatherService`**: Menyediakan data cuaca real-time lokal desa melalui koordinat geospasial desa.

---

### 16. Daftar Custom Hooks (Custom React Hooks)
- **`useAuth()`**: Mengakses data pengguna login saat ini, mengecek hak peran (*role checking*), dan mendeteksi masa berlaku sesi.
- **`useCollection(collectionName, queryConstraints)`**: Sinkronisasi data real-time Firestore otomatis lengkap dengan dukungan fallback data luring jika terjadi putus koneksi.
- **`usePbbTracker(nop)`**: Mengambil data wajib pajak, melacak progres pembayaran PBB, dan menghitung persentase target dusun terkait.
- **`useLetterWorkflow()`**: Mengelola siklus pengajuan surat, pembuatan QR verifikasi, dan penulisan PDF dinamis.
- **`useAISearch()`**: Mengirimkan kata kunci suara atau teks dari user, memprosesnya dengan model Gemini, dan mengembalikan data analisis terstruktur (seperti grafik/tabel yang siap dirender).

---

### 17. State Management yang Digunakan (Global State Management)
Untuk mempertahankan kesederhanaan, kecepatan render, dan integrasi yang erat dengan React, platform menggunakan kombinasi:
1. **React Context API**: Digunakan untuk menyimpan state yang jarang berubah namun krusial di seluruh pohon komponen, seperti:
   - Status otentikasi pengguna (`authContext`).
   - Preferensi bahasa dan konfigurasi tema (Bento Slate Dark vs Light Mode).
2. **Local State (useState/useReducer)**: Digunakan untuk mengelola filter, input form pencarian, kontrol modal dialog, dan status pemutaran stream CCTV secara mandiri di tingkat halaman.
3. **Firestore Offline Persistence Engine**: Firebase secara otomatis bertindak sebagai state-manager lokal tersinkronisasi, menyimpan perubahan luring dalam IndexedDB, sehingga developer tidak perlu mengimplementasikan pustaka eksternal yang rumit untuk redundansi luring.

---

### 18. Routing Aplikasi (Application Routing Layout)
Sistem navigasi dikelola menggunakan router SPA berbasis komponen kondisional dengan jalur proteksi tinggi:
- **`Route: /login`**: Publik, namun mengalihkan user ke `/dashboard` jika sesi aktif terdeteksi.
- **`Route: /dashboard`**: Terproteksi (memerlukan login).
- **`Route: /population`**: Terproteksi (memerlukan role: *Admin, Secretary, Village Head*).
- **`Route: /attendance`**: Terproteksi (memerlukan role: *Aparatur Desa*).
- **`Route: /letters`**: Terproteksi. Warga umum hanya dapat melihat permohonan pribadinya, operator dapat menyusun draf, kepala desa dapat memberikan persetujuan digital.
- **`Route: /finance`**: Publik terfilter (warga umum hanya melihat transparansi diagram APBDes; bendahara dapat mengedit masukan/pengeluaran).
- **`Route: /tax-monitor`**: Terproteksi (memerlukan role: *Aparatur, Tax Collector*).
- **`Route: /gis-map`**: Terproteksi / Publik Terbatas.
- **`Route: /complaints`**: Terproteksi.

---

### 19. Strategi Keamanan (Security and Threat Mitigation Strategy)
1. **Aturan Firestore yang Ketat (Firestore Rules)**:
   Menerapkan aturan validasi tingkat lanjut pada berkas `firestore.rules`. Sebagai contoh, mencegah penulisan data penduduk kecuali user memiliki role `Admin` atau `Secretary`.
2. **API Proxy Server-Side**:
   Kunci API untuk Gemini AI dan OpenWeather API disimpan dengan aman di environment variabel server (`.env.example`). Klien React tidak boleh memanggil Gemini API secara langsung, melainkan harus melewati rute `/api/ai-assistant` Express.
3. **Sanitasi QR-Code**:
   Kode QR tanda tangan surat digital berisi muatan hash tanda tangan kriptografis yang diverifikasi oleh server, mencegah pemalsuan dokumen manual oleh pihak tidak berwenang.

---

### 20. Strategi Backup Data (Data Backup Strategy)
1. **Sinkronisasi Berkala Google Sheets**:
   Setiap kali terjadi pembaruan data kependudukan atau transaksi pajak di Firestore, trigger backend akan memicu pembaharuan baris baris data pada Google Sheets yang terkait.
2. **Ekspor Backup Harian (JSON/CSV Archive)**:
   Sistem menyediakan fungsi ekspor batch cadangan database dalam format JSON terkompresi yang disimpan di Google Drive (`/EasyDes_Village_Repository/03_Laporan_Bulanan/Backup/`).

---

### 21. Strategi Offline Mode (Offline Mode Strategy)
Desa di daerah pelosok sering kali mengalami gangguan jaringan internet. EasyDes mereduksi kendala tersebut melalui:
- **Firestore Local Cache Activation**: Mengaktifkan offline persistence pada inisialisasi Firebase SDK. Hal ini memungkinkan petugas desa tetap dapat menginput data PBB, presensi aparatur, dan keluhan baru saat berada di lapangan (offline).
- **Event Queue Sync**: Saat koneksi internet pulih kembali, Firebase SDK secara otomatis menyelaraskan antrean transaksi lokal ke database Firestore pusat tanpa kehilangan konsistensi data (*conflict resolution: last-write wins*).

---

### 22. Strategi Sinkronisasi Google Sheets ↔ Firebase (Integration Strategy)
1. **Firestore to Google Sheets (One-Way Realtime Push)**:
   Sistem mendengarkan perubahan dokumen pada koleksi `citizens`, `finance`, dan `tax`. Backend Express akan melakukan pembaruan baris data di Google Sheets API menggunakan pengidentifikasi unik dokumen (seperti NIK atau NOP) untuk memastikan data Google Sheets selalu mutakhir.
2. **Google Sheets to Firestore (Manual Import Trigger)**:
   Aparatur desa sering kali lebih nyaman mengedit data massal melalui Excel/Google Sheets. EasyDes memfasilitasi hal ini dengan menyediakan tombol "Sinkronisasi dari Google Sheets" di Panel Admin. Menekan tombol ini memicu proses impor batch, membaca spreadsheet, memvalidasi data (misalnya keabsahan panjang NIK), lalu memperbarui koleksi di Firestore.

---

### 23. Roadmap Pengembangan Menjadi Beberapa Fase (Development Roadmap)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             ROADMAP IMPLEMENTASI                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [ FASE 01: ARSITEKTUR CORE & DATA MOCKING ]                                │
│  - Penyiapan struktur folder modular dan inisialisasi Firebase SDK.        │
│  - Pembuatan data mock komprehensif untuk seluruh koleksi Firestore.         │
│  - Desain layout Bento Grid utama dasbor eksekutif dengan animasi mikro.    │
│  - Durasi: Hari 1 - 3                                                       │
│                                                                             │
│                               ▼                                             │
│                                                                             │
│  [ FASE 02: PETA GIS, PRESENSI & PERSURATAN ]                               │
│  - Integrasi Leaflet Map dengan marker cluster aset, dusun, dan wajib pajak. │
│  - Pengembangan modul presensi aparat bersimulasi GPS dan web-camera.       │
│  - Modul persuratan lengkap dengan cetak PDF dinamis dan verifikator QR.    │
│  - Durasi: Hari 4 - 7                                                       │
│                                                                             │
│                               ▼                                             │
│                                                                             │
│  [ FASE 03: INTEGRASI AI, WORKSPACE & FINISHING ]                           │
│  - Implementasi chatbot asisten AI Gemini terenkripsi via server-side API.  │
│  - Pembuatan integrasi sinkronisasi Google Sheets & Google Drive.           │
│  - Pengujian keamanan Firebase Security Rules dan finalisasi ekspor PDF.    │
│  - Durasi: Hari 8 - 10                                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

*Blueprint ini disetujui untuk diimplementasikan sepenuhnya pada iterasi kode berikutnya.*
