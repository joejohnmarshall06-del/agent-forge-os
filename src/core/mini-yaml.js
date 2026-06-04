export function parseMiniYaml(source) {
  const lines = source.replace(/\r/g, "").split("\n");
  const root = {};
  const stack = [{ indent: -1, value: root }];

  for (const raw of lines) {
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    const indent = raw.match(/^ */)[0].length;
    const text = raw.trim();

    while (stack.at(-1).indent >= indent) stack.pop();
    const parent = stack.at(-1).value;

    if (text.startsWith("- ")) {
      const itemText = text.slice(2);
      if (!Array.isArray(parent)) throw new Error(`List item without list parent: ${raw}`);
      const item = itemText.includes(":") ? parseInlineObject(itemText) : parseScalar(itemText);
      parent.push(item);
      if (typeof item === "object") stack.push({ indent, value: item });
      continue;
    }

    const [key, rest] = splitKeyValue(text);
    if (rest === "") {
      const next = peekNextMeaningful(lines, lines.indexOf(raw) + 1);
      const value = next?.trim().startsWith("- ") ? [] : {};
      parent[key] = value;
      stack.push({ indent, value });
    } else {
      parent[key] = parseScalar(rest);
    }
  }

  return root;
}

function splitKeyValue(text) {
  const index = text.indexOf(":");
  if (index === -1) throw new Error(`Invalid line: ${text}`);
  return [text.slice(0, index).trim(), text.slice(index + 1).trim()];
}

function parseInlineObject(text) {
  const [key, value] = splitKeyValue(text);
  return { [key]: parseScalar(value) };
}

function parseScalar(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^\d+$/.test(value)) return Number(value);
  return value.replace(/^["']|["']$/g, "");
}

function peekNextMeaningful(lines, start) {
  for (let i = start; i < lines.length; i += 1) {
    if (lines[i].trim()) return lines[i];
  }
  return null;
}

