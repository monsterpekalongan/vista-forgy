// Generator family: Aritmetika (Tier 0 & 1)
import type { RNG } from '../rng';
import type { QuestionSpec, Knobs } from '../types';
import { pickContext, contextEntity } from '../context';

// ── ari.tambah ─────────────────────────────────────────────────────────────
export function genAriTambah(rng: RNG, skillId: string, seed: number, knobs: Knobs): QuestionSpec {
  const mag = knobs.magnitude;
  const maxA = mag <= 1 ? 99 : mag === 2 ? 999 : 9999;
  const a = rng.int(10, maxA);
  const b = rng.int(10, maxA);
  const answer = a + b;
  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'mc',
    prompt: { text: `Berapa hasil dari ${a} + ${b}?`, latex: `${a} + ${b} = ?` },
    choices: buildNumericChoices(rng, answer, [answer - rng.int(1,5), answer + rng.int(1,5), answer - a, answer + 1], 4),
    answer: { type: 'mc', correctIndex: 0 },
    solution: {
      title: 'Penjumlahan',
      steps: [{ text: `${a} + ${b} = ${answer}` }],
      finalLatex: `${a}+${b}=${answer}`,
      takeaway: 'Pastikan carry-over dijumlahkan dari digit paling kanan.',
    },
    targetMs: 12000,
    difficultyRating: 900 + mag * 80,
    tags: [],
  };
}

// ── ari.kurang ──────────────────────────────────────────────────────────────
export function genAriKurang(rng: RNG, skillId: string, seed: number, knobs: Knobs): QuestionSpec {
  const mag = knobs.magnitude;
  const maxV = mag <= 1 ? 99 : 999;
  const a = rng.int(10, maxV);
  const b = rng.int(1, a);
  const answer = a - b;
  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'mc',
    prompt: { text: `Berapa hasil dari ${a} − ${b}?`, latex: `${a} - ${b} = ?` },
    choices: buildNumericChoices(rng, answer, [a + b, b - a, answer + 10, answer - 1], 4),
    answer: { type: 'mc', correctIndex: 0 },
    solution: {
      title: 'Pengurangan',
      steps: [{ text: `${a} − ${b} = ${answer}` }],
      finalLatex: `${a}-${b}=${answer}`,
      takeaway: 'Kurangkan dari kanan; jika digit atas < bawah, pinjam dari kiri.',
    },
    targetMs: 12000,
    difficultyRating: 900 + mag * 80,
  };
}

// ── ari.kali ────────────────────────────────────────────────────────────────
export function genAriKali(rng: RNG, skillId: string, seed: number, knobs: Knobs): QuestionSpec {
  const mag = knobs.magnitude;
  const maxA = mag <= 1 ? 12 : 25;
  const maxB = mag <= 1 ? 12 : 9;
  const a = rng.int(2, maxA);
  const b = rng.int(2, maxB);
  const answer = a * b;
  const d1 = a * (b + 1);
  const d2 = (a + 1) * b;
  const d3 = a + b;
  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'mc',
    prompt: { text: `Berapa hasil dari ${a} × ${b}?`, latex: `${a} \\times ${b} = ?` },
    choices: buildNumericChoices(rng, answer, [d1, d2, d3], 4),
    answer: { type: 'mc', correctIndex: 0 },
    solution: {
      title: 'Perkalian',
      steps: [{ text: `${a} × ${b} = ${answer}` }],
      finalLatex: `${a}\\times${b}=${answer}`,
      takeaway: 'Hafalkan tabel perkalian hingga 12×12 untuk kecepatan optimal.',
    },
    targetMs: 15000,
    difficultyRating: 920 + mag * 90,
  };
}

// ── ari.bagi ────────────────────────────────────────────────────────────────
export function genAriBagi(rng: RNG, skillId: string, seed: number, knobs: Knobs): QuestionSpec {
  const mag = knobs.magnitude;
  const maxQ = mag <= 1 ? 12 : 20;
  const q = rng.int(2, maxQ);
  const d = rng.int(2, 12);
  const a = q * d;
  const answer = q;
  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'mc',
    prompt: { text: `Berapa hasil dari ${a} ÷ ${d}?`, latex: `${a} \\div ${d} = ?` },
    choices: buildNumericChoices(rng, answer, [a * d, d, answer + 1, answer - 1], 4),
    answer: { type: 'mc', correctIndex: 0 },
    solution: {
      title: 'Pembagian',
      steps: [{ text: `${a} ÷ ${d} = ${q}` }],
      finalLatex: `${a}\\div${d}=${q}`,
      takeaway: 'Pembagian adalah operasi kebalikan perkalian.',
    },
    targetMs: 15000,
    difficultyRating: 930 + mag * 90,
  };
}

// ── ari.campur ──────────────────────────────────────────────────────────────
export function genAriCampur(rng: RNG, skillId: string, seed: number, _knobs: Knobs): QuestionSpec {
  // Build expression tree depth 2, result 0–99
  // Strategy: pick result r, then build expression
  const ops: ('+' | '-' | '*')[] = ['+', '-', '*'];
  void ops;
  let expr = '';
  let answer = 0;
  let latex = '';
  // a op1 (b op2 c) or (a op1 b) op2 c
  const variant = rng.int(0, 1);
  if (variant === 0) {
    // a + b * c  (multiplication first)
    const b = rng.int(2, 9);
    const c = rng.int(2, 9);
    const bc = b * c;
    const a = rng.int(1, 50);
    answer = a + bc;
    if (answer < 0 || answer > 150) return genAriCampur(rng, skillId, seed + 1, _knobs);
    expr = `${a} + ${b} × ${c}`;
    latex = `${a} + ${b} \\times ${c}`;
  } else {
    // (a + b) * c
    const a = rng.int(1, 10);
    const b = rng.int(1, 10);
    const c = rng.int(2, 5);
    answer = (a + b) * c;
    if (answer > 150) return genAriCampur(rng, skillId, seed + 1, _knobs);
    expr = `(${a} + ${b}) × ${c}`;
    latex = `(${a} + ${b}) \\times ${c}`;
  }
  // Distractors: left-to-right ignoring precedence
  const lrAnswer = variant === 0
    ? (answer + 0) // already correct
    : answer;
  const wrongLR = variant === 0
    ? rng.int(1, 10) + (expr.split('×')[1] ? parseInt(expr.split('×')[1].trim()) : 0)
    : 0;
  void ops; void lrAnswer; void wrongLR;

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'mc',
    prompt: { text: `Berapa nilai dari ${expr}?`, latex: `${latex} = ?` },
    choices: buildNumericChoices(rng, answer, [answer + rng.int(2,8), answer - rng.int(2,8), answer * 2], 4),
    answer: { type: 'mc', correctIndex: 0 },
    solution: {
      title: 'Urutan Operasi (KaBaTaKu)',
      steps: [
        { text: 'Kalikan/bagi dulu, baru tambah/kurang.', latex },
        { text: `Hasil = ${answer}` },
      ],
      finalLatex: `${latex} = ${answer}`,
      takeaway: 'Ingat prioritas operasi: kurung → pangkat → kali/bagi → tambah/kurang.',
    },
    targetMs: 20000,
    difficultyRating: 950,
  };
}

// ── ari.persen ──────────────────────────────────────────────────────────────
export function genAriPersen(rng: RNG, skillId: string, seed: number, knobs: Knobs): QuestionSpec {
  const ctx = pickContext(rng);
  const ent = contextEntity(rng, ctx);
  const percents = [5, 10, 15, 20, 25, 30, 40, 50, 75];
  const p = rng.pick(percents);
  const bases = [100, 200, 250, 400, 500, 800, 1000, 1500, 2000];
  const base = rng.pick(bases);
  const answer = (p / 100) * base;
  const variant = knobs.magnitude <= 1 ? 0 : rng.int(0, 2);

  let text = '';
  let finalLatex = '';
  if (variant === 0) {
    text = `${ent.name} di ${ent.place} mendapat diskon ${p}% dari harga Rp${base.toLocaleString('id-ID')}. Berapa rupiah diskonnya?`;
    finalLatex = `\\frac{${p}}{100} \\times ${base} = ${answer}`;
  } else if (variant === 1) {
    text = `Berapa persen nilai ${answer} dari ${base}?`;
    finalLatex = `\\frac{${answer}}{${base}} \\times 100 = ${p}\\%`;
  } else {
    const harga = answer;
    text = `Jika ${p}% dari harga suatu barang adalah Rp${harga.toLocaleString('id-ID')}, berapa harga aslinya?`;
    finalLatex = `\\frac{${harga}}{${p}} \\times 100 = ${base}`;
  }

  const realAnswer = variant === 1 ? p : variant === 2 ? base : answer;

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'mc',
    prompt: { text },
    choices: buildNumericChoices(rng, realAnswer, [realAnswer * 1.3, realAnswer * 0.7, base * (p / 100) + 10], 4),
    answer: { type: 'mc', correctIndex: 0 },
    solution: {
      title: 'Persen',
      steps: [
        { text: `Rumus: persen = (bagian ÷ total) × 100`, latex: `\\%=\\frac{bagian}{total}\\times100` },
        { text: `Hasil`, latex: finalLatex },
      ],
      finalLatex,
      takeaway: 'Persen = per seratus. 20% dari 500 = 20/100 × 500 = 100.',
      misconceptionNote: 'Jika menghitung persen dari basis yang salah, hasilnya keliru. Pastikan basisnya adalah nilai awal/total.',
    },
    targetMs: 20000,
    difficultyRating: 1000 + knobs.magnitude * 80,
  };
}

// ── ari.rasio ────────────────────────────────────────────────────────────────
export function genAriRasio(rng: RNG, skillId: string, seed: number, _knobs: Knobs): QuestionSpec {
  const a = rng.int(1, 5);
  const b = rng.int(1, 5);
  const total = rng.int(3, 10) * (a + b);
  const partA = (total / (a + b)) * a;
  const partB = (total / (a + b)) * b;
  const ctx = pickContext(rng);
  const ent = contextEntity(rng, ctx);
  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'mc',
    prompt: {
      text: `${ent.name} membagi ${total} ${ent.unit} dalam rasio ${a}:${b}. Berapa bagian yang lebih besar?`,
    },
    choices: buildNumericChoices(rng, Math.max(partA, partB), [Math.min(partA, partB), total, a + b], 4),
    answer: { type: 'mc', correctIndex: 0 },
    solution: {
      title: 'Rasio dan Proporsi',
      steps: [
        { text: `Total bagian: ${a} + ${b} = ${a + b}` },
        { text: `Nilai satu bagian: ${total} ÷ ${a + b} = ${total / (a + b)}` },
        { text: `Bagian terbesar: ${Math.max(a, b)} × ${total / (a + b)} = ${Math.max(partA, partB)}` },
      ],
      finalLatex: `\\frac{${Math.max(a, b)}}{${a + b}} \\times ${total} = ${Math.max(partA, partB)}`,
      takeaway: 'Rasio a:b berarti total dibagi (a+b) bagian, lalu kalikan.',
    },
    targetMs: 25000,
    difficultyRating: 1020,
  };
}

// ── ari.satuan ───────────────────────────────────────────────────────────────
export function genAriSatuan(rng: RNG, skillId: string, seed: number, _knobs: Knobs): QuestionSpec {
  type Conv = { from: string; to: string; factor: number; latex: string };
  const conversions: Conv[] = [
    { from: 'km', to: 'm', factor: 1000, latex: '1\\text{ km} = 1000\\text{ m}' },
    { from: 'kg', to: 'g', factor: 1000, latex: '1\\text{ kg} = 1000\\text{ g}' },
    { from: 'jam', to: 'menit', factor: 60, latex: '1\\text{ jam} = 60\\text{ menit}' },
    { from: 'm', to: 'cm', factor: 100, latex: '1\\text{ m} = 100\\text{ cm}' },
    { from: 'lusin', to: 'buah', factor: 12, latex: '1\\text{ lusin} = 12\\text{ buah}' },
  ];
  const conv = rng.pick(conversions);
  const val = rng.int(1, 20);
  const answer = val * conv.factor;
  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'mc',
    prompt: { text: `Berapa ${val} ${conv.from} jika dikonversi ke ${conv.to}?` },
    choices: buildNumericChoices(rng, answer, [val + conv.factor, val / conv.factor, answer + val], 4),
    answer: { type: 'mc', correctIndex: 0 },
    solution: {
      title: 'Konversi Satuan',
      steps: [
        { text: `Faktor konversi: ${conv.from} → ${conv.to}`, latex: conv.latex },
        { text: `${val} ${conv.from} = ${val} × ${conv.factor} = ${answer} ${conv.to}` },
      ],
      finalLatex: `${val} \\times ${conv.factor} = ${answer}`,
      takeaway: `Ingat faktor konversi: ${conv.from} ke ${conv.to} = × ${conv.factor}.`,
    },
    targetMs: 20000,
    difficultyRating: 980,
  };
}

// ── ari.negatif ──────────────────────────────────────────────────────────────
export function genAriNegatif(rng: RNG, skillId: string, seed: number, _knobs: Knobs): QuestionSpec {
  const a = rng.int(1, 20);
  const b = rng.int(1, 20);
  const ops: ('+' | '-' | '*')[] = ['+', '-', '*'];
  const op = rng.pick(ops);
  let answer: number;
  let exprText: string;
  let exprLatex: string;
  if (op === '+') {
    answer = -a + b;
    exprText = `(-${a}) + ${b}`;
    exprLatex = `(-${a}) + ${b}`;
  } else if (op === '-') {
    answer = a - (-b);
    exprText = `${a} - (-${b})`;
    exprLatex = `${a} - (-${b})`;
  } else {
    answer = -a * b;
    exprText = `(-${a}) × ${b}`;
    exprLatex = `(-${a}) \\times ${b}`;
  }
  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'mc',
    prompt: { text: `Berapa nilai dari ${exprText}?`, latex: `${exprLatex} = ?` },
    choices: buildNumericChoices(rng, answer, [-answer, Math.abs(answer), answer + 2], 4),
    answer: { type: 'mc', correctIndex: 0 },
    solution: {
      title: 'Bilangan Negatif',
      steps: [{ text: `${exprText} = ${answer}` }],
      finalLatex: `${exprLatex} = ${answer}`,
      takeaway: 'Dua tanda negatif = positif. Negatif × positif = negatif.',
    },
    targetMs: 15000,
    difficultyRating: 970,
  };
}

// ── ari.pecahan ──────────────────────────────────────────────────────────────
export function genAriPecahan(rng: RNG, skillId: string, seed: number, _knobs: Knobs): QuestionSpec {
  const dens = [2, 3, 4, 5, 6, 8, 10, 12];
  const d1 = rng.pick(dens);
  const n1 = rng.int(1, d1 - 1);
  const opsArr: ('+' | '-')[] = ['+', '-'];
  const op = rng.pick(opsArr);
  const d2 = rng.pick(dens);
  const n2 = rng.int(1, d2 - 1);
  // Compute via LCM
  const lcm = d1 * d2 / gcd(d1, d2);
  const rn1 = n1 * (lcm / d1);
  const rn2 = n2 * (lcm / d2);
  const numAnswer = op === '+' ? rn1 + rn2 : rn1 - rn2;
  if (numAnswer <= 0) return genAriPecahan(rng, skillId, seed + 1, _knobs);
  const g = gcd(Math.abs(numAnswer), lcm);
  const numS = numAnswer / g;
  const denS = lcm / g;

  const answerText = denS === 1 ? `${numS}` : `${numS}/${denS}`;
  const answerLatex = denS === 1 ? `${numS}` : `\\frac{${numS}}{${denS}}`;

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'mc',
    prompt: {
      text: `Berapa hasil dari ${n1}/${d1} ${op} ${n2}/${d2}? (Sederhanakan)`,
      latex: `\\frac{${n1}}{${d1}} ${op === '+' ? '+' : '-'} \\frac{${n2}}{${d2}} = ?`,
    },
    choices: [
      { text: answerText, latex: answerLatex, isCorrect: true },
      { text: `${n1 + n2}/${d1 + d2}`, latex: `\\frac{${n1 + n2}}{${d1 + d2}}`, isCorrect: false, misconceptionTag: 'jumlah-penyebut-langsung' },
      { text: `${rn1 + rn2}/${lcm}`, latex: `\\frac{${rn1 + rn2}}{${lcm}}`, isCorrect: numS === rn1 + rn2 && denS === lcm ? true : false, misconceptionTag: 'belum-disederhanakan' },
      { text: `${n1 * n2}/${d1 * d2}`, latex: `\\frac{${n1 * n2}}{${d1 * d2}}`, isCorrect: false, misconceptionTag: 'mengalikan-bukan-menjumlah' },
    ].filter((c, i, arr) => arr.findIndex(x => x.latex === c.latex) === i).slice(0, 4),
    answer: { type: 'mc', correctIndex: 0 },
    solution: {
      title: 'Operasi Pecahan',
      steps: [
        { text: `KPK dari ${d1} dan ${d2} adalah ${lcm}` },
        { text: `Samakan penyebut`, latex: `\\frac{${rn1}}{${lcm}} ${op === '+' ? '+' : '-'} \\frac{${rn2}}{${lcm}} = \\frac{${numAnswer}}{${lcm}}` },
        { text: `Sederhanakan (bagi ${g})`, latex: answerLatex },
      ],
      finalLatex: answerLatex,
      takeaway: 'Samakan penyebut dulu via KPK, baru operasikan pembilang, lalu sederhanakan.',
      misconceptionNote: 'Kesalahan umum: menjumlahkan penyebut langsung (1/2 + 1/3 ≠ 2/5).',
    },
    targetMs: 25000,
    difficultyRating: 1030,
  };
}

// ── ari.desimal ──────────────────────────────────────────────────────────────
export function genAriDesimal(rng: RNG, skillId: string, seed: number, _knobs: Knobs): QuestionSpec {
  const a = rng.int(1, 99) / 10;
  const b = rng.int(1, 99) / 10;
  const op = rng.pick(['+', '-'] as ('+' | '-')[]);
  const answer = op === '+' ? Math.round((a + b) * 10) / 10 : Math.round((a - b) * 10) / 10;
  if (answer < 0) return genAriDesimal(rng, skillId, seed + 1, _knobs);
  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: { text: `Berapa ${a.toFixed(1).replace('.', ',')} ${op} ${b.toFixed(1).replace('.', ',')}?`, latex: `${a} ${op === '+' ? '+' : '-'} ${b} = ?` },
    answer: { type: 'numeric', value: answer, tolerance: 0.01 },
    solution: {
      title: 'Operasi Desimal',
      steps: [{ text: `Sejajarkan koma desimal dan ${op === '+' ? 'jumlahkan' : 'kurangkan'}` }, { text: `Hasil: ${answer.toFixed(1)}` }],
      finalLatex: `${a} ${op === '+' ? '+' : '-'} ${b} = ${answer}`,
      takeaway: 'Sejajarkan koma desimal saat menjumlahkan/mengurangkan.',
    },
    targetMs: 20000,
    difficultyRating: 1010,
  };
}

// ── ari.bulat ────────────────────────────────────────────────────────────────
export function genAriBulat(rng: RNG, skillId: string, seed: number, _knobs: Knobs): QuestionSpec {
  const val = rng.int(100, 9999);
  const roundTo = rng.pick([10, 100, 1000] as number[]);
  const answer = Math.round(val / roundTo) * roundTo;
  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'mc',
    prompt: { text: `Bulatkan ${val.toLocaleString('id-ID')} ke ${roundTo} terdekat.` },
    choices: buildNumericChoices(rng, answer, [Math.floor(val / roundTo) * roundTo, Math.ceil(val / roundTo) * roundTo, answer + roundTo], 4),
    answer: { type: 'mc', correctIndex: 0 },
    solution: {
      title: 'Pembulatan',
      steps: [
        { text: `Digit penentu: ${val % roundTo >= roundTo / 2 ? 'lebih dari setengah → naik' : 'kurang dari setengah → turun'}` },
        { text: `${val} dibulatkan ke ${roundTo} terdekat = ${answer}` },
      ],
      finalLatex: `\\approx ${answer}`,
      takeaway: '< 5 → turun; ≥ 5 → naik ke puluhan/ratusan berikutnya.',
    },
    targetMs: 15000,
    difficultyRating: 960,
  };
}

// ── HELPER FUNCTIONS ─────────────────────────────────────────────────────────
function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

export function buildNumericChoices(rng: RNG, correct: number, distractors: number[], count: number) {
  const seen = new Set<number>();
  seen.add(correct);
  const opts: { value: number; tag?: string }[] = [{ value: correct }];
  for (const d of distractors) {
    const rd = Math.round(d * 100) / 100;
    if (!seen.has(rd) && !isNaN(rd) && isFinite(rd)) {
      seen.add(rd);
      opts.push({ value: rd });
    }
    if (opts.length >= count) break;
  }
  // fill if needed
  let offset = 1;
  while (opts.length < count) {
    const v = correct + offset * (rng.int(0, 1) ? 1 : -1);
    if (!seen.has(v)) { seen.add(v); opts.push({ value: v }); }
    offset++;
  }
  // shuffle
  const shuffled = rng.shuffle(opts);
  return shuffled.map((o, i) => ({
    text: formatNumber(o.value),
    latex: `${o.value}`,
    isCorrect: o.value === correct,
    misconceptionTag: i === 0 ? undefined : o.tag,
  }));
}

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toLocaleString('id-ID');
  return n.toFixed(2).replace('.', ',');
}
