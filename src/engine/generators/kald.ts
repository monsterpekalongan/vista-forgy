// Generator family: Kalkulus Diferensial (Tier 2 & 3)
import type { RNG } from '../rng';
import type { QuestionSpec } from '../types';
import { pickContext, contextEntity } from '../context';

// Polynomial term: coeff * x^exp
interface Term { coeff: number; exp: number }

function buildPoly(rng: RNG, numTerms: number, maxCoeff: number, maxExp: number): Term[] {
  const terms: Term[] = [];
  const usedExps = new Set<number>();
  for (let i = 0; i < numTerms; i++) {
    let exp: number;
    let attempts = 0;
    do {
      exp = rng.int(0, maxExp);
      attempts++;
    } while (usedExps.has(exp) && attempts < 20);
    usedExps.add(exp);
    const coeff = rng.int(-maxCoeff, maxCoeff);
    if (coeff !== 0) terms.push({ coeff, exp });
  }
  return terms.length === 0 ? [{ coeff: 1, exp: 2 }] : terms;
}

function polyToLatex(terms: Term[], variable = 'x'): string {
  if (terms.length === 0) return '0';
  return terms
    .sort((a, b) => b.exp - a.exp)
    .map((t, i) => {
      const sign = t.coeff < 0 ? (i === 0 ? '-' : ' - ') : (i === 0 ? '' : ' + ');
      const absC = Math.abs(t.coeff);
      const cStr = absC === 1 && t.exp > 0 ? '' : `${absC}`;
      const xStr = t.exp === 0 ? '' : t.exp === 1 ? variable : `${variable}^{${t.exp}}`;
      return `${sign}${cStr}${xStr}`;
    })
    .join('');
}

function evalPoly(terms: Term[], x: number): number {
  return terms.reduce((sum, t) => sum + t.coeff * Math.pow(x, t.exp), 0);
}

function derivative(terms: Term[]): Term[] {
  return terms
    .filter((t) => t.exp > 0)
    .map((t) => ({ coeff: t.coeff * t.exp, exp: t.exp - 1 }));
}

// ── kald.power (flagship) ────────────────────────────────────────────────────
export function genKaldPower(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const numTerms = rng.int(2, 4);
  const maxCoeff = 7;
  const maxExp = 3;
  const terms = buildPoly(rng, numTerms, maxCoeff, maxExp);
  const dTerms = derivative(terms);

  const k = rng.int(-3, 5);
  const variants = ['eval-deriv', 'find-zero', 'deriv-expr'] as const;
  const variant = rng.pick([...variants]);

  const ctx = pickContext(rng);
  const ent = contextEntity(rng, ctx);
  void ent;

  let questionText = '';
  let questionLatex = '';
  let answer = 0;
  let answerLatex = '';
  let steps: { text: string; latex?: string }[] = [];
  let targetQuestion = '';

  const polyLatex = polyToLatex(terms);
  const dPolyLatex = polyToLatex(dTerms);
  const evalD = evalPoly(dTerms, k);

  if (variant === 'eval-deriv') {
    questionText = `Posisi partikel di conveyor: s(t) = ${polyToLatex(terms, 't')} (meter). Berapa kecepatan partikel saat t = ${k} (m/s)?`;
    questionLatex = `s(t) = ${polyToLatex(terms, 't')}`;
    answer = evalD;
    answerLatex = `${evalD}`;
    targetQuestion = `v(${k}) = s'(${k})`;
    steps = [
      { text: `Kecepatan = turunan posisi`, latex: `v(t) = s'(t) = ${dPolyLatex.replace(/x/g, 't')}` },
      { text: `Substitusi t = ${k}`, latex: `v(${k}) = ${evalD}` },
    ];
  } else if (variant === 'find-zero') {
    // Find x where derivative = 0 (only when derivative has integer root)
    // Simplify: just ask for derivative expression
    questionText = `Diberikan f(x) = ${polyLatex}. Berapa nilai f′(x) pada x = ${k}?`;
    questionLatex = `f(x) = ${polyLatex}`;
    answer = evalD;
    answerLatex = `f'(${k}) = ${evalD}`;
    targetQuestion = `f'(${k})`;
    steps = [
      { text: `Turunkan f(x)`, latex: `f'(x) = ${dPolyLatex}` },
      { text: `Substitusi x = ${k}`, latex: `f'(${k}) = ${evalD}` },
    ];
  } else {
    questionText = `Diberikan f(x) = ${polyLatex}. Berapa nilai f′(${k})?`;
    questionLatex = `f(x) = ${polyLatex}`;
    answer = evalD;
    answerLatex = `f'(${k}) = ${evalD}`;
    targetQuestion = `f'(${k})`;
    steps = [
      { text: `Turunkan setiap suku (power rule: d/dx[xⁿ] = nxⁿ⁻¹)`, latex: `f'(x) = ${dPolyLatex}` },
      { text: `Hitung f′(${k})`, latex: `f'(${k}) = ${evalD}` },
    ];
  }

  // Verify with finite difference
  const h = 1e-6;
  const fdApprox = (evalPoly(terms, k + h) - evalPoly(terms, k - h)) / (2 * h);
  if (Math.abs(fdApprox - answer) > 0.1) {
    // Regenerate if verify fails
    return genKaldPower(rng, skillId, seed + 1000);
  }

  // Distractors
  const d1 = evalPoly(terms, k); // evaluated f(k) instead of f'(k)
  void (answer + 1); // off-by-one distractor noted
  const d3 = -answer;            // sign error
  void d3;
  void targetQuestion;

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: { text: questionText, latex: questionLatex },
    answer: { type: 'numeric', value: answer, tolerance: 0.01 },
    solution: {
      title: 'Turunan — Aturan Pangkat (Power Rule)',
      steps,
      finalLatex: answerLatex,
      takeaway: 'Turunan posisi = kecepatan; evaluasi SETELAH menurunkan, bukan sebelum.',
      misconceptionNote: `Jika jawabanmu ${d1}, kamu menghitung f(${k}) bukan f′(${k}). Jika ${d3}, cek tanda koefisien.`,
    },
    targetMs: 20000,
    difficultyRating: 1150,
    tags: ['kalkulus', 'turunan', 'power-rule'],
  };
}

// ── kald.chain: see genKaldChainFixed below ──────────────────────────────────

// Fix template literal in chain
export function genKaldChainFixed(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const a = rng.int(1, 5);
  const b = rng.int(1, 4);
  const c = rng.int(-5, 5);
  const n = rng.int(2, 4);
  const x0 = rng.int(0, 3);
  const inner = b * x0 + c;
  const answer = a * n * b * Math.pow(inner, n - 1);
  const derivCoeff = a * n * b;
  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: {
      text: `Tentukan f′(${x0}) untuk f(x) = ${a}(${b}x ${c >= 0 ? '+' : ''}${c})^${n}`,
      latex: `f(x) = ${a}(${b}x ${c >= 0 ? '+' : ''}${c})^{${n}}`,
    },
    answer: { type: 'numeric', value: answer, tolerance: 0.01 },
    solution: {
      title: 'Aturan Rantai (Chain Rule)',
      steps: [
        { text: `f′(x) = ${derivCoeff}·(${b}x${c >= 0 ? '+' : ''}${c})^{${n - 1}}`, latex: `f'(x)=${derivCoeff}(${b}x${c >= 0 ? '+' : ''}${c})^{${n - 1}}` },
        { text: `f′(${x0}) = ${derivCoeff}·(${inner})^{${n - 1}} = ${answer}` },
      ],
      finalLatex: `f'(${x0}) = ${answer}`,
      takeaway: 'Chain rule: turunkan luar, kalikan turunan dalam.',
    },
    targetMs: 30000,
    difficultyRating: 1300,
  };
}

// ── kald.limit ───────────────────────────────────────────────────────────────
export function genKaldLimit(rng: RNG, skillId: string, seed: number): QuestionSpec {
  // lim(x→a) poly(x)
  const terms = [
    { coeff: rng.int(-5, 5) || 1, exp: 2 },
    { coeff: rng.int(-8, 8), exp: 1 },
    { coeff: rng.int(-10, 10), exp: 0 },
  ].filter(t => t.coeff !== 0);
  const a = rng.int(-3, 5);
  const answer = evalPoly(terms, a);
  const polyLatex = polyToLatex(terms);
  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: {
      text: `Hitung nilai limit berikut.`,
      latex: `\\lim_{x \\to ${a}} (${polyLatex})`,
    },
    answer: { type: 'numeric', value: answer, tolerance: 0.001 },
    solution: {
      title: 'Limit Polinomial',
      steps: [
        { text: 'Polinomial kontinu di semua titik → substitusi langsung.' },
        { text: `Substitusi x = ${a}`, latex: `${polyLatex.replace(/x/g, `(${a})`)} = ${answer}` },
      ],
      finalLatex: `\\lim_{x\\to${a}}(${polyLatex}) = ${answer}`,
      takeaway: 'Untuk polinomial, limit di titik a = nilai fungsi di a (substitusi langsung).',
    },
    targetMs: 20000,
    difficultyRating: 1200,
  };
}

// evalPolyLocal exported for reuse
export function evalPolyLocal(terms: { coeff: number; exp: number }[], x: number): number {
  return terms.reduce((sum, t) => sum + t.coeff * Math.pow(x, t.exp), 0);
}
