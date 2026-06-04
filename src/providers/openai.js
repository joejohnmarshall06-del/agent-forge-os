export class OpenAIProvider {
  constructor({ apiKey = process.env.OPENAI_API_KEY, model = process.env.OPENAI_MODEL || "gpt-4.1-mini" } = {}) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async complete({ prompt, context = [] }) {
    if (!this.apiKey) {
      throw new Error("OPENAI_API_KEY is required when workflow model is openai.");
    }

    const evidence = context.map((item) => item.text).join("\n\n");
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${this.apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: this.model,
        input: [
          { role: "system", content: "You are a precise workflow automation assistant. Ground answers in supplied context." },
          { role: "user", content: `${prompt}\n\nContext:\n${evidence}` }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed: ${response.status}`);
    }

    const payload = await response.json();
    return payload.output_text || payload.output?.flatMap((item) => item.content || []).map((part) => part.text || "").join("") || "";
  }
}
