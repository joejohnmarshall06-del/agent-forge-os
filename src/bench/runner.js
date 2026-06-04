import { performance } from "node:perf_hooks";
import { runWorkflowFile } from "../core/runtime.js";

export async function runBenchmark(workflowPath, { runs = 50 } = {}) {
  const durations = [];

  for (let i = 0; i < runs; i += 1) {
    const start = performance.now();
    await runWorkflowFile(workflowPath);
    durations.push(performance.now() - start);
  }

  durations.sort((a, b) => a - b);
  return {
    runs,
    minMs: round(durations[0]),
    p50Ms: round(percentile(durations, 0.5)),
    p95Ms: round(percentile(durations, 0.95)),
    maxMs: round(durations.at(-1))
  };
}

function percentile(values, p) {
  return values[Math.min(values.length - 1, Math.floor(values.length * p))];
}

function round(value) {
  return Math.round(value * 100) / 100;
}
