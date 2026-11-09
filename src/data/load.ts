// Bundle-time macros: the bundler runs these and inlines their return values, so the page ships
// ready-made HTML and never parses Markdown in the browser.
import { renderMarkdown } from "../lib/markdown";
import en from "./arete.en.json";
import zh from "./arete.zh.json";
import type { ModelKey, Question, Translation } from "../types/benchmark";

interface RawItem {
  id: string;
  topic: string;
  prompt: string;
  answers: Record<ModelKey, { model: string; text: string }>;
}

interface RawTranslation {
  id: string;
  prompt: string;
  qwen: string;
  inkling: string;
}

export function loadQuestions(): Question[] {
  return (en as RawItem[]).map((i) => ({
    id: i.id,
    topic: i.topic,
    prompt: i.prompt,
    answers: {
      qwen: { model: i.answers.qwen.model, html: renderMarkdown(i.answers.qwen.text) },
      inkling: { model: i.answers.inkling.model, html: renderMarkdown(i.answers.inkling.text) }
    },
    longest: Math.max(i.answers.qwen.text.trim().length, i.answers.inkling.text.trim().length)
  }));
}

export function loadTranslations(): Record<string, Translation> {
  return Object.fromEntries(
    (zh as RawTranslation[]).map((r) => [r.id, { prompt: r.prompt, answers: { qwen: renderMarkdown(r.qwen, { cjk: true }), inkling: renderMarkdown(r.inkling, { cjk: true }) } }])
  );
}
