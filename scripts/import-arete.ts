// Copies chosen rows from NousResearch/arete-data-pairs into src/data/arete.en.json, verbatim.
// Usage: bun scripts/import-arete.ts <dir with paired/*.jsonl downloaded from the dataset>
// Nothing in a prompt or answer is edited; only the A/B order is shuffled later, at runtime.
import { Glob } from "bun";

const PICKED = [
  "foe-003109", "foe-006586", "foe-006598", "foe-005533", "foe-005504", "foe-003883", "foe-000358", "foe-005237",
  "dps-001695", "dps-004736", "dps-003195", "dps-003793", "dps-001822", "dps-000296",
  "demgov-009673", "demgov-007812", "demgov-005935", "demgov-009798",
  "stideo-004612", "stideo-002122", "stideo-004792", "stideo-002212", "stideo-002920",
  "smc-002626", "smc-002735"
];

interface Row {
  id: string;
  topic: string;
  prompt: string;
  sha256: string;
  teacher: { model: string; response: string; response_sha256: string };
  starting_checkpoint: { model: string; response: string; response_sha256: string };
}

const dir = process.argv[2];
if (!dir) throw new Error("Pass the directory holding the dataset's paired/*.jsonl files.");

const wanted = new Set(PICKED);
const found = new Map<string, Row>();
for await (const file of new Glob("*.jsonl").scan(dir)) {
  for (const line of (await Bun.file(`${dir}/${file}`).text()).split("\n")) {
    if (!line) continue;
    const row: Row = JSON.parse(line);
    if (wanted.has(row.id)) found.set(row.id, row);
  }
}
const missing = PICKED.filter((id) => !found.has(id));
if (missing.length) throw new Error(`Not in the dataset files: ${missing.join(", ")}`);

const sha256 = (s: string) => new Bun.CryptoHasher("sha256").update(s).digest("hex");

const items = PICKED.map((id) => {
  const r = found.get(id)!;
  // Prove the text is the dataset's own before keeping it, byte for byte.
  for (const a of [r.starting_checkpoint, r.teacher]) {
    if (sha256(a.response) !== a.response_sha256) throw new Error(`${id}: response does not match its dataset hash`);
  }
  return {
    id: r.id,
    topic: r.topic,
    prompt: r.prompt,
    promptSha256: r.sha256,
    answers: {
      qwen: { model: r.starting_checkpoint.model, text: r.starting_checkpoint.response, sha256: r.starting_checkpoint.response_sha256 },
      inkling: { model: r.teacher.model, text: r.teacher.response, sha256: r.teacher.response_sha256 }
    }
  };
});

await Bun.write("src/data/arete.en.json", JSON.stringify(items, null, 2) + "\n");
console.log(`Wrote ${items.length} items to src/data/arete.en.json`);
