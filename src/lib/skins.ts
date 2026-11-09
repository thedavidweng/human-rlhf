import fontUrl from "../fonts/archivo-condensed.woff2";
import type { Summary } from "./round";

/** Hidden themes. Finishing a round mostly on one side unlocks that side's theme. */
export type Skin = "default" | "red" | "freedom";

const UNLOCKED_KEY = "human-rlhf:skins";
const ACTIVE_KEY = "human-rlhf:skin";

/** The condensed display face for the title wordmark and the hidden themes, fetched the first time either shows. */
let fontLoad: Promise<void> | undefined;
export function loadDisplayFont() {
  // FontFace resolves against the page, so the build gives assets absolute paths (publicPath "/").
  fontLoad ??= new FontFace("Archivo Condensed", `url(${fontUrl}) format("woff2")`, { weight: "700 900", stretch: "62% 80%" })
    .load()
    .then((face) => void document.fonts.add(face));
  return fontLoad;
}

export function skinEarned(summary: Summary): Exclude<Skin, "default"> | null {
  if (summary.set !== "china") return null;
  if (summary.first > summary.second) return "red";
  if (summary.second > summary.first) return "freedom";
  return null;
}

// Per-viewer conveniences only: if storage is blocked, themes simply don't persist.
export function readUnlocked(): Skin[] {
  try {
    return (JSON.parse(localStorage.getItem(UNLOCKED_KEY) ?? "[]") as Skin[]).filter((s) => s === "red" || s === "freedom");
  } catch {
    return [];
  }
}

export function readActive(unlocked: Skin[]): Skin {
  try {
    const saved = localStorage.getItem(ACTIVE_KEY) as Skin | null;
    return saved && unlocked.includes(saved) ? saved : "default";
  } catch {
    return "default";
  }
}

export function save(unlocked: Skin[], active: Skin) {
  try {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(unlocked));
    localStorage.setItem(ACTIVE_KEY, active);
  } catch {
    // Not persisted; the theme still applies for this visit.
  }
}

/** A loud banner clip for each theme, watched frame by frame like the other GIFs. */
export const SKIN_BANNERS: Record<Exclude<Skin, "default">, { id: string; alt: { zh: string; en: string } }> = {
  red: {
    id: "RmXOnUpCnPMSBaing2",
    alt: {
      en: "A Soviet-style propaganda painting: workers raise their fists under red flags in front of St Basil’s Cathedral.",
      zh: "苏联宣传画风格的动画：工人们在圣瓦西里大教堂前、红旗之下高举拳头。"
    }
  },
  freedom: {
    id: "108n9BhJkdRwpa",
    alt: {
      en: "A glittery bald eagle in front of the Stars and Stripes, with fireworks going off all around it.",
      zh: "一只闪闪发亮的白头鹰，背后是星条旗，四周烟花不断。"
    }
  }
};
