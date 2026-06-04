import { readFile } from "node:fs/promises";

export async function createRetriever({ files }) {
  const docs = [];
  for (const file of files) {
    const text = await readFile(file, "utf8");
    docs.push(...chunk(file, text));
  }
  return {
    search(query, topK = 3) {
      const terms = tokenize(query);
      return docs
        .map((doc) => ({ ...doc, score: score(terms, doc.tokens) }))
        .filter((doc) => doc.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
    }
  };
}

function chunk(file, text) {
  return text.split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((text, index) => ({
      id: `${file}#${index}`,
      file,
      text,
      tokens: tokenize(text)
    }));
}

function tokenize(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9_\-\s]/g, " ").split(/\s+/).filter(Boolean);
}

function score(queryTerms, docTerms) {
  const set = new Set(docTerms);
  return queryTerms.reduce((sum, term) => sum + (set.has(term) ? 1 : 0), 0);
}

