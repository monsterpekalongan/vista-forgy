// Generator family: Riset Operasi (Tier 4)
import type { RNG } from '../rng';
import type { QuestionSpec } from '../types';
import { pickContext, contextEntity } from '../context';

// ── rso.lp-grafis (flagship visual) ─────────────────────────────────────────
export function genRsoLpGrafis(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const ctx = pickContext(rng);
  const ent = contextEntity(rng, ctx);

  // Build LP: maximize c1*x + c2*y subject to a1*x+b1*y<=r1, a2*x+b2*y<=r2, x,y>=0
  // Ensure bounded, non-trivial optimal at corner point
  const x_opt = rng.int(2, 8);
  const y_opt = rng.int(2, 8);

  // Constraint 1: a1*x + b1*y <= r1, binding at (x_opt, y_opt)
  const a1 = rng.int(1, 4);
  const b1 = rng.int(1, 4);
  const r1 = a1 * x_opt + b1 * y_opt;

  // Constraint 2: a2*x + b2*y <= r2, binding at (x_opt, y_opt)
  const a2 = rng.int(1, 4);
  let b2 = rng.int(1, 4);
  while (a1 * b2 === a2 * b1) b2 = rng.int(1, 4); // ensure independent
  const r2 = a2 * x_opt + b2 * y_opt;

  // Objective: c1*x + c2*y, maximize
  const c1 = rng.int(2, 8);
  const c2 = rng.int(2, 8);
  const optValue = c1 * x_opt + c2 * y_opt;

  // Verify: corners are (0,0), (r1/a1, 0), (0, r1/b1), and (x_opt, y_opt)
  const corners = [
    { x: 0, y: 0 },
    { x: r1 / a1, y: 0 },
    { x: 0, y: r1 / b1 },
    { x: x_opt, y: y_opt },
  ].filter(pt => a2 * pt.x + b2 * pt.y <= r2 + 0.01);

  const maxObj = Math.max(...corners.map(pt => c1 * pt.x + c2 * pt.y));
  if (Math.abs(maxObj - optValue) > 0.1) {
    return genRsoLpGrafis(rng, skillId, seed + 500);
  }

  const productA = ent.product;
  const productB = rng.pick(['varian B', 'varian premium', 'produk kedua', 'tipe lain']);

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'steps',
    prompt: {
      text: `${ent.name} di ${ent.place} memproduksi dua jenis produk: ${productA} (x unit) dan ${productB} (y unit). Kendala jam kerja: ${a1}x + ${b1}y ≤ ${r1}. Kendala bahan baku: ${a2}x + ${b2}y ≤ ${r2}. Dengan x,y ≥ 0. Fungsi tujuan: maksimumkan Z = ${c1}x + ${c2}y. Tentukan nilai x, y, dan Z optimal.`,
      latex: `\\max Z = ${c1}x + ${c2}y`,
      visual: {
        type: 'lp-graph',
        data: { a1, b1, r1, a2, b2, r2, c1, c2, x_opt, y_opt, optValue },
      },
    },
    answer: { type: 'steps', stepValues: [x_opt, y_opt, optValue] },
    solution: {
      title: 'Program Linear — Metode Grafis',
      steps: [
        { text: `Gambar kendala (constraint) sebagai garis.` },
        { text: `Kendala 1: ${a1}x + ${b1}y = ${r1} (garis)`, latex: `${a1}x + ${b1}y \\leq ${r1}` },
        { text: `Kendala 2: ${a2}x + ${b2}y = ${r2} (garis)`, latex: `${a2}x + ${b2}y \\leq ${r2}` },
        { text: `Temukan titik sudut (corner points) daerah layak (feasible region).` },
        { text: `Titik potong kendala 1 & 2: eliminasi → x = ${x_opt}, y = ${y_opt}` },
        { text: `Evaluasi fungsi tujuan di setiap titik sudut.`, latex: `Z(${x_opt}, ${y_opt}) = ${c1}(${x_opt}) + ${c2}(${y_opt}) = ${optValue}` },
        { text: `Nilai maksimum Z = ${optValue} dicapai pada x = ${x_opt}, y = ${y_opt}.` },
      ],
      finalLatex: `Z^* = ${optValue},\\ x=${x_opt},\\ y=${y_opt}`,
      takeaway: 'Solusi optimal LP selalu di titik sudut daerah layak. Evaluasi semua titik sudut.',
      misconceptionNote: 'Jangan lupa cek semua titik sudut, termasuk (0,0) dan titik pada sumbu.',
    },
    targetMs: 420000,
    difficultyRating: 1600,
    tags: ['riset-operasi', 'linear-programming', 'grafis'],
  };
}

// ── rso.transportasi ──────────────────────────────────────────────────────────
export function genRsoTransportasi(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const ctx = pickContext(rng);
  const ent = contextEntity(rng, ctx);

  // 2 sumber, 3 tujuan, biaya matriks, suplai & permintaan seimbang
  const supply = [rng.int(20, 50), rng.int(20, 50)];
  const totalSupply = supply[0] + supply[1];
  const demand = [rng.int(10, 30), rng.int(10, 30)];
  demand.push(totalSupply - demand[0] - demand[1]);
  if (demand[2] <= 0) return genRsoTransportasi(rng, skillId, seed + 1);

  const costs = [
    [rng.int(2, 10), rng.int(2, 10), rng.int(2, 10)],
    [rng.int(2, 10), rng.int(2, 10), rng.int(2, 10)],
  ];

  // NWCM (North-West Corner): get initial solution
  const alloc = [[0, 0, 0], [0, 0, 0]];
  const s = [...supply];
  const d = [...demand];
  let i = 0, j = 0;
  while (i < 2 && j < 3) {
    const qty = Math.min(s[i], d[j]);
    alloc[i][j] = qty;
    s[i] -= qty; d[j] -= qty;
    if (s[i] === 0) i++; else j++;
  }

  const totalCost = alloc.reduce((sum, row, ri) =>
    sum + row.reduce((s2, q, ci) => s2 + q * costs[ri][ci], 0), 0);

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: {
      text: `Masalah transportasi (${ent.place}): 2 gudang asal (suplai: ${supply[0]}, ${supply[1]} unit) ke 3 tujuan (permintaan: ${demand[0]}, ${demand[1]}, ${demand[2]} unit). Biaya (ribu Rp/unit): [${costs[0].join(', ')}] dan [${costs[1].join(', ')}]. Gunakan metode North-West Corner. Berapa total biaya awal (ribu Rp)?`,
    },
    answer: { type: 'numeric', value: totalCost, tolerance: 0.5 },
    solution: {
      title: 'Metode North-West Corner',
      steps: [
        { text: `Mulai dari pojok kiri atas (NW), alokasikan min(suplai, permintaan).` },
        { text: `Alokasi: [${alloc[0].join(', ')}] dan [${alloc[1].join(', ')}]` },
        { text: `Total biaya = Σ (alokasi × biaya) = ${totalCost} (ribu Rp)` },
      ],
      finalLatex: `TC = ${totalCost}`,
      takeaway: 'NWC memberikan solusi awal layak; perlu uji MODI/stepping-stone untuk optimasi.',
    },
    targetMs: 300000,
    difficultyRating: 1500,
  };
}

// ── rso.pert ──────────────────────────────────────────────────────────────────
export function genRsoPert(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const ctx = pickContext(rng);
  const ent = contextEntity(rng, ctx);
  void ent;

  // 5 aktivitas linear A→B→C→D→E
  const activities = ['A', 'B', 'C', 'D', 'E'];
  const perts = activities.map(() => {
    const a = rng.int(1, 5);
    const m = rng.int(a + 1, a + 5);
    const b = rng.int(m + 1, m + 6);
    const te = Math.round(((a + 4 * m + b) / 6) * 10) / 10;
    const variance = Math.round(Math.pow((b - a) / 6, 2) * 100) / 100;
    return { a, m, b, te, variance };
  });

  const totalTE = Math.round(perts.reduce((s, p) => s + p.te, 0) * 10) / 10;
  const totalVar = Math.round(perts.reduce((s, p) => s + p.variance, 0) * 100) / 100;

  const variant = rng.int(0, 1);

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: {
      text: `Proyek dengan 5 aktivitas berurutan (A→B→C→D→E). Tiga estimasi waktu (optimis, paling mungkin, pesimis) hari: A(${perts[0].a},${perts[0].m},${perts[0].b}), B(${perts[1].a},${perts[1].m},${perts[1].b}), C(${perts[2].a},${perts[2].m},${perts[2].b}), D(${perts[3].a},${perts[3].m},${perts[3].b}), E(${perts[4].a},${perts[4].m},${perts[4].b}). Berapa ${variant === 0 ? 'waktu ekspektasi total jalur (hari)' : 'varians total jalur'}?`,
    },
    answer: { type: 'numeric', value: variant === 0 ? totalTE : totalVar, tolerance: 0.1 },
    solution: {
      title: 'PERT — Waktu Ekspektasi dan Varians',
      steps: [
        { text: 'Rumus PERT:', latex: `t_E = \\frac{a + 4m + b}{6}, \\quad \\sigma^2 = \\left(\\frac{b-a}{6}\\right)^2` },
        ...perts.map((p, i) => ({ text: `Aktivitas ${activities[i]}: tE = (${p.a}+4×${p.m}+${p.b})/6 = ${p.te}`, latex: `t_E = ${p.te},\\ \\sigma^2 = ${p.variance}` })),
        { text: `Total: TE = ${totalTE} hari, Varians = ${totalVar}` },
      ],
      finalLatex: variant === 0 ? `TE_{total} = ${totalTE}` : `\\sigma^2_{total} = ${totalVar}`,
      takeaway: 'PERT: waktu ekspektasi = rata-rata berbobot 3 estimasi; varians jalur = jumlah varians aktivitas kritis.',
    },
    targetMs: 420000,
    difficultyRating: 1550,
  };
}
