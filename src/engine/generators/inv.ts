// Generator family: Persediaan/Inventori (Tier 4)
import type { RNG } from '../rng';
import type { QuestionSpec } from '../types';
import { pickContext, contextEntity } from '../context';

// ── inv.eoq (flagship visual) ─────────────────────────────────────────────────
export function genInvEoq(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const ctx = pickContext(rng);
  const ent = contextEntity(rng, ctx);

  // D (permintaan/tahun), S (biaya pesan), H (biaya simpan/unit/tahun)
  // EOQ = sqrt(2DS/H), build so Q* is integer
  const Q_star = rng.int(3, 20) * 10; // multiples of 10 for nice numbers
  const H = rng.int(1, 10) * 1000; // Rp per unit per tahun
  // D and S such that 2DS/H = Q*^2
  // D = Q*^2 * H / (2S). Choose S first
  const S_choices = [50000, 100000, 150000, 200000, 250000];
  const S = rng.pick(S_choices);
  const D = (Q_star * Q_star * H) / (2 * S);
  if (!Number.isInteger(D) || D < 100 || D > 10000) return genInvEoq(rng, skillId, seed + 1);

  const TC = (D / Q_star) * S + (Q_star / 2) * H;
  const ordersPerYear = D / Q_star;
  const cycleTimeDays = Math.round((Q_star / D) * 365);

  const variants = ['eoq', 'orders-per-year', 'tc', 'cycle-time'] as const;
  const variant = rng.pick([...variants]);

  let question = '';
  let answer = 0;
  let answerLatex = '';

  if (variant === 'eoq') {
    question = `Berapa kuantitas pemesanan ekonomis EOQ (unit)?`;
    answer = Q_star;
    answerLatex = `EOQ = \\sqrt{\\frac{2 \\times ${D} \\times ${S.toLocaleString('id-ID')}}{${H.toLocaleString('id-ID')}}} = ${Q_star}`;
  } else if (variant === 'orders-per-year') {
    question = `Berapa kali pemesanan optimal per tahun?`;
    answer = ordersPerYear;
    answerLatex = `N = \\frac{D}{Q^*} = \\frac{${D}}{${Q_star}} = ${ordersPerYear}`;
  } else if (variant === 'tc') {
    question = `Berapa total biaya persediaan tahunan optimal (Rp)?`;
    answer = TC;
    answerLatex = `TC = \\frac{D}{Q^*}S + \\frac{Q^*}{2}H = ${TC.toLocaleString('id-ID')}`;
  } else {
    question = `Berapa siklus pemesanan (hari), jika 1 tahun = 365 hari?`;
    answer = cycleTimeDays;
    answerLatex = `T = \\frac{Q^*}{D} \\times 365 = ${cycleTimeDays}`;
  }

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: {
      text: `${ent.name} di ${ent.place} menghadapi permintaan ${ent.product} sebesar D = ${D.toLocaleString('id-ID')} unit/tahun. Biaya pemesanan (ordering cost) S = Rp${S.toLocaleString('id-ID')}/pesan. Biaya simpan (holding cost) H = Rp${H.toLocaleString('id-ID')}/unit/tahun. ${question}`,
      visual: {
        type: 'eoq-chart',
        data: { D, S, H, Q_star, TC },
      },
    },
    answer: { type: 'numeric', value: answer, tolerance: variant === 'tc' ? 1 : 0.1 },
    solution: {
      title: 'EOQ — Economic Order Quantity',
      steps: [
        { text: 'Rumus EOQ:', latex: `EOQ = \\sqrt{\\frac{2DS}{H}}` },
        { text: `Substitusi nilai`, latex: `EOQ = \\sqrt{\\frac{2 \\times ${D} \\times ${S.toLocaleString('id-ID')}}{${H.toLocaleString('id-ID')}}} = \\sqrt{${Q_star * Q_star}} = ${Q_star}` },
        { text: 'Verifikasi TC minimum:', latex: `TC = \\frac{${D}}{${Q_star}} \\times ${S.toLocaleString('id-ID')} + \\frac{${Q_star}}{2} \\times ${H.toLocaleString('id-ID')} = ${TC.toLocaleString('id-ID')}` },
        { text: `Jawaban: ${answerLatex}` },
      ],
      finalLatex: answerLatex,
      takeaway: 'EOQ meminimalkan total biaya simpan + pesan. Biaya minimum terjadi saat biaya pesan = biaya simpan.',
      misconceptionNote: 'Perhatikan: H dan S sering tertukar. H = biaya SIMPAN per unit per tahun; S = biaya PESAN per transaksi.',
    },
    targetMs: 300000,
    difficultyRating: 1500,
    tags: ['persediaan', 'EOQ', 'inventori'],
  };
}
