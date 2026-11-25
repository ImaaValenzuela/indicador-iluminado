export type ModuleId = 'smc' | 'liquidity' | 'wyckoff' | 'engine';

export interface LessonConcept {
  id: string;
  tag: string;
  title: string;
  summary: string;
  whyItHappens: string;
  formula?: string;
  bullets: string[];
  mistake?: string;
}

export interface LearningModule {
  id: ModuleId;
  number: string;
  shortTitle: string;
  title: string;
  question: string;
  intro: string;
  concepts: LessonConcept[];
}

export interface GlossaryItem {
  term: string;
  fullName: string;
  category: 'SMC' | 'Liquidez & POIs' | 'Wyckoff & VSA' | 'Motor';
  definition: string;
  formula?: string;
}

export interface QuizQuestion {
  id: string;
  module: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
