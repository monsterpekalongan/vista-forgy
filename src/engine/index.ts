// QuestionForge — main engine dispatcher
import { mulberry32, seedFromString } from './rng';
import type { QuestionSpec, NodeConfig, Knobs } from './types';
import { genAriTambah, genAriKurang, genAriKali, genAriBagi, genAriCampur, genAriPersen, genAriRasio, genAriSatuan, genAriNegatif, genAriPecahan, genAriDesimal, genAriBulat } from './generators/ari';
import { genAljLinear1, genAljLinear2, genAljKuadrat, genAljSistem2Var, genAljEksponen } from './generators/alj';
import { genKaldPower, genKaldChainFixed, genKaldLimit } from './generators/kald';
import { genRsoLpGrafis, genRsoTransportasi, genRsoPert } from './generators/rso';
import { genInvEoq } from './generators/inv';
import { genAntMm1 } from './generators/ant';
import { genProBayes, genProKombinasi, genInfCiMean } from './generators/pro';
import { genUniBreakEven, genUniBungaMajemuk, genUniMarginMarkup } from './generators/uni';

export type { QuestionSpec, NodeConfig, Knobs };

const GENERATORS: Record<string, (rng: ReturnType<typeof mulberry32>, skillId: string, seed: number, knobs: Knobs) => QuestionSpec> = {
  'ari.tambah': (rng, sid, s, k) => genAriTambah(rng, sid, s, k),
  'ari.kurang': (rng, sid, s, k) => genAriKurang(rng, sid, s, k),
  'ari.kali': (rng, sid, s, k) => genAriKali(rng, sid, s, k),
  'ari.bagi': (rng, sid, s, k) => genAriBagi(rng, sid, s, k),
  'ari.campur': (rng, sid, s, k) => genAriCampur(rng, sid, s, k),
  'ari.negatif': (rng, sid, s, _k) => genAriNegatif(rng, sid, s, _k),
  'ari.pecahan': (rng, sid, s, k) => genAriPecahan(rng, sid, s, k),
  'ari.desimal': (rng, sid, s, k) => genAriDesimal(rng, sid, s, k),
  'ari.bulat': (rng, sid, s, k) => genAriBulat(rng, sid, s, k),
  'ari.persen': (rng, sid, s, k) => genAriPersen(rng, sid, s, k),
  'ari.rasio': (rng, sid, s, k) => genAriRasio(rng, sid, s, k),
  'ari.satuan': (rng, sid, s, k) => genAriSatuan(rng, sid, s, k),

  'alj.linear1': (rng, sid, s) => genAljLinear1(rng, sid, s),
  'alj.linear2': (rng, sid, s) => genAljLinear2(rng, sid, s),
  'alj.kuadrat': (rng, sid, s) => genAljKuadrat(rng, sid, s),
  'alj.sistem2var': (rng, sid, s) => genAljSistem2Var(rng, sid, s),
  'alj.eksponen': (rng, sid, s) => genAljEksponen(rng, sid, s),

  'kald.power': (rng, sid, s) => genKaldPower(rng, sid, s),
  'kald.chain': (rng, sid, s) => genKaldChainFixed(rng, sid, s),
  'kald.limit': (rng, sid, s) => genKaldLimit(rng, sid, s),

  'rso.lp-grafis': (rng, sid, s) => genRsoLpGrafis(rng, sid, s),
  'rso.transportasi': (rng, sid, s) => genRsoTransportasi(rng, sid, s),
  'rso.pert': (rng, sid, s) => genRsoPert(rng, sid, s),

  'inv.eoq': (rng, sid, s) => genInvEoq(rng, sid, s),
  'ant.mm1': (rng, sid, s) => genAntMm1(rng, sid, s),

  'pro.bayes': (rng, sid, s) => genProBayes(rng, sid, s),
  'pro.kombinasi': (rng, sid, s) => genProKombinasi(rng, sid, s),
  'inf.ci-mean': (rng, sid, s) => genInfCiMean(rng, sid, s),

  'uni.break-even': (rng, sid, s) => genUniBreakEven(rng, sid, s),
  'uni.bunga-majemuk': (rng, sid, s) => genUniBungaMajemuk(rng, sid, s),
  'uni.margin-markup': (rng, sid, s) => genUniMarginMarkup(rng, sid, s),
};

export function generateQuestion(
  skillId: string,
  sessionSeed: number,
  counter: number,
  knobs: Knobs,
): QuestionSpec {
  const seedStr = `${skillId}:${sessionSeed}:${counter}`;
  const seed = seedFromString(seedStr);
  const rng = mulberry32(seed);

  const generator = GENERATORS[skillId];
  if (!generator) {
    // Fallback to a default arithmetic question
    return genAriTambah(rng, skillId, seed, knobs);
  }

  let attempts = 0;
  while (attempts < 25) {
    try {
      const q = generator(mulberry32(seed + attempts), skillId, seed + attempts, knobs);
      if (validateQuestion(q)) return q;
    } catch {
      // regenerate
    }
    attempts++;
  }

  // Final fallback
  return genAriTambah(mulberry32(seed), skillId, seed, knobs);
}

function validateQuestion(q: QuestionSpec): boolean {
  if (!q.prompt.text || q.prompt.text.length < 5) return false;
  if (!q.solution.finalLatex) return false;
  if (q.format === 'numeric') {
    const ans = q.answer as { type: 'numeric'; value: number; tolerance: number };
    if (isNaN(ans.value) || !isFinite(ans.value)) return false;
  }
  if (q.format === 'mc' && q.choices) {
    const correct = q.choices.filter(c => c.isCorrect);
    if (correct.length !== 1) return false;
  }
  return true;
}

export const DEFAULT_KNOBS: Knobs = {
  magnitude: 1,
  steps: 1,
  abstraction: 0,
  timePressure: false,
  contextDepth: 1,
};

export function getKnobsForElo(userElo: number): Knobs {
  if (userElo < 1050) return { magnitude: 0, steps: 0, abstraction: 0, timePressure: false, contextDepth: 0 };
  if (userElo < 1150) return { magnitude: 1, steps: 1, abstraction: 0, timePressure: false, contextDepth: 1 };
  if (userElo < 1300) return { magnitude: 2, steps: 1, abstraction: 1, timePressure: false, contextDepth: 1 };
  if (userElo < 1450) return { magnitude: 2, steps: 2, abstraction: 2, timePressure: true, contextDepth: 2 };
  return { magnitude: 3, steps: 3, abstraction: 3, timePressure: true, contextDepth: 2 };
}
