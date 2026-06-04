export function summarizeTrace(trace) {
  const counts = trace.steps.reduce((acc, step) => {
    acc[step.type] = (acc[step.type] || 0) + 1;
    return acc;
  }, {});

  const lines = [
    `Trace ${trace.id}`,
    `Steps: ${trace.steps.length}`,
    ""
  ];

  for (const [type, count] of Object.entries(counts)) {
    lines.push(`${type}: ${count}`);
  }

  return lines.join("\n");
}

export function diffTraces(left, right) {
  return {
    left: left.id,
    right: right.id,
    stepDelta: right.steps.length - left.steps.length,
    addedTypes: uniqueTypes(right).filter((type) => !uniqueTypes(left).includes(type)),
    removedTypes: uniqueTypes(left).filter((type) => !uniqueTypes(right).includes(type))
  };
}

function uniqueTypes(trace) {
  return [...new Set(trace.steps.map((step) => step.type))];
}
