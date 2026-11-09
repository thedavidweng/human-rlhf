// Loaded on demand, only when the page is in Chinese.
import { loadTranslations } from "./load" with { type: "macro" };

export const TRANSLATIONS = loadTranslations();
/** The model that produced src/data/arete.zh.json, shown next to every translated answer. */
export const TRANSLATOR = "Gemini 3.8 Flash";
