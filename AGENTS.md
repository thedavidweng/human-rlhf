# Human RLHF

- Bun only (1.4.4+): `bun install`, `bun run dev`, `bun check` (types, `bun lint`, tests), `bun fmt`, `bun run build`. No `typescript` or Prettier package; formatting options live in `bunfig.toml`, and `.prettierignore` keeps the dataset JSON untouched.
- Static site on Cloudflare Pages (`humanrlhf.pages.dev`), built by Pages' GitHub integration on every push to `main` (Pages installs with Bun, then `bun run build`, output `dist/`). Manage the project with the `cf` CLI. Never use or install Wrangler. `static/_headers` sets caching and CSP.
- Preact + hand-written CSS in `src/styles.css`. No Tailwind, no UI library.
- Questions and answers are verbatim rows of NousResearch/arete-data-pairs (`scripts/import-arete.ts`, hash-checked). Never rewrite or summarise them; only the A/B order is shuffled. Never label either answer as better or preferred; name the model instead.
- Chinese text is machine translation and must say so on the page, with the English original one click away.
- Post-answer screens state facts (which model, where from). No role-play, no verdicts.
- The 1984 feel stays in the visual details (dark bars, form strips, stamps, one watching eye in the masthead). No quotes from the book, no fictional ministry.
- Nothing repeats on one screen unless the repetition means something: one eye, the name once, each date, id or source once.
- Background music streams verbatim from the Internet Archive, one track per theme (`src/data/music.ts`). The standard track is CC-licensed; the hidden themes' songs are copyrighted and hotlinked from unofficial uploads, a takedown risk the owner accepted. Keep each credit in the about dialog and never copy, cut or remix them.
- GIFs live in `src/data/memes.ts`, pooled by model. Watch every clip frame by frame before adding it and write `alt` from what is actually on screen. Never search Giphy at runtime.
- Batch mechanical work (translation, bulk data entry) goes to `agy -p` as a subagent.
- Hidden themes (`src/lib/skins.ts`, `@layer skins` in styles.css) are deliberately over the top; keep their decoration in CSS and Giphy banners, never copy art from Red Alert, Broforce or any other game.
