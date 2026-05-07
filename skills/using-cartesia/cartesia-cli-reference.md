# Cartesia CLI Reference

## Auth
```bash
cartesia auth login      # Authenticate with Cartesia
cartesia auth logout     # Deauthenticate
cartesia auth status     # Show current auth state
```

## Agent Management
```bash
cartesia init                    # Link current directory to an agent
cartesia create                  # Create a new agent
cartesia agents ls               # List all agents
cartesia status <agent_id>       # Check agent and deployment status
```

## Deployment
```bash
cartesia deploy                  # Deploy current directory to Cartesia cloud
cartesia deployments ls          # List all deployments
```

Deployment states: `building` → `ready`. Only one active deployment at a time; others available for rollback.

## Environment Variables
```bash
cartesia env set KEY=VALUE       # Set secret/env var for the agent
cartesia env rm KEY              # Remove an env var
```

## Calling & Connecting
```bash
cartesia call +1XXXXXXXXXX [agent_id]          # Dial outbound call to a number
cartesia connect --agent-id <id> --url <url>   # Connect an external agent URL
cartesia disconnect --agent-id <id>            # Disconnect an external agent
```

## Local Testing
```bash
# Terminal 1 — run agent locally
PORT=8000 uv run python main.py

# Terminal 2 — connect via CLI
cartesia chat 8000
```

## Deployment Notes
- One phone number auto-provisioned per agent in production
- Phone number released permanently on agent delete
- Connect GitHub repo for push-to-deploy CI/CD
- Per-call resources: 1GB memory, 0.5 vCPU (contact support to increase)
