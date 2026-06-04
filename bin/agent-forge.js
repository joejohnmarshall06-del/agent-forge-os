#!/usr/bin/env node
import { resolve } from "node:path";
import { createConsoleServer } from "../src/server/console-server.js";
import { runEvalFile } from "../src/evals/runner.js";
import { runWorkflowFile } from "../src/core/runtime.js";

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
  agent-forge console [--port 4222]
`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

