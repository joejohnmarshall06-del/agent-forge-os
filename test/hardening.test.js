import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseMiniYaml } from "../src/core/mini-yaml.js";
import { runEvalFile } from "../src/evals/runner.js";
import { safeStaticPath } from "../src/server/console-server.js";

test("eval workflow paths resolve relative to the dataset file", async () => {
  const cwd = process.cwd();
  const temp = await mkdtemp(join(tmpdir(), "agent-forge-cwd-"));
  try {
    process.chdir(temp);
    const report = await runEvalFile(join(cwd, "examples/evals/release-note.eval.json"));
    assert.equal(report.score, 100);
  } finally {
    process.chdir(cwd);
    await rm(temp, { recursive: true, force: true });
  }
});

test("static server rejects directory traversal", () => {
  const root = join(process.cwd(), "web");
  assert.equal(safeStaticPath(root, "/../package.json"), null);
});

test("mini yaml parser handles repeated sibling keys without using first occurrence", () => {
  const parsed = parseMiniYaml(`
name: Duplicate Test
steps:
  - id: first
    uses: rag.search
    with:
      query: alpha
  - id: second
    uses: rag.search
    with:
      query: beta
`);

  assert.equal(parsed.steps[0].with.query, "alpha");
  assert.equal(parsed.steps[1].with.query, "beta");
});
