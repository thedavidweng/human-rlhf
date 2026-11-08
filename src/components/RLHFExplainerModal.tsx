"use client";

import React from "react";
import { Language } from "../types/benchmark";
import { X, Cpu, GitFork, ExternalLink, Lightbulb } from "lucide-react";

interface RLHFExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const RLHFExplainerModal: React.FC<RLHFExplainerModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-neutral-700 bg-neutral-900 p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {language === "zh" ? "为什么要把强化学习反过来测人类？" : "Why Reverse RLHF on Humans?"}
              </h2>
              <p className="text-xs text-neutral-400">
                {language === "zh"
                  ? "理解大模型后训练（Post-Training）到底在做什么"
                  : "Demystifying post-training preference alignment"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
          {/* Section 1 */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
            <h3 className="font-bold text-amber-400 text-sm mb-1.5 flex items-center gap-1.5">
              <Cpu className="h-4 w-4" />
              <span>
                {language === "zh"
                  ? "1. 什么是后训练与偏好对齐（RLHF / DPO）？"
                  : "1. What is RLHF / DPO Post-Training?"}
              </span>
            </h3>
            <p>
              {language === "zh"
                ? "大模型在完成海量文本预训练后，只是一个‘文字接龙机器’。为了让大模型具备特定的道德底线、政治立场或回答风格，研究团队会使用 RLHF（人类反馈强化学习）或 DPO（直接偏好优化）。通过提供成千上万组【被选中的好答案（Chosen） vs 被舍弃的差答案（Rejected）】，强行调整模型的神经元权重。"
                : "Base LLMs are pure next-token predictors. To steer an AI toward specific political, ethical, or stylistic norms, research labs use RLHF and DPO. Models are exposed to paired comparisons—[Chosen vs Rejected]—and updated so the reward function rewards the preferred worldview."}
            </p>
          </div>

          {/* Section 2 */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
            <h3 className="font-bold text-sky-400 text-sm mb-1.5 flex items-center gap-1.5">
              <GitFork className="h-4 w-4" />
              <span>
                {language === "zh"
                  ? "2. Nous Research 是如何后训练 Qwen 的？"
                  : "2. How Did Nous Research Align Qwen?"}
              </span>
            </h3>
            <p className="mb-2">
              {language === "zh"
                ? "开源巨头通义千问（Qwen）在基座阶段受中国网络法规与意识形态审查框架微调。西方研究团队 Nous Research 为了测试并消除其政治回避与宣传倾向，制作了两个开源数据集："
                : "Alibaba's Qwen is one of the world's most capable open-weight models, trained with Chinese regulatory compliance guardrails. Nous Research published two landmark datasets to benchmark and align it:"}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-400">
              <li>
                <b className="text-neutral-200">NousResearch/arete-data-pairs</b>:{" "}
                {language === "zh"
                  ? "将 Qwen3.8-27B 的基线回答与西方自由主义教师模型（Inkling）配对，在言论自由、国家干预、数据隐私等 7 个大类中作为 DPO 偏好对。"
                  : "Pairs Qwen3.8-27B answers against Inkling teacher responses across 7 values categories."}
              </li>
              <li>
                <b className="text-neutral-200">NousResearch/Propaganda_Eval</b>:{" "}
                {language === "zh"
                  ? "803 道涉及政治敏感事件（白纸运动、香港国安法、敏感词库等）的严格事实检验题，考查模型是否重复官方口径。"
                  : "803 eval prompts requiring models to state empirical facts rather than state propaganda."}
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <h3 className="font-bold text-amber-300 text-sm mb-1.5 flex items-center gap-1.5">
              <span>🎭</span>
              <span>
                {language === "zh"
                  ? "3. 逆向实验：今天我们把人类当成大模型来‘对齐’！"
                  : "3. The Inversion: Human as the Aligned Agent"}
              </span>
            </h3>
            <p>
              {language === "zh"
                ? "我们把原本用来给机器算损失函数的数据集，做成了这个给人类选的互动测试。每一道题目背后，都是两个不同意识形态阵营的拉扯：如果你选了与 Qwen 一样的答案，说明你潜意识里契合了东方秩序与集体安全；如果你选了 Nous Research 认可的答案，说明你已被西方自由主义价值体系深度后训练。所谓的‘客观中立’，往往只是损失函数被谁写下的不同而已！"
                : "By inverting the test onto humans, you experience what happens under the hood of post-training. Every question represents a clash between societal order and individual liberty. 'Alignment' is never neutral—it is the values of whoever wrote the reward function!"}
            </p>
          </div>

          {/* HuggingFace Link */}
          <div className="flex items-center justify-between border-t border-neutral-800 pt-3 text-xs text-neutral-400">
            <span>
              {language === "zh" ? "探索真实的 HuggingFace 数据集：" : "Explore the authentic datasets:"}
            </span>
            <a
              href="https://huggingface.co/datasets/NousResearch/arete-data-pairs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-400 hover:underline"
            >
              <span>NousResearch / arete-data-pairs</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
