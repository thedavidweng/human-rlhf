// Writes the Build Output Specification tree that `cf deploy --prebuilt` uploads:
// an assets-only Worker, no Worker script, no Wrangler.
import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const out = ".cloudflare/output/v0";
const worker = `${out}/workers/default`;

await rm(".cloudflare/output", { recursive: true, force: true });

const result = await Bun.build({
  entrypoints: ["./src/index.html"],
  outdir: `${worker}/assets`,
  minify: true,
  splitting: true,
  define: { "process.env.NODE_ENV": '"production"' },
  naming: { chunk: "assets/[name]-[hash].[ext]", asset: "assets/[name]-[hash].[ext]" }
});
if (!result.success) throw new AggregateError(result.logs, "Build failed");

// Unhashed files served at fixed paths: headers config and the social preview image.
await cp("static", `${worker}/assets`, { recursive: true });
await mkdir(worker, { recursive: true });
await writeFile(`${out}/config.json`, JSON.stringify({ buildContext: { isPreview: false } }));
await writeFile(`${worker}/worker.config.json`, JSON.stringify({ name: "human-rlhf", compatibilityDate: "2026-11-05" }));

for (const o of result.outputs) console.log(`${(o.size / 1024).toFixed(1).padStart(7)} KB  ${o.path.replace(`${process.cwd()}/`, "")}`);
