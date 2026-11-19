import fs from 'fs';
import path from 'path';

const MAX_BYTES = 24 * 1024 * 1024; // Keep safely under Cloudflare's 25 MiB limit
const BLOCKED_NAMES = new Set([
  'founderbytes-30-under-30-india-2026.pdf',
  'FounderBytes Magazine 30U30 (2).pdf',
]);

const distDir = path.resolve(process.cwd(), 'dist');

let totalFiles = 0;
let largestSize = 0;
let largestRel = '';

function cleanDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      cleanDir(fullPath);
      continue;
    }
    if (!entry.isFile()) continue;

    const size = fs.statSync(fullPath).size;
    if (BLOCKED_NAMES.has(entry.name) || size > MAX_BYTES) {
      fs.unlinkSync(fullPath);
      console.warn(
        `[cloudflare-check] Removed blocked/oversized file (${(size / (1024 * 1024)).toFixed(2)} MiB): ${path.relative(distDir, fullPath)}`
      );
      continue;
    }

    totalFiles += 1;
    if (size > largestSize) {
      largestSize = size;
      largestRel = path.relative(distDir, fullPath);
    }
  }
}

cleanDir(distDir);
console.log(
  `[cloudflare-check] dist verified: ${totalFiles} files, largest asset is ${(largestSize / (1024 * 1024)).toFixed(2)} MiB (${largestRel})`
);
