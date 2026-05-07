#!/bin/bash
if [ -n "$CARTESIA_API_KEY" ]; then
  exit 0
fi
if [ -f "$HOME/.config/cartesia/api_key" ]; then
  exit 0
fi
echo "⚠ Cartesia API key not configured. Run /cartesia:setup to get started."
