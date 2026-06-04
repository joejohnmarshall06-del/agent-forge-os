import { resolve } from "node:path";
import { DeterministicProvider } from "../providers/deterministic.js";
import { createRetriever } from "../rag/retriever.js";
import { ToolRegistry } from "../tools/registry.js";
import { registerBuiltinTools } from "../tools/builtins.js";

export async function createDefaultContext({ workflow, baseDir = process.cwd() }) {
  const provider = new DeterministicProvider();
  const retriever = await createRetriever({
    files: (workflow.knowledge || []).map((file) => resolve(baseDir, file))
  });
  const tools = new ToolRegistry();
  registerBuiltinTools(tools, { provider, retriever });
  return { provider, retriever, tools };
}

