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
      zh: "Nous Research arete-data-pairs：Qwen3.8-27B 和 Inkling 回答同一个问题，原文照录。",
      en: "Nous Research arete-data-pairs: Qwen3.8-27B and Inkling answer the same question, quoted in full."
    },
    sourceName: "NousResearch/arete-data-pairs",
    sourceUrl: DATASET_URL
  },
  {
    id: "hh-rlhf",
    ready: false,
    title: { zh: "有用还是无害", en: "Helpful or harmless" },
    description: {
      zh: "Anthropic HH-RLHF：在“拒绝回答”和“有问必答”之间，你站哪边。",
      en: "Anthropic HH-RLHF: where you draw the line between refusing and helping."
    },
    sourceName: "Anthropic/hh-rlhf",
    sourceUrl: "https://huggingface.co/datasets/Anthropic/hh-rlhf"
  },
  {
    id: "beavertails",
    ready: false,
    title: { zh: "安全红线", en: "Safety red lines" },
    description: {
      zh: "北京大学 BeaverTails：14 个安全维度的偏好选择。",
      en: "PKU BeaverTails: preference choices across 14 safety categories."
    },
    sourceName: "PKU-Alignment/BeaverTails",
    sourceUrl: "https://huggingface.co/datasets/PKU-Alignment/BeaverTails"
  }
];
