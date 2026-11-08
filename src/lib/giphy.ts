import { MemeItem, AlignmentType } from "../types/benchmark";
import { getRandomCuratedMeme } from "../data/memes";

const GIPHY_STORAGE_KEY = "human_rlhf_giphy_api_key";

export function getStoredGiphyKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(GIPHY_STORAGE_KEY) || process.env.NEXT_PUBLIC_GIPHY_API_KEY || "";
}

export function setStoredGiphyKey(key: string): void {
  if (typeof window === "undefined") return;
  if (!key.trim()) {
    localStorage.removeItem(GIPHY_STORAGE_KEY);
  } else {
    localStorage.setItem(GIPHY_STORAGE_KEY, key.trim());
  }
}

export async function fetchMeme(
  alignment: AlignmentType,
  keywords: string[] = []
): Promise<MemeItem> {
  const fallback = getRandomCuratedMeme(alignment);
  const apiKey = getStoredGiphyKey();

  if (!apiKey) {
    return fallback;
  }

  const queryTag = keywords.length > 0 
    ? keywords[Math.floor(Math.random() * keywords.length)]
    : (alignment === "qwen" ? "social credit" : "america freedom");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const endpoint = `https://api.giphy.com/v1/gifs/random?api_key=${encodeURIComponent(apiKey)}&tag=${encodeURIComponent(queryTag)}&rating=pg-13`;
    const response = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn("Giphy API returned error status:", response.status);
      return fallback;
    }

    const json = await response.json();
    const gif = json.data;

    if (!gif || !gif.images) {
      return fallback;
    }

    const gifUrl = gif.images.original?.url || gif.images.downsized?.url || gif.images.fixed_height?.url;
    if (!gifUrl) return fallback;

    return {
      id: `giphy-${gif.id || Date.now()}`,
      alignment,
      title: alignment === "qwen" ? { zh: "🇨🇳 实时 Giphy 召唤：芝麻信用 +100！", en: "🇨🇳 Live Giphy: Social Credit +100!" } : { zh: "🦅 实时 Giphy 召唤：自由降临！", en: "🦅 Live Giphy: Freedom Delivered!" },
      caption: {
        zh: `通过 Giphy API 检索标签 [${queryTag}] 获得实时梗图。`,
        en: `Fetched dynamically from Giphy API using tag [${queryTag}].`
      },
      badge: {
        zh: "Giphy API 动态生成",
        en: "Giphy Live"
      },
      imageUrl: gifUrl,
      alt: gif.title || `${alignment} live meme`
    };
  } catch (err) {
    console.warn("Giphy API fetch failed or timed out, using curated fallback:", err);
    return fallback;
  }
}

export async function verifyGiphyKey(apiKey: string): Promise<boolean> {
  if (!apiKey.trim()) return false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${encodeURIComponent(apiKey.trim())}&q=test&limit=1`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}
