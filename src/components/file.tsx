import { useState } from "preact/hooks";
import { I18N } from "../lib/i18n";
import type { Summary } from "../lib/round";
import type { Language, SideKey } from "../types/benchmark";
import { formatDate } from "./notice";

export function PersonnelFile({ summary, setTitle, lang, onRetake }: { summary: Summary; setTitle: string; lang: Language; onRetake: () => void }) {
  const t = I18N[lang];
  const [copied, setCopied] = useState(false);
  const leaning = t.archetypes[summary.set][summary.archetype];
  const [sideA, sideB] = summary.sides;

  const copy = async () => {
    const share = t.shareLine(summary.sides, summary.firstPercent, summary.secondPercent);
    await navigator.clipboard.writeText(`${share}\n${location.origin}${location.pathname}${location.hash}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article class="file sheet">
      <header class="band">
        <span class="band-org">{setTitle}</span>
        <span class="band-ref">{t.answered(summary.first + summary.second)}</span>
      </header>

      <div class="sheet-main">
        <h2 class="file-title">{t.fileTitle}</h2>

        <dl class="file-meta">
          <div>
            <dt>{t.fileDate}</dt>
            <dd>{formatDate(lang)}</dd>
          </div>
          <div>
            <dt>{t.fileClass}</dt>
            <dd class="file-class">{leaning}</dd>
          </div>
        </dl>

        <Split first={summary.first} second={summary.second} sides={summary.sides} lang={lang} />
        <p class="file-note">{t.fileNote}</p>

        <h3 class="kicker">{t.fileByCategory}</h3>
        <ul class="file-cats">
          {summary.byTopic.map((c) => (
            <li key={c.topic}>
              <span>{t.topics[c.topic]}</span>
              <span class="blocks" aria-label={`${t.short[sideA]} ${c.first}, ${t.short[sideB]} ${c.second}`}>
                {Array.from({ length: c.first }, () => (
                  <i data-side={sideA} />
                ))}
                {Array.from({ length: c.second }, () => (
                  <i data-side={sideB} />
                ))}
              </span>
            </li>
          ))}
        </ul>

        <div class="file-actions">
          <button class="button primary" onClick={onRetake}>
            {t.retake}
          </button>
          <button class="button" onClick={copy} aria-live="polite">
            {copied ? t.copied : t.copy}
          </button>
        </div>
      </div>
    </article>
  );
}

export function Split({ first, second, sides, lang }: { first: number; second: number; sides: [SideKey, SideKey]; lang: Language }) {
  const t = I18N[lang];
  const [sideA, sideB] = sides;
  const total = first + second;
  return (
    <div class="split">
      <div class="split-labels">
        <span data-side={sideA}>
          {t.short[sideA]} <b>{first}</b>
        </span>
        <span data-side={sideB}>
          <b>{second}</b> {t.short[sideB]}
        </span>
      </div>
      <div class="split-bar" style={{ "--q": total ? first / total : 0.5 }} data-empty={total === 0 || undefined} />
    </div>
  );
}
