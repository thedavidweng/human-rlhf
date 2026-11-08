"use client";

import React, { useEffect, useState } from "react";
import { ShuffledOption, MemeItem, Language, Question } from "../types/benchmark";
import { I18N } from "../lib/i18n";
import { ExternalLink, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

interface MemeModalProps {
  option: ShuffledOption;
  meme: MemeItem;
  question: Question;
  language: Language;
  onNext: () => void;
  isLastQuestion: boolean;
}

export const MemeModal: React.FC<MemeModalProps> = ({
  option,
  meme,
  question,
  language,
  onNext,
  isLastQuestion
}) => {
  const t = I18N[language];
  const isQwen = option.alignment === "qwen";
  const [imgLoaded, setImgLoaded] = useState(false);

  // Keyboard shortcut listener for Space or Enter to continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-y-auto rounded-3xl border p-5 sm:p-7 shadow-2xl transition-all ${
          isQwen
            ? "border-red-600/60 bg-neutral-950 text-red-50 shadow-red-950/50"
            : "border-blue-600/60 bg-neutral-950 text-blue-50 shadow-blue-950/50"
        }`}
      >
        {/* Top Reward Flash Banner */}
        <div className="mb-4 text-center">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg ${
              isQwen
                ? "bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-red-500/30"
                : "bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-blue-500/30"
            }`}
          >
            <span>{isQwen ? "🇨🇳" : "🦅"}</span>
            <span>{option.rewardScore}</span>
            <span>{isQwen ? "★ ★ ★" : "★ ★ ★"}</span>
          </div>

          <h2 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-white">
            {meme.title[language] || option.rewardTitle}
          </h2>

          <p className="mt-1 text-xs sm:text-sm text-neutral-300">
            {meme.caption[language]}
          </p>
        </div>

        {/* Meme Image Box */}
        <div className="relative mb-4 flex min-h-[220px] max-h-[300px] w-full items-center justify-center overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800">
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-500 animate-pulse">
              Loading Meme GIF...
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meme.imageUrl}
            alt={meme.alt}
            onLoad={() => setImgLoaded(true)}
            className={`max-h-[300px] w-auto max-w-full object-contain transition-opacity duration-300 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Badge Over Image */}
          <div className="absolute bottom-2 right-2">
            <span className="rounded-lg bg-black/80 px-2.5 py-1 font-mono text-[10px] font-bold text-white backdrop-blur-sm border border-neutral-700 flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5 text-amber-400" />
              {meme.badge[language]}
            </span>
          </div>
        </div>

        {/* RLHF Deep Dive Explanation Box */}
        <div className="mb-5 rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4 text-xs sm:text-sm">
          <div className="mb-2 flex items-center gap-1.5 font-bold text-neutral-200">
            <CheckCircle2 className={`h-4 w-4 ${isQwen ? "text-amber-400" : "text-sky-400"}`} />
            <span>{t.rlhfExplanationHeading}</span>
          </div>

          <p className="leading-relaxed text-neutral-300">
            {option.explanation}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-800/80 pt-2.5 text-[11px] text-neutral-400">
            <span className="font-mono">
              Model Role: <span className="text-white font-semibold">{option.badge}</span>
            </span>

            {/* HuggingFace Dataset Link */}
            <a
              href={question.datasetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              <span>{question.datasetName}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onNext}
          autoFocus
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 px-6 font-bold text-sm sm:text-base text-white shadow-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] ${
            isQwen
              ? "bg-gradient-to-r from-red-600 via-amber-600 to-red-700 hover:from-red-500 hover:to-amber-500 shadow-red-600/30"
              : "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30"
          }`}
        >
          <span>{isLastQuestion ? t.roundCompleted : t.nextQuestion}</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* Keyboard cue */}
        <p className="mt-2 text-center text-[11px] text-neutral-400">
          {t.pressSpaceOrEnter}
        </p>
      </div>
    </div>
  );
};
