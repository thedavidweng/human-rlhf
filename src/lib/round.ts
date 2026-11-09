import { memePool, type Meme } from "../data/memes";
import type { QuestionSet } from "../data/sets";
import type { Answer, Question, SetId, SideKey } from "../types/benchmark";
import { archetypeFor, type ArchetypeKey } from "./i18n";

export const ROUND_SIZE = 10;

/** The first question of a round fits on one screen, so the opening view is a clean screenshot. */
export const OPENER_MAX_CHARS = 1700;

export interface RoundItem {
  question: Question;
  /** order[0] is shown as A, order[1] as B. */
  order: [SideKey, SideKey];
  /** The clip each answer would earn, dealt without repeats until a side's pool runs out. */
  memes: Partial<Record<SideKey, Meme>>;
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
  const isChina = pool[0]?.set === "china";
  const qwenMemes = isChina ? shuffle(memePool("qwen"), random) : [];
  const inklingMemes = isChina ? shuffle(memePool("inkling"), random) : [];
  const shuffled = shuffle(pool, random);
  const opener = shuffled.find((q) => q.longest <= OPENER_MAX_CHARS)!;
  return [opener, ...shuffled.filter((q) => q !== opener)].slice(0, ROUND_SIZE).map((question, i) => {
    const [sideA, sideB] = question.sides;
    const order: [SideKey, SideKey] = random() < 0.5 ? [sideA, sideB] : [sideB, sideA];
    return {
      question,
      order,
      memes: isChina ? { qwen: qwenMemes[i % qwenMemes.length], inkling: inklingMemes[i % inklingMemes.length] } : {}
    };
  });
}

export interface Summary {
  set: SetId;
  sides: [SideKey, SideKey];
  first: number;
  second: number;
  firstPercent: number;
  secondPercent: number;
  archetype: ArchetypeKey;
  byTopic: { topic: string; first: number; second: number }[];
}

export function summarize(set: Pick<QuestionSet, "id" | "sides">, answers: readonly Answer[]): Summary {
  const [sideA, sideB] = set.sides;
  const first = answers.filter((a) => a.side === sideA).length;
  const second = answers.length - first;
  const firstPercent = answers.length ? Math.round((first / answers.length) * 100) : 0;
  const secondPercent = answers.length ? 100 - firstPercent : 0;
  const byTopic = new Map<string, { topic: string; first: number; second: number }>();
  for (const { question, side } of answers) {
    const row = byTopic.get(question.topic) ?? {
      topic: question.topic,
      first: 0,
      second: 0
    };
    if (side === sideA) {
      row.first += 1;
    } else {
      row.second += 1;
    }
    byTopic.set(question.topic, row);
  }
  return {
    set: set.id,
    sides: set.sides,
    first,
    second,
    firstPercent,
    secondPercent,
    archetype: archetypeFor(firstPercent),
    byTopic: [...byTopic.values()]
  };
}
