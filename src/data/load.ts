// Bundle-time macros: the bundler runs these and inlines their return values, so the page ships
// ready-made HTML and never parses Markdown in the browser.
import { renderMarkdown } from "../lib/markdown";
import areteEn from "./arete.en.json";
import areteZh from "./arete.zh.json";
import btEn from "./beavertails.en.json";
import btZh from "./beavertails.zh.json";
import hhEn from "./hh-rlhf.en.json";
import hhZh from "./hh-rlhf.zh.json";
import type { AnswerItem, Question, SetId, SideKey, Translation } from "../types/benchmark";

const HH_MODEL = "Anthropic 52B context-distilled language model";
const BT_MODEL = "Alpaca-7B";

interface RawAnswer {
  text: string;
  id?: string;
  categories?: string[];
}

interface RawQuestion<A extends RawAnswer> {
  id: string;
  topic: string;
  prompt: string;
  answers: Record<string, A>;
}

function buildAnswer<A extends RawAnswer>(raw: A, model: string): AnswerItem {
  return {
    model,
    html: renderMarkdown(raw.text),
    ...(raw.id && { id: raw.id }),
    ...(raw.categories && { categories: raw.categories })
  };
}

function loadSet<A extends RawAnswer>(rows: readonly RawQuestion<A>[], set: SetId, sides: [SideKey, SideKey], modelOf: (answer: A) => string): Question[] {
  const [sideA, sideB] = sides;
  return rows.map((r) => ({
    id: r.id,
    set,
    topic: r.topic,
    prompt: r.prompt,
    sides,
    answers: {
      [sideA]: buildAnswer(r.answers[sideA], modelOf(r.answers[sideA])),
      [sideB]: buildAnswer(r.answers[sideB], modelOf(r.answers[sideB]))
    },
    longest: Math.max(r.answers[sideA].text.trim().length, r.answers[sideB].text.trim().length)
  }));
}

interface RawTranslation {
  id: string;
  prompt: string;
  [key: string]: string;
}

function loadTranslationsForSet(rows: readonly RawTranslation[], sides: [SideKey, SideKey]): [string, Translation][] {
  const [sideA, sideB] = sides;
  return rows.map((r) => [
    r.id,
    {
      prompt: r.prompt,
      answers: {
        [sideA]: renderMarkdown(r[sideA], { cjk: true }),
        [sideB]: renderMarkdown(r[sideB], { cjk: true })
      }
    }
  ]);
}

export function loadAllQuestions(): Record<SetId, Question[]> {
  return {
    china: loadSet(areteEn as RawQuestion<RawAnswer & { model: string }>[], "china", ["qwen", "inkling"], (a) => a.model),
    "hh-rlhf": loadSet(hhEn as RawQuestion<RawAnswer>[], "hh-rlhf", ["chosen", "rejected"], () => HH_MODEL),
    beavertails: loadSet(btEn as RawQuestion<RawAnswer>[], "beavertails", ["safe", "unsafe"], () => BT_MODEL)
  };
}

export function loadTranslations(): Record<string, Translation> {
  return Object.fromEntries([
    ...loadTranslationsForSet(areteZh as RawTranslation[], ["qwen", "inkling"]),
    ...loadTranslationsForSet(hhZh as RawTranslation[], ["chosen", "rejected"]),
    ...loadTranslationsForSet(btZh as RawTranslation[], ["safe", "unsafe"])
  ]);
}
