import { dirname } from "node:path";
import { loadWorkflow } from "./workflow.js";
import { createDefaultContext } from "./runtime-context.js";
import { Trace } from "../tracing/trace.js";

export async function runWorkflowFile(path) {
  const workflow = await loadWorkflow(path);
  return runWorkflow(workflow, { baseDir: dirname(path) });
}

export async function runWorkflow(workflow, options = {}) {
  const trace = new Trace();
  const context = await createDefaultContext({ ...options, workflow });
  const outputs = {};

  trace.add("workflow.start", { name: workflow.name });

  for (const step of workflow.steps) {
    trace.add("step.start", { id: step.id, uses: step.uses });
    const output = await context.tools.call(step.uses, {
      ...(step.with || {}),
      workflow,
      outputs,
      context
    });
    outputs[step.id] = output;
    trace.add("step.finish", { id: step.id, output });
  }

  trace.add("workflow.finish", { steps: workflow.steps.length });

  return {
    workflow,
    outputs,
    trace: trace.toJSON(),
    publicResult: {
      name: workflow.name,
      outputs,
      traceId: trace.id
    }
  };
}

