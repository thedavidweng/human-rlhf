import type { LocalizedString } from "../types/benchmark";
import { DATASET_URL } from "./source";

export interface QuestionSet {
  id: string;
  /** Only ready sets can be played; the rest are listed as in preparation. */
  ready: boolean;
  title: LocalizedString;
  description: LocalizedString;
  sourceName: string;
  sourceUrl: string;
}

export const SETS: QuestionSet[] = [
  {
    id: "china",
    ready: true,
    title: { zh: "中国议题", en: "Questions about China" },
    description: {
      zh: "Qwen3.8-27B 对 Inkling，原文照录。",
      en: "Qwen3.8-27B against Inkling, verbatim."
    },
    sourceName: "NousResearch/arete-data-pairs",
    sourceUrl: DATASET_URL
  },
  {
    id: "hh-rlhf",
    ready: false,
    title: { zh: "有用还是无害", en: "Helpful or harmless" },
    description: {
      zh: "Anthropic HH-RLHF：拒绝还是回答。",
      en: "Anthropic HH-RLHF: refuse or help."
    },
    sourceName: "Anthropic/hh-rlhf",
    sourceUrl: "https://huggingface.co/datasets/Anthropic/hh-rlhf"
  },
  {
    id: "beavertails",
    ready: false,
    title: { zh: "安全红线", en: "Safety red lines" },
    description: {
      zh: "北京大学 BeaverTails：14 类安全问题。",
      en: "PKU BeaverTails: 14 safety categories."
    },
    sourceName: "PKU-Alignment/BeaverTails",
    sourceUrl: "https://huggingface.co/datasets/PKU-Alignment/BeaverTails"
  }
];
