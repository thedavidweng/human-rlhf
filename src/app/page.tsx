"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Language,
  Benchmark,
  Question,
  ActiveQuestion,
  ShuffledOption,
  UserAnswerRecord,
  AlignmentSummary,
  MemeItem
} from "../types/benchmark";
import { BENCHMARKS, getBenchmarkQuestions } from "../data/benchmarks";
import { I18N } from "../lib/i18n";
import { fetchMeme, getStoredGiphyKey } from "../lib/giphy";
import {
  isSoundEnabled,
  setSoundEnabled,
  playSocialCreditSound,
  playDemocracySound,
  playClickSound,
  playFinishSound
} from "../lib/sound";

import { Navbar } from "../components/Navbar";
import { AlignmentBar } from "../components/AlignmentBar";
import { QuestionCard } from "../components/QuestionCard";
import { MemeModal } from "../components/MemeModal";
import { ResultCard } from "../components/ResultCard";
import { BenchmarkSelectorModal } from "../components/BenchmarkSelectorModal";
import { GiphySettingsModal } from "../components/GiphySettingsModal";
import { RLHFExplainerModal } from "../components/RLHFExplainerModal";

const ROUND_SIZE = 10;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function makeActiveQuestion(q: Question, lang: Language): ActiveQuestion {
  const isQwenA = Math.random() < 0.5;
  const firstData = isQwenA ? q.qwenOption : q.nousOption;
  const secondData = isQwenA ? q.nousOption : q.qwenOption;

  return {
    question: q,
    options: {
      A: {
        key: "A",
        alignment: firstData.alignment,
        text: firstData.text[lang],
        badge: firstData.badge[lang],
        rewardTitle: firstData.rewardTitle[lang],
        rewardScore: firstData.rewardScore,
        explanation: firstData.explanation[lang],
        memeKeywords: firstData.memeKeywords
      },
      B: {
        key: "B",
        alignment: secondData.alignment,
        text: secondData.text[lang],
        badge: secondData.badge[lang],
        rewardTitle: secondData.rewardTitle[lang],
        rewardScore: secondData.rewardScore,
        explanation: secondData.explanation[lang],
        memeKeywords: secondData.memeKeywords
      }
    }
  };
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("zh");
  const [activeBenchmark, setActiveBenchmark] = useState<Benchmark>(BENCHMARKS[0]);
  const [soundActive, setSoundActive] = useState<boolean>(true);
  const [hasGiphyKey, setHasGiphyKey] = useState<boolean>(false);

  // Modals
  const [giphyModalOpen, setGiphyModalOpen] = useState(false);
  const [explainerModalOpen, setExplainerModalOpen] = useState(false);
  const [benchmarkModalOpen, setBenchmarkModalOpen] = useState(false);

  // Test state
  const [roundQuestions, setRoundQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentActiveQuestion, setCurrentActiveQuestion] = useState<ActiveQuestion | null>(null);
  const [answers, setAnswers] = useState<UserAnswerRecord[]>([]);

  // Meme popup state
  const [activeMeme, setActiveMeme] = useState<MemeItem | null>(null);
  const [selectedOption, setSelectedOption] = useState<ShuffledOption | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize or restart test round with randomized questions
  const initRound = useCallback((benchmark: Benchmark, lang: Language) => {
    const all = getBenchmarkQuestions(benchmark.id);
    const shuffledPool = shuffleArray(all);
    const selected = shuffledPool.slice(0, Math.min(ROUND_SIZE, shuffledPool.length));

    setRoundQuestions(selected);
    setCurrentIndex(0);
    setAnswers([]);
    setIsFinished(false);
    setActiveMeme(null);
    setSelectedOption(null);

    if (selected.length > 0) {
      setCurrentActiveQuestion(makeActiveQuestion(selected[0], lang));
    }
  }, []);

  // Initialize on client mount
  useEffect(() => {
    setSoundActive(isSoundEnabled());
    setHasGiphyKey(Boolean(getStoredGiphyKey()));
    initRound(activeBenchmark, language);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Language toggle handler with instant question text refresh
  const handleToggleLanguage = () => {
    const nextLang: Language = language === "zh" ? "en" : "zh";
    setLanguage(nextLang);

    // Refresh active question text for new language while keeping Option A/B positions
    if (roundQuestions[currentIndex]) {
      const q = roundQuestions[currentIndex];
      setCurrentActiveQuestion((prev) => {
        if (!prev) return makeActiveQuestion(q, nextLang);
        const optAAlignment = prev.options.A.alignment;
        const optAData = optAAlignment === "qwen" ? q.qwenOption : q.nousOption;
        const optBData = optAAlignment === "qwen" ? q.nousOption : q.qwenOption;

        return {
          question: q,
          options: {
            A: {
              ...prev.options.A,
              text: optAData.text[nextLang],
              badge: optAData.badge[nextLang],
              rewardTitle: optAData.rewardTitle[nextLang],
              explanation: optAData.explanation[nextLang]
            },
            B: {
              ...prev.options.B,
              text: optBData.text[nextLang],
              badge: optBData.badge[nextLang],
              rewardTitle: optBData.rewardTitle[nextLang],
              explanation: optBData.explanation[nextLang]
            }
          }
        };
      });
    }
  };

  // Handle option selection
  const handleSelectOption = async (option: ShuffledOption) => {
    if (!currentActiveQuestion) return;

    playClickSound();

    // Play alignment audio
    if (option.alignment === "qwen") {
      playSocialCreditSound();
    } else {
      playDemocracySound();
    }

    // Record answer
    const newRecord: UserAnswerRecord = {
      questionId: currentActiveQuestion.question.id,
      category: currentActiveQuestion.question.category,
      chosenAlignment: option.alignment,
      chosenKey: option.key
    };
    setAnswers((prev) => [...prev, newRecord]);
    setSelectedOption(option);

    // Fetch meme (live Giphy or curated pool)
    const meme = await fetchMeme(option.alignment, option.memeKeywords);
    setActiveMeme(meme);
  };

  // Move to next question or complete round
  const handleNext = () => {
    setActiveMeme(null);
    setSelectedOption(null);

    const nextIdx = currentIndex + 1;
    if (nextIdx < roundQuestions.length) {
      setCurrentIndex(nextIdx);
      setCurrentActiveQuestion(makeActiveQuestion(roundQuestions[nextIdx], language));
    } else {
      // Completed round!
      setIsFinished(true);
      playFinishSound();
    }
  };

  // Calculate live alignment counts
  const qwenCount = useMemo(
    () => answers.filter((a) => a.chosenAlignment === "qwen").length,
    [answers]
  );
  const nousCount = useMemo(
    () => answers.filter((a) => a.chosenAlignment === "nous").length,
    [answers]
  );

  // Generate alignment summary for ResultCard
  const summary: AlignmentSummary = useMemo(() => {
    const total = answers.length || 1;
    const qPct = Math.round((qwenCount / total) * 100);
    const nPct = 100 - qPct;

    const t = I18N[language];
    let archetypeData = t.archetypes.balanced;

    if (qPct >= 80) {
      archetypeData = t.archetypes.pureQwen;
    } else if (qPct >= 60) {
      archetypeData = t.archetypes.leaningQwen;
    } else if (qPct >= 40) {
      archetypeData = t.archetypes.balanced;
    } else if (qPct >= 20) {
      archetypeData = t.archetypes.leaningNous;
    } else {
      archetypeData = t.archetypes.pureNous;
    }

    // Category breakdown
    const categoryScores: Record<
      string,
      { qwen: number; nous: number; total: number; label: { zh: string; en: string } }
    > = {};

    roundQuestions.forEach((q) => {
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = {
          qwen: 0,
          nous: 0,
          total: 0,
          label: q.categoryLabel
        };
      }
    });

    answers.forEach((ans) => {
      if (categoryScores[ans.category]) {
        categoryScores[ans.category].total += 1;
        if (ans.chosenAlignment === "qwen") {
          categoryScores[ans.category].qwen += 1;
        } else {
          categoryScores[ans.category].nous += 1;
        }
      }
    });

    return {
      qwenCount,
      nousCount,
      total,
      qwenPercent: qPct,
      nousPercent: nPct,
      title: { zh: archetypeData.title, en: archetypeData.title },
      archetype: { zh: archetypeData.archetype, en: archetypeData.archetype },
      description: { zh: archetypeData.description, en: archetypeData.description },
      categoryScores
    };
  }, [answers, qwenCount, nousCount, roundQuestions, language]);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-black">
      {/* Navbar */}
      <Navbar
        language={language}
        onToggleLanguage={handleToggleLanguage}
        soundEnabled={soundActive}
        onToggleSound={() => {
          const next = !soundActive;
          setSoundActive(next);
          setSoundEnabled(next);
        }}
        onOpenGiphyModal={() => setGiphyModalOpen(true)}
        onOpenExplainerModal={() => setExplainerModalOpen(true)}
        onOpenBenchmarkModal={() => setBenchmarkModalOpen(true)}
        activeBenchmark={activeBenchmark}
        hasGiphyKey={hasGiphyKey}
      />

      {/* Main Container */}
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-start px-4 py-6 sm:px-6 sm:py-8">
        {/* Hero Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400 mb-2">
            <span>🔥</span>
            <span>{activeBenchmark.title[language]}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {activeBenchmark.subtitle[language]}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
            {activeBenchmark.description[language]}
          </p>
        </div>

        {/* Live Alignment Bar */}
        <div className="mb-6 w-full">
          <AlignmentBar
            qwenCount={qwenCount}
            nousCount={nousCount}
            language={language}
          />
        </div>

        {/* Test Arena: Question Card or Result Card */}
        <div className="w-full">
          {!isFinished && currentActiveQuestion ? (
            <QuestionCard
              activeQuestion={currentActiveQuestion}
              currentIndex={currentIndex}
              totalQuestions={roundQuestions.length}
              language={language}
              onSelectOption={handleSelectOption}
              disabled={Boolean(activeMeme)}
            />
          ) : isFinished ? (
            <ResultCard
              summary={summary}
              language={language}
              benchmark={activeBenchmark}
              onRestart={() => initRound(activeBenchmark, language)}
              onOpenBenchmarkModal={() => setBenchmarkModalOpen(true)}
            />
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-neutral-500 animate-pulse">
              Loading benchmark questions...
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-900 bg-neutral-950/80 py-5 text-center text-xs text-neutral-400">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
          <div>
            Built with{" "}
            <a
              href="https://huggingface.co/datasets/NousResearch/arete-data-pairs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline"
            >
              Nous Research / arete-data-pairs
            </a>{" "}
            &{" "}
            <a
              href="https://huggingface.co/datasets/NousResearch/Propaganda_Eval"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline"
            >
              Propaganda_Eval
            </a>
          </div>
          <div className="font-mono text-[11px] text-neutral-400">
            Reverse Human RLHF Alignment Toy · Deployable on Vercel
          </div>
        </div>
      </footer>

      {/* Meme Modal */}
      {activeMeme && selectedOption && currentActiveQuestion && (
        <MemeModal
          option={selectedOption}
          meme={activeMeme}
          question={currentActiveQuestion.question}
          language={language}
          onNext={handleNext}
          isLastQuestion={currentIndex === roundQuestions.length - 1}
        />
      )}

      {/* Benchmark Selector Modal */}
      <BenchmarkSelectorModal
        isOpen={benchmarkModalOpen}
        onClose={() => setBenchmarkModalOpen(false)}
        activeBenchmarkId={activeBenchmark.id}
        onSelectBenchmark={(bm) => {
          setActiveBenchmark(bm);
          initRound(bm, language);
        }}
        language={language}
      />

      {/* Giphy Settings Modal */}
      <GiphySettingsModal
        isOpen={giphyModalOpen}
        onClose={() => setGiphyModalOpen(false)}
        language={language}
        onKeyChange={(hasKey) => setHasGiphyKey(hasKey)}
      />

      {/* RLHF Explainer Modal */}
      <RLHFExplainerModal
        isOpen={explainerModalOpen}
        onClose={() => setExplainerModalOpen(false)}
        language={language}
      />
    </div>
  );
}
