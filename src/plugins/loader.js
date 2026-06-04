import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

export async function loadPlugins(dir) {
  const files = (await readdir(dir)).filter((file) => file.endsWith(".plugin.json"));
  const plugins = [];

  for (const file of files) {
    const plugin = JSON.parse(await readFile(join(dir, file), "utf8"));
    validatePlugin(plugin, file);
    plugins.push({ ...plugin, file });
  }

  return plugins;
}

export function validatePlugin(plugin, file = "plugin") {
  if (!plugin.name || typeof plugin.name !== "string") throw new Error(`${file} requires name.`);
  if (!plugin.version || typeof plugin.version !== "string") throw new Error(`${file} requires version.`);
  if (!Array.isArray(plugin.tools)) throw new Error(`${file} requires tools array.`);
  for (const tool of plugin.tools) {
    if (!tool.name || typeof tool.name !== "string") throw new Error(`${file} has tool without name.`);
    if (!tool.input || typeof tool.input !== "object") throw new Error(`${file}:${tool.name} requires input schema.`);
  }
}
