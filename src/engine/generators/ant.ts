// Generator family: Antrean M/M/1 (Tier 4)
import type { RNG } from '../rng';
import type { QuestionSpec } from '../types';
import { pickContext, contextEntity } from '../context';

// ── ant.mm1 ───────────────────────────────────────────────────────────────────
export function genAntMm1(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const ctx = pickContext(rng);
  const ent = contextEntity(rng, ctx);

  // λ dan μ dipilih agar ρ = λ/μ ∈ [0.6, 0.9] dan hasilnya "cantik"
  // Build from ρ: pick ρ = {0.6, 0.7, 0.75, 0.8, 0.9}
  const rhoChoices = [0.6, 0.7, 0.75, 0.8, 0.9];
  const rho = rng.pick(rhoChoices);
  const mu = rng.int(3, 12); // pelanggan per menit
  const lambda = Math.round(rho * mu * 10) / 10;
  const rhoActual = lambda / mu;

  // M/M/1 formulas
  const Ls = rhoActual / (1 - rhoActual);
  const Lq = rhoActual * rhoActual / (1 - rhoActual);
  const Ws = 1 / (mu - lambda);
  const Wq = rhoActual / (mu - lambda);

  const roundTo2 = (n: number) => Math.round(n * 100) / 100;

  const metrics = [
    { key: 'rho', label: 'faktor utilisasi (ρ = λ/μ)', value: roundTo2(rhoActual), latex: '\\rho = \\frac{\\lambda}{\\mu}' },
    { key: 'Ls', label: 'rata-rata pelanggan dalam sistem (Ls)', value: roundTo2(Ls), latex: 'L_s = \\frac{\\rho}{1-\\rho}' },
    { key: 'Lq', label: 'rata-rata pelanggan dalam antrian (Lq)', value: roundTo2(Lq), latex: 'L_q = \\frac{\\rho^2}{1-\\rho}' },
    { key: 'Ws', label: 'rata-rata waktu dalam sistem Ws (menit)', value: roundTo2(Ws), latex: 'W_s = \\frac{1}{\\mu-\\lambda}' },
    { key: 'Wq', label: 'rata-rata waktu menunggu dalam antrian Wq (menit)', value: roundTo2(Wq), latex: 'W_q = \\frac{\\rho}{\\mu-\\lambda}' },
  ];

  // Pick 1 random metric to ask
  const asked = rng.pick(metrics);

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: {
      text: `Sistem antrean M/M/1 di ${ent.place} memiliki laju kedatangan (arrival rate) λ = ${lambda} pelanggan/menit dan laju layanan (service rate) μ = ${mu} pelanggan/menit. Hitung ${asked.label}.`,
      latex: asked.latex,
      visual: {
        type: 'mm1-queue',
        data: { lambda, mu, rho: rhoActual, Ls, Lq, Ws, Wq },
      },
    },
    answer: { type: 'numeric', value: asked.value, tolerance: 0.02 },
    solution: {
      title: 'Model Antrean M/M/1',
      steps: [
        { text: `Hitung ρ (rho) terlebih dahulu`, latex: `\\rho = \\frac{\\lambda}{\\mu} = \\frac{${lambda}}{${mu}} = ${roundTo2(rhoActual)}` },
        { text: `Gunakan rumus ${asked.key}`, latex: `${asked.latex} = ${asked.value}` },
        { text: `Verifikasi Little's Law: Ls = λ × Ws`, latex: `${roundTo2(Ls)} \\approx ${lambda} \\times ${roundTo2(Ws)} = ${roundTo2(lambda * Ws)}` },
      ],
      finalLatex: `${asked.key} = ${asked.value}`,
      takeaway: 'Model M/M/1: ρ harus < 1 agar sistem stabil. Semakin ρ mendekati 1, antrean makin panjang secara tidak linear.',
      misconceptionNote: `Jika menjawab ${roundTo2(mu / lambda)}, kamu membalik λ/μ menjadi μ/λ. Perhatikan siapa yang datang (λ) dan siapa yang melayani (μ).`,
    },
    targetMs: 240000,
    difficultyRating: 1480,
    tags: ['antrean', 'MM1', 'riset-operasi'],
  };
}
