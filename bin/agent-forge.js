#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { createConsoleServer } from "../src/server/console-server.js";
import { runBenchmark } from "../src/bench/runner.js";
import { runEvalFile } from "../src/evals/runner.js";
import { loadPlugins } from "../src/plugins/loader.js";
import { runWorkflowFile } from "../src/core/runtime.js";
import { loadWorkflow } from "../src/core/workflow.js";
import { summarizeTrace } from "../src/tracing/trace-utils.js";

const args = process.argv.slice(2);
const command = args[0] || "help";

async function main() {
  if (command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "run") {
    const file = args[1];
    if (!file) throw new Error("Usage: agent-forge run <workflow.agent.yml>");
    const result = await runWorkflowFile(resolve(file));
    console.log(JSON.stringify(result.publicResult, null, 2));
    return;
  }

  if (command === "eval") {
    const file = args[1];
    if (!file) throw new Error("Usage: agent-forge eval <dataset.json>");
    const report = await runEvalFile(resolve(file));
    console.log(formatEval(report));
    process.exitCode = report.score >= 85 ? 0 : 1;
    return;
  }

  if (command === "validate") {
    const file = args[1];
    if (!file) throw new Error("Usage: agent-forge validate <workflow.agent.yml>");
    const workflow = await loadWorkflow(resolve(file));
    console.log(`valid ${workflow.name}`);
    return;
  }

  if (command === "trace") {
    const file = args[1];
    if (!file) throw new Error("Usage: agent-forge trace <workflow.agent.yml> [--out trace.json]");
    const result = await runWorkflowFile(resolve(file));
    const out = resolve(readFlag("--out") || `traces/${safeName(result.workflow.name)}-${Date.now()}.json`);
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, `${JSON.stringify(result.trace, null, 2)}\n`, "utf8");
    console.log(`Trace written to ${out}`);
    return;
  }

  if (command === "trace-summary") {
    const file = args[1];
    if (!file) throw new Error("Usage: agent-forge trace-summary <trace.json>");
    console.log(summarizeTrace(JSON.parse(await import("node:fs/promises").then((fs) => fs.readFile(resolve(file), "utf8")))));
    return;
  }

  if (command === "plugins") {
    const dir = args[1] || "examples/plugins";
    const plugins = await loadPlugins(resolve(dir));
    console.log(JSON.stringify(plugins, null, 2));
    return;
  }

  if (command === "bench") {
    const workflow = args[1];
    if (!workflow) throw new Error("Usage: agent-forge bench <workflow.agent.yml> [--runs 50]");
    const runs = Number(readFlag("--runs") || 50);
    const report = await runBenchmark(resolve(workflow), { runs });
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  if (command === "console") {
    const port = Number(readFlag("--port") || 4222);
    const server = await createConsoleServer({ port });
    console.log(`Agent Forge console running on http://localhost:${server.port}`);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

function readFlag(name) {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1];
}

function formatEval(report) {
  const lines = [
    "Agent Forge Eval",
    `Cases: ${report.total}`,
    `Pass: ${report.pass}`,
    `Score: ${report.score}`,
    ""
  ];
  for (const item of report.cases) {
    lines.push(`${item.passed ? "PASS" : "FAIL"} ${item.id}`);
  }
  return lines.join("\n");
}

function printHelp() {
  console.log(`agent-forge

Usage:
  agent-forge run <workflow.agent.yml>
  agent-forge eval <dataset.json>
  agent-forge validate <workflow.agent.yml>
  agent-forge trace <workflow.agent.yml> [--out trace.json]
  agent-forge trace-summary <trace.json>
  agent-forge plugins [plugin-dir]
  agent-forge bench <workflow.agent.yml> [--runs 50]
  agent-forge console [--port 4222]
`);
}

function safeName(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "workflow";
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
