export class ToolRegistry {
  constructor() {
    this.tools = new Map();
  }

  register(name, tool) {
    this.tools.set(name, tool);
  }

  async call(name, input) {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Unknown tool: ${name}`);
    if (tool.validate) tool.validate(input);
    return tool.run(input);
  }
}

