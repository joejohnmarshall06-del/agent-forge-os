import { readFile } from "node:fs/promises";
import { parseMiniYaml } from "./mini-yaml.js";

export async function loadWorkflow(path) {
  const text = await readFile(path, "utf8");
  const workflow = parseMiniYaml(text);
  validateWorkflow(workflow);
  return workflow;
}

export function validateWorkflow(workflow) {
  if (!workflow.name) throw new Error("Workflow requires name.");
  if (!Array.isArray(workflow.steps)) throw new Error("Workflow requires steps.");
  for (const step of workflow.steps) {
    if (!step.id || !step.uses) throw new Error("Each step requires id and uses.");
  }
}

