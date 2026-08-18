// Generator family: Ekonomi Teknik (Tier 4)
import type { RNG } from '../rng';
import type { QuestionSpec } from '../types';
import { pickContext, contextEntity } from '../context';

export function genEkoNpv(rng: RNG, skillId: string, seed: number): QuestionSpec {
  const ctx = pickContext(rng);
  const ent = contextEntity(rng, ctx);

  const initialInv = rng.int(50, 200) * 1000000; // Rp 50-200 juta
  const annualCashFlow = rng.int(15, 60) * 1000000; // Rp 15-60 juta per tahun
  const years = rng.int(3, 5);
  const iPct = rng.pick([8, 10, 12, 15]);
  const i = iPct / 100;

  // P/A factor
  const PA = (Math.pow(1 + i, years) - 1) / (i * Math.pow(1 + i, years));
  const PV_annual = annualCashFlow * PA;
  const NPV = Math.round(PV_annual - initialInv);

  return {
    id: `${skillId}#${seed}`,
    skillId,
    seed,
    format: 'numeric',
    prompt: {
      text: `Investasi proyek ${ent.product} (${ent.place}) membutuhkan modal awal Rp${(initialInv / 1000000).toFixed(0)} juta. Arus kas masuk Rp${(annualCashFlow / 1000000).toFixed(0)} juta/tahun selama ${years} tahun. Tingkat diskonto i = ${iPct}%. Berapa Net Present Value (NPV) proyek dalam juta rupiah? (Bila rugi, gunakan tanda negatif)`,
      latex: `NPV = -I_0 + A(P/A, i\\%, n)`,
    },
    answer: { type: 'numeric', value: Math.round(NPV / 1000000), tolerance: 1 },
    solution: {
      title: 'Net Present Value (NPV)',
      steps: [
        { text: `Faktor P/A (${iPct}%, ${years} th) = ${PA.toFixed(4)}` },
        { text: `PV arus kas seragam = ${annualCashFlow / 1000000} jt × ${PA.toFixed(4)} = ${(PV_annual / 1000000).toFixed(2)} juta` },
        { text: `NPV = PV - Investasi awal = ${(PV_annual / 1000000).toFixed(2)} - ${initialInv / 1000000} = ${(NPV / 1000000).toFixed(2)} juta` },
      ],
      finalLatex: `NPV = ${Math.round(NPV / 1000000)}\\text{ juta}`,
      takeaway: 'NPV > 0 → Proyek Layak; NPV < 0 → Tidak Layak.',
    },
    targetMs: 360000,
    difficultyRating: 1550,
  };
}
