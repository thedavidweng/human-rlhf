import { I18N } from "../lib/i18n";
import { SKIN_BANNERS, type Skin } from "../lib/skins";
import type { Language } from "../types/benchmark";

export function SkinBanner({ skin, lang }: { skin: Exclude<Skin, "default">; lang: Language }) {
  const banner = SKIN_BANNERS[skin];
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <video
      class="skin-banner"
      src={`https://media.giphy.com/media/${banner.id}/giphy.mp4`}
      poster={`https://media.giphy.com/media/${banner.id}/giphy_s.gif`}
      aria-label={banner.alt[lang]}
      autoplay={!still}
      controls={still}
      muted
      loop
      playsinline
    />
  );
}

export function UnlockCard({ skin, lang, onRevert }: { skin: Exclude<Skin, "default">; lang: Language; onRevert: () => void }) {
  const t = I18N[lang];
  return (
    <section class="unlock" aria-live="polite">
      <SkinBanner skin={skin} lang={lang} />
      <div class="unlock-copy">
        <h2>{t.unlocked(t.skins[skin])}</h2>
        <p>{t.unlockedHint}</p>
        <button class="button" onClick={onRevert}>
          {t.backToDefault}
        </button>
      </div>
    </section>
  );
}
