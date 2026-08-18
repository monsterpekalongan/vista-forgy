// Generator family: Aljabar Linear (Tier 3)
import type { RNG } from '../rng';
import type { QuestionSpec } from '../types';

export function genLinMatrixOps(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const a11 = rng.int(-5, 5); const a12 = rng.int(-5, 5);
  const a21 = rng.int(-5, 5); const a22 = rng.int(-5, 5);

  const b11 = rng.int(-5, 5); const b12 = rng.int(-5, 5);
  const b21 = rng.int(-5, 5); const b22 = rng.int(-5, 5);

  // C = A + B
  const c11 = a11 + b11;
  const c12 = a12 + b12;
  const c21 = a21 + b21;
  const c22 = a22 + b22;

  const detA = a11 * a22 - a12 * a21;

  const variant = rng.int(0, 1);

  if (variant === 0) {
    return {
      id: `${skillId}#${seed}`,
      skillId,
      seed,
      format: 'numeric',
      prompt: {
        text: `Diberikan matriks A = [[${a11}, ${a12}], [${a21}, ${a22}]]. Berapa determinan matriks A (det(A))?`,
        latex: `A = \\begin{bmatrix} ${a11} & ${a12} \\\\ ${a21} & ${a22} \\end{bmatrix}`,
      },
      answer: { type: 'numeric', value: detA, tolerance: 0.001 },
      solution: {
        title: 'Determinan Matriks 2x2',
        steps: [
          { text: 'Rumus determinan 2x2: ad − bc', latex: `\\det(A) = (${a11})(${a22}) - (${a12})(${a21})` },
          { text: `Hasil = ${detA}` },
        ],
        finalLatex: `\\det(A) = ${detA}`,
        takeaway: 'Determinan 2x2: ad - bc.',
      },
      targetMs: 45000,
      difficultyRating: 1250,
    };
  }

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: {
      text: `Diberikan matriks A = [[${a11}, ${a12}], [${a21}, ${a22}]] dan B = [[${b11}, ${b12}], [${b21}, ${b22}]]. Berapa nilai elemen c₁₁ dari C = A + B?`,
      latex: `A = \\begin{bmatrix} ${a11} & ${a12} \\\\ ${a21} & ${a22} \\end{bmatrix}, \\quad B = \\begin{bmatrix} ${b11} & ${b12} \\\\ ${b21} & ${b22} \\end{bmatrix}`,
    },
    answer: { type: 'numeric', value: c11, tolerance: 0.001 },
    solution: {
      title: 'Penjumlahan Matriks',
      steps: [
        { text: 'Jumlahkan elemen seletak:', latex: `c_{11} = a_{11} + b_{11} = ${a11} + (${b11}) = ${c11}` },
      ],
      finalLatex: `c_{11} = ${c11}`,
      takeaway: 'Penjumlahan matriks: jumlahkan setiap elemen seletak.',
    },
    targetMs: 30000,
    difficultyRating: 1200,
  };
}
