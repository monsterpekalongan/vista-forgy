// Generator family: Universal track (non-TI)
import type { RNG } from '../rng';
import type { QuestionSpec } from '../types';
import { buildNumericChoices } from './ari';
import { pickContext, contextEntity } from '../context';

// ── uni.break-even ─────────────────────────────────────────────────────────────
export function genUniBreakEven(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const ctx = pickContext(rng);
  const ent = contextEntity(rng, ctx);

  // FC (biaya tetap), VC/unit (biaya variabel), p (harga jual)
  const fc = rng.int(2, 20) * 500000; // Rp 1-10 juta
  const vc = rng.int(5, 40) * 1000;   // Rp 5-40 ribu per unit
  const markup = rng.int(20, 80) / 100;
  const p = Math.round(vc * (1 + markup) / 1000) * 1000; // harga jual (kelipatan ribuan)
  const cm = p - vc; // contribution margin
  const bepUnit = Math.ceil(fc / cm);
  if (bepUnit > 5000 || bepUnit < 50) return genUniBreakEven(rng, skillId, seed + 1);
  const bepRupiah = bepUnit * p;

  const variants = ['bep-unit', 'bep-rupiah', 'target-profit', 'margin-kontribusi'] as const;
  const variant = rng.pick([...variants]);

  let question = '';
  let answer = 0;
  let answerLatex = '';

  if (variant === 'bep-unit') {
    question = `Berapa unit BEP (titik impas)?`;
    answer = bepUnit;
    answerLatex = `BEQ = \\frac{FC}{p-VC} = \\frac{${(fc / 1000).toFixed(0)}k}{${(p / 1000).toFixed(0)}k-${(vc / 1000).toFixed(0)}k} = ${bepUnit}`;
  } else if (variant === 'bep-rupiah') {
    question = `Berapa pendapatan BEP (Rp)?`;
    answer = bepRupiah;
    answerLatex = `BEP_{Rp} = BEQ \\times p = ${bepUnit} \\times ${p.toLocaleString('id-ID')} = ${bepRupiah.toLocaleString('id-ID')}`;
  } else if (variant === 'target-profit') {
    const targetProfit = rng.int(2, 10) * fc / 10;
    const targetUnits = Math.ceil((fc + targetProfit) / cm);
    question = `Berapa unit harus dijual untuk memperoleh laba Rp${targetProfit.toLocaleString('id-ID')}?`;
    answer = targetUnits;
    answerLatex = `Q = \\frac{FC + \\text{Target Laba}}{p-VC} = ${targetUnits}`;
  } else {
    question = `Berapa margin kontribusi (contribution margin) per unit (Rp)?`;
    answer = cm;
    answerLatex = `CM = p - VC = ${p.toLocaleString('id-ID')} - ${vc.toLocaleString('id-ID')} = ${cm.toLocaleString('id-ID')}`;
  }

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: {
      text: `${ent.name} menjual ${ent.product} di ${ent.place}. Biaya tetap (FC) = Rp${fc.toLocaleString('id-ID')}/bulan. Biaya variabel (VC) = Rp${vc.toLocaleString('id-ID')}/unit. Harga jual = Rp${p.toLocaleString('id-ID')}/unit. ${question}`,
    },
    answer: { type: 'numeric', value: answer, tolerance: answer * 0.001 + 1 },
    solution: {
      title: 'Analisis Titik Impas (Break-Even Point)',
      steps: [
        { text: `Margin kontribusi per unit`, latex: `CM = p - VC = ${p.toLocaleString('id-ID')} - ${vc.toLocaleString('id-ID')} = ${cm.toLocaleString('id-ID')}` },
        { text: `BEP unit`, latex: `BEQ = \\frac{FC}{CM} = \\frac{${fc.toLocaleString('id-ID')}}{${cm.toLocaleString('id-ID')}} = ${bepUnit}` },
        { text: `Jawaban`, latex: answerLatex },
      ],
      finalLatex: answerLatex,
      takeaway: 'BEP = titik di mana pendapatan = total biaya. Di atas BEP = laba; di bawah = rugi.',
      misconceptionNote: 'Perhatikan: BEP unit ≠ BEP rupiah. Jangan lupa biaya tetap (FC) dalam perhitungan.',
    },
    targetMs: 120000,
    difficultyRating: 1200,
    tags: ['break-even', 'akuntansi-biaya', 'manajemen'],
  };
}

// ── uni.bunga-majemuk ─────────────────────────────────────────────────────────
export function genUniBungaMajemuk(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const ctx = pickContext(rng);
  const ent = contextEntity(rng, ctx);
  void ent;

  const P = rng.int(5, 50) * 1000000; // pokok
  const rPct = rng.pick([6, 8, 10, 12, 15] as number[]);
  const r = rPct / 100;
  const n = rng.int(2, 10); // tahun
  const FV = Math.round(P * Math.pow(1 + r, n));

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: {
      text: `Modal Rp${P.toLocaleString('id-ID')} didepositokan dengan bunga majemuk ${rPct}% per tahun selama ${n} tahun. Berapa nilai akhirnya (Rp)?`,
      latex: `FV = P(1+r)^n`,
    },
    answer: { type: 'numeric', value: FV, tolerance: FV * 0.001 },
    solution: {
      title: 'Bunga Majemuk',
      steps: [
        { text: 'Rumus bunga majemuk', latex: `FV = P(1+r)^n` },
        { text: 'Substitusi', latex: `FV = ${P.toLocaleString('id-ID')} \\times (1+${r})^{${n}} = ${FV.toLocaleString('id-ID')}` },
      ],
      finalLatex: `FV = ${FV.toLocaleString('id-ID')}`,
      takeaway: 'Bunga majemuk: bunga dihitung dari pokok + bunga sebelumnya → tumbuh eksponensial.',
    },
    targetMs: 90000,
    difficultyRating: 1150,
  };
}

// ── uni.margin-markup ──────────────────────────────────────────────────────────
export function genUniMarginMarkup(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const cost = rng.int(5, 50) * 10000;
  const markupPct = rng.pick([20, 25, 30, 40, 50, 60, 75, 100] as number[]);
  const sellPrice = cost * (1 + markupPct / 100);
  const profitRp = sellPrice - cost;
  const marginPct = Math.round((profitRp / sellPrice) * 1000) / 10;

  const variant = rng.int(0, 2);
  const ctx = pickContext(rng);
  const ent = contextEntity(rng, ctx);

  let question = '';
  let answer = 0;
  let choices: ReturnType<typeof buildNumericChoices>;

  if (variant === 0) {
    question = `${ent.name} membeli ${ent.product} seharga Rp${cost.toLocaleString('id-ID')} dan menjualnya dengan markup ${markupPct}%. Berapa harga jualnya?`;
    answer = sellPrice;
    choices = buildNumericChoices(rng, answer, [cost + markupPct * 1000, cost * markupPct / 100, cost + markupPct], 4);
  } else if (variant === 1) {
    question = `Harga jual Rp${sellPrice.toLocaleString('id-ID')}, harga beli Rp${cost.toLocaleString('id-ID')}. Berapa margin keuntungan (%) terhadap harga jual?`;
    answer = marginPct;
    choices = buildNumericChoices(rng, answer, [markupPct, marginPct + 5, marginPct - 3], 4);
  } else {
    question = `Harga jual Rp${sellPrice.toLocaleString('id-ID')}, markup ${markupPct}%. Berapa harga belinya?`;
    answer = cost;
    choices = buildNumericChoices(rng, answer, [sellPrice - markupPct * 1000, sellPrice * (1 - markupPct / 100), cost + 10000], 4);
  }

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'mc',
    prompt: { text: question },
    choices,
    answer: { type: 'mc', correctIndex: 0 },
    solution: {
      title: 'Margin dan Markup',
      steps: [
        { text: `Markup dihitung dari harga BELI: Harga jual = Harga beli × (1 + markup%)`, latex: `P_{jual} = P_{beli} \\times (1 + \\frac{markup}{100})` },
        { text: `Margin dihitung dari harga JUAL: Margin = Laba / Harga jual × 100%` },
        { text: `Jawaban: ${answer.toLocaleString('id-ID')}` },
      ],
      finalLatex: `${answer}`,
      takeaway: 'Markup = laba/biaya × 100%. Margin = laba/harga jual × 100%. Keduanya BERBEDA.',
      misconceptionNote: 'Margin ≠ markup. Markup 25% ≠ margin 25%.',
    },
    targetMs: 60000,
    difficultyRating: 1100,
  };
}
