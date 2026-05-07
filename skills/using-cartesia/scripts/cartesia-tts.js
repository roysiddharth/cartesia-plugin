#!/usr/bin/env node
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { homedir } from 'os';
import { join } from 'path';

function getApiKey() {
  if (process.env.CARTESIA_API_KEY) return process.env.CARTESIA_API_KEY;
  const keyFile = join(homedir(), '.config', 'cartesia', 'api_key');
  if (existsSync(keyFile)) return readFile(keyFile, 'utf8').then(k => k.trim());
  return null;
}

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--help') {
  console.log('Usage: node cartesia-tts.js "<text>" [--voice-id <id>] [--model <model>] [--play]');
  process.exit(0);
}

const API_KEY = await getApiKey();
if (!API_KEY) {
  console.error('Error: Cartesia API key not configured. Run /cartesia:setup to get started.');
  process.exit(1);
}

let text = '';
let voiceId = '9626c31c-bec5-4cca-baa8-f8ba9e84c8bc';
let model = 'sonic-3.5';
let play = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--voice-id') voiceId = args[++i];
  else if (args[i] === '--model') model = args[++i];
  else if (args[i] === '--play') play = true;
  else if (!text) text = args[i];
}

if (!text) {
  console.error('Error: text argument is required');
  process.exit(1);
}

const outputDir = '.output';
const outputPath = `${outputDir}/output.wav`;

if (!existsSync(outputDir)) {
  await mkdir(outputDir, { recursive: true });
}

const response = await fetch('https://api.cartesia.ai/tts/bytes', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Cartesia-Version': '2025-04-16',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model_id: model,
    transcript: text,
    voice: { mode: 'id', id: voiceId },
    language: 'en',
    output_format: {
      container: 'wav',
      encoding: 'pcm_f32le',
      sample_rate: 44100,
    },
  }),
});

if (!response.ok) {
  const err = await response.text();
  console.error(`API Error ${response.status}: ${err}`);
  process.exit(1);
}

const audioBuffer = Buffer.from(await response.arrayBuffer());
await writeFile(outputPath, audioBuffer);

// WAV header is 44 bytes; pcm_f32le = 4 bytes/sample, mono
const durationSec = ((audioBuffer.length - 44) / (44100 * 4)).toFixed(1);
console.log(`Saved: ${outputPath} (${durationSec}s, ${audioBuffer.length} bytes)`);

if (play) {
  execSync(`afplay "${outputPath}"`, { stdio: 'inherit' });
}
