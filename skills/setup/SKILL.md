---
name: setup
description: "Use this skill when the user needs to configure their Cartesia API key, when CARTESIA_API_KEY is not set, or when the user runs /cartesia:setup. Guides through one-time API key setup — saves the key to ~/.config/cartesia/api_key for immediate use and to ~/.zshrc for all future sessions."
---

# Cartesia Setup

One-time API key configuration.

## Steps

1. Ask the user for their Cartesia API key. It can be found at https://play.cartesia.ai/keys
2. Run the setup script with the key they provide:
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/cartesia-setup.js" "<api-key>"
   ```
3. Confirm both outputs show ✓ (config file + ~/.zshrc)
4. Check if the `cartesia` CLI is installed:
   ```bash
   which cartesia
   ```
   If missing, tell the user to install it: `pip install cartesia` (required for deploy/agent commands in Operation 4)
5. Let the user know setup is complete and the key is active immediately for this session
