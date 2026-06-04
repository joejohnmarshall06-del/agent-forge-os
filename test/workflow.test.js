import test from "node:test";
import assert from "node:assert/strict";
import { runWorkflowFile } from "../src/core/runtime.js";

test("runs release note workflow", async () => {
  const result = await runWorkflowFile("examples/workflows/release-note.agent.yml");
  const text = JSON.stringify(result.outputs).toLowerCase();
  assert.equal(text.includes("changelog"), true);
  assert.equal(text.includes("migration"), true);
  assert.equal(text.includes("rollback"), true);
});

