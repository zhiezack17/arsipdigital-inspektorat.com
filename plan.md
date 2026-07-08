# plan.md — Portal Dashboard Inspektorat (arsipdigital-inspektorat.com)

## 1) Objectives
- Membangun portal dashboard institusi pemerintah yang modern-formal untuk **Inspektorat Kabupaten Rokan Hilir**.
- Menyediakan **akses terpusat** ke aplikasi: **E-Arsip Irban I, E-Arsip Irban IV, dan KKA**, serta menampilkan Irban II/III/V sebagai **“Segera Hadir”**.
- Mengamankan akses dengan **Login wajib** (tanpa registrasi mandiri) dan **RBAC 2 role**: **Admin** & **Auditor** (JWT + password hash).
- Menyediakan **Admin Panel** untuk kelola user, berita/pengumuman (CRUD), statistik ringkas (manual), dan URL subdomain.

## 2) Implementation Steps

### Phase 1 — Core Build (langsung, tanpa POC terpisah)
> Aplikasi tergolong CRUD + auth sederhana; fokus membangun core flow end-to-end.

**User stories (core):**
1. Sebagai Auditor, saya ingin login agar hanya pengguna internal dapat mengakses portal.
2. Sebagai Auditor, saya ingin melihat kartu menu E-Arsip dan klik untuk menuju subdomain terkait.
3. Sebagai Auditor, saya ingin melihat pengumuman terbaru agar mendapat informasi terkini.
4. Sebagai Admin, saya ingin membuat akun Auditor tanpa fitur registrasi mandiri.
5. Sebagai Admin, saya ingin mengubah URL subdomain dari panel admin tanpa edit kode.

**Backend (FastAPI + MongoDB):**
- Setup struktur proyek, env, koneksi Mongo.
- Model/collection: `users`, `news`, `stats`, `links`.
- Auth:
  - Password hashing (passlib+bcrypt)
  - JWT login (access token), middleware/dep `get_current_user`
  - RBAC: guard admin-only endpoints
  - Seed default admin: `admin / Admin@2025`
- API endpoints (MVP):
  - Auth: `POST /auth/login`, `POST /auth/change-password`
  - Users (admin): CRUD + reset password
  - News: list (auditor/admin), CRUD (admin)
  - Stats: get (all), update (admin)
  - Links: get (all), update (admin)

**Frontend (React + Tailwind + shadcn/ui):**
- Routing: `/login`, `/dashboard`, `/admin/*`, `/profile`.
- Auth state: store JWT (httpOnly cookie bila memungkinkan; jika tidak, localStorage + axios interceptor).
- UI/Branding:
  - Header dengan 2 logo (Kab. Rokan Hilir & Inspektorat “Anggaraksa Dharma”)
  - Tema warna hijau + aksen biru/emas, tipografi formal
- Dashboard page:
  - Hero/welcome banner
  - 4 kartu statistik (manual): Total Surat Masuk, Surat Keluar, Total Arsip, Total Auditor Aktif
  - Grid menu 6 kartu: Irban I (aktif), II (Segera Hadir), III (Segera Hadir), IV (aktif), V (Segera Hadir), KKA (aktif)
  - Section Berita/Pengumuman (list ringkas + detail modal/page)
  - Footer kontak (placeholder terstruktur)

**Checkpoint:** Core flow berjalan: login → dashboard (stats + menu + news) → logout.

**Testing (E2E v1):**
- Jalankan 1 putaran uji end-to-end:
  - Login admin & auditor
  - Proteksi route (tanpa token ditolak)
  - Admin bisa CRUD user/news/stats/links
  - Auditor hanya baca news/stats & akses menu

---

### Phase 2 — V1 App Completion (Admin Panel + UX hardening)

**User stories (v1):**
1. Sebagai Admin, saya ingin mengelola berita (buat/edit/hapus) dengan editor sederhana.
2. Sebagai Admin, saya ingin mengelola statistik ringkas agar dashboard selalu up to date.
3. Sebagai Admin, saya ingin mengelola tautan subdomain agar perubahan domain tidak perlu deploy ulang.
4. Sebagai Auditor, saya ingin melihat label “Segera Hadir” jelas dan menu non-aktif tidak bisa diklik.
5. Sebagai pengguna, saya ingin mengganti password sendiri dari halaman profil.

**Admin Panel (frontend):**
- Halaman:
  - Manajemen User (list, create, edit role, reset password, delete)
  - Manajemen Berita (CRUD)
  - Manajemen Statistik (edit 4 angka)
  - Manajemen URL Subdomain (Irban1/2/3/4/5/KKA)
- UX: loading/empty/error states, toast notification, konfirmasi hapus.

**Security/Hardening:**
- CORS ketat ke domain portal.
- Rate limit login sederhana (opsional MVP) + pesan error generik.
- Validasi input (Pydantic + frontend forms).

**Testing (E2E):**
- Uji peran:
  - Auditor tidak bisa akses `/admin/*` (403/redirect)
  - Endpoint admin tidak bisa dipanggil Auditor
- Uji CRUD:
  - News create/edit/delete terlihat di dashboard
  - Update stats/links terefleksi real-time setelah refresh

---

### Phase 3 — Polishing + Deployment Readiness

**User stories (polish):**
1. Sebagai Auditor, saya ingin tampilan responsif di mobile agar mudah diakses di lapangan.
2. Sebagai Admin, saya ingin melihat audit trail ringan (siapa update apa) agar perubahan terpantau.
3. Sebagai pengguna, saya ingin sesi login berakhir otomatis saat token kedaluwarsa.
4. Sebagai Admin, saya ingin mengganti password admin default setelah login pertama.
5. Sebagai instansi, saya ingin footer berisi alamat/kontak resmi yang konsisten.

**Enhancements (opsional tapi disiapkan):**
- Audit log minimal untuk update berita/stats/links.
- Token refresh / expiry handling (atau re-login flow rapi).
- Konten halaman “Tentang/Profil” singkat.
- Placeholder siap integrasi API stats dari subdomain (tanpa implement integrasi dulu).

**Testing & Regression:**
- Regression test untuk semua flow utama.
- Review keamanan dasar (no register, RBAC ketat, hashing ok).

## 3) Next Actions
1. Mulai implementasi backend FastAPI + Mongo: schema, auth JWT, seed admin default.
2. Implementasi frontend React: login + dashboard (stats/menu/news).
3. Tambahkan Admin Panel (users/news/stats/links) dan halaman profile.
4. Lakukan 1 putaran E2E testing dan perbaiki sampai stabil.

## 4) Success Criteria
- Hanya **Admin/Auditor** yang dapat login; tidak ada registrasi mandiri.
- **RBAC** bekerja: Auditor tidak bisa akses/mengeksekusi aksi admin.
- Dashboard menampilkan **menu 6 kartu** dengan status aktif/“Segera Hadir” sesuai.
- Admin dapat **CRUD berita**, update **statistik**, dan ubah **URL subdomain** via UI.
- UI sesuai gaya **modern-formal pemerintah**, bahasa **Indonesia formal**, menampilkan **2 logo** dengan rapi.
- Semua flow utama lulus **E2E test** tanpa error kritis.