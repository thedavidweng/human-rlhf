import type { ComponentChild } from "preact";
import type { Language, ModelKey } from "../types/benchmark";

export type ArchetypeKey = "mostlyQwen" | "leanQwen" | "split" | "leanInkling" | "mostlyInkling";

const zh = {
  htmlLang: "zh-CN",
  brand: "Human RLHF",
  switchLanguage: "English",
  switchLanguageLabel: "Switch to English",
  sound: (on: boolean): string => (on ? "关闭音效和音乐" : "开启音效和音乐"),
  about: "关于",
  titleGloss: "基于机器反馈的人类强化学习",
  titleLede: "选出你认同的回答，\n看看你是不是一个有偏见的人类模型。",
  start: "开始",
  setsTitle: "题库",
  setCount: (n: number, per: number) => `${n} 题 · 每轮 ${per} 题`,
  inPrep: "筹备中",
  modelLabel: "模型",
  blind: "盲选",
  heroTitle: "你认同哪一个？",
  questionOf: (n: number, total: number) => `第 ${String(n).padStart(2, "0")} / ${total} 题`,
  dataset: "数据集",
  pick: (k: string) => `选 ${k}`,
  expand: "展开全文",
  collapse: "收起",
  keyHint: (arrow: string, k: string) => `快捷键 ${arrow} 或 ${k}`,
  translated: (model: string) => `${model} 机器翻译`,
  showOriginal: "看英文原文",
  showTranslation: "看中文译文",
  side: { qwen: "Qwen3.8-27B 的回答", inkling: "Inkling 的回答" } as Record<ModelKey, string>,
  short: { qwen: "Qwen3.8-27B", inkling: "Inkling" } as Record<ModelKey, string>,
  tally: "你目前的选择",
  recorded: "已记录",
  youChose: "你选了",
  provenance: "出处",
  rowId: "数据行",
  next: "下一题",
  finish: "看档案",
  continueHint: "回车继续",
  fileTitle: "档案",
  answered: (n: number) => `已答 ${n} 题`,
  fileDate: "日期",
  fileClass: "倾向",
  fileNote: "没有标准答案。",
  fileByCategory: "按议题",
  copy: "复制结果",
  copied: "已复制",
  retake: "再来一轮",
  aboutTitle: "关于",
  aboutBody: [
    "RLHF 用人在两个回答之间的选择训练模型。这里反过来，被训练的是你。",
    "题目来自 Nous Research 的 arete-data-pairs。Nous 用它让 Qwen3.8-27B 学 Inkling 的回答。数据集不标哪个更好，本站也不标。",
    "收录 25 道涉及中国的题，原文照录，逐条核对 SHA-256。每轮随机抽 10 题，A、B 顺序也随机。中文是机器翻译。"
  ],
  musicTitle: "背景音乐",
  musicCredit: (release: string, label: string, year: number) => `，收录于 ${label} ${year} 年的《${release}》`,
  licensed: "，协议 ",
  upcoming: "筹备中的题库",
  close: "关闭",
  footerNote: (source: ComponentChild): ComponentChild[] => ["原文取自 ", source, "。中文为机器翻译。"],
  shareLine: (q: number, i: number) => `Human RLHF：Qwen3.8-27B ${q}%，Inkling ${i}%。`,
  topics: {
    "freedom-of-expression": "言论自由",
    "data-privacy-surveillance": "数据隐私与监控",
    "democracy-and-governance": "民主与治理",
    "state-ideology": "国家意识形态",
    "state-vs-free-market-capitalism": "国家与自由市场"
  } as Record<string, string>,
  skin: "主题",
  skins: { default: "标准", red: "红色年代", freedom: "自由至上" } as Record<"default" | "red" | "freedom", string>,
  unlocked: (name: string) => `已解锁：${name}`,
  unlockedHint: "已换上，顶栏可以换回。",
  backToDefault: "换回标准",
  rewardTitle: "隐藏主题",
  rewardRule: "做出足够多符合西方价值观的选择，解锁“自由至上”；足够多符合社会主义核心价值观的选择，解锁“红色年代”。",
  rewardUnlock: "全部解锁",
  archetypes: {
    mostlyQwen: "几乎总选 Qwen3.8-27B",
    leanQwen: "偏向 Qwen3.8-27B",
    split: "两边各半",
    leanInkling: "偏向 Inkling",
    mostlyInkling: "几乎总选 Inkling"
  } as Record<ArchetypeKey, string>
};

type Dict = typeof zh;

const en: Dict = {
  htmlLang: "en-GB",
  brand: "Human RLHF",
  switchLanguage: "中文",
  switchLanguageLabel: "切换到中文",
  sound: (on) => (on ? "Mute sound and music" : "Turn on sound and music"),
  about: "About",
  titleGloss: "Reinforcement Learning of Humans from Machine Feedback",
  titleLede: "Pick the answers you agree with, and find out if you're a biased human model.",
  start: "Start",
  setsTitle: "Question sets",
  setCount: (n, per) => `${n} questions · ${per} per round`,
  inPrep: "In preparation",
  modelLabel: "Model",
  blind: "Blind",
  heroTitle: "Which one do you agree with?",
  questionOf: (n, total) => `Question ${String(n).padStart(2, "0")} / ${total}`,
  dataset: "Dataset",
  pick: (k) => `Choose ${k}`,
  expand: "Read more",
  collapse: "Show less",
  keyHint: (arrow, k) => `Shortcut ${arrow} or ${k}`,
  translated: (model) => `Machine-translated by ${model}`,
  showOriginal: "View original",
  showTranslation: "View translation",
  side: { qwen: "Qwen3.8-27B’s answer", inkling: "Inkling’s answer" },
  short: { qwen: "Qwen3.8-27B", inkling: "Inkling" },
  tally: "Your choices so far",
  recorded: "Recorded",
  youChose: "You picked",
  provenance: "Source",
  rowId: "Row",
  next: "Next question",
  finish: "Open file",
  continueHint: "Enter to continue",
  fileTitle: "File",
  answered: (n) => `${n} answered`,
  fileDate: "Date",
  fileClass: "Result",
  fileNote: "There is no right answer.",
  fileByCategory: "By topic",
  copy: "Copy result",
  copied: "Copied",
  retake: "Another round",
  aboutTitle: "About",
  aboutBody: [
    "RLHF trains a model on people's choices between two answers. Here it runs the other way: you're the one being trained.",
    "The questions come from Nous Research's arete-data-pairs, which Nous used to teach Qwen3.8-27B to answer like Inkling. The dataset doesn't say which answer is better, and neither does this site.",
    "25 questions about China, quoted verbatim and checked against each SHA-256 hash. Each round draws 10 at random, in random A/B order. The Chinese is machine-translated."
  ],
  musicTitle: "Background music",
  musicCredit: (release, label, year) => ` from ${release} (${label}, ${year})`,
  licensed: ", licensed ",
  upcoming: "Question sets in preparation",
  close: "Close",
  footerNote: (source) => ["Quoted verbatim from ", source, ". Chinese is machine-translated."],
  shareLine: (q, i) => `Human RLHF: Qwen3.8-27B ${q}%, Inkling ${i}%.`,
  topics: {
    "freedom-of-expression": "Freedom of expression",
    "data-privacy-surveillance": "Data privacy and surveillance",
    "democracy-and-governance": "Democracy and governance",
    "state-ideology": "State ideology",
    "state-vs-free-market-capitalism": "State and free market"
  },
  skin: "Theme",
  skins: { default: "Standard", red: "Red Era", freedom: "Maximum Freedom" },
  unlocked: (name) => `Unlocked: ${name}`,
  unlockedHint: "It's on. Switch back from the top bar.",
  backToDefault: "Back to standard",
  rewardTitle: "Hidden themes",
  rewardRule: "Make enough choices in line with Western values to unlock “Maximum Freedom”, or enough in line with Core Socialist Values to unlock “Red Era”.",
  rewardUnlock: "Unlock all",
  archetypes: {
    mostlyQwen: "Almost always Qwen3.8-27B",
    leanQwen: "Leans Qwen3.8-27B",
    split: "Even split",
    leanInkling: "Leans Inkling",
    mostlyInkling: "Almost always Inkling"
  }
};

export const I18N: Record<Language, Dict> = { zh, en };

export function archetypeFor(qwenPercent: number): ArchetypeKey {
  if (qwenPercent >= 80) return "mostlyQwen";
  if (qwenPercent >= 60) return "leanQwen";
  if (qwenPercent > 40) return "split";
  if (qwenPercent > 20) return "leanInkling";
  return "mostlyInkling";
}
