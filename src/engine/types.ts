// Core types for QuestionForge engine

export type QuestionFormat = 'mc' | 'numeric' | 'mathlive' | 'steps' | 'slider' | 'match' | 'rush';

export interface VisualSpec {
  type: 'chart-bar' | 'chart-line' | 'lp-graph' | 'mm1-queue' | 'eoq-chart' | 'control-chart' | 'pert-graph' | 'derivative-tangent' | 'riemann' | 'regression' | 'table';
  data: Record<string, unknown>;
}

export interface Choice {
  text: string;
  latex?: string;
  isCorrect: boolean;
  misconceptionTag?: string;
}

export interface NumericAnswer { type: 'numeric'; value: number; tolerance: number; }
export interface MathLiveAnswer { type: 'mathlive'; latex: string; }
export interface StepsAnswer { type: 'steps'; stepValues: number[]; }
export interface SliderAnswer { type: 'slider'; value: number; tolerance: number; }
export interface McAnswer { type: 'mc'; correctIndex: number; }
export interface MatchAnswer { type: 'match'; pairs: [string, string][]; }
export interface RushAnswer { type: 'rush'; values: number[]; }

export type AnswerSpec = NumericAnswer | MathLiveAnswer | StepsAnswer | SliderAnswer | McAnswer | MatchAnswer | RushAnswer;

export interface SolutionStep {
  text: string;
  latex?: string;
}

export interface QuestionSpec {
  id: string;
  skillId: string;
  seed: number;
  format: QuestionFormat;
  prompt: { text: string; latex?: string; visual?: VisualSpec };
  choices?: Choice[];
  answer: AnswerSpec;
  solution: {
    title: string;
    steps: SolutionStep[];
    finalLatex: string;
    takeaway: string;
    misconceptionNote?: string;
  };
  targetMs: number;
  difficultyRating: number;
  tags?: string[];
}

export interface Knobs {
  magnitude: 0 | 1 | 2 | 3;
  steps: 0 | 1 | 2 | 3;
  abstraction: 0 | 1 | 2 | 3;
  timePressure: boolean;
  contextDepth: 0 | 1 | 2;
}

export interface NodeConfig {
  id: string;
  name: string;
  family: string;
  tier: number;
  format: QuestionFormat;
  targetMs: number;
  prereq: string[];
  masteryTarget: number;
  difficultyRange: [number, number];
}

export interface RawProblem {
  params: Record<string, unknown>;
  questionVariant: string;
}

export interface SolvedProblem {
  answer: number | string;
  steps: SolutionStep[];
  distractors?: number[];
}

export interface Distractor {
  value: number | string;
  latex?: string;
  misconceptionTag: string;
}
