import { readFile } from "node:fs/promises";
import { dirname, isAbsolute, resolve } from "node:path";
import { runWorkflowFile } from "../core/runtime.js";

export async function runEvalFile(path) {
  const datasetPath = resolve(path);
  const dataset = JSON.parse(await readFile(datasetPath, "utf8"));
  const datasetDir = dirname(datasetPath);
  const cases = [];

  for (const item of dataset.cases) {
    const workflowPath = isAbsolute(item.workflow)
      ? item.workflow
      : resolve(datasetDir, item.workflow);
    const run = await runWorkflowFile(workflowPath);
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
