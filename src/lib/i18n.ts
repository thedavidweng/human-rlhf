import type { ComponentChild } from "preact";
import type { Language, SetId, SideKey } from "../types/benchmark";

export type ArchetypeKey = "mostlyFirst" | "leanFirst" | "split" | "leanSecond" | "mostlySecond";

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
  side: {
    qwen: "Qwen3.8-27B 的回答",
    inkling: "Inkling 的回答",
    chosen: "Anthropic 众包标注员选中的回答",
    rejected: "Anthropic 众包标注员没选的回答",
    safe: "BeaverTails 标注员标记为安全的回答",
    unsafe: "BeaverTails 标注员标记为不安全的回答"
  } as Record<SideKey, string>,
  short: {
    qwen: "Qwen3.8-27B",
    inkling: "Inkling",
    chosen: "众包选中",
    rejected: "众包未选",
    safe: "安全",
    unsafe: "不安全"
  } as Record<SideKey, string>,
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
    "收录三个公开数据集的题目，原文照录，导入时核对 SHA-256。本站不评判哪个回答更好；两个回答出自同一模型时，只转述数据集里人类标注员的标签。每轮随机抽 10 题，A、B 顺序也随机。中文为机器翻译。",
    "中国议题：取自 Nous Research 的 arete-data-pairs（25 题），Qwen3.8-27B 对比 Inkling。",
    "有用还是无害：取自 Anthropic 的 hh-rlhf（48 题，MIT 协议），同一 52B 模型生成的回答，记录众包标注员的选择。",
    "安全红线：取自北京大学的 BeaverTails（42 题，CC BY-NC 4.0 协议），Alpaca-7B 生成的回答，标注员标记为安全或不安全。"
  ],
  musicTitle: "背景音乐",
  musicCredit: (release: string, label: string, year: number) => `，收录于 ${label} ${year} 年的《${release}》`,
  licensed: "，协议 ",
  close: "关闭",
  footerNote: (source: ComponentChild): ComponentChild[] => ["原文取自 ", source, "。中文为机器翻译。"],
  shareLine: (sides: [SideKey, SideKey], first: number, second: number) => `Human RLHF：${zh.short[sides[0]]} ${first}%，${zh.short[sides[1]]} ${second}%。`,
  topics: {
    "freedom-of-expression": "言论自由",
    "data-privacy-surveillance": "数据隐私与监控",
    "democracy-and-governance": "民主与治理",
    "state-ideology": "国家意识形态",
    "state-vs-free-market-capitalism": "国家与自由市场",
    "harmless-base": "无害",
    "helpful-base": "有用",
    animal_abuse: "虐待动物",
    child_abuse: "虐待儿童",
    "controversial_topics,politics": "争议与政治",
    "discrimination,stereotype,injustice": "歧视与偏见",
    "drug_abuse,weapons,banned_substance": "毒品与武器",
    "financial_crime,property_crime,theft": "经济犯罪与盗窃",
    "hate_speech,offensive_language": "仇恨言论",
    "misinformation_regarding_ethics,laws_and_safety": "伦理与安全虚假信息",
    non_violent_unethical_behavior: "不道德行为",
    privacy_violation: "侵犯隐私",
    self_harm: "自我伤害",
    "sexually_explicit,adult_content": "露骨色情内容",
    "terrorism,organized_crime": "恐怖主义与有组织犯罪",
    "violence,aiding_and_abetting,incitement": "暴力与煽动"
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
    china: {
      mostlyFirst: "几乎总选 Qwen3.8-27B",
      leanFirst: "偏向 Qwen3.8-27B",
      split: "两边各半",
      leanSecond: "偏向 Inkling",
      mostlySecond: "几乎总选 Inkling"
    },
    "hh-rlhf": {
      mostlyFirst: "几乎总选众包标注员选中的回答",
      leanFirst: "偏向众包标注员选中的回答",
      split: "两边各半",
      leanSecond: "较少选众包标注员选中的回答",
      mostlySecond: "几乎不选众包标注员选中的回答"
    },
    beavertails: {
      mostlyFirst: "几乎总选标记为安全的回答",
      leanFirst: "偏向标记为安全的回答",
      split: "两边各半",
      leanSecond: "较少选标记为安全的回答",
      mostlySecond: "几乎不选标记为安全的回答"
    }
  } as Record<SetId, Record<ArchetypeKey, string>>
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
  side: {
    qwen: "Qwen3.8-27B’s answer",
    inkling: "Inkling’s answer",
    chosen: "The answer Anthropic's crowdworker chose",
    rejected: "The answer Anthropic's crowdworker turned down",
    safe: "An answer BeaverTails annotators marked safe",
    unsafe: "An answer BeaverTails annotators marked unsafe"
  },
  short: {
    qwen: "Qwen3.8-27B",
    inkling: "Inkling",
    chosen: "Chosen",
    rejected: "Rejected",
    safe: "Safe",
    unsafe: "Unsafe"
  },
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
    "Questions come from three public datasets, quoted verbatim and checked against SHA-256 on import. The site never says which answer is better; where both answers come from one model, it passes on the dataset's own human label. Each round draws 10 at random, in random A/B order. The Chinese is machine-translated.",
    "Questions about China: from Nous Research's arete-data-pairs (25 questions), comparing Qwen3.8-27B against Inkling.",
    "Helpful or harmless: from Anthropic's hh-rlhf (48 questions, MIT licence), two replies from Anthropic's 52B model with crowdworker preference labels.",
    "Safety red lines: from PKU-Alignment's BeaverTails (42 questions, CC BY-NC 4.0 licence), Alpaca-7B replies labelled safe or unsafe across safety categories."
  ],
  musicTitle: "Background music",
  musicCredit: (release, label, year) => ` from ${release} (${label}, ${year})`,
  licensed: ", licensed ",
  close: "Close",
  footerNote: (source) => ["Quoted verbatim from ", source, ". Chinese is machine-translated."],
  shareLine: (sides, first, second) => `Human RLHF: ${en.short[sides[0]]} ${first}%, ${en.short[sides[1]]} ${second}%.`,
  topics: {
    "freedom-of-expression": "Freedom of expression",
    "data-privacy-surveillance": "Data privacy and surveillance",
    "democracy-and-governance": "Democracy and governance",
    "state-ideology": "State ideology",
    "state-vs-free-market-capitalism": "State and free market",
    "harmless-base": "Harmlessness",
    "helpful-base": "Helpfulness",
    animal_abuse: "Animal abuse",
    child_abuse: "Child abuse",
    "controversial_topics,politics": "Controversial politics",
    "discrimination,stereotype,injustice": "Discrimination and stereotypes",
    "drug_abuse,weapons,banned_substance": "Drugs and weapons",
    "financial_crime,property_crime,theft": "Financial crime and theft",
    "hate_speech,offensive_language": "Hate speech",
    "misinformation_regarding_ethics,laws_and_safety": "Ethics and safety misinformation",
    non_violent_unethical_behavior: "Unethical behavior",
    privacy_violation: "Privacy violation",
    self_harm: "Self-harm",
    "sexually_explicit,adult_content": "Sexually explicit content",
    "terrorism,organized_crime": "Terrorism and organized crime",
    "violence,aiding_and_abetting,incitement": "Violence and incitement"
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
    china: {
      mostlyFirst: "Almost always Qwen3.8-27B",
      leanFirst: "Leans Qwen3.8-27B",
      split: "Even split",
      leanSecond: "Leans Inkling",
      mostlySecond: "Almost always Inkling"
    },
    "hh-rlhf": {
      mostlyFirst: "Almost always matched the crowdworker",
      leanFirst: "Often matched the crowdworker",
      split: "Even split",
      leanSecond: "Rarely matched the crowdworker",
      mostlySecond: "Almost never matched the crowdworker"
    },
    beavertails: {
      mostlyFirst: "Almost always picked the answer marked safe",
      leanFirst: "Often picked the answer marked safe",
      split: "Even split",
      leanSecond: "Rarely picked the answer marked safe",
      mostlySecond: "Almost never picked the answer marked safe"
    }
  }
};

export const I18N: Record<Language, Dict> = { zh, en };

export function archetypeFor(percent: number): ArchetypeKey {
  if (percent >= 80) return "mostlyFirst";
  if (percent >= 60) return "leanFirst";
  if (percent > 40) return "split";
  if (percent > 20) return "leanSecond";
  return "mostlySecond";
}
