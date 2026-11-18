# graphify reference: add a URL and watch a folder

Load this when the user ran `/graphify add <url>` or passed `--watch`. Neither is part of the default build.

## For /graphify add

Fetch a URL and add it to the corpus, then update the graph.

```bash
GRAPHIFY_URL='<url>' GRAPHIFY_AUTHOR='<name or empty>' GRAPHIFY_CONTRIBUTOR='<name or empty>' \
$(cat graphify-out/.graphify_python) -c "
import os, sys
from graphify.ingest import ingest
from pathlib import Path

# Never inline the URL or names into this source: a quote or backslash in a name
# breaks the code, and a crafted URL could inject statements (#193).
url = os.environ['GRAPHIFY_URL']
meta = {k: v for k, v in (
    ('author', os.environ.get('GRAPHIFY_AUTHOR') or None),
    ('contributor', os.environ.get('GRAPHIFY_CONTRIBUTOR') or None),
) if v}
try:
    out = ingest(url, Path('./raw'), **meta)
    print(f'Saved to {out}')
except ValueError as e:
    print(f'error: {e}', file=sys.stderr)
    sys.exit(1)
except RuntimeError as e:
    print(f'error: {e}', file=sys.stderr)
    sys.exit(1)
"
```

Set the URL and any author/contributor names as environment variables and leave the `author`/`contributor` kwargs out entirely when the user gave neither — inlining them as literals records `'AUTHOR'`/`'CONTRIBUTOR'` as real metadata and lets a quote in a name break the code. If the command exits with an error, tell the user what went wrong - do not silently continue.

After a successful save, run the `--update` pipeline against the **existing graph root** (the `graphify-out/.graphify_root` value, normally `.`), **not `./raw`**: `ingest` writes the file under `./raw`, but the graph's `source_file` values are relative to the original scan root, so updating with `./raw` as the root changes the base and every source path stops matching.

Supported URL types (auto-detected):
- YouTube / any video URL → audio downloaded via yt-dlp, transcribed to `.txt` on next run (requires `pip install 'graphifyy[video]'`)
- Twitter/X → fetched via oEmbed, saved as `.md` with tweet text and author
- arXiv → abstract + metadata saved as `.md`
- PDF → downloaded as `.pdf`
- Images (.png/.jpg/.webp) → downloaded, Claude vision extracts on next run
- Any webpage → converted to markdown via html2text

---

## For --watch

Start a background watcher that monitors a folder and auto-updates the graph when files change.

```bash
$(cat graphify-out/.graphify_python) -m graphify.watch INPUT_PATH --debounce 3
```

Replace INPUT_PATH with the folder to watch. Behavior depends on what changed:

- **Code files only (.py, .ts, .go, etc.):** re-runs AST extraction + rebuild + cluster immediately, no LLM needed. `graph.json` and `GRAPH_REPORT.md` are updated automatically.
- **Docs, papers, or images:** writes a `graphify-out/needs_update` flag and prints a notification to run `/graphify --update` (LLM semantic re-extraction required).

Debounce (default 3s): waits until file activity stops before triggering, so a wave of parallel agent writes doesn't trigger a rebuild per file.

Press Ctrl+C to stop.

For agentic workflows: run `--watch` in a background terminal. Code changes from agent waves are picked up automatically between waves. If agents are also writing docs or notes, you'll need a manual `/graphify --update` after those waves.
