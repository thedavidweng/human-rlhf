import { Benchmark, Question } from "../../types/benchmark";
import { WESTERN_VALUES_QUESTIONS } from "./western-values";

export const BENCHMARKS: Benchmark[] = [
  {
    id: "western-values",
    title: {
      zh: "西方价值观对齐测试",
      en: "Western Values Alignment Test"
    },
    subtitle: {
      zh: "“Are you biased?” —— 逆向人类强化学习基准",
      en: "“Are you biased?” —— Reverse Human RLHF Benchmark"
    },
    description: {
      zh: "基于 Nous Research 用来后训练（RLHF / DPO）Qwen3.8-27B 的 Arete 数据集与 Propaganda_Eval 题库，测试你的思想更接近北京微调还是美利坚自由派教师！",
      en: "Built on real post-training RLHF pairs from Nous Research's Arete & Propaganda_Eval datasets. Discover whether your neural pathways align with Qwen's baseline or Inkling's freedom teacher!"
    },
    status: "active",
    sourceName: "Nous Research (Arete & Propaganda Eval)",
    sourceUrl: "https://huggingface.co/datasets/NousResearch/arete-data-pairs",
    tags: ["RLHF", "DPO", "Qwen", "Nous Research", "Western Values"],
    totalQuestions: WESTERN_VALUES_QUESTIONS.length
  },
  {
    id: "hh-rlhf",
    title: {
      zh: "实用 vs 无害之争 (HH-RLHF)",
      en: "Helpful vs Harmless (Anthropic HH-RLHF)"
    },
    subtitle: {
      zh: "你会当过度谨慎的圣母，还是知无不言的极客？",
      en: "Overcautious safety censor or unfiltered helpful companion?"
    },
    description: {
      zh: "来自 Anthropic 经典的 Helpful and Harmless 强化学习偏好数据集，测试你在模型‘拒绝回答’与‘有问必答’之间的价值取向。",
      en: "Extracted from Anthropic's landmark Human Preference dataset, measuring your threshold between risk-averse refusal and helpful execution."
    },
    status: "coming_soon",
    sourceName: "Anthropic / HH-RLHF",
    sourceUrl: "https://huggingface.co/datasets/Anthropic/hh-rlhf",
    tags: ["Safety", "Anthropic", "Constitutional AI"],
    totalQuestions: 15
  },
  {
    id: "beavertails",
    title: {
      zh: "安全伦理红线测试 (BeaverTails)",
      en: "Safety & Ethics Redline (PKU BeaverTails)"
    },
    subtitle: {
      zh: "北京大学 14 维度价值对齐挑战",
      en: "PKU's 14-Dimension Alignment Arena"
    },
    description: {
      zh: "来自北京大学团队开源的 BeaverTails 双向安全偏好数据集，覆盖仇恨言论、暴力、隐私及伦理冲突的微调抉择。",
      en: "PKU's BeaverTails dataset covering 14 safety categories, challenging human intuition on safety filtering versus free inquiry."
    },
    status: "coming_soon",
    sourceName: "PKU-Alignment / BeaverTails",
    sourceUrl: "https://huggingface.co/datasets/PKU-Alignment/BeaverTails",
    tags: ["Red Teaming", "PKU", "Safety"],
    totalQuestions: 20
  }
];

export function getBenchmarkQuestions(benchmarkId: string): Question[] {
  switch (benchmarkId) {
    case "western-values":
      return WESTERN_VALUES_QUESTIONS;
    default:
      return WESTERN_VALUES_QUESTIONS;
  }
}
