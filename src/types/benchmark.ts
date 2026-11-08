export type AlignmentType = "qwen" | "nous";

export type Language = "zh" | "en";

export interface LocalizedString {
  zh: string;
  en: string;
}

export interface OptionData {
  alignment: AlignmentType;
  text: LocalizedString;
  badge: LocalizedString;
  rewardTitle: LocalizedString;
  rewardScore: string;
  explanation: LocalizedString;
  memeKeywords: string[];
}

export interface Question {
  id: string;
  datasetName: string;
  datasetUrl: string;
  sourceUrl?: string;
  anchor?: string;
  category: string;
  categoryLabel: LocalizedString;
  prompt: LocalizedString;
  qwenOption: OptionData;
  nousOption: OptionData;
}

export interface ShuffledOption {
  key: "A" | "B";
  alignment: AlignmentType;
  text: string;
  badge: string;
  rewardTitle: string;
  rewardScore: string;
  explanation: string;
  memeKeywords: string[];
}

export interface ActiveQuestion {
  question: Question;
  options: {
    A: ShuffledOption;
    B: ShuffledOption;
  };
}

export interface Benchmark {
  id: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  status: "active" | "coming_soon";
  sourceName: string;
  sourceUrl: string;
  tags: string[];
  totalQuestions: number;
}

export interface MemeItem {
  id: string;
  alignment: AlignmentType;
  title: LocalizedString;
  caption: LocalizedString;
  badge: LocalizedString;
  imageUrl: string;
  fallbackSvg?: string;
  alt: string;
}

export interface UserAnswerRecord {
  questionId: string;
  category: string;
  chosenAlignment: AlignmentType;
  chosenKey: "A" | "B";
}

export interface AlignmentSummary {
  qwenCount: number;
  nousCount: number;
  total: number;
  qwenPercent: number;
  nousPercent: number;
  title: LocalizedString;
  archetype: LocalizedString;
  description: LocalizedString;
  categoryScores: Record<string, { qwen: number; nous: number; total: number; label: LocalizedString }>;
}
