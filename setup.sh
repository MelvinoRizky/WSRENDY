#!/bin/bash

# Script untuk membantu setup proyek wsrendy
echo "🚀 Setup proyek wsrendy dimulai..."

# Pastikan nodejs terinstall
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak ditemukan. Silakan install Node.js terlebih dahulu."
    echo "   Kunjungi https://nodejs.org/en/download/ untuk mengunduh Node.js"
    exit 1
fi

# Cek versi Node.js
NODE_VERSION=$(node -v)
echo "✅ Node.js terdeteksi: $NODE_VERSION"

# Hapus node_modules jika ada
if [ -d "node_modules" ]; then
    echo "🧹 Menghapus node_modules lama..."
    rm -rf node_modules
fi

# Install dependensi
echo "📦 Menginstall dependensi..."
npm install

# Verifikasi bahwa next tersedia
if [ -f "node_modules/.bin/next" ]; then
    echo "✅ Next.js terinstall dengan benar"
else
    echo "❌ Next.js tidak terinstall dengan benar. Mencoba install ulang..."
    npm install next@14.2.5 --save
fi

# Fix config file untuk menghindari error __filename
if [ -f "next.config.mjs" ]; then
    echo "🔧 Memperbaiki konfigurasi Next.js..."
    # Backup file original
    cp next.config.mjs next.config.mjs.bak
    # Mengganti __filename dengan path hardcoded
    sed -i.bak 's/config: \[__filename\]/config: \["next.config.mjs"\]/' next.config.mjs
    # Atau gunakan file next.config.js jika ada
    if [ -f "next.config.js" ]; then
        echo "✅ Menggunakan next.config.js sebagai konfigurasi utama"
    fi
fi

# Coba menjalankan next
echo "🔍 Verifikasi command next..."
node node_modules/.bin/next -v

echo "🎉 Setup selesai! Jalankan 'npm run dev' untuk memulai server development"
