#!/usr/bin/env node
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const apiKey = process.argv[2];
if (!apiKey) {
  console.error('Usage: node cartesia-setup.js <api-key>');
  process.exit(1);
}

// 1. Write to ~/.config/cartesia/api_key (mode 600 — owner read/write only)
const configDir = join(homedir(), '.config', 'cartesia');
await mkdir(configDir, { recursive: true });
await writeFile(join(configDir, 'api_key'), apiKey, { mode: 0o600 });
console.log(`✓ Saved to ${join(configDir, 'api_key')}`);

// 2. Write to ~/.zshrc — update existing line or append
const zshrcPath = join(homedir(), '.zshrc');
const exportLine = `export CARTESIA_API_KEY="${apiKey}"`;

let zshrc = existsSync(zshrcPath) ? await readFile(zshrcPath, 'utf8') : '';

if (zshrc.includes('CARTESIA_API_KEY')) {
  zshrc = zshrc.replace(/export CARTESIA_API_KEY=.*/g, exportLine);
} else {
  zshrc = zshrc.endsWith('\n') ? zshrc + exportLine + '\n' : zshrc + '\n' + exportLine + '\n';
}

await writeFile(zshrcPath, zshrc);
console.log('✓ Updated ~/.zshrc');
console.log('\nSetup complete. The API key is active for this session immediately.');
console.log('Future shells will pick it up automatically from ~/.zshrc.');
