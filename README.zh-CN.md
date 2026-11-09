<div align="center">

<img src="static/og.png" alt="Human RLHF：一道关于 1997 年香港回归的题目，A、B 两个模型回答并排显示。" width="760">

# Human RLHF

**两个回答。你认同哪一个？**

[English](README.md) | 简体中文

[**马上试试 →**](https://humanrlhf.pages.dev) · [数据集](https://huggingface.co/datasets/NousResearch/arete-data-pairs)

![Bun](https://img.shields.io/badge/Bun-1.4-000?logo=bun&logoColor=fff)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178c6?logo=typescript&logoColor=fff)
![Preact](https://img.shields.io/badge/Preact-11-673ab8?logo=preact&logoColor=fff)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-f38020?logo=cloudflare&logoColor=fff)

</div>

RLHF 指的是用人类在两个回答之间的选择来训练模型。这个网站借用这个形式，让你来做那个二选一。

每道题都来自 Nous Research 的 [arete-data-pairs](https://huggingface.co/datasets/NousResearch/arete-data-pairs)：一个关于中国的问题，Qwen3.8-27B 和教师模型 Inkling 各答一遍，原文照录。你先选自己认同的那个，选完才知道是哪个模型写的。

<table>
  <tr>
    <td width="72%"><img src="docs/desktop-zh.webp" alt="电脑：题目和两个回答在一屏内。"></td>
    <td><img src="docs/mobile-zh.webp" alt="手机：题目、两个回答的开头和两个按钮在一屏内。"></td>
  </tr>
</table>

## 玩法

- **每轮 10 题**，从言论自由、监控、治理、国家意识形态和市场五类共 25 道题里抽，A、B 位置每次随机。
- **一个字都不改。** 题目和回答都是数据集原文，逐字节核对过数据集里的 SHA-256。数据集没有标注哪个回答更好，网站也不标注。
- **为截图而设计。** 在笔记本或手机上，题目、两个回答和选择按钮都在同一屏里。
- **每次选完来一张梗图。** 选 Qwen3.8-27B 的回答，社会信用分上涨；选 Inkling 的，换来一份管理式民主。两边都被调侃，两边的政治人物也都会客串。
- **中英双语。** 中文界面显示机器翻译，标注清楚，一键切回英文原文。
- **支持键盘。** `←` / `A` 和 `→` / `B` 选择，`空格` 或 `回车` 进入下一题。

## 隐藏主题

一轮里多数选了哪一边，就解锁哪一边的主题。解锁后可以用顶栏的色板切换。

<table>
  <tr>
    <th>红色年代 · 多选 Qwen3.8-27B</th>
    <th>自由至上 · 多选 Inkling</th>
  </tr>
  <tr>
    <td><img src="docs/theme-red.webp" alt="红色年代主题：红色放射光芒、米黄纸面和金色字。"></td>
    <td><img src="docs/theme-freedom.webp" alt="自由至上主题：题目背后是星条旗。"></td>
  </tr>
</table>

## 数据

| | |
|---|---|
| 题目和回答 | `src/data/arete.en.json`，由 `scripts/import-arete.ts` 从数据集的 `paired/*.jsonl` 复制，导入时逐条核对 SHA-256，测试会再核一遍。 |
| 中文 | `src/data/arete.zh.json`，由 Gemini 3.8 Flash 机器翻译。测试检查每条回答都有译文，Markdown 结构和原文一致。 |
| 渲染 | 回答是 Markdown，构建时由 Bun 宏（`src/data/load.ts`）渲染成 HTML，转义原始 HTML，只保留 http(s) 链接。 |
| 梗图 | `src/data/memes.ts`，按模型分池，每轮发牌不重复。每张都逐帧看过，说明文字按画面实际内容写。视频从 GIPHY 的 CDN 加载，并注明出处。 |

重新导入：先把数据集 `paired/` 下需要的 jsonl 下载到一个目录，然后运行：

```sh
bun scripts/import-arete.ts <目录>
```

## 开发

需要 [Bun](https://bun.sh) 1.4 以上。

```sh
bun install
bun run dev      # 本地开发，带热更新
bun run check    # 类型检查（TypeScript 7）+ 测试
bun run build    # 输出到 dist/
```

## 部署

纯静态文件，托管在 Cloudflare Pages：[humanrlhf.pages.dev](https://humanrlhf.pages.dev)。Pages 已关联这个 GitHub 仓库，每次推送到 `main`，Cloudflare 会运行 `bun install --frozen-lockfile && bun run build`，然后发布 `dist/`。`main` 以外的分支不生成预览部署。

项目是用 Cloudflare 的 `cf` CLI 创建的，也可以用它手动重新部署当前的 `main`：

```sh
bunx cf auth login
bunx cf pages deployments create humanrlhf
```

`static/_headers` 给带哈希的资源加一年不可变缓存，并设置 CSP；压缩交给 Cloudflare 边缘。社交预览图是 `static/og.png`；以后换域名的话，要同步更新 `src/index.html` 里的地址。
