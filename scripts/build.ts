// Writes the static site to dist/, which Cloudflare Pages publishes after building from GitHub.
import { cp, rm } from "node:fs/promises";

const out = "dist";

await rm(out, { recursive: true, force: true });

const result = await Bun.build({
  entrypoints: ["./src/index.html"],
  outdir: out,
  minify: true,
  splitting: true,
  define: { "process.env.NODE_ENV": '"production"' },
  naming: { chunk: "assets/[name]-[hash].[ext]", asset: "assets/[name]-[hash].[ext]" }
});
if (!result.success) throw new AggregateError(result.logs, "Build failed");

// Unhashed files served at fixed paths: headers config and the social preview image.
await cp("static", out, { recursive: true });

for (const o of result.outputs) console.log(`${(o.size / 1024).toFixed(1).padStart(7)} KB  ${o.path.replace(`${process.cwd()}/`, "")}`);
