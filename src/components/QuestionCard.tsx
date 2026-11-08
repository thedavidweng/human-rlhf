"use client";

import React, { useState, useEffect } from "react";
import { ActiveQuestion, ShuffledOption, Language } from "../types/benchmark";
import { I18N } from "../lib/i18n";
import { ExternalLink, Database, Globe, Bookmark, ArrowRight } from "lucide-react";

interface QuestionCardProps {
  activeQuestion: ActiveQuestion;
  currentIndex: number;
  totalQuestions: number;
  language: Language;
  onSelectOption: (option: ShuffledOption) => void;
  disabled?: boolean;
  isSelecting?: boolean;
  selectedOptionKey?: "A" | "B" | null;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  activeQuestion,
  currentIndex,
  totalQuestions,
  language,
  onSelectOption,
  disabled = false,
  isSelecting = false,
  selectedOptionKey = null
}) => {
  const [showBilingual, setShowBilingual] = useState(false);
  const t = I18N[language];
  const q = activeQuestion.question;

  // Keyboard shortcut listener (1/A/ArrowLeft for Option A, 2/B/ArrowRight for Option B)
  useEffect(() => {
    if (disabled || isSelecting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled || isSelecting) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toUpperCase();
      if (key === "1" || key === "A" || e.key === "ArrowLeft") {
        e.preventDefault();
        onSelectOption(activeQuestion.options.A);
      } else if (key === "2" || key === "B" || e.key === "ArrowRight") {
        e.preventDefault();
        onSelectOption(activeQuestion.options.B);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, isSelecting, activeQuestion, onSelectOption]);

  const primaryPrompt = q.prompt[language];
  const secondaryPrompt = language === "zh" ? q.prompt.en : q.prompt.zh;

  return (
    <div className="w-full rounded-3xl border border-neutral-800 bg-neutral-900/90 p-5 shadow-2xl shadow-black/60 sm:p-7 backdrop-blur-xl">
      {/* Header Badges & Provenance */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5 border-b border-neutral-800/80 pb-4">
        {/* Progress & Category */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-amber-500/10 px-3 py-1 font-mono text-xs font-bold text-amber-400 border border-amber-500/20">
            {t.questionCounter(currentIndex + 1, totalQuestions)}
          </span>
          <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-300">
            {q.categoryLabel[language]}
          </span>
        </div>

        {/* Dataset Provenance with HuggingFace Link */}
        <div className="flex items-center gap-2">
          <a
            href={q.datasetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1 text-[11px] font-medium text-neutral-300 transition hover:border-amber-500/50 hover:bg-neutral-800 hover:text-white"
            title={t.viewOnHuggingFace}
          >
            <Database className="h-3 w-3 text-amber-400 transition group-hover:scale-110" />
            <span className="font-mono text-neutral-400 group-hover:text-neutral-200">
              {q.datasetName}
            </span>
            <ExternalLink className="h-3 w-3 text-neutral-500 transition group-hover:text-amber-400" />
          </a>
        </div>
      </div>

      {/* Source Anchor Citation if present */}
      {(q.anchor || q.sourceUrl) && (
        <div className="mb-3 flex items-center gap-2 text-xs text-neutral-400">
          <Bookmark className="h-3.5 w-3.5 text-neutral-500" />
          <span>{t.sourceFactAnchor}:</span>
          {q.sourceUrl ? (
            <a
              href={q.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-neutral-300 underline underline-offset-2 hover:text-amber-400"
            >
              <span>{q.anchor || "Source Reference"}</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          ) : (
            <span className="font-medium text-neutral-300">{q.anchor}</span>
          )}
        </div>
      )}

      {/* Question Prompt */}
      <div className="mb-6 space-y-2">
        <h2 className="text-lg font-semibold leading-relaxed text-white sm:text-xl">
          {primaryPrompt}
        </h2>

        {/* Bilingual Secondary Display */}
        {showBilingual && (
          <p className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3 text-sm italic leading-relaxed text-neutral-400">
            {secondaryPrompt}
          </p>
        )}

        <div className="pt-1">
          <button
            onClick={() => setShowBilingual(!showBilingual)}
            className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 transition hover:text-neutral-300"
          >
            <Globe className="h-3 w-3" />
            <span>{showBilingual ? t.bilingualToggleHide : t.bilingualToggleShow}</span>
          </button>
        </div>
      </div>

      {/* Choice Prompt Label */}
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-400">
        {t.chooseAnswerPrompt}
      </p>

      {/* Options Grid (Option A and Option B, randomized order) */}
      <div className="grid gap-3.5 sm:grid-cols-2">
        {(["A", "B"] as const).map((key) => {
          const opt = activeQuestion.options[key];
          const isThisSelected = isSelecting && selectedOptionKey === key;
          const isOtherSelected = isSelecting && selectedOptionKey !== key;

          return (
            <button
              key={key}
              onClick={() => onSelectOption(opt)}
              disabled={disabled || isSelecting}
              className={`group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 active:scale-[0.99] disabled:pointer-events-none ${
                isThisSelected
                  ? opt.alignment === "qwen"
                    ? "border-red-500 bg-red-950/40 ring-2 ring-red-500 shadow-xl shadow-red-500/20 animate-pulse"
                    : "border-blue-500 bg-blue-950/40 ring-2 ring-blue-500 shadow-xl shadow-blue-500/20 animate-pulse"
                  : isOtherSelected
                  ? "border-neutral-800 bg-neutral-950/40 opacity-40"
                  : "border-neutral-700/80 bg-neutral-950/70 hover:-translate-y-0.5 hover:border-amber-500/60 hover:bg-neutral-800/80 hover:shadow-xl hover:shadow-amber-500/5 disabled:opacity-50"
              }`}
            >
              {/* Option Key Tag */}
              <div className="mb-3 flex items-center justify-between">
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold transition ${
                  isThisSelected
                    ? opt.alignment === "qwen" ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                    : "bg-neutral-800 text-amber-400 ring-1 ring-neutral-700 group-hover:bg-amber-500 group-hover:text-black"
                }`}>
                  {key}
                </span>
                <span className="font-mono text-[11px] text-neutral-500 group-hover:text-neutral-400">
                  {key === "A" ? "[A / 1 / ←]" : "[B / 2 / →]"}
                </span>
              </div>

              {/* Option Text */}
              <p className="text-sm sm:text-base font-normal leading-relaxed text-neutral-200 group-hover:text-white">
                {opt.text}
              </p>

              {/* Hover Cue or Loading State */}
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-neutral-500 transition group-hover:text-amber-400">
                {isThisSelected ? (
                  <span className={opt.alignment === "qwen" ? "text-red-400 font-semibold" : "text-blue-400 font-semibold"}>
                    {language === "zh" ? "🧠 神经元权重对齐中..." : "🧠 Aligning reward weights..."}
                  </span>
                ) : (
                  <>
                    <span>Select this response</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
