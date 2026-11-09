import type { LocalizedString } from "../types/benchmark";

export const UPCOMING: { id: string; title: LocalizedString; description: LocalizedString; sourceName: string; sourceUrl: string }[] = [
  {
    id: "hh-rlhf",
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
    title: { zh: "安全红线", en: "Safety red lines" },
    description: {
      zh: "北京大学 BeaverTails：14 个安全维度的偏好选择。",
      en: "PKU BeaverTails: preference choices across 14 safety categories."
    },
    sourceName: "PKU-Alignment/BeaverTails",
    sourceUrl: "https://huggingface.co/datasets/PKU-Alignment/BeaverTails"
  }
];
