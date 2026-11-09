# Human RLHF

- Bun only: `bun install`, `bun run dev`, `bun run check`, `bun run build`.
- Static site on Cloudflare Pages (`humanrlhf.pages.dev`), built by Pages' GitHub integration on every push to `main` (`bun install --frozen-lockfile && bun run build`, output `dist/`). Manage the project with the `cf` CLI. Never use or install Wrangler. `static/_headers` sets caching and CSP.
- Preact + hand-written CSS in `src/styles.css`. No Tailwind, no UI library.
- Questions and answers are verbatim rows of NousResearch/arete-data-pairs (`scripts/import-arete.ts`, hash-checked). Never rewrite or summarise them; only the A/B order is shuffled. Never label either answer as better or preferred; name the model instead.
- Chinese text is machine translation and must say so on the page, with the English original one click away.
- Post-answer screens state facts (which model, where from). No role-play, no verdicts.
- The 1984 feel stays in the visual details (dark bars, form strips, stamps, recurring eyes). No quotes from the book, no fictional ministry.
- GIFs live in `src/data/memes.ts`, pooled by model. Watch every clip frame by frame before adding it and write `alt` from what is actually on screen. Never search Giphy at runtime.
- Batch mechanical work (translation, bulk data entry) goes to `agy -p` as a subagent.
- Hidden themes (`src/lib/skins.ts`, `@layer skins` in styles.css) are deliberately over the top; keep their decoration in CSS and Giphy banners, never copy art from Red Alert, Broforce or any other game.
