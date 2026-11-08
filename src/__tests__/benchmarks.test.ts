import { describe, it, expect } from "bun:test";
import { BENCHMARKS, getBenchmarkQuestions } from "../data/benchmarks";
import { WESTERN_VALUES_QUESTIONS } from "../data/benchmarks/western-values";
import { CURATED_MEMES, getRandomCuratedMeme } from "../data/memes";
import { I18N } from "../lib/i18n";
import { verifyGiphyKey, fetchMeme } from "../lib/giphy";
import { existsSync } from "fs";
import { join } from "path";

describe("RLHF Benchmarks Registry", () => {
  it("should have Western Values benchmark as active", () => {
    const western = BENCHMARKS.find((b) => b.id === "western-values");
    expect(western).toBeDefined();
    expect(western?.status).toBe("active");
    expect(western?.sourceUrl).toContain("https://huggingface.co/datasets/");
  });

  it("should have upcoming benchmarks registered for future expansion", () => {
    const hhRlhf = BENCHMARKS.find((b) => b.id === "hh-rlhf");
    const beaver = BENCHMARKS.find((b) => b.id === "beavertails");
    expect(hhRlhf).toBeDefined();
    expect(hhRlhf?.status).toBe("coming_soon");
    expect(beaver).toBeDefined();
    expect(beaver?.status).toBe("coming_soon");
  });

  it("getBenchmarkQuestions returns valid question list with 20 items", () => {
    const questions = getBenchmarkQuestions("western-values");
    expect(questions.length).toBe(20);
    expect(questions).toBe(WESTERN_VALUES_QUESTIONS);
  });
});

describe("Western Values Questions Quality & Provenance", () => {
  it("every question should have unique ID", () => {
    const ids = new Set<string>();
    for (const q of WESTERN_VALUES_QUESTIONS) {
      expect(ids.has(q.id)).toBe(false);
      ids.add(q.id);
    }
    expect(ids.size).toBe(20);
  });

  it("every question must link to authentic HuggingFace dataset", () => {
    for (const q of WESTERN_VALUES_QUESTIONS) {
      expect(q.datasetUrl).toMatch(/^https:\/\/huggingface\.co\/datasets\/NousResearch\//);
      expect(q.datasetName.length).toBeGreaterThan(0);
      expect(["NousResearch/Propaganda_Eval", "NousResearch/arete-data-pairs"]).toContain(q.datasetName);
    }
  });

  it("every question must have bilingual prompt (zh and en)", () => {
    for (const q of WESTERN_VALUES_QUESTIONS) {
      expect(q.prompt.zh.trim().length).toBeGreaterThan(15);
      expect(q.prompt.en.trim().length).toBeGreaterThan(15);
    }
  });

  it("every question must have valid Qwen and Nous options with rewards", () => {
    for (const q of WESTERN_VALUES_QUESTIONS) {
      // Qwen Option
      expect(q.qwenOption.alignment).toBe("qwen");
      expect(q.qwenOption.text.zh.length).toBeGreaterThan(10);
      expect(q.qwenOption.text.en.length).toBeGreaterThan(10);
      expect(q.qwenOption.badge.zh.length).toBeGreaterThan(2);
      expect(q.qwenOption.badge.en.length).toBeGreaterThan(2);
      expect(q.qwenOption.rewardScore).toContain("Social Credit");
      expect(q.qwenOption.explanation.zh.length).toBeGreaterThan(10);
      expect(q.qwenOption.explanation.en.length).toBeGreaterThan(10);
      expect(q.qwenOption.memeKeywords.length).toBeGreaterThan(0);

      // Nous Option
      expect(q.nousOption.alignment).toBe("nous");
      expect(q.nousOption.text.zh.length).toBeGreaterThan(10);
      expect(q.nousOption.text.en.length).toBeGreaterThan(10);
      expect(q.nousOption.badge.zh.length).toBeGreaterThan(2);
      expect(q.nousOption.badge.en.length).toBeGreaterThan(2);
      expect(q.nousOption.rewardScore).toContain("Freedom");
      expect(q.nousOption.explanation.zh.length).toBeGreaterThan(10);
      expect(q.nousOption.explanation.en.length).toBeGreaterThan(10);
      expect(q.nousOption.memeKeywords.length).toBeGreaterThan(0);
    }
  });

  it("covers all key categories with bilingual labels", () => {
    const categories = new Set(WESTERN_VALUES_QUESTIONS.map((q) => q.category));
    expect(categories.has("freedom-of-expression")).toBe(true);
    expect(categories.has("democracy-and-governance")).toBe(true);
    expect(categories.has("state-ideology")).toBe(true);
    expect(categories.has("state-vs-free-market-capitalism")).toBe(true);
    expect(categories.has("data-privacy-surveillance")).toBe(true);

    for (const q of WESTERN_VALUES_QUESTIONS) {
      expect(q.categoryLabel.zh.length).toBeGreaterThan(2);
      expect(q.categoryLabel.en.length).toBeGreaterThan(2);
    }
  });
});

describe("Meme Gallery & Fallback Assets", () => {
  it("should have curated memes for both Qwen and Nous alignments", () => {
    const qwenMemes = CURATED_MEMES.filter((m) => m.alignment === "qwen");
    const nousMemes = CURATED_MEMES.filter((m) => m.alignment === "nous");

    expect(qwenMemes.length).toBeGreaterThanOrEqual(5);
    expect(nousMemes.length).toBeGreaterThanOrEqual(5);

    for (const m of CURATED_MEMES) {
      expect(m.imageUrl).toMatch(/^https?:\/\//);
      expect(m.title.zh.length).toBeGreaterThan(0);
      expect(m.title.en.length).toBeGreaterThan(0);
      expect(m.caption.zh.length).toBeGreaterThan(0);
      expect(m.caption.en.length).toBeGreaterThan(0);
    }
  });

  it("every curated meme has a fallbackSvg that exists in public/", () => {
    for (const m of CURATED_MEMES) {
      expect(m.fallbackSvg).toBeDefined();
      expect(m.fallbackSvg?.startsWith("/memes/")).toBe(true);
      const filePath = join(process.cwd(), "public", m.fallbackSvg!);
      expect(existsSync(filePath)).toBe(true);
    }
  });

  it("getRandomCuratedMeme returns appropriate meme for alignment", () => {
    const qwenMeme = getRandomCuratedMeme("qwen");
    expect(qwenMeme.alignment).toBe("qwen");

    const nousMeme = getRandomCuratedMeme("nous");
    expect(nousMeme.alignment).toBe("nous");
  });

  it("fetchMeme falls back to curated meme when no key is set", async () => {
    const meme = await fetchMeme("qwen", ["social credit"]);
    expect(meme).toBeDefined();
    expect(meme.alignment).toBe("qwen");
    expect(meme.imageUrl).toBeTruthy();
    expect(meme.fallbackSvg).toBeTruthy();
  });

  it("verifyGiphyKey returns false for empty key", async () => {
    const result = await verifyGiphyKey("");
    expect(result).toBe(false);
  });
});

describe("Alignment Diagnostic Archetypes & True Bilingual Separation", () => {
  it("zh and en dictionaries should have complete archetypes", () => {
    expect(I18N.zh.archetypes.pureQwen.archetype).toContain("北京后训练大模型");
    expect(I18N.zh.archetypes.pureNous.title).toContain("自由之鹰");
    expect(I18N.zh.archetypes.balanced.title).toContain("对齐失败");

    expect(I18N.en.archetypes.pureQwen.archetype).toContain("Qwen");
    expect(I18N.en.archetypes.pureNous.title).toContain("Freedom Eagle");
  });

  it("verifies that pureQwen archetype produces different zh and en strings", () => {
    const zh = I18N.zh.archetypes.pureQwen;
    const en = I18N.en.archetypes.pureQwen;

    expect(zh.title).not.toEqual(en.title);
    expect(zh.archetype).not.toEqual(en.archetype);
    expect(zh.description).not.toEqual(en.description);

    // English string must not contain Chinese characters
    expect(/[\u4e00-\u9fa5]/.test(en.title)).toBe(false);
    expect(/[\u4e00-\u9fa5]/.test(en.archetype)).toBe(false);
  });

  it("verifies that pureNous archetype produces different zh and en strings", () => {
    const zh = I18N.zh.archetypes.pureNous;
    const en = I18N.en.archetypes.pureNous;

    expect(zh.title).not.toEqual(en.title);
    expect(zh.archetype).not.toEqual(en.archetype);
    expect(/[\u4e00-\u9fa5]/.test(en.title)).toBe(false);
  });

  it("verifies that balanced archetype produces different zh and en strings", () => {
    const zh = I18N.zh.archetypes.balanced;
    const en = I18N.en.archetypes.balanced;

    expect(zh.title).not.toEqual(en.title);
    expect(zh.archetype).not.toEqual(en.archetype);
    expect(/[\u4e00-\u9fa5]/.test(en.title)).toBe(false);
  });
});
