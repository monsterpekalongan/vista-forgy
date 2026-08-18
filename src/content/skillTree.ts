// Skill Tree — Complete curriculum according to VF-1.0-REACT spec
import type { NodeConfig } from '../engine/types';

export const SKILL_NODES: NodeConfig[] = [
  // ── TIER 0: PEMANASAN ─────────────────────────────────────────────────────
  // Domain A — Aritmetika & Number Sense (12 nodes)
  { id: 'ari.tambah', name: 'Penjumlahan', family: 'ari.tambah', tier: 0, format: 'mc', targetMs: 12000, prereq: [], masteryTarget: 3, difficultyRange: [900, 1000] },
  { id: 'ari.kurang', name: 'Pengurangan', family: 'ari.kurang', tier: 0, format: 'mc', targetMs: 12000, prereq: ['ari.tambah'], masteryTarget: 3, difficultyRange: [900, 1010] },
  { id: 'ari.kali', name: 'Perkalian', family: 'ari.kali', tier: 0, format: 'mc', targetMs: 15000, prereq: ['ari.tambah'], masteryTarget: 3, difficultyRange: [920, 1050] },
  { id: 'ari.bagi', name: 'Pembagian', family: 'ari.bagi', tier: 0, format: 'mc', targetMs: 15000, prereq: ['ari.kali'], masteryTarget: 3, difficultyRange: [930, 1060] },
  { id: 'ari.campur', name: 'Operasi Campur', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 20000, prereq: ['ari.kali', 'ari.bagi'], masteryTarget: 3, difficultyRange: [950, 1080] },
  { id: 'ari.negatif', name: 'Bilangan Negatif', family: 'ari.negatif', tier: 0, format: 'mc', targetMs: 15000, prereq: ['ari.kurang'], masteryTarget: 3, difficultyRange: [970, 1050] },
  { id: 'ari.pecahan', name: 'Pecahan', family: 'ari.pecahan', tier: 0, format: 'mc', targetMs: 25000, prereq: ['ari.bagi'], masteryTarget: 3, difficultyRange: [1000, 1100] },
  { id: 'ari.desimal', name: 'Desimal', family: 'ari.desimal', tier: 0, format: 'mc', targetMs: 20000, prereq: ['ari.pecahan'], masteryTarget: 3, difficultyRange: [1010, 1090] },
  { id: 'ari.bulat', name: 'Pembulatan & Estimasi', family: 'ari.bulat', tier: 0, format: 'mc', targetMs: 15000, prereq: ['ari.desimal'], masteryTarget: 3, difficultyRange: [960, 1040] },
  { id: 'ari.persen', name: 'Persen', family: 'ari.persen', tier: 0, format: 'mc', targetMs: 20000, prereq: ['ari.pecahan'], masteryTarget: 3, difficultyRange: [1000, 1100] },
  { id: 'ari.rasio', name: 'Rasio & Proporsi', family: 'ari.rasio', tier: 0, format: 'mc', targetMs: 25000, prereq: ['ari.persen'], masteryTarget: 3, difficultyRange: [1020, 1120] },
  { id: 'ari.satuan', name: 'Konversi Satuan', family: 'ari.satuan', tier: 0, format: 'mc', targetMs: 20000, prereq: ['ari.kali', 'ari.bagi'], masteryTarget: 3, difficultyRange: [980, 1060] },

  // Domain B — Aljabar Permulaan (8 nodes)
  { id: 'alj.substitusi', name: 'Substitusi Nilai', family: 'alj.linear1', tier: 0, format: 'mc', targetMs: 25000, prereq: ['ari.campur'], masteryTarget: 3, difficultyRange: [1000, 1080] },
  { id: 'alj.suku-sejenis', name: 'Suku Sejenis', family: 'alj.linear1', tier: 0, format: 'mc', targetMs: 25000, prereq: ['alj.substitusi'], masteryTarget: 3, difficultyRange: [1010, 1090] },
  { id: 'alj.linear1', name: 'Linear 1 Langkah', family: 'alj.linear1', tier: 0, format: 'numeric', targetMs: 30000, prereq: ['alj.suku-sejenis'], masteryTarget: 3, difficultyRange: [1050, 1130] },
  { id: 'alj.linear2', name: 'Linear 2 Langkah', family: 'alj.linear2', tier: 0, format: 'numeric', targetMs: 35000, prereq: ['alj.linear1'], masteryTarget: 3, difficultyRange: [1070, 1150] },
  { id: 'alj.distributif', name: 'Aturan Distributif', family: 'alj.linear2', tier: 0, format: 'mc', targetMs: 30000, prereq: ['alj.linear2'], masteryTarget: 3, difficultyRange: [1060, 1140] },
  { id: 'alj.pertidaksamaan', name: 'Pertidaksamaan Dasar', family: 'alj.linear2', tier: 0, format: 'mc', targetMs: 35000, prereq: ['alj.linear2'], masteryTarget: 3, difficultyRange: [1080, 1160] },
  { id: 'alj.sistem-mudah', name: 'Sistem Persamaan Mudah', family: 'alj.sistem2var', tier: 0, format: 'numeric', targetMs: 45000, prereq: ['alj.pertidaksamaan'], masteryTarget: 3, difficultyRange: [1100, 1200] },
  { id: 'alj.kpk', name: 'Pemfaktoran KPK', family: 'alj.linear1', tier: 0, format: 'mc', targetMs: 30000, prereq: ['ari.pecahan'], masteryTarget: 3, difficultyRange: [1020, 1100] },

  // Domain C — Logika Dasar (8 nodes)
  { id: 'log.pernyataan', name: 'Pernyataan & Negasi', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 30000, prereq: [], masteryTarget: 3, difficultyRange: [950, 1050] },
  { id: 'log.konjungsi', name: 'Konjungsi & Disjungsi', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 30000, prereq: ['log.pernyataan'], masteryTarget: 3, difficultyRange: [980, 1080] },
  { id: 'log.implikasi', name: 'Implikasi Logic', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 35000, prereq: ['log.konjungsi'], masteryTarget: 3, difficultyRange: [1000, 1100] },
  { id: 'log.silogisme', name: 'Silogisme', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 40000, prereq: ['log.implikasi'], masteryTarget: 3, difficultyRange: [1020, 1120] },
  { id: 'log.tabel-kebenaran', name: 'Tabel Kebenaran', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 45000, prereq: ['log.implikasi'], masteryTarget: 3, difficultyRange: [1040, 1140] },
  { id: 'log.deduksi', name: 'Deduksi Siapa Benar', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 50000, prereq: ['log.silogisme'], masteryTarget: 3, difficultyRange: [1060, 1160] },
  { id: 'log.pola', name: 'Pola Barisan', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 35000, prereq: ['ari.campur'], masteryTarget: 3, difficultyRange: [1000, 1100] },
  { id: 'log.pola-gambar', name: 'Pola Urutan Angka', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 40000, prereq: ['log.pola'], masteryTarget: 3, difficultyRange: [1020, 1120] },

  // Domain D — Interpretasi Data (5 nodes)
  { id: 'dat.tabel', name: 'Baca Tabel Data', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 30000, prereq: [], masteryTarget: 3, difficultyRange: [950, 1050] },
  { id: 'dat.bar', name: 'Baca Bar Chart', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 30000, prereq: ['dat.tabel'], masteryTarget: 3, difficultyRange: [960, 1060] },
  { id: 'dat.mean', name: 'Mean Sederhana', family: 'ari.campur', tier: 0, format: 'numeric', targetMs: 35000, prereq: ['dat.tabel'], masteryTarget: 3, difficultyRange: [980, 1080] },
  { id: 'dat.median-modus', name: 'Median & Modus', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 40000, prereq: ['dat.mean'], masteryTarget: 3, difficultyRange: [1000, 1100] },
  { id: 'dat.grafik-dua', name: 'Perbandingan Grafik', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 45000, prereq: ['dat.bar'], masteryTarget: 3, difficultyRange: [1020, 1120] },

  // ── TIER 1: DASAR ─────────────────────────────────────────────────────────
  // Aritmetika Lanjut (8 nodes)
  { id: 'ari2.persen-naik', name: 'Persen Kenaikan/Penurunan', family: 'ari.persen', tier: 1, format: 'numeric', targetMs: 30000, prereq: ['ari.persen', 'ari.rasio'], masteryTarget: 3, difficultyRange: [1050, 1150] },
  { id: 'ari2.diskon', name: 'Diskon Berlapis', family: 'ari.persen', tier: 1, format: 'mc', targetMs: 35000, prereq: ['ari2.persen-naik'], masteryTarget: 3, difficultyRange: [1060, 1160] },
  { id: 'ari2.bunga', name: 'Bunga Sederhana', family: 'uni.bunga-majemuk', tier: 1, format: 'numeric', targetMs: 40000, prereq: ['ari2.persen-naik'], masteryTarget: 3, difficultyRange: [1070, 1170] },
  { id: 'ari2.rasio3', name: 'Rasio 3 Bagian', family: 'ari.rasio', tier: 1, format: 'numeric', targetMs: 45000, prereq: ['ari.rasio'], masteryTarget: 3, difficultyRange: [1080, 1180] },
  { id: 'ari2.skala', name: 'Skala Peta & Gambar', family: 'ari.rasio', tier: 1, format: 'numeric', targetMs: 35000, prereq: ['ari2.rasio3'], masteryTarget: 3, difficultyRange: [1060, 1160] },
  { id: 'ari2.konversi', name: 'Konversi Turun-Naik', family: 'ari.satuan', tier: 1, format: 'numeric', targetMs: 30000, prereq: ['ari.satuan'], masteryTarget: 3, difficultyRange: [1050, 1150] },
  { id: 'ari2.pecahan-campur', name: 'Pecahan Campuran', family: 'ari.pecahan', tier: 1, format: 'mc', targetMs: 40000, prereq: ['ari.pecahan'], masteryTarget: 3, difficultyRange: [1070, 1170] },
  { id: 'ari2.pangkat-akar', name: 'Pangkat & Akar', family: 'alj.eksponen', tier: 1, format: 'mc', targetMs: 25000, prereq: ['ari.campur'], masteryTarget: 3, difficultyRange: [1050, 1150] },

  // Aljabar (10 nodes)
  { id: 'alj2.word-linear', name: 'Soal Cerita Linear', family: 'alj.sistem2var', tier: 1, format: 'numeric', targetMs: 60000, prereq: ['alj.sistem-mudah'], masteryTarget: 3, difficultyRange: [1100, 1200] },
  { id: 'alj2.sistem2var', name: 'Sistem 2 Variabel', family: 'alj.sistem2var', tier: 1, format: 'numeric', targetMs: 60000, prereq: ['alj2.word-linear'], masteryTarget: 3, difficultyRange: [1150, 1250] },
  { id: 'alj2.kuadrat', name: 'Persamaan Kuadrat', family: 'alj.kuadrat', tier: 1, format: 'mc', targetMs: 40000, prereq: ['alj.linear2'], masteryTarget: 3, difficultyRange: [1100, 1200] },
  { id: 'alj2.rumus-abc', name: 'Rumus Kuadrat (ABC)', family: 'alj.kuadrat', tier: 1, format: 'numeric', targetMs: 50000, prereq: ['alj2.kuadrat'], masteryTarget: 3, difficultyRange: [1120, 1220] },
  { id: 'alj2.pecahan-aljabar', name: 'Pecahan Aljabar', family: 'alj.linear2', tier: 1, format: 'mc', targetMs: 45000, prereq: ['alj2.kuadrat'], masteryTarget: 3, difficultyRange: [1140, 1240] },
  { id: 'alj2.eksponen', name: 'Aturan Eksponen', family: 'alj.eksponen', tier: 1, format: 'mc', targetMs: 30000, prereq: ['ari2.pangkat-akar'], masteryTarget: 3, difficultyRange: [1080, 1180] },
  { id: 'alj2.polinomial', name: 'Operasi Polinomial', family: 'alj.linear2', tier: 1, format: 'mc', targetMs: 40000, prereq: ['alj2.eksponen'], masteryTarget: 3, difficultyRange: [1100, 1200] },
  { id: 'alj2.faktorisasi', name: 'Pemfaktoran Kuadrat', family: 'alj.kuadrat', tier: 1, format: 'mc', targetMs: 45000, prereq: ['alj2.polinomial'], masteryTarget: 3, difficultyRange: [1130, 1230] },
  { id: 'alj2.pertidaksamaan', name: 'Pertidaksamaan Interval', family: 'alj.linear2', tier: 1, format: 'mc', targetMs: 40000, prereq: ['alj.pertidaksamaan'], masteryTarget: 3, difficultyRange: [1110, 1210] },
  { id: 'alj2.nilai-mutlak', name: 'Nilai Mutlak', family: 'alj.linear1', tier: 1, format: 'numeric', targetMs: 35000, prereq: ['alj2.pertidaksamaan'], masteryTarget: 3, difficultyRange: [1120, 1220] },

  // Logika (7 nodes)
  { id: 'log2.kontraposisi', name: 'Kontraposisi', family: 'ari.campur', tier: 1, format: 'mc', targetMs: 35000, prereq: ['log.implikasi'], masteryTarget: 3, difficultyRange: [1080, 1180] },
  { id: 'log2.biimplikasi', name: 'Biimplikasi', family: 'ari.campur', tier: 1, format: 'mc', targetMs: 35000, prereq: ['log2.kontraposisi'], masteryTarget: 3, difficultyRange: [1090, 1190] },
  { id: 'log2.demorgan', name: 'Hukum De Morgan', family: 'ari.campur', tier: 1, format: 'mc', targetMs: 40000, prereq: ['log2.biimplikasi'], masteryTarget: 3, difficultyRange: [1100, 1200] },
  { id: 'log2.kuantor', name: 'Kuantor & Negasi', family: 'ari.campur', tier: 1, format: 'mc', targetMs: 40000, prereq: ['log2.demorgan'], masteryTarget: 3, difficultyRange: [1110, 1210] },
  { id: 'log2.counterexample', name: 'Counterexample', family: 'ari.campur', tier: 1, format: 'mc', targetMs: 45000, prereq: ['log2.kuantor'], masteryTarget: 3, difficultyRange: [1120, 1220] },
  { id: 'log2.argumen', name: 'Valid/Invalid Argumen', family: 'ari.campur', tier: 1, format: 'mc', targetMs: 50000, prereq: ['log2.counterexample'], masteryTarget: 3, difficultyRange: [1140, 1240] },
  { id: 'log2.zebra', name: 'Puzzle Grid Mini 3x3', family: 'ari.campur', tier: 1, format: 'mc', targetMs: 90000, prereq: ['log2.argumen'], masteryTarget: 3, difficultyRange: [1180, 1280] },

  // Fungsi & Grafik (7 nodes)
  { id: 'fng.gradien', name: 'Gradien & Intersep', family: 'alj.linear1', tier: 1, format: 'numeric', targetMs: 30000, prereq: ['alj.linear2'], masteryTarget: 3, difficultyRange: [1060, 1160] },
  { id: 'fng.interpretasi', name: 'Interpretasi Grafik', family: 'ari.campur', tier: 1, format: 'mc', targetMs: 40000, prereq: ['fng.gradien'], masteryTarget: 3, difficultyRange: [1080, 1180] },
  { id: 'fng.komposisi', name: 'Komposisi f(g(x))', family: 'alj.linear1', tier: 1, format: 'numeric', targetMs: 40000, prereq: ['fng.interpretasi'], masteryTarget: 3, difficultyRange: [1100, 1200] },
  { id: 'fng.invers', name: 'Invers Fungsi Linear', family: 'alj.linear1', tier: 1, format: 'numeric', targetMs: 45000, prereq: ['fng.komposisi'], masteryTarget: 3, difficultyRange: [1120, 1220] },
  { id: 'fng.puncak-kuadrat', name: 'Puncak Kuadrat', family: 'alj.kuadrat', tier: 1, format: 'numeric', targetMs: 45000, prereq: ['alj2.kuadrat'], masteryTarget: 3, difficultyRange: [1130, 1230] },
  { id: 'fng.transformasi', name: 'Transformasi Grafik', family: 'alj.linear2', tier: 1, format: 'mc', targetMs: 40000, prereq: ['fng.puncak-kuadrat'], masteryTarget: 3, difficultyRange: [1140, 1240] },
  { id: 'fng.domain-range', name: 'Domain & Range', family: 'alj.linear2', tier: 1, format: 'mc', targetMs: 35000, prereq: ['fng.transformasi'], masteryTarget: 3, difficultyRange: [1110, 1210] },

  // Statistika Deskriptif (5 nodes)
  { id: 'dat2.mean-frek', name: 'Mean Data Berfrekuensi', family: 'ari.campur', tier: 1, format: 'numeric', targetMs: 45000, prereq: ['dat.median-modus'], masteryTarget: 3, difficultyRange: [1080, 1180] },
  { id: 'dat2.iqr', name: 'Range & IQR', family: 'ari.campur', tier: 1, format: 'numeric', targetMs: 50000, prereq: ['dat2.mean-frek'], masteryTarget: 3, difficultyRange: [1100, 1200] },
  { id: 'dat2.sdev', name: 'Simpangan Baku', family: 'ari.campur', tier: 1, format: 'numeric', targetMs: 60000, prereq: ['dat2.iqr'], masteryTarget: 3, difficultyRange: [1120, 1220] },
  { id: 'dat2.boxplot', name: 'Baca Boxplot', family: 'ari.campur', tier: 1, format: 'mc', targetMs: 40000, prereq: ['dat2.sdev'], masteryTarget: 3, difficultyRange: [1110, 1210] },
  { id: 'dat2.sebaran', name: 'Konsep Sebaran Data', family: 'ari.campur', tier: 1, format: 'mc', targetMs: 35000, prereq: ['dat2.boxplot'], masteryTarget: 3, difficultyRange: [1100, 1200] },

  // ── TIER 2: TANPA ALAT ────────────────────────────────────────────────────
  // Mental Math Rush (8 nodes)
  { id: 'mm.campur', name: 'Rush Campur 2-Digit', family: 'ari.campur', tier: 2, format: 'rush', targetMs: 6000, prereq: ['ari.campur'], masteryTarget: 3, difficultyRange: [1150, 1250] },
  { id: 'mm.persen-cepat', name: 'Rush Persen Cepat', family: 'ari.persen', tier: 2, format: 'rush', targetMs: 5000, prereq: ['mm.campur'], masteryTarget: 3, difficultyRange: [1160, 1260] },
  { id: 'mm.trik-kali', name: 'Perkalian Trik (x11, x25)', family: 'ari.kali', tier: 2, format: 'rush', targetMs: 5000, prereq: ['mm.persen-cepat'], masteryTarget: 3, difficultyRange: [1180, 1280] },
  { id: 'mm.desimal-cepat', name: 'Pecahan ke Desimal', family: 'ari.pecahan', tier: 2, format: 'rush', targetMs: 6000, prereq: ['mm.trik-kali'], masteryTarget: 3, difficultyRange: [1170, 1270] },
  { id: 'mm.estimasi-akar', name: 'Estimasi Akar Cepat', family: 'alj.eksponen', tier: 2, format: 'rush', targetMs: 7000, prereq: ['mm.desimal-cepat'], masteryTarget: 3, difficultyRange: [1190, 1290] },
  { id: 'mm.rasio-cepat', name: 'Rasio Mental', family: 'ari.rasio', tier: 2, format: 'rush', targetMs: 6000, prereq: ['mm.estimasi-akar'], masteryTarget: 3, difficultyRange: [1180, 1280] },
  { id: 'mm.mod-jam', name: 'Aritmetika Modulo Jam', family: 'ari.campur', tier: 2, format: 'rush', targetMs: 6000, prereq: ['mm.rasio-cepat'], masteryTarget: 3, difficultyRange: [1200, 1300] },
  { id: 'mm.sig-fig', name: 'Pembulatan Signifikan', family: 'ari.bulat', tier: 2, format: 'rush', targetMs: 5000, prereq: ['mm.mod-jam'], masteryTarget: 3, difficultyRange: [1170, 1270] },

  // Kalkulus Cepat (10 nodes)
  { id: 'kald.power', name: 'Turunan Power Rule', family: 'kald.power', tier: 2, format: 'numeric', targetMs: 20000, prereq: ['alj2.eksponen'], masteryTarget: 3, difficultyRange: [1150, 1300] },
  { id: 'kald.chain', name: 'Aturan Rantai (Chain Rule)', family: 'kald.chain', tier: 2, format: 'numeric', targetMs: 30000, prereq: ['kald.power'], masteryTarget: 3, difficultyRange: [1220, 1380] },
  { id: 'kald.limit', name: 'Limit Polinomial', family: 'kald.limit', tier: 2, format: 'numeric', targetMs: 20000, prereq: ['alj2.kuadrat'], masteryTarget: 3, difficultyRange: [1150, 1280] },
  { id: 'kald.limit-rasional', name: 'Limit Rasional Faktor', family: 'kald.limit', tier: 2, format: 'numeric', targetMs: 25000, prereq: ['kald.limit'], masteryTarget: 3, difficultyRange: [1180, 1320] },
  { id: 'kald.kontinuitas', name: 'Cek Kontinuitas', family: 'kald.limit', tier: 2, format: 'mc', targetMs: 25000, prereq: ['kald.limit-rasional'], masteryTarget: 3, difficultyRange: [1170, 1290] },
  { id: 'kald.product', name: 'Turunan Hasil Kali', family: 'kald.power', tier: 2, format: 'numeric', targetMs: 30000, prereq: ['kald.power'], masteryTarget: 3, difficultyRange: [1200, 1350] },
  { id: 'kald.gradien-garis', name: 'Gradien Garis Singgung', family: 'kald.power', tier: 2, format: 'numeric', targetMs: 25000, prereq: ['kald.product'], masteryTarget: 3, difficultyRange: [1190, 1320] },
  { id: 'kald.turunan2', name: 'Turunan Kedua', family: 'kald.power', tier: 2, format: 'numeric', targetMs: 20000, prereq: ['kald.gradien-garis'], masteryTarget: 3, difficultyRange: [1180, 1300] },
  { id: 'kald.integral-taktentu', name: 'Integral Tak Tentu Power', family: 'kald.power', tier: 2, format: 'numeric', targetMs: 25000, prereq: ['kald.turunan2'], masteryTarget: 3, difficultyRange: [1200, 1340] },
  { id: 'kald.integral-tentu', name: 'Integral Tentu Polinomial', family: 'kald.power', tier: 2, format: 'numeric', targetMs: 30000, prereq: ['kald.integral-taktentu'], masteryTarget: 3, difficultyRange: [1220, 1360] },

  // Trigonometri (7 nodes)
  { id: 'trg.istimewa', name: 'Nilai Sudut Istimewa', family: 'ari.campur', tier: 2, format: 'mc', targetMs: 15000, prereq: ['alj2.kuadrat'], masteryTarget: 3, difficultyRange: [1150, 1280] },
  { id: 'trg.identitas', name: 'Identitas Pythagoras Trig', family: 'ari.campur', tier: 2, format: 'mc', targetMs: 20000, prereq: ['trg.istimewa'], masteryTarget: 3, difficultyRange: [1180, 1300] },
  { id: 'trg.grafik', name: 'Baca Grafik Sin/Cos', family: 'ari.campur', tier: 2, format: 'mc', targetMs: 25000, prereq: ['trg.identitas'], masteryTarget: 3, difficultyRange: [1170, 1290] },
  { id: 'trg.aturan-sinus', name: 'Aturan Sinus', family: 'ari.campur', tier: 2, format: 'numeric', targetMs: 30000, prereq: ['trg.grafik'], masteryTarget: 3, difficultyRange: [1200, 1320] },
  { id: 'trg.aturan-cosinus', name: 'Aturan Cosinus', family: 'ari.campur', tier: 2, format: 'numeric', targetMs: 35000, prereq: ['trg.aturan-sinus'], masteryTarget: 3, difficultyRange: [1220, 1350] },
  { id: 'trg.radian', name: 'Radian & Derajat', family: 'ari.campur', tier: 2, format: 'numeric', targetMs: 20000, prereq: ['trg.aturan-cosinus'], masteryTarget: 3, difficultyRange: [1140, 1260] },
  { id: 'trg.aplikasi', name: 'Aplikasi Tinggi & Jarak', family: 'ari.campur', tier: 2, format: 'numeric', targetMs: 40000, prereq: ['trg.radian'], masteryTarget: 3, difficultyRange: [1230, 1370] },

  // Geometri Terapan (5 nodes)
  { id: 'geo.luas-keliling', name: 'Luas & Keliling Campur', family: 'ari.campur', tier: 2, format: 'numeric', targetMs: 25000, prereq: ['ari.kali'], masteryTarget: 3, difficultyRange: [1100, 1220] },
  { id: 'geo.volume', name: 'Volume Prisma & Tabung', family: 'ari.campur', tier: 2, format: 'numeric', targetMs: 30000, prereq: ['geo.luas-keliling'], masteryTarget: 3, difficultyRange: [1130, 1250] },
  { id: 'geo.optimasi-mini', name: 'Optimasi Dimensi Pagar', family: 'alj.kuadrat', tier: 2, format: 'numeric', targetMs: 40000, prereq: ['geo.volume'], masteryTarget: 3, difficultyRange: [1220, 1360] },
  { id: 'geo.pythagoras', name: 'Pythagoras Terapan', family: 'alj.kuadrat', tier: 2, format: 'numeric', targetMs: 25000, prereq: ['geo.luas-keliling'], masteryTarget: 3, difficultyRange: [1120, 1240] },
  { id: 'geo.gabungan', name: 'Gabungan Bidang', family: 'ari.campur', tier: 2, format: 'numeric', targetMs: 35000, prereq: ['geo.pythagoras'], masteryTarget: 3, difficultyRange: [1160, 1280] },

  // ── TIER 3: LANGKAH ───────────────────────────────────────────────────────
  // Kalkulus Diferensial Lanjut (10 nodes)
  { id: 'kald2.hasil-kali-bagi', name: 'Aturan Hasil Bagi', family: 'kald.power', tier: 3, format: 'steps', targetMs: 60000, prereq: ['kald.product'], masteryTarget: 3, difficultyRange: [1300, 1450] },
  { id: 'kald2.chain-multilevel', name: 'Chain Multi-Level', family: 'kald.chain', tier: 3, format: 'steps', targetMs: 75000, prereq: ['kald.chain'], masteryTarget: 3, difficultyRange: [1350, 1500] },
  { id: 'kald2.implisit', name: 'Turunan Implisit', family: 'kald.power', tier: 3, format: 'steps', targetMs: 90000, prereq: ['kald2.chain-multilevel'], masteryTarget: 3, difficultyRange: [1380, 1520] },
  { id: 'kald2.diferensial-error', name: 'Diferensial & Error', family: 'kald.power', tier: 3, format: 'numeric', targetMs: 60000, prereq: ['kald2.implisit'], masteryTarget: 3, difficultyRange: [1320, 1460] },
  { id: 'kald2.laju-berhubung', name: 'Laju Berhubungan', family: 'kald.power', tier: 3, format: 'numeric', targetMs: 90000, prereq: ['kald2.diferensial-error'], masteryTarget: 3, difficultyRange: [1400, 1550] },
  { id: 'kald2.optimasi-terikat', name: 'Optimasi 1 Kendala', family: 'kald.power', tier: 3, format: 'steps', targetMs: 120000, prereq: ['kald2.laju-berhubung'], masteryTarget: 3, difficultyRange: [1420, 1580] },
  { id: 'kald2.analisis-fungsi', name: 'Analisis Titik Kritis', family: 'kald.power', tier: 3, format: 'steps', targetMs: 80000, prereq: ['kald2.optimasi-terikat'], masteryTarget: 3, difficultyRange: [1360, 1500] },
  { id: 'kald2.sketsa-kurva', name: 'Sketsa Kurva Langkah', family: 'kald.power', tier: 3, format: 'steps', targetMs: 100000, prereq: ['kald2.analisis-fungsi'], masteryTarget: 3, difficultyRange: [1380, 1520] },
  { id: 'kald2.lhopital', name: 'Aturan L\'Hopital', family: 'kald.limit', tier: 3, format: 'numeric', targetMs: 60000, prereq: ['kald2.sketsa-kurva'], masteryTarget: 3, difficultyRange: [1340, 1480] },
  { id: 'kald2.turunan-trig-exp', name: 'Turunan Trig & Exp', family: 'kald.power', tier: 3, format: 'numeric', targetMs: 60000, prereq: ['kald2.lhopital'], masteryTarget: 3, difficultyRange: [1350, 1500] },

  // Kalkulus Integral (8 nodes)
  { id: 'kali.usub', name: 'Integral Substitusi u', family: 'kald.power', tier: 3, format: 'steps', targetMs: 90000, prereq: ['kald.integral-tentu'], masteryTarget: 3, difficultyRange: [1320, 1480] },
  { id: 'kali.partial', name: 'Integral Parsial', family: 'kald.power', tier: 3, format: 'steps', targetMs: 120000, prereq: ['kali.usub'], masteryTarget: 3, difficultyRange: [1380, 1540] },
  { id: 'kali.partial-fraction', name: 'Parsial Fraksi', family: 'kald.power', tier: 3, format: 'steps', targetMs: 150000, prereq: ['kali.partial'], masteryTarget: 3, difficultyRange: [1400, 1560] },
  { id: 'kali.trig-int', name: 'Integral Trig Dasar', family: 'kald.power', tier: 3, format: 'numeric', targetMs: 75000, prereq: ['kali.partial-fraction'], masteryTarget: 3, difficultyRange: [1350, 1500] },
  { id: 'kali.luas-kurva', name: 'Luas Antar Kurva', family: 'kald.power', tier: 3, format: 'numeric', targetMs: 90000, prereq: ['kali.trig-int'], masteryTarget: 3, difficultyRange: [1360, 1520] },
  { id: 'kali.volume-putar', name: 'Volume Putar Cakram', family: 'kald.power', tier: 3, format: 'numeric', targetMs: 120000, prereq: ['kali.luas-kurva'], masteryTarget: 3, difficultyRange: [1400, 1550] },
  { id: 'kali.mean-value', name: 'Nilai Rata-Rata Fungsi', family: 'kald.power', tier: 3, format: 'numeric', targetMs: 60000, prereq: ['kali.volume-putar'], masteryTarget: 3, difficultyRange: [1300, 1450] },
  { id: 'kali.improper', name: 'Integral Tak Wajar', family: 'kald.power', tier: 3, format: 'numeric', targetMs: 90000, prereq: ['kali.mean-value'], masteryTarget: 3, difficultyRange: [1380, 1540] },

  // Aljabar Linear (12 nodes)
  { id: 'lin.matrix-ops', name: 'Operasi Matriks', family: 'alj.linear1', tier: 3, format: 'steps', targetMs: 60000, prereq: ['alj.sistem-mudah'], masteryTarget: 3, difficultyRange: [1250, 1400] },
  { id: 'lin.transpose', name: 'Transpose & Simetri', family: 'alj.linear1', tier: 3, format: 'numeric', targetMs: 45000, prereq: ['lin.matrix-ops'], masteryTarget: 3, difficultyRange: [1220, 1380] },
  { id: 'lin.det2x2-3x3', name: 'Determinan 2x2 & 3x3', family: 'alj.linear1', tier: 3, format: 'numeric', targetMs: 60000, prereq: ['lin.transpose'], masteryTarget: 3, difficultyRange: [1280, 1420] },
  { id: 'lin.inv2x2', name: 'Invers Matriks 2x2', family: 'alj.linear1', tier: 3, format: 'numeric', targetMs: 75000, prereq: ['lin.det2x2-3x3'], masteryTarget: 3, difficultyRange: [1300, 1450] },
  { id: 'lin.gauss', name: 'Eliminasi Gauss Steps', family: 'alj.linear1', tier: 3, format: 'steps', targetMs: 180000, prereq: ['lin.inv2x2'], masteryTarget: 3, difficultyRange: [1380, 1550] },
  { id: 'lin.cramer', name: 'Aturan Cramer', family: 'alj.linear1', tier: 3, format: 'numeric', targetMs: 90000, prereq: ['lin.gauss'], masteryTarget: 3, difficultyRange: [1320, 1480] },
  { id: 'lin.rank', name: 'Rank & Konsistensi', family: 'alj.linear1', tier: 3, format: 'mc', targetMs: 60000, prereq: ['lin.cramer'], masteryTarget: 3, difficultyRange: [1300, 1440] },
  { id: 'lin.vector-dot', name: 'Norm & Dot Product', family: 'alj.linear1', tier: 3, format: 'numeric', targetMs: 45000, prereq: ['lin.rank'], masteryTarget: 3, difficultyRange: [1240, 1380] },
  { id: 'lin.cross-product', name: 'Cross Product Vektor', family: 'alj.linear1', tier: 3, format: 'numeric', targetMs: 60000, prereq: ['lin.vector-dot'], masteryTarget: 3, difficultyRange: [1280, 1420] },
  { id: 'lin.independensi', name: 'Independensi Linear', family: 'alj.linear1', tier: 3, format: 'mc', targetMs: 60000, prereq: ['lin.cross-product'], masteryTarget: 3, difficultyRange: [1320, 1460] },
  { id: 'lin.eigen2x2', name: 'Eigen 2x2 Values', family: 'alj.linear1', tier: 3, format: 'numeric', targetMs: 90000, prereq: ['lin.independensi'], masteryTarget: 3, difficultyRange: [1380, 1540] },
  { id: 'lin.eigen-steps', name: 'Eigen 2x2 Langkah', family: 'alj.linear1', tier: 3, format: 'steps', targetMs: 120000, prereq: ['lin.eigen2x2'], masteryTarget: 3, difficultyRange: [1400, 1560] },

  // Probabilitas & Inferensial (18 nodes)
  { id: 'pro.kombinasi', name: 'Kombinasi & Permutasi', family: 'pro.kombinasi', tier: 3, format: 'mc', targetMs: 90000, prereq: ['ari.rasio'], masteryTarget: 3, difficultyRange: [1250, 1450] },
  { id: 'pro.tree', name: 'Diagram Pohon Peluang', family: 'pro.kombinasi', tier: 3, format: 'numeric', targetMs: 60000, prereq: ['pro.kombinasi'], masteryTarget: 3, difficultyRange: [1240, 1400] },
  { id: 'pro.union', name: 'Komplemen & Union', family: 'pro.kombinasi', tier: 3, format: 'numeric', targetMs: 60000, prereq: ['pro.tree'], masteryTarget: 3, difficultyRange: [1260, 1410] },
  { id: 'pro.bersyarat', name: 'Peluang Bersyarat', family: 'pro.bayes', tier: 3, format: 'numeric', targetMs: 75000, prereq: ['pro.union'], masteryTarget: 3, difficultyRange: [1280, 1440] },
  { id: 'pro.bayes', name: 'Teorema Bayes', family: 'pro.bayes', tier: 3, format: 'numeric', targetMs: 120000, prereq: ['pro.bersyarat'], masteryTarget: 3, difficultyRange: [1300, 1500] },
  { id: 'pro.binomial', name: 'Peluang Binomial', family: 'pro.bayes', tier: 3, format: 'numeric', targetMs: 90000, prereq: ['pro.bayes'], masteryTarget: 3, difficultyRange: [1320, 1480] },
  { id: 'pro.ekspektasi', name: 'Ekspektasi & Varian Diskrit', family: 'pro.bayes', tier: 3, format: 'numeric', targetMs: 90000, prereq: ['pro.binomial'], masteryTarget: 3, difficultyRange: [1340, 1490] },
  { id: 'pro.uniform', name: 'Uniform Kontinu', family: 'pro.bayes', tier: 3, format: 'numeric', targetMs: 60000, prereq: ['pro.ekspektasi'], masteryTarget: 3, difficultyRange: [1280, 1420] },
  { id: 'pro.normal-z', name: 'Normal Standardisasi z', family: 'pro.bayes', tier: 3, format: 'numeric', targetMs: 75000, prereq: ['pro.uniform'], masteryTarget: 3, difficultyRange: [1300, 1460] },
  { id: 'pro.normal-area', name: 'Normal Luas Area Tabel', family: 'pro.bayes', tier: 3, format: 'numeric', targetMs: 90000, prereq: ['pro.normal-z'], masteryTarget: 3, difficultyRange: [1350, 1500] },

  { id: 'inf.clt', name: 'Teorema Limit Pusat (CLT)', family: 'inf.ci-mean', tier: 3, format: 'numeric', targetMs: 90000, prereq: ['pro.normal-area'], masteryTarget: 3, difficultyRange: [1320, 1480] },
  { id: 'inf.ci-mean', name: 'Interval Kepercayaan Mean z', family: 'inf.ci-mean', tier: 3, format: 'numeric', targetMs: 150000, prereq: ['inf.clt'], masteryTarget: 3, difficultyRange: [1350, 1550] },
  { id: 'inf.ci-t', name: 'Interval Kepercayaan t', family: 'inf.ci-mean', tier: 3, format: 'numeric', targetMs: 150000, prereq: ['inf.ci-mean'], masteryTarget: 3, difficultyRange: [1380, 1560] },
  { id: 'inf.z-test', name: 'Uji z Satu Mean', family: 'inf.ci-mean', tier: 3, format: 'steps', targetMs: 180000, prereq: ['inf.ci-t'], masteryTarget: 3, difficultyRange: [1400, 1580] },
  { id: 'inf.t-test', name: 'Uji t Satu Mean', family: 'inf.ci-mean', tier: 3, format: 'steps', targetMs: 180000, prereq: ['inf.z-test'], masteryTarget: 3, difficultyRange: [1420, 1600] },
  { id: 'inf.p-value', name: 'Interpretasi p-value', family: 'inf.ci-mean', tier: 3, format: 'mc', targetMs: 60000, prereq: ['inf.t-test'], masteryTarget: 3, difficultyRange: [1360, 1520] },
  { id: 'inf.proporsi', name: 'Uji Proporsi 1 Sampel', family: 'inf.ci-mean', tier: 3, format: 'numeric', targetMs: 120000, prereq: ['inf.p-value'], masteryTarget: 3, difficultyRange: [1380, 1540] },
  { id: 'inf.regresi', name: 'Korelasi & Regresi Sederhana', family: 'inf.ci-mean', tier: 3, format: 'steps', targetMs: 240000, prereq: ['inf.proporsi'], masteryTarget: 3, difficultyRange: [1450, 1650] },

  // ── TIER 4: KASUS INDUSTRI ────────────────────────────────────────────────
  // Riset Operasi (14 nodes)
  { id: 'rso.lp-model', name: 'Formulasi Model LP', family: 'rso.lp-grafis', tier: 4, format: 'steps', targetMs: 300000, prereq: ['kald.limit'], masteryTarget: 3, difficultyRange: [1450, 1650] },
  { id: 'rso.lp-grafis', name: 'LP Grafis Interaktif', family: 'rso.lp-grafis', tier: 4, format: 'steps', targetMs: 420000, prereq: ['rso.lp-model'], masteryTarget: 3, difficultyRange: [1500, 1800] },
  { id: 'rso.lp-interpre', name: 'Interpretasi Slack Kendala', family: 'rso.lp-grafis', tier: 4, format: 'mc', targetMs: 180000, prereq: ['rso.lp-grafis'], masteryTarget: 3, difficultyRange: [1480, 1680] },
  { id: 'rso.simpleks', name: 'Tabel Simpleks Pivot', family: 'rso.lp-grafis', tier: 4, format: 'steps', targetMs: 360000, prereq: ['rso.lp-interpre'], masteryTarget: 3, difficultyRange: [1550, 1750] },
  { id: 'rso.transportasi', name: 'Transportasi NWC', family: 'rso.transportasi', tier: 4, format: 'numeric', targetMs: 300000, prereq: ['rso.simpleks'], masteryTarget: 3, difficultyRange: [1450, 1700] },
  { id: 'rso.assignment', name: 'Metode Hungarian 3x3', family: 'rso.transportasi', tier: 4, format: 'steps', targetMs: 300000, prereq: ['rso.transportasi'], masteryTarget: 3, difficultyRange: [1480, 1720] },
  { id: 'rso.dual', name: 'Dual LP & Harga Bayangan', family: 'rso.lp-grafis', tier: 4, format: 'mc', targetMs: 240000, prereq: ['rso.assignment'], masteryTarget: 3, difficultyRange: [1500, 1740] },
  { id: 'rso.sensitivitas', name: 'Analisis Sensitivitas', family: 'rso.lp-grafis', tier: 4, format: 'numeric', targetMs: 300000, prereq: ['rso.dual'], masteryTarget: 3, difficultyRange: [1520, 1760] },
  { id: 'rso.ip', name: 'Branch & Bound IP 1 Level', family: 'rso.lp-grafis', tier: 4, format: 'numeric', targetMs: 360000, prereq: ['rso.sensitivitas'], masteryTarget: 3, difficultyRange: [1560, 1780] },
  { id: 'rso.goal', name: 'Goal Programming Mini', family: 'rso.lp-grafis', tier: 4, format: 'steps', targetMs: 300000, prereq: ['rso.ip'], masteryTarget: 3, difficultyRange: [1540, 1760] },
  { id: 'rso.dijkstra', name: 'Shortest Path Dijkstra', family: 'rso.pert', tier: 4, format: 'steps', targetMs: 300000, prereq: ['rso.goal'], masteryTarget: 3, difficultyRange: [1480, 1700] },
  { id: 'rso.mst', name: 'Minimum Spanning Tree', family: 'rso.pert', tier: 4, format: 'numeric', targetMs: 240000, prereq: ['rso.dijkstra'], masteryTarget: 3, difficultyRange: [1460, 1680] },
  { id: 'rso.pert', name: 'PERT & CPM', family: 'rso.pert', tier: 4, format: 'numeric', targetMs: 420000, prereq: ['rso.mst'], masteryTarget: 3, difficultyRange: [1450, 1700] },
  { id: 'rso.cpm', name: 'Jalur Kritis & Crashing', family: 'rso.pert', tier: 4, format: 'steps', targetMs: 420000, prereq: ['rso.pert'], masteryTarget: 3, difficultyRange: [1550, 1780] },

  // Teori Antrean & Inventori & Lainnya (32 nodes)
  { id: 'ant.mm1', name: 'Antrean M/M/1', family: 'ant.mm1', tier: 4, format: 'numeric', targetMs: 240000, prereq: ['pro.bayes'], masteryTarget: 3, difficultyRange: [1400, 1650] },
  { id: 'ant.mm1-cost', name: 'Biaya Sistem M/M/1', family: 'ant.mm1', tier: 4, format: 'numeric', targetMs: 300000, prereq: ['ant.mm1'], masteryTarget: 3, difficultyRange: [1440, 1680] },
  { id: 'ant.mm2', name: 'Antrean M/M/2', family: 'ant.mm1', tier: 4, format: 'numeric', targetMs: 360000, prereq: ['ant.mm1-cost'], masteryTarget: 3, difficultyRange: [1480, 1720] },
  { id: 'ant.littles-law', name: 'Hukum Little Terapan', family: 'ant.mm1', tier: 4, format: 'numeric', targetMs: 180000, prereq: ['ant.mm2'], masteryTarget: 3, difficultyRange: [1380, 1600] },
  { id: 'ant.kendall-poisson', name: 'Notasi Kendall & Poisson', family: 'ant.mm1', tier: 4, format: 'mc', targetMs: 180000, prereq: ['ant.littles-law'], masteryTarget: 3, difficultyRange: [1360, 1580] },

  { id: 'inv.eoq', name: 'EOQ — Inventori', family: 'inv.eoq', tier: 4, format: 'numeric', targetMs: 300000, prereq: ['ari2.bunga'], masteryTarget: 3, difficultyRange: [1400, 1650] },
  { id: 'inv.eoq-prod', name: 'EOQ Production Rate', family: 'inv.eoq', tier: 4, format: 'numeric', targetMs: 330000, prereq: ['inv.eoq'], masteryTarget: 3, difficultyRange: [1450, 1680] },
  { id: 'inv.eoq-discount', name: 'EOQ Quantity Discount', family: 'inv.eoq', tier: 4, format: 'steps', targetMs: 360000, prereq: ['inv.eoq-prod'], masteryTarget: 3, difficultyRange: [1480, 1720] },
  { id: 'inv.rop-safety', name: 'ROP & Safety Stock z', family: 'inv.eoq', tier: 4, format: 'numeric', targetMs: 300000, prereq: ['inv.eoq-discount'], masteryTarget: 3, difficultyRange: [1440, 1670] },
  { id: 'inv.abc', name: 'Kebijakan P/Q & ABC', family: 'inv.eoq', tier: 4, format: 'mc', targetMs: 240000, prereq: ['inv.rop-safety'], masteryTarget: 3, difficultyRange: [1400, 1620] },

  { id: 'frc.moving-avg', name: 'Moving Average n-Periode', family: 'inv.eoq', tier: 4, format: 'numeric', targetMs: 240000, prereq: ['dat2.sdev'], masteryTarget: 3, difficultyRange: [1380, 1600] },
  { id: 'frc.weighted-ma', name: 'Weighted Moving Average', family: 'inv.eoq', tier: 4, format: 'numeric', targetMs: 270000, prereq: ['frc.moving-avg'], masteryTarget: 3, difficultyRange: [1400, 1620] },
  { id: 'frc.exp-smooth', name: 'Exponential Smoothing α', family: 'inv.eoq', tier: 4, format: 'steps', targetMs: 240000, prereq: ['frc.weighted-ma'], masteryTarget: 3, difficultyRange: [1420, 1650] },
  { id: 'frc.mad-mape', name: 'MAD & MAPE Error', family: 'inv.eoq', tier: 4, format: 'numeric', targetMs: 300000, prereq: ['frc.exp-smooth'], masteryTarget: 3, difficultyRange: [1440, 1670] },
  { id: 'frc.regresi-trend', name: 'Regresi Trend Bisnis', family: 'inv.eoq', tier: 4, format: 'steps', targetMs: 360000, prereq: ['frc.mad-mape'], masteryTarget: 3, difficultyRange: [1480, 1700] },
  { id: 'frc.indeks-musiman', name: 'Indeks Musiman', family: 'inv.eoq', tier: 4, format: 'numeric', targetMs: 300000, prereq: ['frc.regresi-trend'], masteryTarget: 3, difficultyRange: [1450, 1680] },

  { id: 'rel.mtbf', name: 'MTBF, MTTR & Availability', family: 'ant.mm1', tier: 4, format: 'numeric', targetMs: 240000, prereq: ['dat2.sdev'], masteryTarget: 3, difficultyRange: [1380, 1600] },
  { id: 'rel.series-parallel', name: 'Reliability Seri-Paralel', family: 'ant.mm1', tier: 4, format: 'numeric', targetMs: 300000, prereq: ['rel.mtbf'], masteryTarget: 3, difficultyRange: [1420, 1650] },
  { id: 'rel.control-chart', name: 'Control Chart X-bar UCL/LCL', family: 'ant.mm1', tier: 4, format: 'steps', targetMs: 300000, prereq: ['rel.series-parallel'], masteryTarget: 3, difficultyRange: [1450, 1680] },
  { id: 'rel.p-chart', name: 'P-chart Proporsi Cacat', family: 'ant.mm1', tier: 4, format: 'numeric', targetMs: 270000, prereq: ['rel.control-chart'], masteryTarget: 3, difficultyRange: [1430, 1660] },
  { id: 'rel.cp-cpk', name: 'Kapabilitas Proses Cp/Cpk', family: 'ant.mm1', tier: 4, format: 'numeric', targetMs: 300000, prereq: ['rel.p-chart'], masteryTarget: 3, difficultyRange: [1460, 1700] },

  { id: 'eko.factors', name: 'Faktor F/P dan P/F', family: 'uni.bunga-majemuk', tier: 4, format: 'numeric', targetMs: 240000, prereq: ['uni.bunga-majemuk'], masteryTarget: 3, difficultyRange: [1350, 1580] },
  { id: 'eko.present-worth', name: 'Anuitas P/A & F/A', family: 'uni.bunga-majemuk', tier: 4, format: 'numeric', targetMs: 300000, prereq: ['eko.factors'], masteryTarget: 3, difficultyRange: [1400, 1620] },
  { id: 'eko.npv', name: 'Net Present Value (NPV)', family: 'uni.bunga-majemuk', tier: 4, format: 'steps', targetMs: 360000, prereq: ['eko.present-worth'], masteryTarget: 3, difficultyRange: [1450, 1700] },
  { id: 'eko.irr', name: 'Internal Rate of Return (IRR)', family: 'uni.bunga-majemuk', tier: 4, format: 'steps', targetMs: 420000, prereq: ['eko.npv'], masteryTarget: 3, difficultyRange: [1500, 1750] },
  { id: 'eko.payback', name: 'Payback Period', family: 'uni.bunga-majemuk', tier: 4, format: 'numeric', targetMs: 240000, prereq: ['eko.irr'], masteryTarget: 3, difficultyRange: [1360, 1580] },
  { id: 'eko.depresiasi', name: 'Depresiasi Garis Lurus', family: 'uni.bunga-majemuk', tier: 4, format: 'numeric', targetMs: 240000, prereq: ['eko.payback'], masteryTarget: 3, difficultyRange: [1350, 1560] },
  { id: 'eko.tabel-faktor', name: 'Perbandingan Alternatif PW', family: 'uni.bunga-majemuk', tier: 4, format: 'steps', targetMs: 360000, prereq: ['eko.depresiasi'], masteryTarget: 3, difficultyRange: [1480, 1720] },

  { id: 'sim.random-var', name: 'Angka Acak Variate', family: 'pro.bayes', tier: 4, format: 'numeric', targetMs: 240000, prereq: ['pro.bayes'], masteryTarget: 3, difficultyRange: [1400, 1620] },
  { id: 'sim.invers-diskrit', name: 'Invers Diskrit Generator', family: 'pro.bayes', tier: 4, format: 'steps', targetMs: 300000, prereq: ['sim.random-var'], masteryTarget: 3, difficultyRange: [1440, 1660] },
  { id: 'sim.antrean-manual', name: 'Simulasi Antrean 5 Event', family: 'pro.bayes', tier: 4, format: 'steps', targetMs: 420000, prereq: ['sim.invers-diskrit'], masteryTarget: 3, difficultyRange: [1500, 1740] },
  { id: 'sim.monte-carlo', name: 'Monte Carlo Integrasi', family: 'pro.bayes', tier: 4, format: 'numeric', targetMs: 360000, prereq: ['sim.antrean-manual'], masteryTarget: 3, difficultyRange: [1480, 1720] },

  // ── TRACK UNIVERSAL (15 nodes) ───────────────────────────────────────────
  { id: 'uni.margin-markup', name: 'Margin & Markup', family: 'uni.margin-markup', tier: 0, format: 'mc', targetMs: 60000, prereq: ['ari.persen'], masteryTarget: 3, difficultyRange: [1050, 1200] },
  { id: 'uni.tax', name: 'PPN & Pajak', family: 'uni.margin-markup', tier: 0, format: 'numeric', targetMs: 60000, prereq: ['uni.margin-markup'], masteryTarget: 3, difficultyRange: [1060, 1210] },
  { id: 'uni.break-even', name: 'Break-Even Analysis', family: 'uni.break-even', tier: 1, format: 'numeric', targetMs: 120000, prereq: ['ari.persen'], masteryTarget: 3, difficultyRange: [1100, 1300] },
  { id: 'uni.unit-cost', name: 'Unit Cost & HPP', family: 'uni.break-even', tier: 1, format: 'numeric', targetMs: 90000, prereq: ['uni.break-even'], masteryTarget: 3, difficultyRange: [1120, 1250] },
  { id: 'uni.net-discount', name: 'Diskon Kas & Net Term', family: 'uni.margin-markup', tier: 1, format: 'numeric', targetMs: 75000, prereq: ['uni.unit-cost'], masteryTarget: 3, difficultyRange: [1110, 1240] },
  { id: 'uni.stat-skeptis', name: 'Membaca Statistik Berita', family: 'ari.campur', tier: 1, format: 'mc', targetMs: 60000, prereq: ['dat.tabel'], masteryTarget: 3, difficultyRange: [1080, 1220] },
  { id: 'uni.sampling', name: 'Konsep Sampling Survei', family: 'ari.campur', tier: 1, format: 'mc', targetMs: 60000, prereq: ['uni.stat-skeptis'], masteryTarget: 3, difficultyRange: [1100, 1240] },
  { id: 'uni.index-numbers', name: 'Index Numbers Bisnis', family: 'ari.rasio', tier: 1, format: 'numeric', targetMs: 90000, prereq: ['uni.sampling'], masteryTarget: 3, difficultyRange: [1130, 1260] },
  { id: 'uni.time-series', name: 'Time Series Bisnis', family: 'ari.campur', tier: 1, format: 'mc', targetMs: 90000, prereq: ['uni.index-numbers'], masteryTarget: 3, difficultyRange: [1140, 1270] },
  { id: 'uni.risiko', name: 'Probabilitas Risiko Harian', family: 'pro.bayes', tier: 1, format: 'numeric', targetMs: 90000, prereq: ['uni.time-series'], masteryTarget: 3, difficultyRange: [1150, 1280] },
  { id: 'uni.korelasi-kausasi', name: 'Korelasi vs Kausasi', family: 'ari.campur', tier: 1, format: 'mc', targetMs: 60000, prereq: ['uni.risiko'], masteryTarget: 3, difficultyRange: [1100, 1230] },
  { id: 'uni.konversi-praktis', name: 'Konversi Satuan Praktis', family: 'ari.satuan', tier: 0, format: 'numeric', targetMs: 45000, prereq: ['ari.satuan'], masteryTarget: 3, difficultyRange: [1020, 1150] },
  { id: 'uni.bunga-majemuk', name: 'Bunga Majemuk & Cicilan', family: 'uni.bunga-majemuk', tier: 1, format: 'numeric', targetMs: 90000, prereq: ['ari2.bunga'], masteryTarget: 3, difficultyRange: [1100, 1250] },
  { id: 'uni.mean-tertimbang', name: 'Mean Tertimbang', family: 'ari.campur', tier: 1, format: 'numeric', targetMs: 75000, prereq: ['dat.mean'], masteryTarget: 3, difficultyRange: [1080, 1220] },
  { id: 'uni.chart-choice', name: 'Memilih Chart Tepat', family: 'ari.campur', tier: 1, format: 'mc', targetMs: 60000, prereq: ['uni.mean-tertimbang'], masteryTarget: 3, difficultyRange: [1060, 1200] },
];

export const TIER_CONFIG = [
  { tier: 0, name: 'Pemanasan', description: 'MC + hint, tanpa timer. Bangun fondasi & kebiasaan.', masteryRequired: 28, totalNodes: 33, unlockRequirement: 'Selesaikan 28 node Tier 0' },
  { tier: 1, name: 'Dasar', description: 'MC tanpa hint + numeric. Retrieval murni.', masteryRequired: 32, totalNodes: 37, unlockRequirement: 'Master 32+ node Tier 0 + Ujian Promosi' },
  { tier: 2, name: 'Tanpa Alat', description: 'Numeric ketik + timer ketat. Otomatisasi mental.', masteryRequired: 26, totalNodes: 30, unlockRequirement: 'Master 26+ node Tier 1 + Ujian Promosi' },
  { tier: 3, name: 'Langkah', description: 'Multi-langkah + steps. Prosedur lengkap.', masteryRequired: 42, totalNodes: 48, unlockRequirement: 'Master 42+ node Tier 2 + Ujian Promosi' },
  { tier: 4, name: 'Kasus', description: 'Soal cerita industri + visual interaktif.', masteryRequired: 40, totalNodes: 46, unlockRequirement: 'Master 40+ node Tier 3 + Ujian Promosi' },
  { tier: 5, name: 'Ujian Praktik', description: 'Mode ujian permanen campuran semua tier.', masteryRequired: 0, totalNodes: 0, unlockRequirement: 'Master 40+ node Tier 4 + Ujian Akhir' },
];

export function getNodesByTier(tier: number): NodeConfig[] {
  return SKILL_NODES.filter(n => n.tier === tier);
}

export function getNodeById(id: string): NodeConfig | undefined {
  return SKILL_NODES.find(n => n.id === id);
}

export function getUnlockedNodes(masteredNodes: Set<string>): NodeConfig[] {
  return SKILL_NODES.filter(node =>
    node.prereq.every(prereq => masteredNodes.has(prereq))
  );
}
