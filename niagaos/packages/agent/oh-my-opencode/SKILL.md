# Oh-My-OpenCode Integration

> The Best Agent Harness - Sisyphus Agent untuk NiagaBot

## 🎯 Quick Activation

Just include in your prompt:

```
ultrawork
```

Or shorthand:

```
ulw
```

## 🤖 Available Agents

| Agent | Purpose | Trigger |
|-------|---------|---------|
| **Sisyphus** | Main orchestrator | Default |
| **Prometheus** | Planner - creates execution plans | Planning tasks |
| **Oracle** | Architecture & debugging | Debug / design |
| **Librarian** | Docs & code search | Research |
| **Explore** | Fast codebase grep | Quick search |
| **Multimodal Looker** | Visual analysis | Images |

## ⚡ Background Agents

Run multiple agents in parallel:

```
Run this in background while I work on something else
```

## 🔧 Features

### LSP & AST Tools

- Refactoring
- Rename symbols
- Diagnostics
- AST-aware code search

### Context Injection

Auto-loads:

- AGENTS.md
- README.md
- Conditional rules

### Built-in MCPs

- websearch (Exa)
- context7 (docs)
- grep_app (GitHub search)

### Productivity

- Ralph Loop (continuous execution)
- Todo Enforcer
- Comment Checker
- Think Mode

## 📋 Configuration

### Project Config

Location: `.opencode/oh-my-opencode.json`

```json
{
  "agents": {
    "sisyphus": {
      "enabled": true,
      "model": "gemini-3-pro-preview"
    }
  },
  "hooks": {
    "disabled_hooks": []
  },
  "background_tasks": {
    "max_concurrent": 3
  }
}
```

### User Config

Location: `~/.config/opencode/oh-my-opencode.json`

## 🔗 Integration with NiagaBot

### From WhatsApp/Telegram

```
ultrawork: buat feature X untuk project Y
```

### Sisyphus will

1. Create execution plan (Prometheus)
2. Research existing code (Librarian)
3. Implement changes
4. Validate with Oracle
5. Report back

## 📚 Resources

- [GitHub](https://github.com/code-yeongyu/oh-my-opencode)
- [Features Doc](https://github.com/code-yeongyu/oh-my-opencode/blob/dev/docs/features.md)
- [Config Doc](https://github.com/code-yeongyu/oh-my-opencode/blob/dev/docs/configurations.md)
