// Generator family: Probabilitas & Statistika (Tier 3)
import type { RNG } from '../rng';
import type { QuestionSpec } from '../types';
import { buildNumericChoices } from './ari';
import { pickContext, contextEntity } from '../context';

// ── pro.bayes ─────────────────────────────────────────────────────────────────
export function genProBayes(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const ctx = pickContext(rng);
  const ent = contextEntity(rng, ctx);

  // Mesin A dan B dengan defect rate berbeda
  const pA = rng.int(3, 7) / 10; // proporsi output mesin A
  const pB = 1 - pA;
  const defA = rng.pick([0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10]);
  let defB = rng.pick([0.05, 0.08, 0.10, 0.12, 0.15, 0.20]);
  while (defB <= defA) defB = rng.pick([0.05, 0.08, 0.10, 0.12, 0.15, 0.20]);

  // P(defect) = pA*defA + pB*defB
  const pDefect = pA * defA + pB * defB;
  // P(A | defect) via Bayes
  const pAgivenDefect = (pA * defA) / pDefect;
  const answer = Math.round(pAgivenDefect * 1000) / 1000;

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: {
      text: `Di ${ent.place}, ${Math.round(pA * 100)}% produk dibuat oleh Mesin A (tingkat cacat ${(defA * 100).toFixed(0)}%) dan ${Math.round(pB * 100)}% oleh Mesin B (tingkat cacat ${(defB * 100).toFixed(0)}%). Jika sebuah produk ditemukan cacat, berapa peluang produk itu berasal dari Mesin A? (2 desimal)`,
      latex: `P(A | \\text{cacat}) = ?`,
    },
    answer: { type: 'numeric', value: Math.round(answer * 100) / 100, tolerance: 0.01 },
    solution: {
      title: 'Teorema Bayes',
      steps: [
        { text: 'Hitung total peluang cacat (Total Probability)', latex: `P(D) = P(A)P(D|A) + P(B)P(D|B) = ${pA} \\times ${defA} + ${pB} \\times ${defB} = ${Math.round(pDefect * 1000) / 1000}` },
        { text: 'Teorema Bayes', latex: `P(A|D) = \\frac{P(A)P(D|A)}{P(D)} = \\frac{${pA} \\times ${defA}}{${Math.round(pDefect * 1000) / 1000}} = ${Math.round(answer * 100) / 100}` },
      ],
      finalLatex: `P(A|\\text{cacat}) = ${Math.round(answer * 100) / 100}`,
      takeaway: 'Bayes: posterior = (prior × likelihood) / evidence. Normalkan selalu dengan membagi total.',
      misconceptionNote: 'Kesalahan umum: menjawab hanya P(A) = ' + pA + ' tanpa mempertimbangkan likelihood defect.',
    },
    targetMs: 120000,
    difficultyRating: 1380,
  };
}

// ── pro.kombinasi ─────────────────────────────────────────────────────────────
export function genProKombinasi(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const n = rng.int(5, 10);
  const r = rng.int(2, n - 1);
  const variant = rng.int(0, 1); // 0 = kombinasi, 1 = permutasi

  function factorial(k: number): number {
    if (k <= 1) return 1;
    return k * factorial(k - 1);
  }

  const perm = factorial(n) / factorial(n - r);
  const comb = perm / factorial(r);
  const answer = variant === 0 ? comb : perm;

  const ctx = pickContext(rng);
  const ent = contextEntity(rng, ctx);

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: {
      text: variant === 0
        ? `Dari ${n} ${ent.product} yang tersedia, dipilih ${r} item. Berapa banyak cara pemilihan jika urutan tidak diperhatikan? (Kombinasi C(${n},${r}))`
        : `Dari ${n} ${ent.product}, dipilih ${r} item untuk disusun berurutan. Berapa cara? (Permutasi P(${n},${r}))`,
      latex: variant === 0 ? `C(${n},${r}) = ?` : `P(${n},${r}) = ?`,
    },
    choices: buildNumericChoices(rng, answer, [perm, comb, factorial(n) / factorial(r)], 4),
    answer: { type: 'mc', correctIndex: 0 },
    solution: {
      title: variant === 0 ? 'Kombinasi' : 'Permutasi',
      steps: [
        { text: variant === 0 ? `C(n,r) = n! / (r!(n-r)!)` : `P(n,r) = n! / (n-r)!`, latex: variant === 0 ? `C(${n},${r}) = \\frac{${n}!}{${r}!(${n - r})!}` : `P(${n},${r}) = \\frac{${n}!}{(${n - r})!}` },
        { text: `= ${answer}` },
      ],
      finalLatex: `= ${answer}`,
      takeaway: variant === 0 ? 'Kombinasi: urutan tidak penting. Lebih sedikit dari permutasi.' : 'Permutasi: urutan penting. Lebih banyak dari kombinasi.',
      misconceptionNote: variant === 0 ? `Jika menjawab ${perm}, kamu menghitung permutasi (urutan diperhitungkan).` : `Jika menjawab ${comb}, kamu menghitung kombinasi (urutan diabaikan).`,
    },
    targetMs: 90000,
    difficultyRating: 1280,
  };
}

// ── inf.ci-mean ───────────────────────────────────────────────────────────────
export function genInfCiMean(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const ctx = pickContext(rng);
  const ent = contextEntity(rng, ctx);
  void ent;

  const n = rng.int(12, 35);
  const mu = rng.int(50, 200) / 10;
  const sigma = rng.int(5, 30) / 10;
  const xbar = mu;
  const alpha = rng.pick([0.05, 0.01]); // 95% or 99%
  const z = alpha === 0.05 ? 1.96 : 2.576;
  const me = Math.round(z * sigma / Math.sqrt(n) * 100) / 100;
  const lower = Math.round((xbar - me) * 100) / 100;
  const upper = Math.round((xbar + me) * 100) / 100;

  const ci = (1 - alpha) * 100;

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: {
      text: `Sampel n = ${n} unit, rata-rata x̄ = ${xbar.toFixed(1).replace('.', ',')}, simpangan baku populasi σ = ${sigma.toFixed(1).replace('.', ',')}. Hitung batas atas interval kepercayaan (confidence interval) ${ci}% untuk rata-rata populasi. (z = ${z})`,
      latex: `\\bar{x} \\pm z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}`,
    },
    answer: { type: 'numeric', value: upper, tolerance: 0.05 },
    solution: {
      title: `Interval Kepercayaan ${ci}% untuk Mean`,
      steps: [
        { text: `Margin of error (ME)`, latex: `ME = z \\cdot \\frac{\\sigma}{\\sqrt{n}} = ${z} \\times \\frac{${sigma}}{\\sqrt{${n}}} = ${me}` },
        { text: `Interval`, latex: `[${xbar} - ${me}, ${xbar} + ${me}] = [${lower}, ${upper}]` },
      ],
      finalLatex: `CI_{${ci}\\%} = [${lower}, ${upper}]`,
      takeaway: `Interval kepercayaan ${ci}%: jika diulang 100 kali, ~${ci} interval akan mengandung μ sebenarnya.`,
      misconceptionNote: `Interpretasi salah: "Peluang μ ada di dalam interval adalah ${ci}%" — μ konstan, bukan acak. Interval-nya yang bervariasi.`,
    },
    targetMs: 150000,
    difficultyRating: 1400,
  };
}
