# plan.md — Portal Dashboard Inspektorat (arsipdigital-inspektorat.com)

## 1) Objectives
- Menyediakan **Portal Arsip Digital** yang modern-formal untuk **Inspektorat Kabupaten Rokan Hilir** sebagai **akses terpusat** ke aplikasi:
  - **E-Arsip Irban I** (aktif)
  - **E-Arsip Irban IV** (aktif)
  - **KKA (Kertas Kerja Audit)** (aktif)
  - **Irban II / III / V** ditampilkan sebagai **“Segera Hadir”**
- Mengamankan akses dengan **Login wajib** (tanpa registrasi mandiri) dan **RBAC 2 role**:
  - **Admin** (full akses: kelola user, berita, statistik, URL subdomain)
  - **Auditor** (akses dashboard, lihat berita/statistik, buka menu aplikasi aktif)
- Menyediakan fitur operasional untuk pengelolaan portal:
  - **Berita/Pengumuman** (CRUD)
  - **Statistik ringkas** (manual input; siap untuk integrasi API di masa depan)
  - **Manajemen tautan subdomain** (editable via UI)
- Status saat ini: **Portal sudah dibangun full-stack dan lulus E2E testing 100%** (backend 44/44 + verifikasi alur frontend). Siap untuk **user review** dan masuk tahap **polishing/deployment readiness**.

---

## 2) Implementation Steps

### Phase 1 — Core Build (langsung, tanpa POC terpisah) ✅ *Completed*
> Core flow end-to-end telah dibuat dan berjalan stabil.

**User stories (core) — Completed:**
1. Auditor dapat login sehingga hanya pengguna internal bisa mengakses portal.
2. Auditor melihat kartu menu E-Arsip dan membuka subdomain aktif.
3. Auditor melihat pengumuman terbaru.
4. Admin membuat akun Auditor tanpa fitur registrasi mandiri.
5. Admin mengubah URL subdomain dari panel admin tanpa edit kode.

**Backend (FastAPI + MongoDB) — Implemented:**
- DB collections: `users`, `news`, `stats`, `links`.
- Auth & Security:
  - JWT access token
  - Password hashing (bcrypt)
  - RBAC guard admin-only endpoints
  - Seed default accounts:
    - Admin: `admin / Admin@2025`
    - Auditor (testing): `auditor / Auditor@2025`
- API endpoints (delivered):
  - Auth: `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/change-password`
  - Users (admin): list/create/update/delete + reset password
  - News: list/get (authenticated), CRUD (admin)
  - Stats: get (authenticated), update (admin)
  - Links: get (authenticated), update (admin)

**Frontend (React + Tailwind + shadcn/ui) — Implemented:**
- Routing: `/login`, `/dashboard`, `/admin/*`, `/profile`.
- Auth state: JWT disimpan di localStorage + axios interceptor + redirect on 401.
- Branding & UI:
  - Header menampilkan **2 logo institusi** (Kab. Rokan Hilir + Inspektorat “Anggaraksa Dharma”).
  - Tema warna **hijau + biru/emas**, tampilan modern-formal, Bahasa Indonesia formal.
- Dashboard:
  - Welcome banner personal
  - 4 KPI statistik
  - Grid menu 6 kartu (Irban I/II/III/IV/V/KKA) dengan badge **Aktif/Segera Hadir**
  - News feed + detail dialog
  - Footer keamanan/kontak

**Checkpoint:** login → dashboard (stats + menu + news) → logout ✅

**Testing (E2E v1):** ✅
- Backend: **44/44** test API pass.
- Frontend: seluruh alur utama dan RBAC diverifikasi.

---

### Phase 2 — V1 App Completion (Admin Panel + UX hardening) ✅ *Completed*
> Admin panel lengkap telah tersedia dan teruji.

**User stories (v1) — Completed:**
1. Admin mengelola berita (buat/edit/hapus) + publikasi.
2. Admin mengelola statistik ringkas agar dashboard up-to-date.
3. Admin mengelola tautan subdomain agar perubahan domain tidak perlu deploy ulang.
4. Auditor melihat label “Segera Hadir” jelas dan menu non-aktif tidak dapat diakses.
5. Pengguna mengganti password sendiri dari halaman profil.

**Admin Panel (frontend) — Delivered:**
- `/admin/users`: CRUD user, set role, aktif/nonaktif, reset password
- `/admin/news`: CRUD berita + publish toggle
- `/admin/stats`: edit 4 angka KPI
- `/admin/links`: edit URL subdomain Irban1/2/3/4/5/KKA (URL kosong → tampil “Segera Hadir”)

**Security/Hardening — Implemented (baseline):**
- Validasi input backend (Pydantic) & frontend (form constraints).
- Proteksi route frontend:
  - Auditor tidak bisa akses `/admin/*` (redirect ke dashboard)
- Proteksi endpoint backend:
  - Admin-only endpoints mengembalikan 403 untuk auditor
  - Endpoint protected mengembalikan 401 tanpa token

**Testing (E2E):** ✅
- Role-based checks (Admin vs Auditor)
- CRUD News/Users/Stats/Links terverifikasi dan refleksi UI berjalan.

---

### Phase 3 — Polishing + Deployment Readiness ⏳ *Next*
> Menunggu masukan user; fokus pada produksi, keamanan lebih ketat, dan perapihan konten.

**User stories (polish) — Proposed:**
1. Responsif & kenyamanan mobile ditingkatkan (auditor di lapangan).
2. Admin mendapatkan penguatan keamanan (opsional): pembatasan percobaan login (rate limit) dan audit trail ringan.
3. Perapihan sesi: UX saat token kedaluwarsa (pesan re-login yang jelas).
4. Wajibkan perubahan password admin default setelah login pertama (opsional kebijakan).
5. Footer dan halaman informasi institusi dilengkapi data resmi (alamat, kontak, jam layanan).

**Enhancements (opsional):**
- Audit log minimal untuk perubahan (news/stats/links/users).
- CORS ketat ke domain portal produksi.
- Parameterisasi konfigurasi (mis. base URL, CORS origins) untuk produksi.
- Integrasi statistik otomatis via API dari subdomain (jika subdomain menyediakan endpoint) — *future work*.

**Testing & Regression (Phase 3):**
- Regression test semua flow setelah hardening.
- Verifikasi UX mobile (viewport test) + aksesibilitas (focus ring, contrast).

---

## 3) Next Actions
1. **User Review**: konfirmasi UI/brand (logo placement, warna, copy), struktur menu, dan konten footer.
2. **Keamanan Produksi**:
   - Set `CORS_ORIGINS` ke domain portal produksi.
   - Ganti `JWT_SECRET` untuk produksi.
   - (Opsional) tambah rate limiting login.
3. **Konten Resmi**:
   - Lengkapi alamat/kontak resmi Inspektorat untuk footer.
   - (Opsional) halaman “Tentang/Profil” institusi.
4. **Polish UI** (jika diperlukan): microcopy, empty states, loading skeleton konsisten.
5. **Deployment Readiness**: verifikasi environment, backup DB, dan prosedur pembuatan akun auditor oleh admin.

---

## 4) Success Criteria
✅ **Sudah tercapai (V1):**
- Hanya **Admin/Auditor** yang dapat login; tidak ada registrasi mandiri.
- **RBAC** berjalan: auditor tidak dapat mengakses admin panel maupun endpoint admin.
- Dashboard menampilkan **6 kartu menu** dengan status **Aktif/Segera Hadir** sesuai.
- Admin dapat **CRUD berita**, update **statistik**, dan ubah **URL subdomain** via UI.
- UI **modern-formal pemerintah** (Bahasa Indonesia formal) + menampilkan **2 logo** dengan rapi.
- Lulus **E2E test** tanpa bug kritis: backend **44/44** pass + alur frontend tervalidasi.

⏳ **Target tambahan (Phase 3):**
- Hardening produksi (CORS ketat, secret produksi, opsional rate limit/audit log).
- Konten institusional lengkap dan siap digunakan publik internal.
