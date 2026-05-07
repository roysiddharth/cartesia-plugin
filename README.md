# cartesia-plugin

A Claude Code plugin for working with the [Cartesia](https://cartesia.ai) voice AI platform. Provides doc search, TTS synthesis, voice listing, CLI shortcuts, and a debugging reference — all accessible as Claude skills.

## Install

```bash
claude plugin marketplace add github.com/roysiddharth/cartesia-plugin --scope local
claude plugin install cartesia --scope local
```

Then run `/cartesia:setup` to configure your API key (get one at [play.cartesia.ai/keys](https://play.cartesia.ai/keys)).

## Update

```bash
claude plugin update cartesia --scope local
```

## Skills

| Skill | Invoke | What it does |
|---|---|---|
| `using-cartesia` | `/cartesia:using-cartesia` | Docs search, TTS synthesis, voice listing, CLI commands |
| `setup` | `/cartesia:setup` | One-time API key configuration |
| `debug` | `/cartesia:debug` | 5-step debugging protocol + common Cartesia failure archetypes |

## Usage

**Search docs**
> "How does the loopback tool work in Cartesia Line?"

**Generate audio**
```
/cartesia:using-cartesia tts "Hello world" --play
```

**Find a voice**
```
/cartesia:using-cartesia voices --search "british"
```

**Debug a failing test**
```
/cartesia:debug
```

## Requirements

- Claude Code
- Node.js 18+
- `cartesia` CLI (for deploy/agent commands): `pip install cartesia`

## License

MIT
