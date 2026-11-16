# graphify reference: extra exports and benchmark

Load this when the user passed one of the export flags (`--wiki`, `--neo4j`, `--neo4j-push`, `--falkordb`, `--falkordb-push`, `--svg`, `--graphml`, `--mcp`), or when the corpus is large enough for the token-reduction benchmark. Each step runs only for its own flag.

### Step 6b - Wiki (only if --wiki flag)

**Only run this step if `--wiki` was explicitly given in the original command.**

Run this before Step 9 (cleanup) so `.graphify_labels.json` is still available.

```bash
graphify export wiki
```

### Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag)

**If `--neo4j`** - generate a Cypher file for manual import:

```bash
graphify export neo4j
```

**If `--neo4j-push <uri>`** - push directly to a running Neo4j instance. **Use the URI given to the flag** — hardcoding `bolt://localhost:7687` silently ignores a remote host or alternate port. Pass the password through the `NEO4J_PASSWORD` environment variable; never put it on `--password`, where it leaks into shell history and process listings:

```bash
NEO4J_PASSWORD=… graphify export neo4j --push "<uri-from-the-flag>" --user neo4j
```

`--user` defaults to `neo4j`. `--password` exists only for non-interactive use where the env var is impossible; otherwise omit it and graphify reads `NEO4J_PASSWORD`. Uses MERGE - safe to re-run without creating duplicates.

### Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag)

**If `--falkordb`** - generate a Cypher file. The statements are OpenCypher, but FalkorDB's `GRAPH.QUERY` runs one statement at a time (no bulk script import like Neo4j's `cypher-shell`), so prefer `--falkordb-push` to load a graph. Use this only when you want the portable `cypher.txt` artifact:

```bash
graphify export falkordb
```

**If `--falkordb-push <uri>`** - push directly to a running FalkorDB instance. Use the URI given to the flag rather than the hardcoded default, and pass any password through `FALKORDB_PASSWORD` (never `--password`, per the Neo4j note above):

```bash
FALKORDB_PASSWORD=… graphify export falkordb --push "<uri-from-the-flag>"
```

Auth is optional; when the instance requires it, graphify reads `FALKORDB_PASSWORD`. The scheme is informational - `redis://` or a bare `host:port` work too - and the target graph defaults to `graphify`. Uses MERGE - safe to re-run without creating duplicates.

### Step 7b - SVG export (only if --svg flag)

```bash
graphify export svg
```

### Step 7c - GraphML export (only if --graphml flag)

```bash
graphify export graphml
```

### Step 7d - MCP server (only if --mcp flag)

> This command starts a **long-lived foreground** stdio server that never returns, so running it inline stalls the pipeline before Step 8 and Step 9 and leaves the temporary `.graphify_*` files behind (#193). Start it **in the background** and do not wait on it — or skip running it entirely and just emit the client config below, letting the MCP client own the process.

```bash
$(cat graphify-out/.graphify_python) -m graphify.serve graphify-out/graph.json &
```

This starts a stdio MCP server that exposes tools: `query_graph`, `get_node`, `get_neighbors`, `get_community`, `god_nodes`, `graph_stats`, `shortest_path`. Add to Claude Desktop or any MCP-compatible agent orchestrator so other agents can query the graph live.

To configure in Claude Desktop, add to `claude_desktop_config.json`. Claude Desktop can't run `$(...)`, and under `uv tool install` the system `python3` can't import graphify — so set `command` to the **absolute interpreter path** printed by `cat graphify-out/.graphify_python`:
```json
{
  "mcpServers": {
    "graphify": {
      "command": "<absolute path from: cat graphify-out/.graphify_python>",
      "args": ["-m", "graphify.serve", "/absolute/path/to/graphify-out/graph.json"]
    }
  }
}
```

### Step 8 - Token reduction benchmark (only if total_words > 5000)

If `total_words` from `graphify-out/.graphify_detect.json` is greater than 5,000, run:

```bash
graphify benchmark
```

Print the output directly in chat. If `total_words <= 5000`, skip silently - the graph value is structural clarity, not token compression, for small corpora.
