---
name: using-cartesia
description: "Use this skill when working with the Cartesia voice AI platform. Handles four operations: (1) searching Cartesia docs via context7 — use when asked about the API, Line platform, TTS parameters, voice agents, tools, events, webhooks, or deployment; (2) running TTS synthesis — use when asked to test TTS, generate audio, or hear a voice; (3) listing available voices — use when asked for voice IDs or to find a specific voice; (4) running cartesia CLI commands — use for deploy, init, status, env, call, connect operations."
---

# Using Cartesia

Thin wrapper over the Cartesia API and CLI. Five operations available.

## Setup

Requires `CARTESIA_API_KEY` in environment. Load from the project's `.key` file:
```bash
export CARTESIA_API_KEY=$(cat .key)
```

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

# With playback
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

