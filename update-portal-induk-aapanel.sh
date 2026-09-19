#!/bin/bash
# =====================================================================
# UPDATE PORTAL INDUK — arsipdigital-inspektorat.com
# Mengintegrasikan Pintu Gerbang Ekosistem KKA Digital & Layanan APIP
# Inspektorat Daerah Kabupaten Rokan Hilir
# =====================================================================

set -e

echo "=========================================================="
echo " [1/4] Mencari lokasi folder website Portal Induk..."
echo "=========================================================="

SITE_DIR=""
if [ -d "/www/wwwroot/arsip-hub" ]; then
    SITE_DIR="/www/wwwroot/arsip-hub"
elif [ -d "/www/wwwroot/arsipdigital-inspektorat.com" ]; then
    SITE_DIR="/www/wwwroot/arsipdigital-inspektorat.com"
else
    SITE_DIR=$(find /www/wwwroot -maxdepth 5 -name "branding.js" 2>/dev/null | head -1 | sed 's|/frontend/src/lib/branding.js||')
fi

if [ -z "$SITE_DIR" ] || [ ! -d "$SITE_DIR" ]; then
    echo "❌ Folder portal induk tidak ditemukan di /www/wwwroot."
    exit 1
fi

echo "✔ Folder portal terdeteksi di: $SITE_DIR"

echo "=========================================================="
echo " [2/4] Melakukan backup build frontend lama..."
echo "=========================================================="
STAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/www/backup-arsip-hub/build-$STAMP"
mkdir -p "$BACKUP_DIR"
if [ -d "$SITE_DIR/frontend/build" ]; then
    cp -rf "$SITE_DIR/frontend/build" "$BACKUP_DIR/" 2>/dev/null || true
    echo "✔ Backup build disimpan di: $BACKUP_DIR"
fi

echo "=========================================================="
echo " [3/4] Menarik kode terbaru dari GitHub..."
echo "=========================================================="
cd "$SITE_DIR"
git fetch origin main
git reset --hard origin/main
echo "✔ Kode terbaru berhasil ditarik."

echo "=========================================================="
echo " [4/4] Melakukan build frontend React..."
echo "=========================================================="
cd "$SITE_DIR/frontend"

if command -v yarn >/dev/null 2>&1; then
    echo "Menjalankan yarn build..."
    yarn build
elif command -v npm >/dev/null 2>&1; then
    echo "Menjalankan npm run build..."
    npm run build
else
    echo "❌ yarn atau npm tidak ditemukan di PATH."
    exit 1
fi

echo "=========================================================="
echo "✔ Izin akses direktori build..."
echo "=========================================================="
chmod -R 755 "$SITE_DIR/frontend/build"
chown -R www:www "$SITE_DIR/frontend/build" 2>/dev/null || true

echo ""
echo "=========================================================="
echo "🎉 SELESAI! Portal Induk Berhasil Diperbarui."
echo "Pintu Gerbang Ekosistem KKA Digital telah aktif."
echo "Kunjungi: https://arsipdigital-inspektorat.com"
echo "=========================================================="
