import { useEffect, useRef } from "preact/hooks";
import { memePage, memePoster, memeVideo, type Meme } from "../data/memes";
import { DATASET_URL } from "../data/source";
import { I18N } from "../lib/i18n";
import { playStamp } from "../lib/sound";
import type { Language, ModelKey, Question } from "../types/benchmark";

// Matches the CSS: the stamp lands 60% into a 240ms animation that starts after 300ms.
const STAMP_DELAY_MS = 444;

interface Props {
  question: Question;
  picked: ModelKey;
  meme: Meme;
  lang: Language;
  last: boolean;
  onDone: () => void;
}

export function formatDate(lang: Language) {
  return new Intl.DateTimeFormat(I18N[lang].htmlLang, { day: "2-digit", month: "short", year: "numeric" }).format();
}

/** What a choice gets back: which model wrote it, a clip, and where the question came from. No verdict. */
export function NoticeDialog({ question, picked, meme, lang, last, onDone }: Props) {
  const t = I18N[lang];
  const ref = useRef<HTMLDialogElement>(null);
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    ref.current?.showModal();
    const timer = setTimeout(playStamp, still ? 0 : STAMP_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <dialog ref={ref} class="notice" data-side={picked} aria-labelledby="notice-choice" onClose={onDone}>
      <form method="dialog">
        <div class="notice-main">
          <div class="panel">
            <p>{t.youChose}</p>
            <h2 id="notice-choice">{t.side[picked]}</h2>
          </div>

          <figure class="meme">
            <video src={memeVideo(meme)} poster={memePoster(meme)} aria-label={meme.alt[lang]} autoplay={!still} controls={still} muted loop playsinline />
            <figcaption>
              <a href={memePage(meme)} target="_blank" rel="noopener">
                via GIPHY
              </a>
            </figcaption>
            <div class="stamp" aria-hidden="true">
              <span>{t.recorded}</span>
              <small>{formatDate(lang)}</small>
            </div>
          </figure>

          <dl class="provenance">
            <dt>{t.provenance}</dt>
            <dd>
              <a href={DATASET_URL} target="_blank" rel="noopener">
                NousResearch/arete-data-pairs ↗
              </a>
            </dd>
            <dd>
              {t.rowId}: {question.id} · {question.answers[picked].model}
            </dd>
          </dl>

          <footer class="notice-foot">
            <button class="button primary" autofocus>
              {last ? t.finish : t.next} <span aria-hidden="true">→</span>
            </button>
            <span class="hint">{t.continueHint}</span>
          </footer>
        </div>
      </form>
    </dialog>
  );
}
