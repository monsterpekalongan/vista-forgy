// Skill Tree — semua node, tier, prereq, config
import type { NodeConfig } from '../engine/types';

export const SKILL_NODES: NodeConfig[] = [
  // ── TIER 0: PEMANASAN ─────────────────────────────────────────────────────
  // Domain A — Aritmetika
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

  // Domain B — Aljabar Permulaan
  { id: 'alj.substitusi', name: 'Substitusi Nilai', family: 'alj.linear1', tier: 0, format: 'mc', targetMs: 25000, prereq: ['ari.campur'], masteryTarget: 3, difficultyRange: [1000, 1080] },
  { id: 'alj.suku-sejenis', name: 'Suku Sejenis', family: 'alj.linear1', tier: 0, format: 'mc', targetMs: 25000, prereq: ['alj.substitusi'], masteryTarget: 3, difficultyRange: [1010, 1090] },
  { id: 'alj.linear1', name: 'Linear 1 Langkah', family: 'alj.linear1', tier: 0, format: 'numeric', targetMs: 30000, prereq: ['alj.suku-sejenis'], masteryTarget: 3, difficultyRange: [1050, 1130] },
  { id: 'alj.linear2', name: 'Linear 2 Langkah', family: 'alj.linear2', tier: 0, format: 'numeric', targetMs: 35000, prereq: ['alj.linear1'], masteryTarget: 3, difficultyRange: [1070, 1150] },
  { id: 'alj.distributif', name: 'Distributif', family: 'alj.linear2', tier: 0, format: 'mc', targetMs: 30000, prereq: ['alj.linear2'], masteryTarget: 3, difficultyRange: [1060, 1140] },
  { id: 'alj.pertidaksamaan', name: 'Pertidaksamaan', family: 'alj.linear2', tier: 0, format: 'mc', targetMs: 35000, prereq: ['alj.linear2'], masteryTarget: 3, difficultyRange: [1080, 1160] },
  { id: 'alj.sistem-mudah', name: 'Sistem Persamaan (mudah)', family: 'alj.sistem2var', tier: 0, format: 'numeric', targetMs: 45000, prereq: ['alj.pertidaksamaan'], masteryTarget: 3, difficultyRange: [1100, 1200] },
  { id: 'alj.kpk', name: 'Pemfaktoran KPK', family: 'alj.linear1', tier: 0, format: 'mc', targetMs: 30000, prereq: ['ari.pecahan'], masteryTarget: 3, difficultyRange: [1020, 1100] },

  // Domain C — Logika Dasar
  { id: 'log.pernyataan', name: 'Pernyataan & Negasi', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 30000, prereq: [], masteryTarget: 3, difficultyRange: [950, 1050] },
  { id: 'log.konjungsi', name: 'Konjungsi & Disjungsi', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 30000, prereq: ['log.pernyataan'], masteryTarget: 3, difficultyRange: [980, 1080] },
  { id: 'log.implikasi', name: 'Implikasi', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 35000, prereq: ['log.konjungsi'], masteryTarget: 3, difficultyRange: [1000, 1100] },
  { id: 'log.silogisme', name: 'Silogisme', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 40000, prereq: ['log.implikasi'], masteryTarget: 3, difficultyRange: [1020, 1120] },
  { id: 'log.pola', name: 'Pola Barisan', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 35000, prereq: ['ari.campur'], masteryTarget: 3, difficultyRange: [1000, 1100] },

  // Domain D — Data
  { id: 'dat.tabel', name: 'Baca Tabel', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 30000, prereq: [], masteryTarget: 3, difficultyRange: [950, 1050] },
  { id: 'dat.mean', name: 'Mean Sederhana', family: 'ari.campur', tier: 0, format: 'numeric', targetMs: 35000, prereq: ['dat.tabel'], masteryTarget: 3, difficultyRange: [980, 1080] },
  { id: 'dat.median-modus', name: 'Median & Modus', family: 'ari.campur', tier: 0, format: 'mc', targetMs: 40000, prereq: ['dat.mean'], masteryTarget: 3, difficultyRange: [1000, 1100] },

  // ── TIER 1: DASAR ─────────────────────────────────────────────────────────
  { id: 'ari2.persen-naik', name: 'Persen Kenaikan/Penurunan', family: 'ari.persen', tier: 1, format: 'numeric', targetMs: 30000, prereq: ['ari.persen', 'ari.rasio'], masteryTarget: 3, difficultyRange: [1050, 1150] },
  { id: 'ari2.diskon', name: 'Diskon Berlapis', family: 'ari.persen', tier: 1, format: 'mc', targetMs: 35000, prereq: ['ari2.persen-naik'], masteryTarget: 3, difficultyRange: [1060, 1160] },
  { id: 'ari2.bunga', name: 'Bunga Sederhana', family: 'uni.bunga-majemuk', tier: 1, format: 'numeric', targetMs: 40000, prereq: ['ari2.persen-naik'], masteryTarget: 3, difficultyRange: [1070, 1170] },
  { id: 'ari2.pangkat-akar', name: 'Pangkat & Akar', family: 'alj.eksponen', tier: 1, format: 'mc', targetMs: 25000, prereq: ['ari.campur'], masteryTarget: 3, difficultyRange: [1050, 1150] },

  { id: 'alj2.word-linear', name: 'Soal Cerita Linear', family: 'alj.sistem2var', tier: 1, format: 'numeric', targetMs: 60000, prereq: ['alj.sistem-mudah'], masteryTarget: 3, difficultyRange: [1100, 1200] },
  { id: 'alj2.sistem2var', name: 'Sistem 2 Variabel', family: 'alj.sistem2var', tier: 1, format: 'numeric', targetMs: 60000, prereq: ['alj2.word-linear'], masteryTarget: 3, difficultyRange: [1150, 1250] },
  { id: 'alj2.kuadrat', name: 'Persamaan Kuadrat', family: 'alj.kuadrat', tier: 1, format: 'mc', targetMs: 40000, prereq: ['alj.linear2'], masteryTarget: 3, difficultyRange: [1100, 1200] },
  { id: 'alj2.eksponen', name: 'Aturan Eksponen', family: 'alj.eksponen', tier: 1, format: 'mc', targetMs: 30000, prereq: ['ari2.pangkat-akar'], masteryTarget: 3, difficultyRange: [1080, 1180] },

  { id: 'dat2.mean-frek', name: 'Mean Data Berfrekuensi', family: 'ari.campur', tier: 1, format: 'numeric', targetMs: 45000, prereq: ['dat.median-modus'], masteryTarget: 3, difficultyRange: [1080, 1180] },
  { id: 'dat2.sdev', name: 'Simpangan Baku', family: 'ari.campur', tier: 1, format: 'numeric', targetMs: 60000, prereq: ['dat2.mean-frek'], masteryTarget: 3, difficultyRange: [1100, 1200] },

  // ── TIER 2: TANPA ALAT ────────────────────────────────────────────────────
  { id: 'kald.power', name: 'Turunan Power Rule', family: 'kald.power', tier: 2, format: 'numeric', targetMs: 20000, prereq: ['alj2.eksponen'], masteryTarget: 3, difficultyRange: [1100, 1300] },
  { id: 'kald.chain', name: 'Aturan Rantai', family: 'kald.chain', tier: 2, format: 'numeric', targetMs: 30000, prereq: ['kald.power'], masteryTarget: 3, difficultyRange: [1200, 1400] },
  { id: 'kald.limit', name: 'Limit Polinomial', family: 'kald.limit', tier: 2, format: 'numeric', targetMs: 20000, prereq: ['alj2.kuadrat'], masteryTarget: 3, difficultyRange: [1100, 1250] },

  // ── TIER 3: LANGKAH ───────────────────────────────────────────────────────
  { id: 'pro.bayes', name: 'Teorema Bayes', family: 'pro.bayes', tier: 3, format: 'numeric', targetMs: 120000, prereq: ['dat2.sdev'], masteryTarget: 3, difficultyRange: [1300, 1500] },
  { id: 'pro.kombinasi', name: 'Kombinasi & Permutasi', family: 'pro.kombinasi', tier: 3, format: 'mc', targetMs: 90000, prereq: ['ari.rasio'], masteryTarget: 3, difficultyRange: [1250, 1450] },
  { id: 'inf.ci-mean', name: 'Interval Kepercayaan Mean', family: 'inf.ci-mean', tier: 3, format: 'numeric', targetMs: 150000, prereq: ['dat2.sdev'], masteryTarget: 3, difficultyRange: [1350, 1550] },

  // ── TIER 4: KASUS ─────────────────────────────────────────────────────────
  { id: 'rso.lp-grafis', name: 'LP Grafis', family: 'rso.lp-grafis', tier: 4, format: 'steps', targetMs: 420000, prereq: ['kald.limit'], masteryTarget: 3, difficultyRange: [1500, 1800] },
  { id: 'rso.transportasi', name: 'Transportasi NWC', family: 'rso.transportasi', tier: 4, format: 'numeric', targetMs: 300000, prereq: ['rso.lp-grafis'], masteryTarget: 3, difficultyRange: [1450, 1700] },
  { id: 'rso.pert', name: 'PERT & CPM', family: 'rso.pert', tier: 4, format: 'numeric', targetMs: 420000, prereq: ['dat2.sdev'], masteryTarget: 3, difficultyRange: [1450, 1700] },
  { id: 'inv.eoq', name: 'EOQ — Inventori', family: 'inv.eoq', tier: 4, format: 'numeric', targetMs: 300000, prereq: ['ari2.bunga'], masteryTarget: 3, difficultyRange: [1400, 1650] },
  { id: 'ant.mm1', name: 'Antrean M/M/1', family: 'ant.mm1', tier: 4, format: 'numeric', targetMs: 240000, prereq: ['pro.bayes'], masteryTarget: 3, difficultyRange: [1400, 1650] },

  // ── UNIVERSAL ─────────────────────────────────────────────────────────────
  { id: 'uni.break-even', name: 'Break-Even Analysis', family: 'uni.break-even', tier: 1, format: 'numeric', targetMs: 120000, prereq: ['ari.persen'], masteryTarget: 3, difficultyRange: [1100, 1300] },
  { id: 'uni.bunga-majemuk', name: 'Bunga Majemuk', family: 'uni.bunga-majemuk', tier: 1, format: 'numeric', targetMs: 90000, prereq: ['ari2.bunga'], masteryTarget: 3, difficultyRange: [1100, 1250] },
  { id: 'uni.margin-markup', name: 'Margin & Markup', family: 'uni.margin-markup', tier: 0, format: 'mc', targetMs: 60000, prereq: ['ari.persen'], masteryTarget: 3, difficultyRange: [1050, 1200] },
];

export const TIER_CONFIG = [
  { tier: 0, name: 'Pemanasan', description: 'MC + hint, tanpa timer. Bangun fondasi & kebiasaan.', masteryRequired: 20, totalNodes: 33, unlockRequirement: 'Selesaikan 20 node Tier 0' },
  { tier: 1, name: 'Dasar', description: 'MC tanpa hint + numeric. Retrieval murni.', masteryRequired: 25, totalNodes: 37, unlockRequirement: 'Master 20+ node Tier 0 + Ujian Promosi' },
  { tier: 2, name: 'Tanpa Alat', description: 'Numeric ketik + timer ketat. Otomatisasi mental.', masteryRequired: 20, totalNodes: 30, unlockRequirement: 'Master 25+ node Tier 1 + Ujian Promosi' },
  { tier: 3, name: 'Langkah', description: 'Multi-langkah + steps. Prosedur lengkap.', masteryRequired: 20, totalNodes: 48, unlockRequirement: 'Master 20+ node Tier 2 + Ujian Promosi' },
  { tier: 4, name: 'Kasus', description: 'Soal cerita industri + visual interaktif.', masteryRequired: 15, totalNodes: 46, unlockRequirement: 'Master 20+ node Tier 3 + Ujian Promosi' },
  { tier: 5, name: 'Ujian Praktik', description: 'Mode ujian permanen campuran semua tier.', masteryRequired: 0, totalNodes: 0, unlockRequirement: 'Master 15+ node Tier 4 + Ujian Akhir' },
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
