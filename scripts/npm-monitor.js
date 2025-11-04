// scripts/npm-monitor.js
import fetch from 'node-fetch';
import fs from 'fs';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const FILE = './pkgVersions.json';

const pkg = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
const PACKAGES = pkg?.packages || [];

async function getLatest(pkg) {
  const res = await fetch(`https://registry.npmjs.org/${pkg}/latest`);
  const data = await res.json();
  return data.version;
}

async function sendTG(msg) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text: msg }),
  });
}

async function main() {
  let last = {};
  if (fs.existsSync(FILE)) {
    last = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  }

  const updates = [];

  for (const pkg of PACKAGES) {
    try {
      const latest = await getLatest(pkg);
      const prev = last[pkg];
      if (latest !== prev) {
        updates.push(`${pkg} updated: ${prev || 'N/A'} → ${latest}`);
        last[pkg] = latest;
      }
    } catch (e) {
      await sendTG(`Failed to check ${pkg}: ${e.message}`);
    }
  }

  if (updates.length > 0) {
    const msg = `NPM Updates Detected:\n\n${updates.join('\n')}`;
    await sendTG(msg);
    fs.writeFileSync(FILE, JSON.stringify(last, null, 2));
  } else {
    console.log('No new versions found.');
  }
}

main().catch(async (err) => {
  console.error('Error:', err);
  await sendTG(`Script error: ${err.message}`);
  process.exit(1);
});
