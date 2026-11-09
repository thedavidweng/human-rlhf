<div align="center">

<img src="static/og.png" alt="Human RLHF title screen: the words Human RLHF, two answer slips with the model names blacked out under a Blind stamp, and the question sets." width="760">

# Human RLHF

**Pick the answers you agree with, and find out if you're a biased human model.**

English | [简体中文](README.zh-CN.md)

[**Try it →**](https://humanrlhf.pages.dev) · [China](https://huggingface.co/datasets/NousResearch/arete-data-pairs) · [HH-RLHF](https://huggingface.co/datasets/Anthropic/hh-rlhf) · [BeaverTails](https://huggingface.co/datasets/PKU-Alignment/BeaverTails)

![Bun](https://img.shields.io/badge/Bun-1.4-000?logo=bun&logoColor=fff)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178c6?logo=typescript&logoColor=fff)
![Preact](https://img.shields.io/badge/Preact-11-673ab8?logo=preact&logoColor=fff)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-f38020?logo=cloudflare&logoColor=fff)

</div>

RLHF trains a model on people's choices between two answers. This site borrows that format and puts you in the chooser's seat.

Questions come from three public datasets:

- **Questions about China**: from Nous Research's [arete-data-pairs](https://huggingface.co/datasets/NousResearch/arete-data-pairs), comparing Qwen3.8-27B against Inkling (25 questions).
- **Helpful or harmless**: from Anthropic's [hh-rlhf](https://huggingface.co/datasets/Anthropic/hh-rlhf) (MIT licence), two replies from Anthropic's 52B model with crowdworker preference labels (48 questions).
- **Safety red lines**: from PKU-Alignment's [BeaverTails](https://huggingface.co/datasets/PKU-Alignment/BeaverTails) (CC BY-NC 4.0 licence), Alpaca-7B replies labelled safe or unsafe across safety categories (42 questions).

You pick the answer you agree with. Only then do you find out which model wrote it, or which human label the dataset assigned.

<table>
  <tr>
    <td width="72%"><img src="docs/desktop-en.webp" alt="Desktop: the question and both answers fit on one screen."></td>
    <td><img src="docs/mobile-en.webp" alt="Phone: the question, the start of both answers and the two buttons on one screen."></td>
  </tr>
</table>

## How it works

- **10 questions a round**, drawn from the active set. A and B are shuffled every time.
- **Nothing is rewritten.** Questions and answers are the datasets' own text, checked byte for byte: arete-data-pairs rows against the dataset's own SHA-256, HH-RLHF and BeaverTails against the SHA-256 of the source files on Hugging Face. The site never says which answer is better. Where both answers come from one model, it tells you the dataset's own human label and whose it is.
- **A title screen worth sharing.** The site opens on a poster with all three playable sets: `#china`, `#hh-rlhf`, and `#beavertails`.
- **Built to be screenshotted.** The question, both answers and the buttons share one screen on a laptop or a phone.
- **A GIF after every pick in the China set.** Choose Qwen3.8-27B's answer and your social credit goes up; choose Inkling's and you get managed democracy. Both sides get roasted, and politicians from both get a cameo.
- **Chinese or English.** The Chinese interface shows a machine translation, clearly labelled, with the English original one click away.
- **Keyboard friendly.** `←` / `A` and `→` / `B` to choose, `Space` or `Enter` to move on.

## Hidden themes

Finish a round in the China set mostly on one side and that side's theme unlocks. Unlocked themes can be switched from the swatches in the top bar.

<table>
  <tr>
    <th>Red Era · mostly Qwen3.8-27B</th>
    <th>Maximum Freedom · mostly Inkling</th>
  </tr>
  <tr>
    <td><img src="docs/theme-red.webp" alt="Red Era theme: red ray burst, cream poster paper and gold type."></td>
    <td><img src="docs/theme-freedom.webp" alt="Maximum Freedom theme: Stars and Stripes behind the question."></td>
  </tr>
</table>

## Data

|                       |                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Questions and answers | `src/data/*.en.json`, imported by `scripts/import-*.ts` from the respective datasets. Each script checks its source against SHA-256 (per row for arete-data-pairs, per file for the other two) and stores a hash of every answer, which the tests check again.                                                                                                                                                                                         |
| Chinese               | `src/data/*.zh.json`, machine-translated by Gemini 3.8 Flash. Tests check that every question has a translation with matching Markdown structure.                                                                                                                                                                                                                                                                                                      |
| Rendering             | Answers are Markdown, rendered at build time by Bun macros (`src/data/load.ts`) with raw HTML escaped and only http(s) links kept.                                                                                                                                                                                                                                                                                                                     |
| Music                 | `src/data/music.ts`, one track per theme, streamed unmodified from the Internet Archive and credited in _About_; nothing is copied into the repo. Standard: “Access Denied!!!” by Figure, from Heavy Industries' _Maintenance EP_ (2004), CC BY-NC-ND 1.0. Red Era: 屠洪刚, “天上太阳红彤彤” (1996). Maximum Freedom: Team America, “America, Fuck Yeah” (2004). The last two are copyrighted and come from unofficial uploads, so they may disappear. |
| GIFs                  | `src/data/memes.ts`, pooled by model for the China set and dealt without repeats. Every clip was watched frame by frame and its alt text describes what's on screen. Served from GIPHY's CDN and credited.                                                                                                                                                                                                                                             |

To re-import datasets:

```sh
bun scripts/import-arete.ts <arete-dir>
bun scripts/import-hh-rlhf.ts <hh-dir>
bun scripts/import-beavertails.ts <bt-dir>
```

## Development

Requires [Bun](https://bun.sh) 1.4.4 or later. Type checking, formatting and tests all use Bun's built-in tools; there is no `typescript` or Prettier package.

```sh
bun install
bun run dev      # dev server with hot reload
bun check        # type check (bun check), formatting check and tests
bun lint         # formatting check only (bun fmt --check)
bun fmt          # format everything; options live in bunfig.toml
bun run build    # writes dist/
```

## Deployment

Static files on Cloudflare Pages at [humanrlhf.pages.dev](https://humanrlhf.pages.dev). Pages is connected to this GitHub repo: every push to `main` makes Cloudflare install dependencies with Bun, run `bun run build` and publish `dist/`. Branches other than `main` get no preview deployments.

The project was created with Cloudflare's `cf` CLI, which can also redeploy the current `main` by hand:

```sh
bunx cf auth login
bunx cf pages deployments create humanrlhf
```

`static/_headers` sets a one-year immutable cache on hashed assets and a CSP; Cloudflare's edge handles compression. The social preview is `static/og.png`; if the site moves to another domain, update the URLs in `src/index.html`.
