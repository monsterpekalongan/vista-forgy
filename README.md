# 🏭 Vista Forgy (VF-1.0-REACT)

**Gym Otak Logika & Matematika Industri** — Aplikasi Web Statis SPA (React + Vite + TypeScript Strict).

Vista Forgy diciptakan untuk melatih refleks logika, matematika industri, kalkulus, dan riset operasi hingga level "di luar kepala" melalui repetisi berkualitas dengan generator soal prosedural.

---

## 🚀 Panduan Penggunaan & Pengembangan

### 1. Instalasi Dependency
```bash
npm install
```

### 2. Jalankan Server Dev
```bash
npm run dev
```

### 3. Build Production (Single File SPA Statis)
```bash
npm run build
```
Hasil build berada di folder `dist/` dan siap dideploy langsung ke GitHub Pages, Netlify, atau dibuka via `file://`.

### 4. Jalankan Unit & Property-Based Tests
```bash
npx vitest run
```

---

## 🏗️ Struktur Arsitektur Proyek

```
/src
  /crypto      ← Module Web Crypto (.fgy AES-GCM + PBKDF2 250k) - TS Murni
  /engine      ← QuestionForge: Mesin generator prosedural, solver & verifikator - TS Murni
  /scheduler   ← FSRS-lite SRS engine, antrian harian, decay, Sharpness Score - TS Murni
  /progression ← Ujian Promosi, Cooldown 48 jam, Elo rating, Boss Battle - TS Murni
  /storage     ← SaveSystem localStorage, snapshot rotasi 7 hari, crash resume - TS Murni
  /content     ← Skill Tree (200+ node), Kartu Konsep KaTeX, Humor KOA - TS Murni
  /audio       ← WebAudio Synth Engine (tanpa file aset eksternal)
  /visual      ← KOA 3D Scene (Three.js), Pabrik Mini Isometrik, 8 Chart SVG Interaktif
  /ui          ← Komponen & 10 Layar Utama (Beranda, Runner, Peta, Ujian, Stats, Data, Pengaturan, Onboarding)
  /tests       ← Property-based tests (fast-check) & Unit tests (vitest)
  App.tsx      ← Shell Aplikasi & Navigasi Responsive (Bottom Bar / Sidebar)
  main.tsx     ← Entry point & Fontsource bundler
```

---

## 📋 Hasil Protokol Verifikasi Internal (Trace Protocol 12.8)

1. **(a) Sesi Lengkap (Warm-up → Review → Fokus → Summary):** Lolos. Progres & statistik tersimpan otomatis ke `localStorage` (`vf.save`).
2. **(b) Siklus SRS FSRS-Lite (Hari 1 → Hari 3):** Lolos. Retrievability $R(t,S)$ terhitung secara matematis dan mengatur antrian harian otomatis.
3. **(c) Ekspor & Impor Terenkripsi (`.fgy`):** Lolos. File terenkripsi dengan AES-GCM-256 + PBKDF2 (250.000 iterasi). Fitur Merge dan Replace bekerja sempurna.
4. **(d) Ujian Promosi & Cooldown 48 Jam:** Lolos. Evaluasi gerbang mastery (90% node), volume (400 soal), skor minimum 85%, serta cooldown 48 jam jika gagal. Sertifikat lulus dapat diunduh sebagai PNG.
5. **(e) Generator Prosedural & Chart Interaktif:** Lolos. Soal selalu digenerate dari seed mulberry32 dengan solver terverifikasi + 8 diagram SVG interaktif.
6. **(f) Uji Responsif (360px ↔ 1920px):** Lolos. Tampilan menyesuaikan sempurna dari smartphone kecil hingga monitor desktop.

---

## 📜 Lisensi & Hak Cipta
Hak Cipta © 2026 Vista Forgy. Dikembangkan untuk Mahasiswa Teknik Industri & Rekan Sejawat di Indonesia.
