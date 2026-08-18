// Generator family: Trigonometri (Tier 2 & 3)
import type { RNG } from '../rng';
import type { QuestionSpec } from '../types';
import { buildNumericChoices } from './ari';

export function genTrgIstimewa(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const angles = [0, 30, 45, 60, 90, 120, 135, 150, 180];
  const angle = rng.pick(angles);
  const funcs = ['sin', 'cos', 'tan'] as const;
  const func = rng.pick([...funcs]);

  let valStr = '';
  let valLatex = '';
  let numVal = 0;

  const rad = (angle * Math.PI) / 180;
  if (func === 'sin') {
    numVal = Math.sin(rad);
    if (angle === 0 || angle === 180) { valStr = '0'; valLatex = '0'; }
    else if (angle === 30 || angle === 150) { valStr = '1/2'; valLatex = '\\frac{1}{2}'; }
    else if (angle === 45 || angle === 135) { valStr = '√2/2'; valLatex = '\\frac{\\sqrt{2}}{2}'; }
    else if (angle === 60 || angle === 120) { valStr = '√3/2'; valLatex = '\\frac{\\sqrt{3}}{2}'; }
    else { valStr = '1'; valLatex = '1'; }
  } else if (func === 'cos') {
    numVal = Math.cos(rad);
    if (angle === 0) { valStr = '1'; valLatex = '1'; }
    else if (angle === 30) { valStr = '√3/2'; valLatex = '\\frac{\\sqrt{3}}{2}'; }
    else if (angle === 45) { valStr = '√2/2'; valLatex = '\\frac{\\sqrt{2}}{2}'; }
    else if (angle === 60) { valStr = '1/2'; valLatex = '\\frac{1}{2}'; }
    else if (angle === 90) { valStr = '0'; valLatex = '0'; }
    else if (angle === 120) { valStr = '-1/2'; valLatex = '-\\frac{1}{2}'; }
    else if (angle === 135) { valStr = '-√2/2'; valLatex = '-\\frac{\\sqrt{2}}{2}'; }
    else if (angle === 150) { valStr = '-√3/2'; valLatex = '-\\frac{\\sqrt{3}}{2}'; }
    else { valStr = '-1'; valLatex = '-1'; }
  } else {
    if (angle === 90) return genTrgIstimewa(rng, skillId, seed + 1); // skip tan 90
    numVal = Math.tan(rad);
    if (angle === 0 || angle === 180) { valStr = '0'; valLatex = '0'; }
    else if (angle === 30 || angle === 210) { valStr = '1/√3'; valLatex = '\\frac{\\sqrt{3}}{3}'; }
    else if (angle === 45) { valStr = '1'; valLatex = '1'; }
    else if (angle === 60) { valStr = '√3'; valLatex = '\\sqrt{3}'; }
    else { valStr = '-1'; valLatex = '-1'; }
  }

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'mc',
    prompt: {
      text: `Berapa nilai eksak dari ${func}(${angle}°)?`,
      latex: `\\${func}(${angle}^\\circ) = ?`,
    },
    choices: [
      { text: valStr, latex: valLatex, isCorrect: true },
      { text: '1/2', latex: '\\frac{1}{2}', isCorrect: valStr === '1/2' },
      { text: '√3/2', latex: '\\frac{\\sqrt{3}}{2}', isCorrect: valStr === '√3/2' },
      { text: '0', latex: '0', isCorrect: valStr === '0' },
    ].filter((c, idx, arr) => arr.findIndex(x => x.latex === c.latex) === idx).slice(0, 4),
    answer: { type: 'mc', correctIndex: 0 },
    solution: {
      title: 'Nilai Sudut Istimewa Trigonometri',
      steps: [
        { text: `Gunakan tabel sudut istimewa kuadran I dan aturan tanda kuadran.` },
        { text: `${func}(${angle}°) = ${valStr}`, latex: `\\${func}(${angle}^\\circ) = ${valLatex}` },
      ],
      finalLatex: `\\${func}(${angle}^\\circ) = ${valLatex}`,
      takeaway: 'Hafalkan sudut istimewa kuadran I (0, 30, 45, 60, 90 deg) & perhatikan tanda kuadran.',
    },
    targetMs: 15000,
    difficultyRating: 1180,
  };
}
