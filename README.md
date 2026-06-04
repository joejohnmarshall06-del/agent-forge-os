# Agent Forge OS

Local-first AI agent workflow platform for building, testing, evaluating, and sharing agent automations.

This project is designed as a serious open-source foundation rather than a one-off demo. It combines a tiny workflow DSL, deterministic agent runtime, typed tools, retrieval, evals, traces, a local web console, and a plugin-ready project layout.

No API key is required for the default demo. Real model providers can be added behind the model adapter interface.

## What It Is

Agent Forge OS is a local development kit for AI workflows:

- Write agent workflows as readable `.agent.yml` files.
- Run them locally from the CLI.
- Attach typed tools with input validation.
- Add local knowledge files for retrieval.
- Record execution traces.
- Run regression evals before changing prompts or tools.
- Open a local console to inspect workflows and results.

## Why This Kind Of Project Can Grow

Large open-source AI projects usually win because they become infrastructure:

- Developers can use them immediately.
- Teams can extend them.
- The core is local-first and transparent.
- The project creates artifacts users can share.
- It is broad enough to become an ecosystem.

Agent Forge OS is shaped around that pattern.

## Features

- Agent workflow DSL
- Deterministic runtime
- Provider adapter interface
- Tool registry
- Safe shell-like demo tools
- Local RAG retrieval
- Eval runner
- Trace recorder
- Static web console
- Plugin manifest format
- Example workflows
- Zero runtime dependencies

## Quick Start

```bash
npm test
npm run demo
node bin/agent-forge.js run examples/workflows/release-note.agent.yml
node bin/agent-forge.js eval examples/evals/release-note.eval.json
node bin/agent-forge.js trace examples/workflows/release-note.agent.yml --out traces/release-note.json
node bin/agent-forge.js console
```

Then open:

```text
http://localhost:4222
```

## CLI

```text
agent-forge run <workflow.agent.yml>
agent-forge eval <dataset.json>
agent-forge trace <workflow.agent.yml> [--out trace.json]
agent-forge console [--port 4222]
```

## Workflow Example

```yaml
name: Release Note Agent
description: Drafts grounded release notes from local project context.
model: deterministic
knowledge:
  - examples/knowledge/release-policy.md
steps:
  - id: retrieve
    uses: rag.search
    with:
      query: release checklist changelog version
      topK: 3
  - id: draft
    uses: llm.complete
    with:
      prompt: Write a release note using retrieved context.
  - id: score
    uses: eval.contains
    with:
      phrases:
        - changelog
        - version
        - migration
```

## Repository Structure

```text
bin/                  CLI
src/core/             workflow parser and runtime
src/providers/        model adapters
src/rag/              local retrieval
src/tools/            typed tool registry
src/evals/            eval runner and checks
src/tracing/          trace recorder
src/server/           local console server
web/                  static console UI
examples/             workflows, knowledge, evals, plugins
docs/                 design notes and roadmap
test/                 regression tests
```

## Long-Term Roadmap

- Real OpenAI, Anthropic, Gemini, and local model adapters
- Sandboxed tool execution
- Visual workflow editor
- Plugin marketplace
- Trace diffing
- Eval dashboards
- GitHub PR review mode
- Prompt versioning
- Team workspace sync
- Hosted optional control plane

## Interview And Portfolio Value

This is the kind of project that can support deep engineering discussion:

- DSL design
- runtime orchestration
- tool validation
- RAG tradeoffs
- eval-driven development
- local-first architecture
- plugin systems
- trace observability
- AI safety boundaries
- product growth strategy

## License

MIT
