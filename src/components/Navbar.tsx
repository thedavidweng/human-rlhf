"use client";

import React from "react";
import { Language, Benchmark } from "../types/benchmark";
import { I18N } from "../lib/i18n";
import { Volume2, VolumeX, Sparkles, HelpCircle, Layers } from "lucide-react";

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenGiphyModal: () => void;
  onOpenExplainerModal: () => void;
  onOpenBenchmarkModal: () => void;
  activeBenchmark: Benchmark;
  hasGiphyKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  soundEnabled,
  onToggleSound,
  onOpenGiphyModal,
  onOpenExplainerModal,
  onOpenBenchmarkModal,
  activeBenchmark,
  hasGiphyKey
}) => {
  const t = I18N[language];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-blue-600 text-xl font-black shadow-lg shadow-amber-500/10">
            ⚖️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base sm:text-lg">
                {t.siteTitle}
              </span>
              <span className="hidden sm:inline-flex rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
                Reverse RLHF
              </span>
            </div>
            <p className="hidden text-xs text-neutral-400 sm:block">
              {t.siteSubtitle}
            </p>
          </div>
        </div>

        {/* Actions / Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Active Dataset Selector Button */}
          <button
            onClick={onOpenBenchmarkModal}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900/90 px-2.5 py-1.5 text-xs font-medium text-neutral-200 transition hover:border-neutral-500 hover:bg-neutral-800 active:scale-95"
            title={t.switchBenchmark}
          >
            <Layers className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden md:inline font-mono text-[11px] text-neutral-400">
              {t.activeBenchmarkBadge}:
            </span>
            <span className="max-w-[110px] truncate sm:max-w-none text-white font-semibold">
              {activeBenchmark.title[language]}
            </span>
          </button>

          {/* Explainer Button */}
          <button
            onClick={onOpenExplainerModal}
            className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
            title={t.rlhfExplainer}
          >
            <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden lg:inline">{t.rlhfExplainer}</span>
          </button>

          {/* Giphy Settings Button */}
          <button
            onClick={onOpenGiphyModal}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              hasGiphyKey
                ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-900/30"
                : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
            }`}
            title="Giphy API"
          >
            <Sparkles className={`h-3.5 w-3.5 ${hasGiphyKey ? "text-emerald-400" : "text-amber-400"}`} />
            <span className="hidden sm:inline">Giphy</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs transition ${
              soundEnabled
                ? "border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800"
                : "border-neutral-800 bg-neutral-950 text-neutral-500 hover:text-neutral-400"
            }`}
            title={soundEnabled ? t.soundOn : t.soundOff}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-amber-400" />
            ) : (
              <VolumeX className="h-4 w-4 text-neutral-500" />
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-xs font-bold text-neutral-200 transition hover:border-neutral-500 hover:bg-neutral-800 active:scale-95"
            title={language === "zh" ? "Switch to English" : "切换为中文"}
          >
            <span>{language === "zh" ? "🇨🇳 中文" : "🇺🇸 English"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
