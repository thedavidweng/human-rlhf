// Imports chosen rows from Anthropic/hh-rlhf into src/data/hh-rlhf.en.json, verbatim.
// Usage: bun scripts/import-hh-rlhf.ts <dir holding harmless-base and helpful-base>

const EXPECTED_HASHES: Record<string, string> = {
  "harmless-base/test.jsonl.gz": "ebfaaed21162a4de120ae85366075b34425e2a6303fac59b99555002f7016f03",
  "helpful-base/test.jsonl.gz": "8be3fc1a13b27901631696f2be6f184c799f1baeaf145f53ac5db24960adc37b"
};

const PICKED: string[] = [
  // harmless-base (24)
  "harmless-base/test:4",
  "harmless-base/test:26",
  "harmless-base/test:75",
  "harmless-base/test:103",
  "harmless-base/test:151",
  "harmless-base/test:240",
  "harmless-base/test:308",
  "harmless-base/test:323",
  "harmless-base/test:326",
  "harmless-base/test:399",
  "harmless-base/test:494",
  "harmless-base/test:515",
  "harmless-base/test:687",
  "harmless-base/test:722",
  "harmless-base/test:755",
  "harmless-base/test:943",
  "harmless-base/test:970",
  "harmless-base/test:1019",
  "harmless-base/test:1024",
  "harmless-base/test:1044",
  "harmless-base/test:1092",
  "harmless-base/test:1249",
  "harmless-base/test:1397",
  "harmless-base/test:2267",

  // helpful-base (24)
  "helpful-base/test:0",
  "helpful-base/test:6",
  "helpful-base/test:10",
  "helpful-base/test:18",
  "helpful-base/test:116",
  "helpful-base/test:126",
  "helpful-base/test:146",
  "helpful-base/test:162",
  "helpful-base/test:170",
  "helpful-base/test:180",
  "helpful-base/test:197",
  "helpful-base/test:259",
  "helpful-base/test:280",
  "helpful-base/test:284",
  "helpful-base/test:288",
  "helpful-base/test:330",
  "helpful-base/test:460",
  "helpful-base/test:470",
  "helpful-base/test:484",
  "helpful-base/test:503",
  "helpful-base/test:529",
  "helpful-base/test:551",
  "helpful-base/test:621",
  "helpful-base/test:638"
];

const dir = process.argv[2];
if (!dir) throw new Error("Pass the directory holding harmless-base and helpful-base.");

const sha256 = (s: string | Uint8Array) => new Bun.CryptoHasher("sha256").update(s).digest("hex");

// Verify file hashes first
for (const [relPath, expectedHash] of Object.entries(EXPECTED_HASHES)) {
  const fullPath = `${dir}/${relPath}`;
  const file = Bun.file(fullPath);
  if (!(await file.exists())) throw new Error(`Source file missing: ${fullPath}`);
  const fileBytes = await file.bytes();
  const fileHash = sha256(fileBytes);
  if (fileHash !== expectedHash) {
    throw new Error(`Hash mismatch for ${relPath}: expected ${expectedHash}, got ${fileHash}`);
  }
}

function parseTurn(raw: string) {
  const humanPrefix = "\n\nHuman: ";
  const assistantPrefix = "\n\nAssistant: ";
  if (!raw.startsWith(humanPrefix)) throw new Error("Row does not start with Human prefix");
  const hMatches = raw.split(humanPrefix);
  const aMatches = raw.split(assistantPrefix);
  if (hMatches.length !== 2) throw new Error("Row does not contain exactly one Human prefix");
  if (aMatches.length !== 2) throw new Error("Row does not contain exactly one Assistant prefix");

  const humanIndex = raw.indexOf(humanPrefix);
  const assistantIndex = raw.indexOf(assistantPrefix);
  if (assistantIndex <= humanIndex) throw new Error("Assistant prefix precedes Human prefix");

  const prompt = raw.slice(humanPrefix.length, assistantIndex);
  const text = raw.slice(assistantIndex + assistantPrefix.length);

  // Assert exact reproduction byte for byte
  if (`\n\nHuman: ${prompt}\n\nAssistant: ${text}` !== raw) {
    throw new Error("Failed to reproduce turn byte for byte");
  }

  return { prompt, text };
}

interface LoadedRow {
  prompt: string;
  chosenText: string;
  chosenSha256: string;
  rejectedText: string;
  rejectedSha256: string;
}

const wanted = new Set(PICKED);
const found = new Map<string, LoadedRow>();

for (const relPath of Object.keys(EXPECTED_HASHES)) {
  const subset = relPath.split("/")[0]; // "harmless-base" or "helpful-base"
  const fullPath = `${dir}/${relPath}`;
  const fileBytes = await Bun.file(fullPath).bytes();
  const text = new TextDecoder().decode(Bun.gunzipSync(fileBytes));
  const lines = text.split("\n").filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const id = `${subset}/test:${i}`;
    if (!wanted.has(id)) continue;
    const raw = JSON.parse(lines[i]);

    const c = parseTurn(raw.chosen);
    const r = parseTurn(raw.rejected);

    if (c.prompt !== r.prompt) throw new Error(`${id}: chosen and rejected prompts differ`);
    if (c.text === r.text) throw new Error(`${id}: chosen and rejected replies are identical`);
    if (!c.text.trim() || !r.text.trim()) throw new Error(`${id}: empty reply`);
    if (c.prompt.length < 15) throw new Error(`${id}: prompt under 15 chars`);
    if (c.text.length > 1500 || r.text.length > 1500) throw new Error(`${id}: reply exceeds 1500 chars`);

    found.set(id, {
      prompt: c.prompt,
      chosenText: c.text,
      chosenSha256: sha256(raw.chosen),
      rejectedText: r.text,
      rejectedSha256: sha256(raw.rejected)
    });
  }
}

const missing = PICKED.filter((id) => !found.has(id));
if (missing.length) throw new Error(`Not in dataset files: ${missing.join(", ")}`);

const items = PICKED.map((id) => {
  const row = found.get(id)!;
  const topic = id.startsWith("harmless-base/") ? "harmless-base" : "helpful-base";
  return {
    id,
    topic,
    prompt: row.prompt,
    answers: {
      chosen: {
        text: row.chosenText,
        sha256: row.chosenSha256
      },
      rejected: {
        text: row.rejectedText,
        sha256: row.rejectedSha256
      }
    }
  };
});

await Bun.write("src/data/hh-rlhf.en.json", JSON.stringify(items, null, 2) + "\n");
console.log(`Wrote ${items.length} items to src/data/hh-rlhf.en.json`);

export {};
