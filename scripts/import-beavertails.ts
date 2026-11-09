// Imports chosen pairs from PKU-Alignment/BeaverTails into src/data/beavertails.en.json, verbatim.
// Usage: bun scripts/import-beavertails.ts <dir holding round0/30k/test.jsonl.gz and round0/30k/train.jsonl.gz>

const EXPECTED_HASHES: Record<string, string> = {
  "round0/30k/test.jsonl.gz": "0ce619bf4c421c12e578445b1fb8d1aedf4bf05ca3eb985f4ddf498a784769ff",
  "round0/30k/train.jsonl.gz": "2e24b85dd599224eeb7379da297223bad50e11fea9fee6a7fdb4bd26aedec315"
};

// [safeRowId, unsafeRowId] pairs
const PICKED: [string, string][] = [
  // 1. animal_abuse (3)
  ["30k/train:12556", "30k/train:2792"],
  ["30k/train:1893", "30k/train:3688"],
  ["30k/train:8455", "30k/train:22343"],

  // 2. terrorism,organized_crime (3)
  ["30k/train:1680", "30k/train:24355"],
  ["30k/train:6712", "30k/train:19895"],
  ["30k/train:16956", "30k/train:22546"],

  // 3. controversial_topics,politics (4)
  ["30k/test:213", "30k/test:2056"],
  ["30k/test:1950", "30k/test:1266"],
  ["30k/train:11843", "30k/train:227"],
  ["30k/train:2945", "30k/train:283"],

  // 4. discrimination,stereotype,injustice (4)
  ["30k/test:619", "30k/test:119"],
  ["30k/test:2077", "30k/test:427"],
  ["30k/test:2220", "30k/test:1794"],
  ["30k/test:2390", "30k/test:2696"],

  // 5. drug_abuse,weapons,banned_substance (4)
  ["30k/test:482", "30k/test:1635"],
  ["30k/train:10008", "30k/train:290"],
  ["30k/train:469", "30k/train:10774"],
  ["30k/test:117", "30k/test:1805"],

  // 6. financial_crime,property_crime,theft (4)
  ["30k/test:305", "30k/test:984"],
  ["30k/test:1305", "30k/test:685"],
  ["30k/test:1688", "30k/test:2566"],
  ["30k/train:17388", "30k/train:25837"],

  // 7. hate_speech,offensive_language (4)
  ["30k/test:256", "30k/test:1587"],
  ["30k/test:349", "30k/test:2015"],
  ["30k/test:2353", "30k/test:2584"],
  ["30k/test:254", "30k/test:822"],

  // 8. misinformation_regarding_ethics,laws_and_safety (4)
  ["30k/test:2358", "30k/test:506"],
  ["30k/test:2006", "30k/test:1315"],
  ["30k/train:107", "30k/train:12974"],
  ["30k/train:122", "30k/train:127"],

  // 9. non_violent_unethical_behavior (4)
  ["30k/test:1761", "30k/test:153"],
  ["30k/test:2885", "30k/test:231"],
  ["30k/test:1030", "30k/test:1985"],
  ["30k/test:709", "30k/test:2363"],

  // 10. privacy_violation (4)
  ["30k/test:2114", "30k/test:647"],
  ["30k/test:1064", "30k/test:1359"],
  ["30k/train:289", "30k/train:26279"],
  ["30k/train:10903", "30k/train:369"],

  // 11. violence,aiding_and_abetting,incitement (4)
  ["30k/test:3010", "30k/test:19"],
  ["30k/test:1176", "30k/test:1924"],
  ["30k/test:1568", "30k/test:1450"],
  ["30k/test:2076", "30k/test:1616"]
];

const TOPICS: Record<string, string> = {
  // animal_abuse
  "30k/train:2792": "animal_abuse",
  "30k/train:3688": "animal_abuse",
  "30k/train:22343": "animal_abuse",

  // terrorism,organized_crime
  "30k/train:24355": "terrorism,organized_crime",
  "30k/train:19895": "terrorism,organized_crime",
  "30k/train:22546": "terrorism,organized_crime",

  // controversial_topics,politics
  "30k/test:2056": "controversial_topics,politics",
  "30k/test:1266": "controversial_topics,politics",
  "30k/train:227": "controversial_topics,politics",
  "30k/train:283": "controversial_topics,politics",

  // discrimination,stereotype,injustice
  "30k/test:119": "discrimination,stereotype,injustice",
  "30k/test:427": "discrimination,stereotype,injustice",
  "30k/test:1794": "discrimination,stereotype,injustice",
  "30k/test:2696": "discrimination,stereotype,injustice",

  // drug_abuse,weapons,banned_substance
  "30k/test:1635": "drug_abuse,weapons,banned_substance",
  "30k/train:290": "drug_abuse,weapons,banned_substance",
  "30k/train:10774": "drug_abuse,weapons,banned_substance",
  "30k/test:1805": "drug_abuse,weapons,banned_substance",

  // financial_crime,property_crime,theft
  "30k/test:984": "financial_crime,property_crime,theft",
  "30k/test:685": "financial_crime,property_crime,theft",
  "30k/test:2566": "financial_crime,property_crime,theft",
  "30k/train:25837": "financial_crime,property_crime,theft",

  // hate_speech,offensive_language
  "30k/test:1587": "hate_speech,offensive_language",
  "30k/test:2015": "hate_speech,offensive_language",
  "30k/test:2584": "hate_speech,offensive_language",
  "30k/test:822": "hate_speech,offensive_language",

  // misinformation_regarding_ethics,laws_and_safety
  "30k/test:506": "misinformation_regarding_ethics,laws_and_safety",
  "30k/test:1315": "misinformation_regarding_ethics,laws_and_safety",
  "30k/train:12974": "misinformation_regarding_ethics,laws_and_safety",
  "30k/train:127": "misinformation_regarding_ethics,laws_and_safety",

  // non_violent_unethical_behavior
  "30k/test:153": "non_violent_unethical_behavior",
  "30k/test:231": "non_violent_unethical_behavior",
  "30k/test:1985": "non_violent_unethical_behavior",
  "30k/test:2363": "non_violent_unethical_behavior",

  // privacy_violation
  "30k/test:647": "privacy_violation",
  "30k/test:1359": "privacy_violation",
  "30k/train:26279": "privacy_violation",
  "30k/train:369": "privacy_violation",

  // violence,aiding_and_abetting,incitement
  "30k/test:19": "violence,aiding_and_abetting,incitement",
  "30k/test:1924": "violence,aiding_and_abetting,incitement",
  "30k/test:1450": "violence,aiding_and_abetting,incitement",
  "30k/test:1616": "violence,aiding_and_abetting,incitement"
};

const dir = process.argv[2];
if (!dir) throw new Error("Pass the directory holding BeaverTails round0 data.");

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

interface BTRow {
  prompt: string;
  response: string;
  is_safe: boolean;
  category: Record<string, boolean>;
}

const wantedIds = new Set<string>();
for (const [safeId, unsafeId] of PICKED) {
  wantedIds.add(safeId);
  wantedIds.add(unsafeId);
}

const found = new Map<string, BTRow>();

for (const relPath of Object.keys(EXPECTED_HASHES)) {
  const split = relPath.includes("test") ? "test" : "train";
  const fullPath = `${dir}/${relPath}`;
  const fileBytes = await Bun.file(fullPath).bytes();
  const text = new TextDecoder().decode(Bun.gunzipSync(fileBytes));
  const lines = text.split("\n").filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const id = `30k/${split}:${i}`;
    if (!wantedIds.has(id)) continue;
    const row: BTRow = JSON.parse(lines[i]);
    found.set(id, row);
  }
}

const missing = Array.from(wantedIds).filter((id) => !found.has(id));
if (missing.length) throw new Error(`Not in dataset files: ${missing.join(", ")}`);

const items = PICKED.map(([safeId, unsafeId]) => {
  const safeRow = found.get(safeId)!;
  const unsafeRow = found.get(unsafeId)!;

  if (safeRow.prompt !== unsafeRow.prompt) {
    throw new Error(`Prompt mismatch between ${safeId} and ${unsafeId}`);
  }
  if (safeRow.is_safe !== true) {
    throw new Error(`Expected safeRow ${safeId} to have is_safe: true`);
  }
  if (unsafeRow.is_safe !== false) {
    throw new Error(`Expected unsafeRow ${unsafeId} to have is_safe: false`);
  }

  const topic = TOPICS[unsafeId];
  if (!topic) throw new Error(`Missing topic mapping for ${unsafeId}`);

  const unsafeCategories = Object.keys(unsafeRow.category).filter((k) => unsafeRow.category[k]);
  if (!unsafeCategories.includes(topic)) {
    throw new Error(`Topic ${topic} is not among true categories of ${unsafeId}: ${unsafeCategories.join(", ")}`);
  }

  return {
    id: unsafeId,
    topic,
    prompt: safeRow.prompt,
    answers: {
      safe: {
        id: safeId,
        text: safeRow.response,
        sha256: sha256(safeRow.response)
      },
      unsafe: {
        id: unsafeId,
        text: unsafeRow.response,
        sha256: sha256(unsafeRow.response),
        categories: unsafeCategories
      }
    }
  };
});

await Bun.write("src/data/beavertails.en.json", JSON.stringify(items, null, 2) + "\n");
console.log(`Wrote ${items.length} items to src/data/beavertails.en.json`);

export {};
