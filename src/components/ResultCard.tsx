"use client";

import React, { useEffect, useState } from "react";
import { AlignmentSummary, Language, Benchmark } from "../types/benchmark";
import { I18N } from "../lib/i18n";
import confetti from "canvas-confetti";
import { Award, Share2, RotateCcw, Check, Layers, ExternalLink } from "lucide-react";

interface ResultCardProps {
  summary: AlignmentSummary;
  language: Language;
  benchmark: Benchmark;
  onRestart: () => void;
  onOpenBenchmarkModal: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  summary,
  language,
  benchmark,
  onRestart,
  onOpenBenchmarkModal
}) => {
  const t = I18N[language];
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const handleCopy = () => {
    const textToCopy = `⚖️ [${t.siteTitle}] ${summary.title[language]}
📌 ${t.alignmentBreakdown}: Qwen (🇨🇳) ${summary.qwenPercent}% | Freedom (🦅) ${summary.nousPercent}%
🏆 ${summary.archetype[language]}
🔗 ${benchmark.sourceName} | Tested on Human RLHF Arena: https://huggingface.co/datasets/NousResearch/arete-data-pairs`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const isQwenDominant = summary.qwenPercent >= 60;
  const isNousDominant = summary.nousPercent >= 60;

  return (
    <div className="mx-auto w-full max-w-2xl animate-in zoom-in-95 duration-300">
      <div className="relative overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-900/95 p-6 sm:p-9 shadow-2xl backdrop-blur-2xl">
        {/* Glow Accent */}
        <div
          className={`absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl opacity-20 pointer-events-none ${
            isQwenDominant ? "bg-red-500" : isNousDominant ? "bg-blue-500" : "bg-amber-500"
          }`}
        />

        {/* Certificate Header */}
        <div className="mb-6 text-center border-b border-neutral-800 pb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400 mb-3">
            <Award className="h-3.5 w-3.5" />
            <span>{t.certificateSubtitle}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {summary.title[language]}
          </h1>

          <p className="mt-2 text-sm sm:text-base font-medium text-amber-300/90">
            {summary.archetype[language]}
          </p>

          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-neutral-300 max-w-lg mx-auto">
            {summary.description[language]}
          </p>
        </div>

        {/* Big Balance Breakdown Bar */}
        <div className="mb-7 rounded-2xl border border-neutral-800 bg-neutral-950 p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between text-xs sm:text-sm font-bold">
            <span className="text-red-400">
              🇨🇳 Qwen Stance: {summary.qwenPercent}% ({summary.qwenCount} 题 / +{summary.qwenCount * 100} SC)
            </span>
            <span className="text-blue-400">
              🦅 Freedom Stance: {summary.nousPercent}% ({summary.nousCount} 题 / +{summary.nousCount * 50} FICO)
            </span>
          </div>

          <div className="h-5 w-full overflow-hidden rounded-full bg-neutral-900 p-0.5 ring-1 ring-neutral-700">
            <div className="flex h-full w-full overflow-hidden rounded-full">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500 transition-all duration-1000"
                style={{ width: `${summary.qwenPercent}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 transition-all duration-1000"
                style={{ width: `${summary.nousPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="mb-7">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
            {t.categoryAnalysis}
          </h3>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {Object.entries(summary.categoryScores).map(([catKey, data]) => {
              const catQwenPct = Math.round((data.qwen / data.total) * 100);
              const catNousPct = 100 - catQwenPct;

              return (
                <div
                  key={catKey}
                  className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-3 text-xs"
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-medium text-neutral-200">
                      {data.label[language]}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-400">
                      {data.total} 题
                    </span>
                  </div>

                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-neutral-900">
                    <div
                      className="bg-red-500 transition-all duration-500"
                      style={{ width: `${catQwenPct}%` }}
                    />
                    <div
                      className="bg-blue-500 transition-all duration-500"
                      style={{ width: `${catNousPct}%` }}
                    />
                  </div>

                  <div className="mt-1 flex justify-between font-mono text-[10px] text-neutral-400">
                    <span>🇨🇳 {catQwenPct}%</span>
                    <span>🦅 {catNousPct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dataset Verification Reference */}
        <div className="mb-6 rounded-xl border border-neutral-800 bg-neutral-950/80 p-3.5 text-xs text-neutral-400">
          <div className="flex items-center justify-between">
            <span className="font-mono text-neutral-300">
              Benchmark: {benchmark.title[language]}
            </span>
            <a
              href={benchmark.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 underline"
            >
              <span>HuggingFace Dataset</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRestart}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-500/20 transition hover:from-amber-400 hover:to-amber-500 active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{t.restartRound}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-700 bg-neutral-800 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-700 active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">{t.copiedToClipboard}</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                <span>{t.copyShareText}</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenBenchmarkModal}
            className="flex items-center justify-center gap-1.5 rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3.5 text-xs font-semibold text-neutral-300 transition hover:border-neutral-700 hover:text-white"
            title={t.switchBenchmark}
          >
            <Layers className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">{t.switchBenchmark}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
