import type { LocalizedString, SetId, SideKey } from "../types/benchmark";

export interface QuestionSet {
  id: SetId;
  shortName: string;
  title: LocalizedString;
  description: LocalizedString;
  sourceName: string;
  sourceUrl: string;
  sides: [SideKey, SideKey];
}

export const SETS: QuestionSet[] = [
  {
    id: "china",
    shortName: "arete-data-pairs",
    title: { zh: "中国议题", en: "Questions about China" },
    description: {
      zh: "Qwen3.8-27B 对 Inkling，原文照录。",
      en: "Qwen3.8-27B against Inkling, verbatim."
    },
    sourceName: "NousResearch/arete-data-pairs",
    sourceUrl: "https://huggingface.co/datasets/NousResearch/arete-data-pairs",
    sides: ["qwen", "inkling"]
  },
  {
    id: "hh-rlhf",
    shortName: "hh-rlhf",
    title: { zh: "有用还是无害", en: "Helpful or harmless" },
    description: {
      zh: "Anthropic HH-RLHF：拒绝还是回答。含冒犯内容，原文照录。",
      en: "Anthropic HH-RLHF: refuse or help. Contains offensive text, verbatim."
    },
    sourceName: "Anthropic/hh-rlhf",
    sourceUrl: "https://huggingface.co/datasets/Anthropic/hh-rlhf",
    sides: ["chosen", "rejected"]
  },
  {
    id: "beavertails",
    shortName: "BeaverTails",
    title: { zh: "安全红线", en: "Safety red lines" },
    description: {
      zh: "北京大学 BeaverTails：14 类安全问题。含冒犯内容，原文照录。",
      en: "PKU BeaverTails: 14 safety categories. Contains offensive text, verbatim."
    },
    sourceName: "PKU-Alignment/BeaverTails",
    sourceUrl: "https://huggingface.co/datasets/PKU-Alignment/BeaverTails",
    sides: ["safe", "unsafe"]
  }
];
