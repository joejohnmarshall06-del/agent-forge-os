# Plugin System

Plugins are described with `.plugin.json` manifests. The first version of Agent Forge OS validates plugin metadata and tool schemas so future runtime loading can remain safe and predictable.

Example:

```json
{
  "name": "github",
  "version": "0.1.0",
  "tools": [
    {
      "name": "github.createIssue",
      "input": {
        "title": "string",
        "body": "string"
      }
    }
  ]
}
```

Future work:

- signed plugins
- local plugin registry
- sandboxed execution
- permission prompts
- workflow-level plugin allowlists

