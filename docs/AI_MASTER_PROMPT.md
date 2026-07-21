# AI_MASTER_PROMPT.md
# EasyDes Smart Village Command Center
Version : 1.0
Status : MASTER DEVELOPMENT RULES

---

# PROJECT IDENTITY

Nama Aplikasi:
EasyDes Smart Village Command Center

Lokasi Implementasi:
Desa Bongas Kulon
Kecamatan Sumberjaya
Kabupaten Majalengka
Provinsi Jawa Barat
Indonesia

Target Pengguna:
- Kepala Desa
- Sekretaris Desa
- Bendahara
- Kasi Pemerintahan
- Kasi Pelayanan
- Kasi Kesejahteraan
- Kepala Dusun
- Operator Desa
- Kolektor PBB
- BPD
- Masyarakat

Target Platform:
- Android Browser
- Desktop Browser
- Progressive Web App (PWA)

Target Biaya:
GRATIS

Hosting:
Vercel / Netlify

Repository:
GitHub

Database:
Firebase Firestore

Authentication:
Firebase Authentication

Storage:
Firebase Storage

Backup:
Google Drive

---

# MAIN OBJECTIVE

Aplikasi ini BUKAN demo.

Aplikasi ini adalah Sistem Informasi Pemerintahan Desa yang akan benar-benar digunakan di Desa Bongas Kulon.

Semua implementasi harus production-ready.

Tidak boleh membuat fitur hanya untuk tampilan.

Semua tombol harus memiliki fungsi.

Semua data harus dapat disimpan.

Semua data harus dapat diubah.

Semua data harus dapat dihapus.

Semua data harus dapat dicari.

Semua data harus dapat difilter.

---

# PRIMARY DATA SOURCE

Gunakan hanya data resmi berikut.

1. Prodeskel Kemendagri

2. APBDes

3. RPJMDes

4. RKPDes

5. PBB Desa

6. Data Kependudukan

7. Data Inventaris Desa

8. Data Surat Desa

9. Data Pembangunan

10. Data Bongas Kulon

JANGAN membuat data fiktif jika data asli sudah tersedia.

---

# UI STANDARD

Gunakan desain:

Premium Command Center

Modern Government Dashboard

Dark Mode Default

Glassmorphism

Bento Grid

High Contrast

Responsive

Mobile First

Touch Friendly

Android Optimized

55 Inch Dashboard Compatible

---

# CODING STANDARD

Gunakan:

React

TypeScript

Vite

Repository Pattern

SOLID Principle

Context API

Reusable Components

Lazy Loading

Dynamic Import

Error Boundary

Loading Boundary

Toast Notification

Strict Type Checking

---

# DEVELOPMENT RULES

Sebelum mengubah kode:

1.
Analisa dampak perubahan.

2.
Jangan menghapus fitur lama.

3.
Jangan mengubah struktur folder tanpa alasan.

4.
Jangan membuat file duplikat.

5.
Gunakan komponen yang sudah ada.

6.
Gunakan repository yang sudah ada.

7.
Gunakan interface yang sudah ada.

8.
Jangan mengubah nama TypeScript Interface tanpa alasan.

9.
Jangan menghapus Context.

10.
Jangan memecahkan fitur yang sudah berjalan.

---

# DATA RULES

Semua CRUD wajib.

Create

Read

Update

Delete

Search

Filter

Sorting

Pagination

Validation

Audit Log

Timestamp

User Tracking

---

# FIREBASE RULES

Jika Firebase aktif:

Gunakan Firestore.

Jika Firebase belum aktif:

Gunakan LocalStorage Repository.

Perubahan UI tidak boleh dipengaruhi jenis database.

RepositoryFactory adalah satu-satunya tempat memilih database.

---

# PERFORMANCE RULES

Target:

Build Success

No Infinite Loop

No Memory Leak

No Duplicate Render

Lazy Load

Chunk Split

Bundle sekecil mungkin.

Optimalkan untuk Android.

---

# SECURITY RULES

Gunakan RBAC.

Admin

Kepala Desa

Sekretaris

Operator

Bendahara

Kasi

Kadus

Kolektor

Semua hak akses harus melalui ProtectedRoute.

---

# IMPLEMENTATION PRIORITY

1.
Stabilitas

2.
Bug Fix

3.
CRUD

4.
Firebase

5.
Integrasi Data Bongas Kulon

6.
Optimasi

7.
PWA

8.
Offline Mode

---

# DO NOT

JANGAN:

Menghapus fitur.

Menghapus halaman.

Menghapus Context.

Menghapus Repository.

Mengubah struktur tanpa alasan.

Menggunakan data dummy jika data asli tersedia.

Mengubah UI hanya demi estetika.

Mengatakan pekerjaan selesai padahal masih ada bug.

---

# DEFINITION OF DONE

AI TIDAK BOLEH mengatakan pekerjaan selesai jika:

Masih ada tombol mati.

Masih ada menu kosong.

Masih ada TODO.

Masih ada FIXME.

Masih ada mock data.

Masih ada console error.

Build gagal.

TypeScript gagal.

CRUD belum lengkap.

Repository belum digunakan.

---

# BEFORE EVERY TASK

Selalu lakukan urutan berikut:

1.
Audit

2.
Planning

3.
Implementation

4.
Testing

5.
Documentation

6.
Commit Summary

---

# OUTPUT FORMAT

Setiap selesai bekerja AI WAJIB memberikan:

## Ringkasan

## File yang diubah

## Dampak perubahan

## Risiko

## Cara menguji

## Status

---

# GITHUB RULE

Setiap perubahan harus:

Tidak merusak build.

Tidak merusak fitur lain.

Memperbarui CHANGELOG.md.

Memperbarui PROJECT_AUDIT.md jika diperlukan.

---

# FINAL INSTRUCTION

Anggap repository GitHub ini sebagai sumber utama proyek.

Seluruh pengembangan harus mempertahankan arsitektur yang sudah ada.

Prioritaskan kualitas kode, stabilitas, dokumentasi, dan kesiapan produksi.

Jika menemukan bug atau inkonsistensi, laporkan terlebih dahulu sebelum melakukan perubahan.

Jangan mengubah sesuatu hanya karena bisa. Ubah hanya jika memberikan peningkatan yang jelas dan tidak merusak sistem yang sudah berjalan.