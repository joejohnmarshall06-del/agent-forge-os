# Architecture

Agent Forge OS is organized around a small but extensible runtime.

## Workflow DSL

Workflows are plain text files with predictable fields: metadata, knowledge sources, and ordered steps. This keeps workflows reviewable in pull requests and portable across projects.

## Runtime

The runtime loads a workflow, creates a context, executes each step, records traces, and returns structured outputs. Steps are tool calls, not hard-coded branches.

## Tools

Tools are registered by name and can validate inputs before execution. This mirrors the way production AI systems protect tool calls from malformed model output.

## Retrieval

The local retriever loads markdown knowledge files, chunks them, tokenizes them, and scores chunks with lexical overlap. It is deliberately simple so the whole retrieval path can be inspected.

## Model Providers

The default provider is deterministic. Real LLMs should be added through the same provider interface so evals can compare behavior across model versions.

## Evals

Eval datasets describe expected output properties. The initial runner checks required phrases, but the project structure supports judge models, schema checks, tool-call checks, and trace assertions.

