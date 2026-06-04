export class DeterministicProvider {
  async complete({ prompt, context = [] }) {
    const evidence = context.map((item) => item.text).join(" ");
    const summary = evidence
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .slice(0, 3)
      .join(" ");

    return [
      `Draft: ${prompt}`,
      summary ? `Grounded context: ${summary}` : "Grounded context: none",
      "Checklist: include version, changelog, migration notes, validation, and rollback plan."
    ].join("\n");
  }
}

