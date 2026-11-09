export type SetId = "china" | "hh-rlhf" | "beavertails";

export type SideKey = "qwen" | "inkling" | "chosen" | "rejected" | "safe" | "unsafe";

export type Language = "zh" | "en";

export interface LocalizedString {
  zh: string;
  en: string;
}

export interface AnswerItem {
  model: string;
  html: string;
  id?: string;
  categories?: string[];
}

/** One question row, text verbatim; answers pre-rendered from Markdown at build time. */
export interface Question {
  id: string;
  set: SetId;
  topic: string;
  prompt: string;
  sides: [SideKey, SideKey];
  answers: Record<string, AnswerItem>;
  /** Characters in the longer of the two original answers. */
  longest: number;
}

/** Machine translation of a question, keyed by question id. */
export interface Translation {
  prompt: string;
  answers: Record<string, string>;
}

export interface Answer {
  question: Question;
  side: SideKey;
}
