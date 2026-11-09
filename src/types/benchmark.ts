/** Which model wrote an answer. The dataset does not mark either as preferred, and neither does this site. */
export type ModelKey = "qwen" | "inkling";

export type Language = "zh" | "en";

export interface LocalizedString {
  zh: string;
  en: string;
}

/** One row of NousResearch/arete-data-pairs, text verbatim; answers pre-rendered from Markdown at build time. */
export interface Question {
  id: string;
  topic: string;
  prompt: string;
  answers: Record<ModelKey, { model: string; html: string }>;
  /** Characters in the longer of the two original answers. */
  longest: number;
}

/** Machine translation of a question, keyed by question id. */
export interface Translation {
  prompt: string;
  answers: Record<ModelKey, string>;
}

export interface Answer {
  question: Question;
  model: ModelKey;
}
