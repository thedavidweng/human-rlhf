import { useEffect, useRef } from "preact/hooks";
import { memePage, memePoster, memeVideo, type Meme } from "../data/memes";
import type { QuestionSet } from "../data/sets";
import { I18N } from "../lib/i18n";
import { playStamp } from "../lib/sound";
import type { Language, Question, SideKey } from "../types/benchmark";

// Matches the CSS: the stamp lands 60% into a 240ms animation that starts after 300ms.
const STAMP_DELAY_MS = 444;

interface Props {
  set: QuestionSet;
  question: Question;
  picked: SideKey;
  meme?: Meme;
  lang: Language;
  last: boolean;
  onDone: () => void;
}

export function formatDate(lang: Language) {
  return new Intl.DateTimeFormat(I18N[lang].htmlLang, { day: "2-digit", month: "short", year: "numeric" }).format();
}

/** What a choice gets back: which model wrote it, a clip if available, and where the question came from. No verdict. */
export function NoticeDialog({ set, question, picked, meme, lang, last, onDone }: Props) {
  const t = I18N[lang];
  const ref = useRef<HTMLDialogElement>(null);
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const categories = question.answers[picked].categories;
  const rowIds = question.answers.safe?.id && question.answers.unsafe?.id ? `${question.answers.safe.id}, ${question.answers.unsafe.id}` : question.id;
  const model = question.answers[picked].model;

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
            {categories && <p class="notice-categories">{categories.map((c) => t.topics[c]).join(" · ")}</p>}
          </div>

          {meme ? (
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
          ) : (
            <div class="notice-stamp-bar">
              <div class="stamp" aria-hidden="true">
                <span>{t.recorded}</span>
                <small>{formatDate(lang)}</small>
              </div>
            </div>
          )}

          <dl class="provenance">
            <dt>{t.provenance}</dt>
            <dd>
              <a href={set.sourceUrl} target="_blank" rel="noopener">
                {set.sourceName} ↗
              </a>
            </dd>
            <dd>
              {t.rowId}: {rowIds} · {model}
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
