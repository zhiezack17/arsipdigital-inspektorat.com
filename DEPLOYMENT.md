# 🚀 Deployment Guide - Arsip Digital Inspektorat

## Prerequisites

1. **MongoDB Atlas Account** ✅
   - Create a free cluster at https://cloud.mongodb.com/
   - Get connection string

2. **Render Account** ✅
   - Already connected to GitHub
   - Ready to deploy

3. **GitHub Repository** ✅
   - All config files ready

---

## Step 1: Prepare MongoDB Atlas

### 1.1 Get Connection String
1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Navigate to your cluster
3. Click "Connect" → "Connect Your Application"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your database user credentials
6. Format should look like:
   ```
   mongodb+srv://myuser:mypassword@cluster0.mongodb.net/arsipdigital?retryWrites=true&w=majority
   ```

### 1.2 Create Database User (if not exists)
1. Go to Database Access
2. Click "Add New Database User"
3. Username & Password (save these!)
4. Click "Add User"

### 1.3 Whitelist IP (Network Access)
1. Go to Network Access
2. Click "Add IP Address"
3. Either:
   - Add `0.0.0.0/0` (allow all - for testing)
   - Or add Render's IP (more secure)

---

## Step 2: Delete Old Service in Render (OPTIONAL)

Anda bisa skip ini, tapi recommended untuk bersih-bersih:

1. Go to https://dashboard.render.com/
2. Click **My project** → **Production**
3. Find `e-arsip-api` service (yang Failed)
4. Click the three dots (...) → **Delete**
5. Confirm deletion

---

## Step 3: Deploy New Blueprint in Render ⭐ PENTING

### 3.1 Buka Render Dashboard
1. Go to: https://dashboard.render.com/
2. Di sebelah kiri klik: **My project**

### 3.2 Deploy from Blueprint
1. Klik button **+ New** (warna biru di atas)
2. Pilih **Blueprint**
3. GitHub account Anda akan muncul
4. Cari repo: `arsipdigital-inspektorat.com`
5. Klik repo tersebut
6. **Branch**: pastikan `main` dipilih
7. Klik **Create Blueprint**

### 3.3 Isi Environment Variables

Render akan minta input untuk environment variables. **Isi seperti ini:**

**BACKEND (arsipdigital-backend):**

| Key | Value |
|-----|-------|
| `MONGO_URL` | `mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/arsipdigital?retryWrites=true&w=majority` |
| `JWT_SECRET` | `masukkan-string-random-atau-biarkan-default` |

**Contoh MONGO_URL:**
```
mongodb+srv://admin:password123@cluster0.mongodb.net/arsipdigital?retryWrites=true&w=majority
```

**FRONTEND (arsipdigital-frontend):**
- Biarkan kosong atau skip (akan auto-filled dari backend)

### 3.4 Deploy!
1. Klik **Deploy**
2. Tunggu 5-10 menit
3. Akan ada loading bar
4. Selesai ketika ada ✅ **Deployed** di kedua service

---

## Step 4: Verify Deployment ✅

### 4.1 Cek Backend
1. Dashboard → klik **arsipdigital-backend**
2. Lihat status: harus **Deployed** (hijau)
3. Copy URL dari atas (format: `https://arsipdigital-backend.onrender.com`)
4. Buka URL di browser
5. Seharusnya muncul error 404 atau response JSON (itu normal!)

### 4.2 Cek Frontend
1. Dashboard → klik **arsipdigital-frontend**
2. Lihat status: harus **Deployed** (hijau)
3. Copy URL dari atas (format: `https://arsipdigital-frontend.onrender.com`)
4. Buka URL di browser
5. Seharusnya muncul halaman login React

---

## 🎉 Sukses! Sekarang Apa?

### Tahap Selanjutnya:
1. Test login di frontend
2. Pastikan bisa connect ke backend
3. Cek MongoDB data

### Jika Ada Error:
- **Deployment gagal?** → Lihat di **Logs** tab
- **Backend tidak bisa connect MongoDB?** → Check MONGO_URL di Environment variables
- **Frontend blank/error?** → Check browser console (F12)

---

## Troubleshooting

### Backend fails to deploy

**Error: "ModuleNotFoundError"**
- Check `backend/requirements.txt` is valid
- Ensure all dependencies are listed

**Error: "Exited with status 1"**
- Click service → **Logs** tab
- Lihat error message
- Common issues:
  - Missing `MONGO_URL` env var
  - MongoDB connection string incorrect
  - Database user doesn't have access

**Fix:**
- Balik ke **Environment** tab
- Edit variabel yang salah
- Save, Render otomatis redeploy

### Frontend fails to build

**Error: "npm ERR!" atau "yarn ERR!"**
- Check `frontend/package.json` is valid JSON
- Run locally: `cd frontend && yarn install && yarn build`

### MongoDB Connection Error

**Pesan: "Failed to connect to MongoDB"**
1. Check MongoDB Atlas:
   - Cluster aktif? 
   - Database user ada?
   - IP whitelist benar?
2. Test connection string di local:
   ```bash
   mongosh "mongodb+srv://user:pass@cluster.mongodb.net/arsipdigital"
   ```

---

## Local Development

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env dengan MongoDB URL Anda
uvicorn server:app --reload
# Akses di: http://localhost:8000
```

### Frontend
```bash
cd frontend
yarn install
cp .env.example .env.local
# Edit .env.local jika needed
yarn start
# Akses di: http://localhost:3000
```

---

## Environment Variables Reference

### Backend (backend/.env)
```env
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/dbname
DB_NAME=arsipdigital
JWT_SECRET=your-secret-key
PYTHONUNBUFFERED=1
```

### Frontend (frontend/.env.local)
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

### Production (Render)
Backend env vars di Render Environment tab, Frontend auto-filled.

---

## Common Issues & Solutions

### 1. CORS Errors (Frontend tidak bisa akses Backend)
**Error:** "Access to XMLHttpRequest blocked by CORS policy"
- Backend CORS config mungkin perlu diupdate
- Check `backend/server.py` CORS settings
- Frontend URL harus di allow list

**Fix:**
```python
# Di backend/server.py, pastikan ada:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # atau list domain specific
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. 401 Unauthorized (Login tidak bekerja)
**Error:** "401 Unauthorized"
- Check JWT_SECRET sama di backend
- Verify token dikirim di Authorization header

**Fix:**
- Pastikan `JWT_SECRET` sama di Render env var

### 3. MongoDB Connection Timeout
**Error:** "Timeout connecting to MongoDB"
1. Verify connection string di MONGO_URL
2. Check IP whitelist di MongoDB Atlas Network Access
   - Tambah `0.0.0.0/0` untuk allow all
3. Pastikan database user punya akses

### 4. Port Issues
**Error:** "Address already in use" atau "Cannot bind to port"
- Backend HARUS menggunakan `$PORT` environment variable
- Check `backend/server.py`:
```python
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
```

---

## Monitoring & Maintenance

### Check Service Status
- Dashboard → pilih service
- Lihat **Status** tab

### View Logs
- Dashboard → Service → **Logs** tab
- Search dengan keywords
- Useful untuk debugging

### Auto-Redeploy on GitHub Push
Render otomatis redeploy ketika:
- Push ke branch `main`
- Atau manual trigger di Dashboard

---

## Next Steps

1. ✅ Deploy blueprint ke Render
2. ✅ Test backend & frontend
3. 📝 Setup custom domain (optional)
4. 🔒 Monitor dengan Render alerts (optional)
5. 📊 Integrate Emergent Agent if needed

---

## Support & Help

**Untuk bantuan lebih lanjut:**
1. Check Render docs: https://render.com/docs
2. Check MongoDB Atlas docs: https://docs.mongodb.com
3. Check FastAPI docs: https://fastapi.tiangolo.com/
4. Check React docs: https://react.dev/

---

**Generated:** 2026-07-08  
**Stack:** FastAPI + React + MongoDB Atlas + Render  
**Status:** Ready for production deployment

Semangat! 🚀
