import { useEffect } from "preact/hooks";
import { QUESTIONS } from "../data/questions";
import { SETS, type QuestionSet } from "../data/sets";
import { I18N } from "../lib/i18n";
import { ROUND_SIZE } from "../lib/round";
import { loadDisplayFont } from "../lib/skins";
import type { Language } from "../types/benchmark";
import { Eye } from "./eye";

/** Placeholder text lines on the two answer slips: [width, redacted]. */
const SLIP_LINES: Record<"A" | "B", [string, boolean][]> = {
  A: [
    ["100%", false],
    ["34%", true],
    ["92%", false],
    ["100%", false],
    ["58%", true],
    ["86%", false],
    ["44%", false]
  ],
  B: [
    ["96%", false],
    ["100%", false],
    ["62%", true],
    ["90%", false],
    ["28%", true],
    ["100%", false],
    ["70%", false]
  ]
};

/** The first screen: a poster for the whole site, then the question sets to pick from. */
export function TitleScreen({ lang, onStart }: { lang: Language; onStart: (set: QuestionSet) => void }) {
  const t = I18N[lang];
  const first = SETS.find((s) => s.ready)!;

  useEffect(() => void loadDisplayFont(), []);

  return (
    <main class="title">
      <div class="title-copy">
        <p class="kicker">{t.titleKicker}</p>
        <h1 class="wordmark" lang="en">
          <span>Human</span> <span>RLHF</span>
        </h1>
        <p class="title-gloss">{t.titleGloss}</p>
        <p class="title-lede">{t.titleLede}</p>
        <p class="title-body">{t.titleBody}</p>
        <div class="title-start">
          <p class="insert" aria-hidden="true">
            <span class="caret">▶</span> {t.insertHuman}
          </p>
          <button class="button start" onClick={() => onStart(first)}>
            {t.start} <span aria-hidden="true">→</span>
          </button>
          <span class="hint">{t.startHint}</span>
        </div>
      </div>

      <div class="slips" aria-hidden="true">
        {(["A", "B"] as const).map((k) => (
          <div class="slip" data-slip={k} key={k}>
            <header class="band">
              <span>{t.answerLabel(k)}</span>
              <span class="slip-model">
                {t.modelLabel} <i class="redact" />
              </span>
            </header>
            <div class="slip-body">
              {SLIP_LINES[k].map(([w, redacted]) => (
                <i class={redacted ? "redact" : "line"} style={{ width: w }} />
              ))}
            </div>
            <div class="slip-foot">
              <span class="option-key">{k}</span>
              <span class="slip-pick">{t.pick(k)}</span>
            </div>
          </div>
        ))}
        <div class="title-seal">
          <Eye size={64} />
        </div>
        <div class="stamp title-stamp">
          <Eye size={24} />
          <span>{t.blind}</span>
          <small>{t.blindNote}</small>
        </div>
      </div>

      <section class="sets" aria-labelledby="sets-title">
        <h2 id="sets-title" class="kicker">
          {t.setsTitle}
        </h2>
        <ol>
          {SETS.map((s, i) => {
            const body = (
              <>
                <span class="set-no" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <strong>{s.title[lang]}</strong>
                <span class="set-desc">{s.description[lang]}</span>
                <span class="set-meta">{s.ready ? t.setCount(QUESTIONS.length, ROUND_SIZE) : <span class="set-prep">{t.inPrep}</span>}</span>
              </>
            );
            return (
              <li key={s.id}>
                {s.ready ? (
                  <button class="set" onClick={() => onStart(s)}>
                    {body}
                  </button>
                ) : (
                  <div class="set" aria-disabled="true">
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
