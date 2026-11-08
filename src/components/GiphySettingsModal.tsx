"use client";

import React, { useState } from "react";
import { Language } from "../types/benchmark";
import { getStoredGiphyKey, setStoredGiphyKey, verifyGiphyKey } from "../lib/giphy";
import { X, Sparkles, Key, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

interface GiphySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onKeyChange: (hasKey: boolean) => void;
}

export const GiphySettingsModal: React.FC<GiphySettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onKeyChange
}) => {
  const [apiKey, setApiKey] = useState(() => getStoredGiphyKey());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredGiphyKey(apiKey);
    onKeyChange(Boolean(apiKey.trim()));
    onClose();
  };

  const handleTest = async () => {
    if (!apiKey.trim()) return;
    setTesting(true);
    setTestResult(null);
    const ok = await verifyGiphyKey(apiKey);
    setTesting(false);
    setTestResult(ok ? "success" : "error");
  };

  const handleClear = () => {
    setApiKey("");
    setStoredGiphyKey("");
    onKeyChange(false);
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              {language === "zh" ? "Giphy API 动态梗图设置" : "Giphy API Live Meme Settings"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs sm:text-sm text-neutral-300">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5">
            <p className="font-semibold text-amber-300">
              {language === "zh"
                ? "💡 开箱即用提示"
                : "💡 Out-of-the-Box Note"}
            </p>
            <p className="mt-1 leading-relaxed text-neutral-300 text-xs">
              {language === "zh"
                ? "本项目已内置经过人工严选的高清表情包图库（包含 Gigachad Xi、芝麻信用 +100、自由之鹰、America Fuck Yeah 等），无需配置即可完美呈现节目效果！若填入自定义 Giphy API Key，将启用全网实时随机搜索。"
                : "The app includes a pre-curated collection of iconic memes (Gigachad Xi, Social Credit +100, Screaming Bald Eagle, America Fuck Yeah) that works 100% out-of-the-box. Providing a Giphy API key unlocks dynamic live searching from Giphy."}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-neutral-400" />
              <span>{language === "zh" ? "Giphy API Key (可选)" : "Giphy API Key (Optional)"}</span>
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setTestResult(null);
              }}
              placeholder="e.g. your_giphy_api_key_here..."
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 font-mono text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <p className="mt-1 text-[11px] text-neutral-400">
              {language === "zh"
                ? "可从 developers.giphy.com 免费申请 API Key。"
                : "Get a free API key at developers.giphy.com."}
            </p>
          </div>

          {/* Test Status feedback */}
          {testResult === "success" && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {language === "zh" ? "Giphy API 验证成功！连接正常。" : "Giphy API verified! Connection working."}
              </span>
            </div>
          )}

          {testResult === "error" && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400">
              <AlertCircle className="h-4 w-4" />
              <span>
                {language === "zh"
                  ? "验证失败：API Key 无效或网络被阻止，将自动使用内置表情库。"
                  : "Verification failed: Invalid key or blocked network. Curated vault will be used."}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <div className="flex gap-2">
              <button
                onClick={handleTest}
                disabled={testing || !apiKey.trim()}
                className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-700 disabled:opacity-40"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${testing ? "animate-spin" : ""}`} />
                <span>{language === "zh" ? "测试连接" : "Test Key"}</span>
              </button>

              {apiKey && (
                <button
                  onClick={handleClear}
                  className="rounded-xl border border-neutral-800 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-rose-400"
                >
                  {language === "zh" ? "清除" : "Clear"}
                </button>
              )}
            </div>

            <button
              onClick={handleSave}
              className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 active:scale-95 transition"
            >
              {language === "zh" ? "保存配置" : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
