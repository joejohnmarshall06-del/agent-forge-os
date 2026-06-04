export function registerBuiltinTools(registry, { provider, retriever }) {
  registry.register("rag.search", {
    validate(input) {
      if (!input.query) throw new Error("rag.search requires query.");
    },
    run(input) {
      return retriever.search(input.query, input.topK || 3);
    }
  });

  registry.register("llm.complete", {
    validate(input) {
      if (!input.prompt) throw new Error("llm.complete requires prompt.");
    },
    async run(input) {
      const context = Object.values(input.outputs || {}).flat().filter((item) => item?.text);
      return provider.complete({ prompt: input.prompt, context });
    }
  });

  registry.register("eval.contains", {
    validate(input) {
      if (!Array.isArray(input.phrases)) throw new Error("eval.contains requires phrases.");
    },
    run(input) {
      const haystack = JSON.stringify(input.outputs || {}).toLowerCase();
      const missing = input.phrases.filter((phrase) => !haystack.includes(String(phrase).toLowerCase()));
      return { passed: missing.length === 0, missing };
    }
  });
}

