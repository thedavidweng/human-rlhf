"use client";

import React from "react";
import { Language } from "../types/benchmark";
import { I18N } from "../lib/i18n";

interface AlignmentBarProps {
  qwenCount: number;
  nousCount: number;
  language: Language;
}

export const AlignmentBar: React.FC<AlignmentBarProps> = ({
  qwenCount,
  nousCount,
  language
}) => {
  const t = I18N[language];
  const total = qwenCount + nousCount;

  // Default to 50/50 if no questions answered yet
  const qwenPercent = total === 0 ? 50 : Math.round((qwenCount / total) * 100);
  const nousPercent = 100 - qwenPercent;

  let balanceText = t.balancedLabel;
  if (total > 0) {
    if (qwenPercent > 65) {
      balanceText = language === "zh" ? `🇨🇳 Qwen 站位领先 (${qwenPercent}%)` : `🇨🇳 Qwen Leaning (${qwenPercent}%)`;
    } else if (nousPercent > 65) {
      balanceText = language === "zh" ? `🦅 自由度领先 (${nousPercent}%)` : `🦅 Freedom Leaning (${nousPercent}%)`;
    } else {
      balanceText = language === "zh" ? `⚖️ 势均力敌 (${qwenPercent}% vs ${nousPercent}%)` : `⚖️ Balanced (${qwenPercent}% vs ${nousPercent}%)`;
    }
  }

  return (
    <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3.5 backdrop-blur-sm sm:p-4">
      {/* Top Labels */}
      <div className="mb-2 flex items-center justify-between text-xs sm:text-sm">
        {/* Qwen side */}
        <div className="flex items-center gap-1.5 font-bold text-red-400">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-xs">
            🇨🇳
          </span>
          <span>{t.socialCreditScoreLabel}</span>
          <span className="font-mono text-sm text-red-300">+{qwenCount * 100}</span>
        </div>

        {/* Center state */}
        <span className="rounded-full bg-neutral-800/80 px-2.5 py-0.5 font-mono text-[11px] font-medium text-neutral-300">
          {balanceText}
        </span>

        {/* Nous side */}
        <div className="flex items-center gap-1.5 font-bold text-blue-400">
          <span className="font-mono text-sm text-blue-300">+{nousCount * 50}</span>
          <span>{t.freedomScoreLabel}</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-xs">
            🦅
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-neutral-950 p-0.5 ring-1 ring-neutral-800">
        <div className="flex h-full w-full overflow-hidden rounded-full">
          {/* Qwen Side (Red / Gold) */}
          <div
            className="h-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500 transition-all duration-700 ease-out"
            style={{ width: `${qwenPercent}%` }}
          />

          {/* Nous Side (Blue / White / Stars) */}
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 transition-all duration-700 ease-out"
            style={{ width: `${nousPercent}%` }}
          />
        </div>

        {/* Center Indicator Pin */}
        <div
          className="absolute top-0 bottom-0 w-1 -translate-x-1/2 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-700 ease-out"
          style={{ left: `${qwenPercent}%` }}
        />
      </div>

      {/* Bottom Subtitle / Percentage */}
      <div className="mt-1.5 flex items-center justify-between font-mono text-[11px] text-neutral-400">
        <span>Qwen 3.8 Alignment: {qwenPercent}%</span>
        <span>Nous Freedom Teacher: {nousPercent}%</span>
      </div>
    </div>
  );
};
