import test from "node:test";
import assert from "node:assert/strict";
import { runBenchmark } from "../src/bench/runner.js";
import { loadPlugins } from "../src/plugins/loader.js";
import { OpenAIProvider } from "../src/providers/openai.js";
import { summarizeTrace } from "../src/tracing/trace-utils.js";

test("loads plugin manifests", async () => {
  const plugins = await loadPlugins("examples/plugins");
  assert.equal(plugins[0].name, "github");
});

test("summarizes traces", () => {
  const summary = summarizeTrace({ id: "t1", steps: [{ type: "a" }, { type: "a" }, { type: "b" }] });
  assert.equal(summary.includes("a: 2"), true);
});

test("benchmark returns latency summary", async () => {
  const report = await runBenchmark("examples/workflows/release-note.agent.yml", { runs: 2 });
  assert.equal(report.runs, 2);
  assert.equal(typeof report.p50Ms, "number");
});

test("openai provider requires an api key", async () => {
  const provider = new OpenAIProvider({ apiKey: "" });
  await assert.rejects(() => provider.complete({ prompt: "x" }), /OPENAI_API_KEY/);
});
