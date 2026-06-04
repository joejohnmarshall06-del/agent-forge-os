export class Trace {
  constructor() {
    this.id = `trace_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    this.steps = [];
  }

  add(type, payload) {
    this.steps.push({ type, payload, at: new Date().toISOString() });
  }

  toJSON() {
    return { id: this.id, steps: this.steps };
  }
}

