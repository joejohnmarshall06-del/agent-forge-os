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
  if (typeof workflow.name !== "string") throw new Error("Workflow name must be a string.");
  if (workflow.description && typeof workflow.description !== "string") throw new Error("Workflow description must be a string.");
  if (workflow.model && typeof workflow.model !== "string") throw new Error("Workflow model must be a string.");
  if (workflow.knowledge && !Array.isArray(workflow.knowledge)) throw new Error("Workflow knowledge must be a list.");
  if (!Array.isArray(workflow.steps)) throw new Error("Workflow requires steps.");
  const ids = new Set();
  for (const step of workflow.steps) {
    if (!step.id || !step.uses) throw new Error("Each step requires id and uses.");
    if (ids.has(step.id)) throw new Error(`Duplicate step id: ${step.id}`);
    ids.add(step.id);
    if (typeof step.id !== "string") throw new Error("Step id must be a string.");
    if (typeof step.uses !== "string") throw new Error("Step uses must be a string.");
    if (step.with && typeof step.with !== "object") throw new Error(`Step ${step.id} with must be an object.`);
  }
}
