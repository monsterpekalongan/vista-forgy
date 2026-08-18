// Generator family: Aljabar (Tier 0 & 1)
import type { RNG } from '../rng';
import type { QuestionSpec } from '../types';
import { buildNumericChoices } from './ari';
import { pickContext, contextEntity } from '../context';

// ── alj.linear1 ─────────────────────────────────────────────────────────────
export function genAljLinear1(rng: RNG, skillId: string, seed: number): QuestionSpec {
  // ax + b = c → x = (c-b)/a
  const a = rng.int(1, 9);
  const x = rng.int(-10, 10);
  const b = rng.int(-20, 20);
  const c = a * x + b;
  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: {
      text: `Tentukan nilai x dari persamaan: ${a}x ${b >= 0 ? '+' : ''}${b} = ${c}`,
      latex: `${a}x ${b >= 0 ? '+' : ''}${b} = ${c}`,
    },
    answer: { type: 'numeric', value: x, tolerance: 0.001 },
    solution: {
      title: 'Persamaan Linear Satu Variabel',
      steps: [
        { text: `Pindahkan ${b} ke kanan`, latex: `${a}x = ${c} ${b >= 0 ? '-' : '+'}${Math.abs(b)} = ${c - b}` },
        { text: `Bagi kedua ruas dengan ${a}`, latex: `x = \\frac{${c - b}}{${a}} = ${x}` },
      ],
      finalLatex: `x = ${x}`,
      takeaway: 'Isolasi variabel: pindahkan konstanta ke kanan, lalu bagi koefisien.',
    },
    targetMs: 30000,
    difficultyRating: 1050,
  };
}

// ── alj.linear2 ─────────────────────────────────────────────────────────────
export function genAljLinear2(rng: RNG, skillId: string, seed: number): QuestionSpec {
  // ax + b = cx + d
  const a = rng.int(2, 8);
  const c = rng.int(1, a - 1);
  const x = rng.int(-8, 8);
  const b = rng.int(-15, 15);
  const d = (a - c) * x + b;
  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: {
      text: `Tentukan x dari: ${a}x ${b >= 0 ? '+' : ''}${b} = ${c}x ${d >= 0 ? '+' : ''}${d}`,
      latex: `${a}x ${b >= 0 ? '+' : ''}${b} = ${c}x ${d >= 0 ? '+' : ''}${d}`,
    },
    answer: { type: 'numeric', value: x, tolerance: 0.001 },
    solution: {
      title: 'Persamaan Linear Dua Langkah',
      steps: [
        { text: 'Kumpulkan suku x di kiri', latex: `${a - c}x = ${d - b}` },
        { text: 'Bagi dengan koefisien', latex: `x = \\frac{${d - b}}{${a - c}} = ${x}` },
      ],
      finalLatex: `x = ${x}`,
      takeaway: 'Pindahkan suku x ke satu sisi, konstanta ke sisi lain, lalu selesaikan.',
    },
    targetMs: 35000,
    difficultyRating: 1100,
  };
}

// ── alj.kuadrat ──────────────────────────────────────────────────────────────
export function genAljKuadrat(rng: RNG, skillId: string, seed: number): QuestionSpec {
  // (x - r1)(x - r2) = 0 → akar integer
  const r1 = rng.int(-6, 6);
  let r2 = rng.int(-6, 6);
  while (r2 === r1) r2 = rng.int(-6, 6);
  const b = -(r1 + r2);
  const c = r1 * r2;
  const larger = Math.max(r1, r2);
  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'mc',
    prompt: {
      text: `Tentukan akar terbesar dari persamaan kuadrat: x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
      latex: `x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
    },
    choices: buildNumericChoices(rng, larger, [Math.min(r1, r2), -larger, b], 4),
    answer: { type: 'mc', correctIndex: 0 },
    solution: {
      title: 'Persamaan Kuadrat — Pemfaktoran',
      steps: [
        { text: `Faktorkan: (x ${-r1 >= 0 ? '+' : ''}${-r1})(x ${-r2 >= 0 ? '+' : ''}${-r2}) = 0`, latex: `(x${-r1 >= 0 ? '+' : ''}${-r1})(x${-r2 >= 0 ? '+' : ''}${-r2})=0` },
        { text: `Akar-akarnya: x = ${r1} atau x = ${r2}` },
        { text: `Akar terbesar: x = ${larger}` },
      ],
      finalLatex: `x = ${larger}`,
      takeaway: 'Faktorkan x² + bx + c = (x - r₁)(x - r₂) dengan r₁ × r₂ = c dan r₁ + r₂ = -b.',
      misconceptionNote: 'Jika menjawab akar terkecil, cek kembali mana yang lebih besar.',
    },
    targetMs: 40000,
    difficultyRating: 1150,
  };
}

// ── alj.sistem2var ────────────────────────────────────────────────────────────
export function genAljSistem2Var(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const ctx = pickContext(rng);
  const ent = contextEntity(rng, ctx);
  // Build from solution: x = harga1, y = harga2
  const x = rng.int(2, 15) * 1000;
  const y = rng.int(2, 15) * 1000;
  const a1 = rng.int(1, 4);
  const b1 = rng.int(1, 4);
  const a2 = rng.int(1, 4);
  let b2 = rng.int(1, 4);
  while (a1 * b2 === a2 * b1) b2 = rng.int(1, 4);
  const c1 = a1 * x + b1 * y;
  const c2 = a2 * x + b2 * y;
  const names = ['A', 'B'];
  void names;
  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: {
      text: `Di ${ent.place}, ${a1} ${ent.product} dan ${b1} item lain seharga Rp${c1.toLocaleString('id-ID')}. Sedangkan ${a2} ${ent.product} dan ${b2} item lain seharga Rp${c2.toLocaleString('id-ID')}. Berapa harga 1 ${ent.product}? (dalam ribuan)`,
    },
    answer: { type: 'numeric', value: x / 1000, tolerance: 0.001 },
    solution: {
      title: 'Sistem Persamaan Linear 2 Variabel',
      steps: [
        { text: `Misal x = harga ${ent.product} (ribuan), y = harga item lain (ribuan)` },
        { text: `Persamaan 1`, latex: `${a1}x + ${b1}y = ${c1 / 1000}` },
        { text: `Persamaan 2`, latex: `${a2}x + ${b2}y = ${c2 / 1000}` },
        { text: `Eliminasi dan substitusi → x = ${x / 1000}` },
      ],
      finalLatex: `x = ${x / 1000}\\text{ (ribu)}`,
      takeaway: 'Sistem 2 variabel: eliminasi satu variabel, substitusi ke persamaan lain.',
    },
    targetMs: 60000,
    difficultyRating: 1180,
  };
}

// ── alj.eksponen ──────────────────────────────────────────────────────────────
export function genAljEksponen(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const base = rng.int(2, 5);
  const p = rng.int(1, 4);
  const q = rng.int(1, 4);
  const variants = ['multiply', 'divide', 'power'] as ('multiply' | 'divide' | 'power')[];
  const variant = rng.pick(variants);
  let prompt = '';
  let latex = '';
  let answer = 0;
  let answerLatex = '';
  if (variant === 'multiply') {
    answer = p + q;
    prompt = `Sederhanakan: ${base}^${p} × ${base}^${q}`;
    latex = `${base}^{${p}} \\times ${base}^{${q}}`;
    answerLatex = `${base}^{${answer}}`;
  } else if (variant === 'divide') {
    const bigP = Math.max(p, q);
    const smallQ = Math.min(p, q);
    answer = bigP - smallQ;
    prompt = `Sederhanakan: ${base}^${bigP} ÷ ${base}^${smallQ}`;
    latex = `${base}^{${bigP}} \\div ${base}^{${smallQ}}`;
    answerLatex = `${base}^{${answer}}`;
  } else {
    answer = p * q;
    prompt = `Sederhanakan: (${base}^${p})^${q}`;
    latex = `(${base}^{${p}})^{${q}}`;
    answerLatex = `${base}^{${answer}}`;
  }
  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'mc',
    prompt: { text: prompt, latex: `${latex} = ?` },
    choices: buildNumericChoices(rng, answer, [p * q + 1, p + q + 2, answer - 1], 4).map(c => ({
      ...c,
      text: `${base}^${c.text}`,
      latex: `${base}^{${c.latex}}`,
    })),
    answer: { type: 'mc', correctIndex: 0 },
    solution: {
      title: 'Aturan Eksponen',
      steps: [
        { text: variant === 'multiply' ? `aᵐ × aⁿ = aᵐ⁺ⁿ` : variant === 'divide' ? `aᵐ ÷ aⁿ = aᵐ⁻ⁿ` : `(aᵐ)ⁿ = aᵐⁿ` },
        { text: `Hasilnya`, latex: answerLatex },
      ],
      finalLatex: answerLatex,
      takeaway: 'Pangkat kali → jumlahkan; pangkat bagi → kurangi; pangkat bertingkat → kalikan.',
    },
    targetMs: 30000,
    difficultyRating: 1120,
  };
}
