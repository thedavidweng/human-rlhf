import { useState } from "preact/hooks";
import { I18N } from "../lib/i18n";
import type { Summary } from "../lib/round";
import type { Language } from "../types/benchmark";
import { Eye } from "./eye";
import { formatDate } from "./notice";

export function PersonnelFile({ summary, lang, onRetake }: { summary: Summary; lang: Language; onRetake: () => void }) {
  const t = I18N[lang];
  const [copied, setCopied] = useState(false);
  const leaning = t.archetypes[summary.archetype];

  const copy = async () => {
    await navigator.clipboard.writeText(`${t.shareLine(leaning, summary.qwenPercent, summary.inklingPercent)}\n${location.origin}${location.pathname}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article class="file sheet">
      <header class="band">
        <span class="band-org">
          <Eye size={22} />
          {t.brand}
        </span>
        <span class="band-ref">{formatDate(lang)}</span>
      </header>

      <div class="sheet-main">
        <h2 class="file-title">{t.fileTitle}</h2>

        <dl class="file-meta">
          <div>
            <dt>{t.fileSubject}</dt>
            <dd>{t.fileSubjectValue}</dd>
          </div>
          <div>
            <dt>{t.fileDate}</dt>
            <dd>{formatDate(lang)}</dd>
          </div>
          <div>
            <dt>{t.fileClass}</dt>
            <dd class="file-class">{leaning}</dd>
          </div>
        </dl>

        <Split qwen={summary.qwen} inkling={summary.inkling} lang={lang} />
        <p class="file-note">{t.fileNote}</p>

        <h3 class="kicker">{t.fileByCategory}</h3>
        <ul class="file-cats">
          {summary.byTopic.map((c) => (
            <li key={c.topic}>
              <span>{t.topics[c.topic]}</span>
              <span class="blocks" aria-label={`${t.short.qwen} ${c.qwen}, ${t.short.inkling} ${c.inkling}`}>
                {Array.from({ length: c.qwen }, () => (
                  <i data-side="qwen" />
                ))}
                {Array.from({ length: c.inkling }, () => (
                  <i data-side="inkling" />
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

export function Split({ qwen, inkling, lang }: { qwen: number; inkling: number; lang: Language }) {
  const t = I18N[lang];
  const total = qwen + inkling;
  return (
    <div class="split">
      <div class="split-labels">
        <span data-side="qwen">
          {t.short.qwen} <b>{qwen}</b>
        </span>
        <span data-side="inkling">
          <b>{inkling}</b> {t.short.inkling}
        </span>
      </div>
      <div class="split-bar" style={{ "--q": total ? qwen / total : 0.5 }} data-empty={total === 0 || undefined} />
    </div>
  );
}
