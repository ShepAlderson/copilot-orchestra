# Agent Files - Deprecated Location

⚠️ **DEPRECATED**: The agent files in this root directory are kept for backward compatibility only.

## New Location

Agent files have been moved to: **`.github/agents/`**

This is the canonical location for all agent files:
- `Conductor.agent.md`
- `planning-subagent.agent.md`
- `implement-subagent.agent.md`
- `code-review-subagent.agent.md`
- `quality-assurance-subagent.agent.md`

## Why the Change?

Moving agent files to `.github/agents/` provides:
- ✅ Better organization following GitHub conventions
- ✅ Cleaner root directory
- ✅ Easier VS Code workspace import
- ✅ Clear separation from documentation

## Migration

### If you're using the root-level files:

**Option 1: Use the workspace file (Recommended)**
```bash
code-insiders copilot-orchestra.code-workspace
```

**Option 2: Copy from new location**
```bash
cp -r .github/agents /path/to/your/project/.github/
```

**Option 3: Update your references**
If you have scripts or documentation referencing the root-level files, update them to reference `.github/agents/` instead.

## Deprecation Timeline

- **Current**: Root-level files maintained for backward compatibility
- **Future**: Root-level files may be removed in a future release
- **Action**: Migrate to `.github/agents/` directory

## Documentation

See [.github/agents/README.md](.github/agents/README.md) for complete documentation.
