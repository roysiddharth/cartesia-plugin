---
name: using-cartesia
description: "Use this skill when working with the Cartesia voice AI platform. Handles four operations: (1) searching Cartesia docs via context7 — use when asked about the API, Line platform, TTS parameters, voice agents, tools, events, webhooks, or deployment; (2) running TTS synthesis — use when asked to test TTS, generate audio, or hear a voice; (3) listing available voices — use when asked for voice IDs or to find a specific voice; (4) running cartesia CLI commands — use for deploy, init, status, env, call, connect operations."
---

# Using Cartesia

Thin wrapper over the Cartesia API and CLI. Five operations available.

## Setup (run once, at the start of every skill invocation)

**Step 1 — API key**

Load `CARTESIA_API_KEY` from the project's `.key` file if not already set:
```bash
export CARTESIA_API_KEY=$(cat .key)
```

**Step 2 — CLI availability check (only needed for Operation 4)**

If the user's request involves Operation 4 (CLI commands), run:
```bash
which cartesia
```

If the command is not found, use `AskUserQuestion` to ask:
> "The Cartesia CLI is not installed. Install it now? (`curl -fsSL https://cartesia.sh | sh`)"

- If the user says **yes**: run `curl -fsSL https://cartesia.sh | sh`, then proceed immediately with the requested operation.
- If the user says **no**: stop and inform them the CLI is required for this operation.

Do not run this check for Operations 1, 2, or 3 — they use direct API fetch and do not need the CLI.

Scripts use Node.js built-in `fetch` — no npm install needed.

---

## Operation 1: Docs Search

Query context7 for up-to-date Cartesia documentation.

```
Step 1: mcp__context7__resolve-library-id with libraryName "Cartesia" and the user's query
Step 2: mcp__context7__query-docs with the resolved library ID and the user's query
Step 3: Return relevant snippets inline
```

Best library IDs for Cartesia:
- `/websites/cartesia_ai` — full platform docs (1,200+ snippets, most comprehensive)
- `/cartesia-ai/cartesia-js` — JavaScript SDK reference
- `/cartesia-ai/cartesia-python` — Python SDK reference

---

## Operation 2: TTS Synthesis

```bash
node .claude/skills/using-cartesia/scripts/cartesia-tts.js "<text>" [--voice-id <id>] [--model <model>] [--play]
```

**Defaults:**
- voice: `9626c31c-bec5-4cca-baa8-f8ba9e84c8bc`
- model: `sonic-3.5`
- output: `.output/output.wav`

**Examples:**
```bash
# Basic synthesis
node .claude/skills/using-cartesia/scripts/cartesia-tts.js "Hello, world!"

# With playback (macOS only — requires afplay)
node .claude/skills/using-cartesia/scripts/cartesia-tts.js "Testing voice" --play

# Custom voice and model
node .claude/skills/using-cartesia/scripts/cartesia-tts.js "Hello" --voice-id <uuid> --model sonic-2
```

---

## Operation 3: List Voices

```bash
node .claude/skills/using-cartesia/scripts/cartesia-list-voices.js [--search <query>]
```

**Examples:**
```bash
# List all voices
node .claude/skills/using-cartesia/scripts/cartesia-list-voices.js

# Filter by name
node .claude/skills/using-cartesia/scripts/cartesia-list-voices.js --search "british"
```

Output columns: `name | id | language | gender | age | accent`

---

## Operation 4: Cartesia CLI

Run `cartesia` CLI commands directly. See `./cartesia-cli-reference.md` for all commands.

**Common commands:**
```bash
cartesia auth status
cartesia agents ls
cartesia status <agent_id>
cartesia deploy
cartesia deployments ls
cartesia env set KEY=VALUE
cartesia call +1XXXXXXXXXX [agent_id]
```

---

