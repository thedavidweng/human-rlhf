import { describe, expect, it } from "bun:test";
import en from "../data/arete.en.json";
import zh from "../data/arete.zh.json";
import { loadQuestions } from "../data/load";
import { MEMES, memePool } from "../data/memes";
import { I18N } from "../lib/i18n";
import { renderMarkdown } from "../lib/markdown";
import { drawRound, OPENER_MAX_CHARS, ROUND_SIZE, summarize } from "../lib/round";
import { skinEarned } from "../lib/skins";
import type { Answer } from "../types/benchmark";

const QUESTIONS = loadQuestions();
const sha256 = (s: string) => new Bun.CryptoHasher("sha256").update(s).digest("hex");

describe("dataset", () => {
  it("keeps both answers of every row, with unique ids", () => {
    expect(new Set(en.map((q) => q.id)).size).toBe(en.length);
    for (const q of en) {
      expect(q.prompt.length).toBeGreaterThan(20);
      expect(q.answers.qwen.model).toBe("Qwen/Qwen3.8-27B");
      expect(q.answers.inkling.model).toBe("thinkingmachines/inkling");
      for (const a of [q.answers.qwen, q.answers.inkling]) expect(a.text.length).toBeGreaterThan(100);
    }
  });

  it("stores every prompt and answer byte for byte as published", () => {
    for (const q of en) {
      expect(sha256(q.prompt), q.id).toBe(q.promptSha256);
      for (const a of [q.answers.qwen, q.answers.inkling]) expect(sha256(a.text), q.id).toBe(a.sha256);
    }
  });

  it("has a translation for every question, with the same Markdown shape", () => {
    expect(zh.map((t) => t.id)).toEqual(en.map((q) => q.id));
    const shape = (s: string) => [(s.match(/^\s*[-*] /gm) ?? []).length, (s.match(/^\s*\d+[.)] /gm) ?? []).length, (s.match(/^#+ /gm) ?? []).length];
    for (const [i, t] of zh.entries()) {
      for (const k of ["qwen", "inkling"] as const) {
        expect(t[k].length, `${t.id}.${k}`).toBeGreaterThan(en[i].answers[k].text.length * 0.2);
        expect(shape(t[k]), `${t.id}.${k}`).toEqual(shape(en[i].answers[k].text));
      }
    }
  });
});

describe("markdown", () => {
  it("escapes raw HTML and drops non-http links", () => {
    const html = renderMarkdown("**ok** <script>x()</script> <img src=x onerror=y()>\n\n[a](javascript:alert(1)) [b](https://example.org)");
    expect(html).toContain("<strong>ok</strong>");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("javascript:");
    expect(html).toContain('href="https://example.org"');
  });

  it("renders emphasis next to Chinese punctuation, without touching list bullets", () => {
    const html = renderMarkdown("*《人民日报》*将其称为**“百年国耻”**。\n\n* 列表项", { cjk: true });
    expect(html).toContain("<em>《人民日报》</em>");
    expect(html).toContain("<strong>“百年国耻”</strong>");
    expect(html).toContain("<li>列表项</li>");
    expect(html).not.toContain("*");
  });
});

describe("memes", () => {
  it("are unique, captioned in both languages, and cover both sides", () => {
    expect(new Set(MEMES.map((m) => m.id)).size).toBe(MEMES.length);
    for (const m of MEMES) expect(m.alt.zh && m.alt.en).toBeTruthy();
    expect(memePool("qwen").length).toBeGreaterThan(5);
    expect(memePool("inkling").length).toBeGreaterThan(5);
  });
});

describe("round", () => {
  it("draws distinct questions with both answers placed once", () => {
    const round = drawRound(QUESTIONS);
    expect(round.length).toBe(ROUND_SIZE);
    expect(new Set(round.map((r) => r.question.id)).size).toBe(ROUND_SIZE);
    expect(round[0].question.longest).toBeLessThanOrEqual(OPENER_MAX_CHARS);
    for (const r of round) {
      expect([...r.order].sort()).toEqual(["inkling", "qwen"]);
      for (const side of r.order) expect(r.memes[side].side).toBe(side);
    }
  });

  it("summarises answers into percentages, a leaning and per-topic counts", () => {
    const answers: Answer[] = QUESTIONS.slice(0, 10).map((question, i) => ({ question, model: i < 7 ? "qwen" : "inkling" }));
    const s = summarize(answers);
    expect([s.qwen, s.inkling, s.qwenPercent, s.inklingPercent]).toEqual([7, 3, 70, 30]);
    expect(s.archetype).toBe("leanQwen");
    expect(s.byTopic.reduce((n, c) => n + c.qwen + c.inkling, 0)).toBe(10);
    expect(summarize(answers.map((a) => ({ ...a, model: "inkling" }))).archetype).toBe("mostlyInkling");
    expect(summarize(answers.slice(5, 9)).archetype).toBe("split");
  });
});

describe("skins", () => {
  it("unlocks the theme of whichever side got more picks, and none on a tie", () => {
    const answers = (q: number, i: number): Answer[] => [
      ...QUESTIONS.slice(0, q).map((question) => ({ question, model: "qwen" as const })),
      ...QUESTIONS.slice(q, q + i).map((question) => ({ question, model: "inkling" as const }))
    ];
    expect(skinEarned(summarize(answers(6, 4)))).toBe("red");
    expect(skinEarned(summarize(answers(4, 6)))).toBe("freedom");
    expect(skinEarned(summarize(answers(5, 5)))).toBeNull();
  });
});

describe("i18n", () => {
  it("defines the same keys in both languages and labels every topic", () => {
    expect(Object.keys(I18N.en).sort()).toEqual(Object.keys(I18N.zh).sort());
    for (const q of en) {
      expect(I18N.zh.topics[q.topic]).toBeTruthy();
      expect(I18N.en.topics[q.topic]).toBeTruthy();
    }
  });
});
