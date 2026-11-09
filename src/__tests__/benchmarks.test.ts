import { describe, expect, it } from "bun:test";
import areteEn from "../data/arete.en.json";
import areteZh from "../data/arete.zh.json";
import btEn from "../data/beavertails.en.json";
import btZh from "../data/beavertails.zh.json";
import hhEn from "../data/hh-rlhf.en.json";
import hhZh from "../data/hh-rlhf.zh.json";
import { MEMES, memePool } from "../data/memes";
import { QUESTIONS_BY_SET } from "../data/questions";
import { SETS } from "../data/sets";
import { I18N } from "../lib/i18n";
import { renderMarkdown } from "../lib/markdown";
import { drawRound, OPENER_MAX_CHARS, ROUND_SIZE, summarize } from "../lib/round";
import { skinEarned } from "../lib/skins";
import type { Answer } from "../types/benchmark";

const sha256 = (s: string) => new Bun.CryptoHasher("sha256").update(s).digest("hex");

const BEAVERTAILS_CATEGORIES = [
  "animal_abuse",
  "child_abuse",
  "controversial_topics,politics",
  "discrimination,stereotype,injustice",
  "drug_abuse,weapons,banned_substance",
  "financial_crime,property_crime,theft",
  "hate_speech,offensive_language",
  "misinformation_regarding_ethics,laws_and_safety",
  "non_violent_unethical_behavior",
  "privacy_violation",
  "self_harm",
  "sexually_explicit,adult_content",
  "terrorism,organized_crime",
  "violence,aiding_and_abetting,incitement"
];

describe("dataset", () => {
  it("keeps both answers of every row, with unique ids", () => {
    expect(new Set(areteEn.map((q) => q.id)).size).toBe(areteEn.length);
    for (const q of areteEn) {
      expect(q.prompt.length).toBeGreaterThan(20);
      expect(q.answers.qwen.model).toBe("Qwen/Qwen3.8-27B");
      expect(q.answers.inkling.model).toBe("thinkingmachines/inkling");
      for (const a of [q.answers.qwen, q.answers.inkling]) expect(a.text.length).toBeGreaterThan(100);
    }

    expect(new Set(hhEn.map((q) => q.id)).size).toBe(hhEn.length);
    for (const q of hhEn) {
      expect(q.prompt.length).toBeGreaterThan(10);
      expect(q.answers.chosen.text.length).toBeGreaterThan(10);
      expect(q.answers.rejected.text.length).toBeGreaterThan(10);
    }

    expect(new Set(btEn.map((q) => q.id)).size).toBe(btEn.length);
    for (const q of btEn) {
      expect(q.prompt.length).toBeGreaterThan(10);
      expect(q.answers.safe.text.length).toBeGreaterThan(10);
      expect(q.answers.unsafe.text.length).toBeGreaterThan(10);
      expect(q.answers.unsafe.categories.length).toBeGreaterThan(0);
    }
  });

  it("stores every prompt and answer byte for byte as published", () => {
    for (const q of areteEn) {
      expect(sha256(q.prompt), q.id).toBe(q.promptSha256);
      for (const a of [q.answers.qwen, q.answers.inkling]) expect(sha256(a.text), q.id).toBe(a.sha256);
    }

    for (const q of hhEn) {
      const chosenRaw = `\n\nHuman: ${q.prompt}\n\nAssistant: ${q.answers.chosen.text}`;
      const rejectedRaw = `\n\nHuman: ${q.prompt}\n\nAssistant: ${q.answers.rejected.text}`;
      expect(sha256(chosenRaw), q.id).toBe(q.answers.chosen.sha256);
      expect(sha256(rejectedRaw), q.id).toBe(q.answers.rejected.sha256);
    }

    for (const q of btEn) {
      expect(sha256(q.answers.safe.text), q.id).toBe(q.answers.safe.sha256);
      expect(sha256(q.answers.unsafe.text), q.id).toBe(q.answers.unsafe.sha256);
    }
  });

  it("has a translation for every question, with the same Markdown shape", () => {
    expect(areteZh.map((t) => t.id)).toEqual(areteEn.map((q) => q.id));
    const shape = (s: string) => [(s.match(/^\s*[-*] /gm) ?? []).length, (s.match(/^\s*\d+[.)] /gm) ?? []).length, (s.match(/^#+ /gm) ?? []).length];
    for (const [i, t] of areteZh.entries()) {
      for (const k of ["qwen", "inkling"] as const) {
        expect(t[k].length, `${t.id}.${k}`).toBeGreaterThan(areteEn[i].answers[k].text.length * 0.2);
        expect(shape(t[k]), `${t.id}.${k}`).toEqual(shape(areteEn[i].answers[k].text));
      }
    }

    expect(hhZh.map((t) => t.id)).toEqual(hhEn.map((q) => q.id));
    for (const [i, t] of hhZh.entries()) {
      for (const k of ["chosen", "rejected"] as const) {
        expect(t[k].length, `${t.id}.${k}`).toBeGreaterThan(hhEn[i].answers[k].text.length * 0.2);
        expect(shape(t[k]), `${t.id}.${k}`).toEqual(shape(hhEn[i].answers[k].text));
      }
    }

    expect(btZh.map((t) => t.id)).toEqual(btEn.map((q) => q.id));
    for (const [i, t] of btZh.entries()) {
      for (const k of ["safe", "unsafe"] as const) {
        expect(t[k].length, `${t.id}.${k}`).toBeGreaterThan(btEn[i].answers[k].text.length * 0.2);
        expect(shape(t[k]), `${t.id}.${k}`).toEqual(shape(btEn[i].answers[k].text));
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
  const [chinaSet, hhSet, btSet] = SETS;

  it("draws distinct questions with both answers placed once", () => {
    const round = drawRound(QUESTIONS_BY_SET.china);
    expect(round.length).toBe(ROUND_SIZE);
    expect(new Set(round.map((r) => r.question.id)).size).toBe(ROUND_SIZE);
    expect(round[0].question.longest).toBeLessThanOrEqual(OPENER_MAX_CHARS);
    for (const r of round) {
      expect([...r.order].sort()).toEqual(["inkling", "qwen"]);
      for (const side of r.order) expect(r.memes[side]?.side).toBe(side);
    }

    const hhRound = drawRound(QUESTIONS_BY_SET["hh-rlhf"]);
    expect(hhRound.length).toBe(ROUND_SIZE);
    expect(new Set(hhRound.map((r) => r.question.id)).size).toBe(ROUND_SIZE);
    expect(hhRound[0].question.longest).toBeLessThanOrEqual(OPENER_MAX_CHARS);
    for (const r of hhRound) {
      expect([...r.order].sort()).toEqual(["chosen", "rejected"]);
      expect(r.memes).toEqual({});
    }

    const btRound = drawRound(QUESTIONS_BY_SET.beavertails);
    expect(btRound.length).toBe(ROUND_SIZE);
    expect(new Set(btRound.map((r) => r.question.id)).size).toBe(ROUND_SIZE);
    expect(btRound[0].question.longest).toBeLessThanOrEqual(OPENER_MAX_CHARS);
    for (const r of btRound) {
      expect([...r.order].sort()).toEqual(["safe", "unsafe"]);
      expect(r.memes).toEqual({});
    }
  });

  it("summarises answers into percentages, a leaning and per-topic counts", () => {
    const answers: Answer[] = QUESTIONS_BY_SET.china.slice(0, 10).map((question, i) => ({
      question,
      side: i < 7 ? "qwen" : "inkling"
    }));
    const s = summarize(chinaSet, answers);
    expect([s.first, s.second, s.firstPercent, s.secondPercent]).toEqual([7, 3, 70, 30]);
    expect(s.archetype).toBe("leanFirst");
    expect(s.byTopic.reduce((n, c) => n + c.first + c.second, 0)).toBe(10);
    expect(
      summarize(
        chinaSet,
        answers.map((a) => ({ ...a, side: "inkling" }))
      ).archetype
    ).toBe("mostlySecond");
    expect(summarize(chinaSet, answers.slice(5, 9)).archetype).toBe("split");

    const hhPool = QUESTIONS_BY_SET["hh-rlhf"];
    const hhAnswers: Answer[] = hhPool.slice(0, 10).map((question, i) => ({
      question,
      side: i < 8 ? "chosen" : "rejected"
    }));
    const sHh = summarize(hhSet, hhAnswers);
    expect([sHh.first, sHh.second, sHh.firstPercent, sHh.secondPercent]).toEqual([8, 2, 80, 20]);
    expect(sHh.archetype).toBe("mostlyFirst");
    expect(sHh.byTopic.reduce((n, c) => n + c.first + c.second, 0)).toBe(10);
    expect(
      summarize(
        hhSet,
        hhAnswers.map((a) => ({ ...a, side: "rejected" }))
      ).archetype
    ).toBe("mostlySecond");
    expect(summarize(hhSet, hhAnswers.slice(6, 10)).archetype).toBe("split");

    const btPool = QUESTIONS_BY_SET.beavertails;
    const btAnswers: Answer[] = btPool.slice(0, 10).map((question, i) => ({
      question,
      side: i < 8 ? "safe" : "unsafe"
    }));
    const sBt = summarize(btSet, btAnswers);
    expect([sBt.first, sBt.second, sBt.firstPercent, sBt.secondPercent]).toEqual([8, 2, 80, 20]);
    expect(sBt.archetype).toBe("mostlyFirst");
    expect(sBt.byTopic.reduce((n, c) => n + c.first + c.second, 0)).toBe(10);
    expect(
      summarize(
        btSet,
        btAnswers.map((a) => ({ ...a, side: "unsafe" }))
      ).archetype
    ).toBe("mostlySecond");
    expect(summarize(btSet, btAnswers.slice(6, 10)).archetype).toBe("split");
  });
});

describe("skins", () => {
  const [chinaSet, hhSet, btSet] = SETS;

  it("unlocks the theme of whichever side got more picks, and none on a tie", () => {
    const answers = (q: number, i: number): Answer[] => [
      ...QUESTIONS_BY_SET.china.slice(0, q).map((question) => ({ question, side: "qwen" as const })),
      ...QUESTIONS_BY_SET.china.slice(q, q + i).map((question) => ({ question, side: "inkling" as const }))
    ];
    expect(skinEarned(summarize(chinaSet, answers(6, 4)))).toBe("red");
    expect(skinEarned(summarize(chinaSet, answers(4, 6)))).toBe("freedom");
    expect(skinEarned(summarize(chinaSet, answers(5, 5)))).toBeNull();

    const hhAnswers: Answer[] = QUESTIONS_BY_SET["hh-rlhf"].slice(0, 10).map((question) => ({
      question,
      side: "chosen"
    }));
    expect(skinEarned(summarize(hhSet, hhAnswers))).toBeNull();

    const btAnswers: Answer[] = QUESTIONS_BY_SET.beavertails.slice(0, 10).map((question) => ({
      question,
      side: "safe"
    }));
    expect(skinEarned(summarize(btSet, btAnswers))).toBeNull();
  });
});

describe("i18n", () => {
  it("defines the same keys in both languages and labels every topic", () => {
    expect(Object.keys(I18N.en).sort()).toEqual(Object.keys(I18N.zh).sort());
    for (const q of areteEn) {
      expect(I18N.zh.topics[q.topic]).toBeTruthy();
      expect(I18N.en.topics[q.topic]).toBeTruthy();
    }
    for (const q of hhEn) {
      expect(I18N.zh.topics[q.topic]).toBeTruthy();
      expect(I18N.en.topics[q.topic]).toBeTruthy();
    }
    for (const q of btEn) {
      expect(I18N.zh.topics[q.topic]).toBeTruthy();
      expect(I18N.en.topics[q.topic]).toBeTruthy();
      for (const cat of q.answers.unsafe.categories) {
        expect(I18N.zh.topics[cat]).toBeTruthy();
        expect(I18N.en.topics[cat]).toBeTruthy();
      }
    }
    for (const cat of BEAVERTAILS_CATEGORIES) {
      expect(I18N.zh.topics[cat]).toBeTruthy();
      expect(I18N.en.topics[cat]).toBeTruthy();
    }
  });
});
