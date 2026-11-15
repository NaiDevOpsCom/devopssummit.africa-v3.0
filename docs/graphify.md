# Graphify — Codebase Knowledge Graph

[Graphify](https://github.com/Graphify-Labs/graphify) builds a persistent knowledge graph of this
repository (symbols, docs, cross-file relationships, community clusters) and lets agents and
humans query it instead of grepping. It is **optional tooling** — the app builds, tests, and deploys
without it.

## What is committed

Project-scoped configuration is committed so every contributor and agent gets identical behaviour:

| Path                            | Purpose                                            |
| ------------------------------- | -------------------------------------------------- |
| `.opencode/opencode.json`       | Registers the OpenCode plugin                      |
| `.opencode/plugins/graphify.js` | Reminds agents to query the graph before searching |
| `.opencode/skills/graphify/`    | Graphify skill + references for OpenCode           |
| `AGENTS.md`                     | Agent instructions, including the Graphify rules   |
| `.graphifyignore`               | Corpus exclusions layered on top of `.gitignore`   |

Everything generated during a run (`graphify-out/`, `.graphify_*.json`, `.graphify_*.txt`) is
gitignored — never commit it.

## Setup

```sh
# Install the CLI (once, user-level)
pipx install graphify

# Install project config for OpenCode (already committed; re-run only to upgrade)
graphify install --project --platform opencode
```

After reinstalling, check `git diff AGENTS.md`: the generated block must stay verbatim so future
installs merge cleanly instead of duplicating it.

## Usage

```sh
graphify extract . --code-only   # build/refresh the graph from source — local AST only, no API cost
graphify query "<question>"      # scoped subgraph for a codebase question
graphify path "<A>" "<B>"        # how two symbols/files relate
graphify explain "<concept>"     # focused concept explanation
graphify update .                # incremental AST refresh after code changes
```

The first `extract` scans the whole repo; later `update` runs only touch changed files.

> ⚠️ `graphify extract .` **without** `--code-only` may call an LLM API for semantic extraction and
> can incur cost. Use `--code-only` unless you deliberately want semantic enrichment.

## What goes in the graph

`.graphifyignore` excludes generated output, vendored tooling, `public/` assets, Storybook image
fixtures, and large machine-written files (`lighthouse-baseline.json`, `gallery.generated.json`,
`package-lock.json`). Add an entry there rather than `.gitignore` when you only want to keep
something out of the graph.

## CI and formatting

`graphify-out/`, `.opencode/`, and `AGENTS.md` are listed in `.prettierignore`, because the CI
workflow runs `npx prettier --check .` and would otherwise fail on generated content.

## Troubleshooting

| Symptom                                 | Fix                                                         |
| --------------------------------------- | ----------------------------------------------------------- |
| `graphify: command not found`           | `pipx install graphify`; ensure `~/.local/bin` is on `PATH` |
| Queries return stale results            | `graphify update .`                                         |
| `graphify-out/` missing                 | `graphify extract . --code-only`                            |
| Duplicate Graphify block in `AGENTS.md` | Restore the block, then rerun `graphify install --project`  |
