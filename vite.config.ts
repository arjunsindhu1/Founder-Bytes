import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

const MAX_CLOUDFLARE_ASSET_BYTES = 24 * 1024 * 1024; // Keep safely under Cloudflare's 25 MiB limit
const BLOCKED_LEGACY_DIST_FILES = [
  path.join('magazines', 'founderbytes-30-under-30-india-2026.pdf'),
  'FounderBytes Magazine 30U30 (2).pdf',
];

function pruneOversizedAssets(dir: string) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      pruneOversizedAssets(fullPath);
    } else if (entry.isFile()) {
      const size = fs.statSync(fullPath).size;
      if (size > MAX_CLOUDFLARE_ASSET_BYTES) {
        fs.unlinkSync(fullPath);
        console.warn(
          `[cloudflare-asset-guard] Removed oversized asset (${(size / (1024 * 1024)).toFixed(1)} MiB): ${fullPath}`
        );
      }
    }
  }
}

function cloudflareAssetGuard(): Plugin {
  return {
    name: 'cloudflare-asset-guard',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      for (const relPath of BLOCKED_LEGACY_DIST_FILES) {
        const target = path.join(distDir, relPath);
        if (fs.existsSync(target)) {
          fs.unlinkSync(target);
          console.warn(`[cloudflare-asset-guard] Removed legacy asset: ${relPath}`);
        }
      }
      pruneOversizedAssets(distDir);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), cloudflareAssetGuard()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/pdfjs-dist')) {
              return 'pdfjs-vendor';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
