import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { Eye } from "./components/eye";
import { PersonnelFile, Split } from "./components/file";
import { NoticeDialog } from "./components/notice";
import { SkinBanner, UnlockCard } from "./components/skin";
import { memeVideo } from "./data/memes";
import { QUESTIONS } from "./data/questions";
import { DATASET_URL } from "./data/source";
import { UPCOMING } from "./data/upcoming";
import { I18N } from "./lib/i18n";
import { drawRound, summarize, type RoundItem } from "./lib/round";
import { loadSkinFont, readActive, readUnlocked, save, skinEarned, type Skin } from "./lib/skins";
import { playChime, playKey, readSoundPreference, setSound } from "./lib/sound";
import type { Answer, Language, ModelKey, Translation } from "./types/benchmark";

const LANG_KEY = "human-rlhf:lang";
const ALL_SKINS: Skin[] = ["red", "freedom"];

export function initialLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "zh" || saved === "en") return saved;
  } catch {
    // Storage blocked: fall through to the browser language.
  }
  return navigator.languages.some((l) => l.toLowerCase().startsWith("zh")) ? "zh" : "en";
}

/** Swap screens inside a view transition when the browser has them and the user hasn't asked for less motion. */
function transition(update: () => void) {
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return update();
  document.startViewTransition(async () => {
    update();
    // Preact renders in a microtask queued by the state change; this one runs after it. A timer would
    // also work but gets throttled in background tabs, which makes the transition time out.
    await new Promise<void>((resolve) => queueMicrotask(resolve));
  });
}

export interface ChineseText {
  translations: Record<string, Translation>;
  translator: string;
}

export async function loadChinese(): Promise<ChineseText> {
  const m = await import("./data/zh");
  return { translations: m.TRANSLATIONS, translator: m.TRANSLATOR };
}

/** `preloaded` is the Chinese text already fetched before the first render, so Chinese readers never see English flash first. */
export function App({ lang: firstLang, preloaded }: { lang: Language; preloaded: ChineseText | null }) {
  const [lang, setLang] = useState(firstLang);
  const [zh, setZh] = useState<ChineseText | null>(preloaded);
  const [original, setOriginal] = useState(false);
  const [sound, setSoundState] = useState(readSoundPreference);
  const [round, setRound] = useState(() => drawRound(QUESTIONS));
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<ModelKey | null>(null);
  const [unlocked, setUnlocked] = useState(readUnlocked);
  const [skin, setSkin] = useState<Skin>(() => readActive(readUnlocked()));
  const [justUnlocked, setJustUnlocked] = useState<Exclude<Skin, "default"> | null>(null);
  const about = useRef<HTMLDialogElement>(null);
  const t = I18N[lang];

  const index = picked ? answers.length - 1 : answers.length;
  const current: RoundItem | undefined = round[index];
  const finished = !current;
  const summary = useMemo(() => summarize(answers), [answers]);

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // Not persisted; harmless.
    }
    if (lang === "zh" && !zh) {
      loadChinese().then(setZh);
    }
  }, [lang]);

  useEffect(() => {
    if (skin === "default") delete document.documentElement.dataset.skin;
    else {
      document.documentElement.dataset.skin = skin;
      loadSkinFont();
    }
    save(unlocked, skin);
  }, [skin, unlocked]);

  // Finishing a round mostly on one side unlocks that side's theme, and puts it on.
  useEffect(() => {
    if (!finished) return;
    const earned = skinEarned(summary);
    if (!earned || unlocked.includes(earned)) return;
    setUnlocked([...unlocked, earned]);
    setJustUnlocked(earned);
    transition(() => setSkin(earned));
  }, [finished]);

  const changeSkin = (next: Skin) => transition(() => setSkin(next));

  const pick = (model: ModelKey) => {
    if (picked || !current) return;
    playKey();
    setAnswers((prev) => [...prev, { question: current.question, model }]);
    setPicked(model);
  };

  // One listener for the page's lifetime, reading the latest state through a ref. Re-registering it
  // after each render would leave a gap while a view transition holds the next frame.
  const onKey = useRef<(e: KeyboardEvent) => void>(undefined);
  onKey.current = (e) => {
    if (picked || finished || e.metaKey || e.ctrlKey || e.altKey || document.querySelector("dialog[open]")) return;
    if (e.target instanceof HTMLElement && e.target.closest("input, textarea, [contenteditable]")) return;
    const slot = ({ a: 0, "1": 0, arrowleft: 0, b: 1, "2": 1, arrowright: 1 } as const)[e.key.toLowerCase()];
    if (slot === undefined) return;
    e.preventDefault();
    pick(current.order[slot]);
  };
  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKey.current?.(e);
    addEventListener("keydown", handler);
    return () => removeEventListener("keydown", handler);
  }, []);

  const next = () => {
    const last = answers.length === round.length;
    transition(() => setPicked(null));
    if (last) playChime();
  };

  const retake = () => {
    transition(() => {
      setRound(drawRound(QUESTIONS));
      setAnswers([]);
      setPicked(null);
      setJustUnlocked(null);
    });
    scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSound = () => {
    setSound(!sound);
    setSoundState(!sound);
  };

  return (
    <>
      {/* The masthead and the current question share exactly one screen, so a screenshot catches all of it. */}
      <div class="screen" data-fit={!finished || undefined}>
      <header class="masthead">
        <a class="brand" href="./" aria-label={t.brand}>
          <Eye />
          <span class="brand-name">{t.brand}</span>
        </a>
        <nav class="tools">
          <button class="link" onClick={() => about.current?.showModal()}>
            {t.about}
          </button>
          {unlocked.length > 0 && (
            <Swatches skins={["default", ...unlocked]} active={skin} lang={lang} onPick={changeSkin} />
          )}
          <button class="link icon" aria-label={t.sound(sound)} title={t.sound(sound)} onClick={toggleSound}>
            <SpeakerIcon on={sound} />
          </button>
          <button class="link" lang={lang === "zh" ? "en" : "zh"} aria-label={t.switchLanguageLabel} onClick={() => setLang(lang === "zh" ? "en" : "zh")}>
            {t.switchLanguage}
          </button>
        </nav>
      </header>

      <main class="page">
        {answers.length === 0 && (
          <section class="hero">
            <div class="hero-copy">
              <p class="kicker">{t.heroKicker}</p>
              <h1>{t.heroTitle}</h1>
              <p class="hero-body">{t.heroBody}</p>
            </div>
            {skin === "default" ? (
              <div class="seal" aria-hidden="true">
                <Eye size={72} />
              </div>
            ) : (
              <SkinBanner skin={skin} lang={lang} />
            )}
          </section>
        )}

        {finished ? (
          <>
            {justUnlocked && <UnlockCard skin={justUnlocked} lang={lang} onRevert={() => changeSkin("default")} />}
            <PersonnelFile summary={summary} lang={lang} onRetake={retake} />
          </>
        ) : (
          <QuestionSheet
            key={current.question.id}
            item={current}
            index={index}
            total={round.length}
            lang={lang}
            zh={lang === "zh" && !original ? zh : null}
            onToggleOriginal={lang === "zh" ? () => setOriginal(!original) : undefined}
            original={original}
            picked={picked}
            onPick={pick}
          />
        )}

      </main>
      </div>

      <div class="page">
        {!finished && (
          <section class="progress" aria-label={t.tally}>
            <ol class="pips" aria-hidden="true">
              {round.map((_, i) => (
                <li data-side={answers[i]?.model} data-current={i === index || undefined} />
              ))}
            </ol>
            <Split qwen={summary.qwen} inkling={summary.inkling} lang={lang} />
          </section>
        )}
      </div>

      <footer class="colophon">
        <Eye size={36} />
        <p>{t.footerNote}</p>
        <p>
          <a href={DATASET_URL} target="_blank" rel="noopener">
            NousResearch/arete-data-pairs
          </a>
        </p>
      </footer>

      {picked && current && (
        <NoticeDialog key={current.question.id} question={current.question} picked={picked} meme={current.memes[picked]} lang={lang} last={index === round.length - 1} onDone={next} />
      )}

      <dialog ref={about} class="about" closedby="any" aria-labelledby="about-title">
        <form method="dialog">
          <h2 id="about-title">{t.aboutTitle}</h2>
          {t.aboutBody.map((p) => (
            <p>{p}</p>
          ))}
          <h3 class="kicker">{t.rewardTitle}</h3>
          <div class="reward">
            <p>{t.rewardRule}</p>
            {unlocked.length < ALL_SKINS.length ? (
              <button type="button" class="link quiet" onClick={() => setUnlocked(ALL_SKINS)}>
                {t.rewardUnlock}
              </button>
            ) : (
              <Swatches skins={["default", ...ALL_SKINS]} active={skin} lang={lang} onPick={changeSkin} labelled />
            )}
          </div>
          <h3 class="kicker">{t.upcoming}</h3>
          <ul class="papers">
            {UPCOMING.map((b) => (
              <li key={b.id}>
                <strong>{b.title[lang]}</strong>
                <span>{b.description[lang]}</span>
                <a href={b.sourceUrl} target="_blank" rel="noopener">
                  {b.sourceName} ↗
                </a>
              </li>
            ))}
          </ul>
          <button class="button">{t.close}</button>
        </form>
      </dialog>
    </>
  );
}

interface SheetProps {
  item: RoundItem;
  index: number;
  total: number;
  lang: Language;
  /** Chinese text to show instead of the English original, once loaded. */
  zh: ChineseText | null;
  original: boolean;
  onToggleOriginal?: () => void;
  picked: ModelKey | null;
  onPick: (m: ModelKey) => void;
}

function QuestionSheet({ item, index, total, lang, zh, original, onToggleOriginal, picked, onPick }: SheetProps) {
  const t = I18N[lang];
  const q = item.question;
  const tr = zh?.translations[q.id];

  return (
    <article class="sheet">
      <header class="band">
        <span class="band-org">
          <Eye size={22} />
          {t.questionOf(index + 1, total)}
        </span>
        <span class="band-ref">{t.topics[q.topic]}</span>
      </header>
      <div class="sheet-main">
        <h2 class="prompt" lang={tr ? "zh-CN" : "en"}>
          {tr ? tr.prompt : q.prompt}
        </h2>
        <p class="sheet-meta">
          <a href={DATASET_URL} target="_blank" rel="noopener">
            {t.dataset}: arete-data-pairs · {q.id} ↗
          </a>
          {tr && zh && <span>{t.translated(zh.translator)}</span>}
          {onToggleOriginal && (
            <button class="link" aria-pressed={original} onClick={onToggleOriginal}>
              {original ? t.showTranslation : t.showOriginal}
            </button>
          )}
        </p>

        {/* Warm the cache for whichever clip this answer is about to earn. */}
        <div hidden>
          {item.order.map((side) => (
            <video key={side} src={memeVideo(item.memes[side])} preload="auto" muted />
          ))}
        </div>

        <p class="choose kicker">{t.choose}</p>
        <div class="options">
          {item.order.map((model, slot) => (
            <Option
              key={model}
              letter={slot === 0 ? "A" : "B"}
              html={tr ? tr.answers[model] : q.answers[model].html}
              lang={lang}
              textLang={tr ? "zh-CN" : "en"}
              side={picked === model ? model : undefined}
              dim={Boolean(picked && picked !== model)}
              disabled={Boolean(picked)}
              onPick={() => onPick(model)}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

interface OptionProps {
  letter: "A" | "B";
  html: string;
  lang: Language;
  textLang: string;
  side?: ModelKey;
  dim: boolean;
  disabled: boolean;
  onPick: () => void;
}

function Option({ letter, html, lang, textLang, side, dim, disabled, onPick }: OptionProps) {
  const t = I18N[lang];
  const [open, setOpen] = useState(false);
  const [clipped, setClipped] = useState(false);
  const answer = useRef<HTMLDivElement>(null);
  const arrow = letter === "A" ? "ArrowLeft" : "ArrowRight";
  const arrowKey = letter === "A" ? "←" : "→";

  // Offer "read in full" only when the answer is actually cut off at this screen size.
  useEffect(() => {
    const el = answer.current;
    if (!el) return;
    let frame = 0;
    // Measure in the next frame: reacting inside the observer callback would trip a resize loop.
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setClipped(el.scrollHeight > el.clientHeight + 2));
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [html]);

  return (
    <section class="option" data-side={side} data-dim={dim || undefined} data-open={open || undefined} data-clipped={clipped || undefined} aria-label={letter}>
      <span class="option-key" aria-hidden="true">
        {letter}
      </span>
      {/* Pre-rendered at build time from dataset Markdown, with raw HTML escaped (see lib/markdown.ts). */}
      <div class="answer" ref={answer} lang={textLang} dangerouslySetInnerHTML={{ __html: html }} />
      <div class="option-foot">
        <button class="link more" aria-expanded={open} hidden={!clipped && !open} onClick={() => setOpen(!open)}>
          {open ? t.collapse : t.expand}
        </button>
        <button class="button primary pick" disabled={disabled} onClick={onPick} aria-keyshortcuts={`${letter} ${arrow}`} title={t.keyHint(arrowKey, letter)}>
          {t.pick(letter)}
          <span class="keys" aria-hidden="true">
            <kbd>{arrowKey}</kbd>
            <kbd>{letter}</kbd>
          </span>
        </button>
      </div>
    </section>
  );
}

/** Small round colour chips, one per theme: a theme switch that looks like the themes it switches to. */
function Swatches({ skins, active, lang, onPick, labelled = false }: { skins: Skin[]; active: Skin; lang: Language; onPick: (s: Skin) => void; labelled?: boolean }) {
  const t = I18N[lang];
  return (
    <div class="swatches" role="group" aria-label={t.skin} data-labelled={labelled || undefined}>
      {skins.map((s) => (
        <button type="button" key={s} class="swatch-button" aria-pressed={active === s} title={t.skins[s]} aria-label={labelled ? undefined : t.skins[s]} onClick={() => onPick(s)}>
          <span class="swatch" data-swatch={s} aria-hidden="true" />
          {labelled && <span>{t.skins[s]}</span>}
        </button>
      ))}
    </div>
  );
}

/** Speaker glyph after Lucide's volume-2 / volume-x (ISC). */
function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
      {on ? (
        <>
          <path d="M16 9a5 5 0 0 1 0 6" />
          <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
        </>
      ) : (
        <path d="m22 9-6 6m0-6 6 6" />
      )}
    </svg>
  );
}
