#!/usr/bin/env node
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

function getApiKey() {
  if (process.env.CARTESIA_API_KEY) return process.env.CARTESIA_API_KEY;
  const keyFile = join(homedir(), '.config', 'cartesia', 'api_key');
  if (existsSync(keyFile)) return readFile(keyFile, 'utf8').then(k => k.trim());
  return null;
}

const API_KEY = await getApiKey();
if (!API_KEY) {
  console.error('Error: Cartesia API key not configured. Run /cartesia:setup to get started.');
  process.exit(1);
}

const args = process.argv.slice(2);
let search = '';
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--search') search = args[++i]?.toLowerCase() ?? '';
}

// Paginate through all voices
let allVoices = [];
let offset = 0;
const limit = 100;

while (true) {
  const res = await fetch(`https://api.cartesia.ai/voices?limit=${limit}&offset=${offset}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Cartesia-Version': '2025-04-16',
    },
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`API Error ${res.status}: ${err}`);
    process.exit(1);
  }

  const body = await res.json();
  allVoices = allVoices.concat(body.data ?? []);
  if (!body.page_info?.has_next_page) break;
  offset += limit;
}

const voices = search
  ? allVoices.filter(v => v.name?.toLowerCase().includes(search))
  : allVoices;

if (voices.length === 0) {
  console.log(search ? `No voices matching "${search}"` : 'No voices found');
  process.exit(0);
}

const pad = (s, n) => String(s ?? '').padEnd(n).slice(0, n);
const COL = { name: 28, id: 38, lang: 6, gender: 8, age: 10, accent: 10 };

console.log(
  `${pad('NAME', COL.name)} ${pad('ID', COL.id)} ${pad('LANG', COL.lang)} ${pad('GENDER', COL.gender)} ${pad('AGE', COL.age)} ${pad('ACCENT', COL.accent)}`
);
console.log('─'.repeat(Object.values(COL).reduce((a, b) => a + b + 1, 0)));

for (const v of voices) {
  console.log(
    `${pad(v.name, COL.name)} ${pad(v.id, COL.id)} ${pad(v.language, COL.lang)} ${pad(v.gender, COL.gender)} ${pad(v.age, COL.age)} ${pad(v.accent, COL.accent)}`
  );
}

console.log(`\n${voices.length} voice(s)${search ? ` matching "${search}"` : ''}`);
