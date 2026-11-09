/**
 * Markdown from the dataset is third-party text. Render it at build time with raw HTML escaped and
 * only http(s) links kept, so the page can insert the result without trusting its source.
 */
export function renderMarkdown(md: string, { cjk = false } = {}): string {
  let src = md.replaceAll("<", "&lt;");
  // CommonMark won't open or close emphasis against CJK punctuation (**“…”**, *《…》*), so for
  // Chinese text, mark emphasis pairs before rendering and turn them into tags afterwards.
  if (cjk) {
    src = src.replace(/\*\*(?=\S)(.+?)(?<=\S)\*\*/g, "\u0001$1\u0002").replace(/(?<![*\w])\*(?=[^\s*])([^*\n]+?)(?<=\S)\*(?![*\w])/g, "\u0003$1\u0004");
  }
  let html = Bun.markdown
    .html(src)
    .replace(/<a href="(?!https?:\/\/)[^"]*"/g, "<a")
    .replace(/<a href="/g, '<a target="_blank" rel="noopener" href="');
  if (cjk) html = html.replaceAll("\u0001", "<strong>").replaceAll("\u0002", "</strong>").replaceAll("\u0003", "<em>").replaceAll("\u0004", "</em>");
  return html;
}
