import test from "node:test";
import assert from "node:assert/strict";
import { runEvalFile } from "../src/evals/runner.js";

test("release note eval passes", async () => {
  const report = await runEvalFile("examples/evals/release-note.eval.json");
  assert.equal(report.score, 100);
});

