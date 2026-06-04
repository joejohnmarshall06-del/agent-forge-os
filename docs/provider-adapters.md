# Provider Adapters

Agent Forge OS keeps model providers behind a small adapter interface:

```js
provider.complete({ prompt, context })
```

The default deterministic provider is used for tests and local demos. The OpenAI adapter is available for real model calls when a workflow sets:

```yaml
model: openai
```

Required environment variables:

```text
OPENAI_API_KEY
OPENAI_MODEL optional, defaults to gpt-4.1-mini
```

Provider adapters should:

- accept structured context
- return plain text
- avoid writing files directly
- surface provider errors clearly
- remain testable through mock providers

