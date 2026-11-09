import { memePool, type Meme } from "../data/memes";
import type { Answer, ModelKey, Question } from "../types/benchmark";
import { archetypeFor, type ArchetypeKey } from "./i18n";

export const ROUND_SIZE = 10;

/** The first question of a round fits on one screen, so the opening view is a clean screenshot. */
export const OPENER_MAX_CHARS = 1700;

export interface RoundItem {
  question: Question;
  /** order[0] is shown as A, order[1] as B. */
  order: [ModelKey, ModelKey];
  /** The clip each answer would earn, dealt without repeats until a side's pool runs out. */
  memes: Record<ModelKey, Meme>;
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function drawRound(pool: readonly Question[], random = Math.random): RoundItem[] {
  const qwen = shuffle(memePool("qwen"), random);
  const inkling = shuffle(memePool("inkling"), random);
  const shuffled = shuffle(pool, random);
  const opener = shuffled.find((q) => q.longest <= OPENER_MAX_CHARS)!;
  return [opener, ...shuffled.filter((q) => q !== opener)]
    .slice(0, ROUND_SIZE)
    .map((question, i) => ({
      question,
      order: random() < 0.5 ? ["qwen", "inkling"] : ["inkling", "qwen"],
      memes: { qwen: qwen[i % qwen.length], inkling: inkling[i % inkling.length] }
    }));
}

export interface Summary {
  qwen: number;
  inkling: number;
  qwenPercent: number;
  inklingPercent: number;
  archetype: ArchetypeKey;
  byTopic: { topic: string; qwen: number; inkling: number }[];
}

export function summarize(answers: readonly Answer[]): Summary {
  const qwen = answers.filter((a) => a.model === "qwen").length;
  const inkling = answers.length - qwen;
  const qwenPercent = answers.length ? Math.round((qwen / answers.length) * 100) : 0;
  const byTopic = new Map<string, Summary["byTopic"][number]>();
  for (const { question, model } of answers) {
    const row = byTopic.get(question.topic) ?? { topic: question.topic, qwen: 0, inkling: 0 };
    row[model] += 1;
    byTopic.set(question.topic, row);
  }
  return {
    qwen,
    inkling,
    qwenPercent,
    inklingPercent: answers.length ? 100 - qwenPercent : 0,
    archetype: archetypeFor(qwenPercent),
    byTopic: [...byTopic.values()]
  };
}
