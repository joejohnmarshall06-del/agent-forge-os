import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { runWorkflowFile } from "../core/runtime.js";

export async function runEvalFile(path) {
  const dataset = JSON.parse(await readFile(path, "utf8"));
  const cases = [];

  for (const item of dataset.cases) {
    const run = await runWorkflowFile(resolve(item.workflow));
    const outputText = JSON.stringify(run.outputs).toLowerCase();
    const missing = item.mustContain.filter((phrase) => !outputText.includes(phrase.toLowerCase()));
    cases.push({
      id: item.id,
      passed: missing.length === 0,
      missing
    });
  }

  const pass = cases.filter((item) => item.passed).length;
  return {
    total: cases.length,
    pass,
    score: Math.round((pass / Math.max(cases.length, 1)) * 100),
    cases
  };
}

