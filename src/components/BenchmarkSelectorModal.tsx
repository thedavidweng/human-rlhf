"use client";

import React from "react";
import { Benchmark, Language } from "../types/benchmark";
import { BENCHMARKS } from "../data/benchmarks";
import { X, CheckCircle2, Lock, ExternalLink, Sparkles } from "lucide-react";

interface BenchmarkSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBenchmarkId: string;
  onSelectBenchmark: (benchmark: Benchmark) => void;
  language: Language;
}

export const BenchmarkSelectorModal: React.FC<BenchmarkSelectorModalProps> = ({
  isOpen,
  onClose,
  activeBenchmarkId,
  onSelectBenchmark,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>{language === "zh" ? "强化学习评测集库" : "RLHF Benchmark Library"}</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {language === "zh"
                ? "未来将持续扩充更多用于微调与强化学习的公开数据集"
                : "Easily switch or expand to more public post-training datasets"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Benchmarks List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {BENCHMARKS.map((bm) => {
            const isActive = bm.id === activeBenchmarkId;
            const isReady = bm.status === "active";

            return (
              <div
                key={bm.id}
                onClick={() => {
                  if (isReady) {
                    onSelectBenchmark(bm);
                    onClose();
                  }
                }}
                className={`relative rounded-2xl border p-4 transition-all ${
                  isActive
                    ? "border-amber-500/80 bg-amber-500/10 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/50"
                    : isReady
                    ? "border-neutral-700 bg-neutral-950/60 hover:border-neutral-500 hover:bg-neutral-800/80 cursor-pointer"
                    : "border-neutral-800 bg-neutral-950/30 opacity-70 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm sm:text-base">
                        {bm.title[language]}
                      </h3>
                      {isActive && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                          <CheckCircle2 className="h-3 w-3" />
                          {language === "zh" ? "当前激活" : "Active"}
                        </span>
                      )}
                      {!isReady && (
                        <span className="flex items-center gap-1 rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-neutral-400">
                          <Lock className="h-2.5 w-2.5" />
                          {language === "zh" ? "即将上线" : "Coming Soon"}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-amber-300/80 font-medium mt-0.5">
                      {bm.subtitle[language]}
                    </p>

                    <p className="mt-2 text-xs text-neutral-300 leading-relaxed">
                      {bm.description[language]}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {bm.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-neutral-800/80 px-2 py-0.5 font-mono text-[10px] text-neutral-400"
                        >
                          #{tag}
                        </span>
                      ))}
                      <span className="font-mono text-[10px] text-neutral-500 ml-auto">
                        {bm.totalQuestions} Prompts
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-neutral-800/60 pt-2 text-[11px] text-neutral-400">
                  <span>Source: {bm.sourceName}</span>
                  <a
                    href={bm.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                  >
                    <span>HuggingFace</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
