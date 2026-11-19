import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

const MAX_CLOUDFLARE_ASSET_BYTES = 24 * 1024 * 1024; // Keep safely under Cloudflare's 25 MiB limit
const BLOCKED_FILENAMES = new Set([
  'founderbytes-30-under-30-india-2026.pdf',
  'FounderBytes Magazine 30U30 (2).pdf',
]);

function copyFilteredPublicDir(srcDir: string, destDir: string) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, {recursive: true});

  for (const entry of fs.readdirSync(srcDir, {withFileTypes: true})) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyFilteredPublicDir(srcPath, destPath);
    } else if (entry.isFile()) {
      const size = fs.statSync(srcPath).size;
      if (BLOCKED_FILENAMES.has(entry.name) || size > MAX_CLOUDFLARE_ASSET_BYTES) {
        console.warn(
          `[cloudflare-asset-guard] Skipped blocked/oversized public asset (${(size / (1024 * 1024)).toFixed(2)} MiB): ${entry.name}`
        );
        continue;
      }
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function cloudflareAssetGuard(): Plugin {
  return {
    name: 'cloudflare-asset-guard',
    closeBundle() {
      const rootDir = process.cwd();
      const publicDir = path.resolve(rootDir, 'public');
      const distDir = path.resolve(rootDir, 'dist');
      copyFilteredPublicDir(publicDir, distDir);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), cloudflareAssetGuard()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    build: {
      copyPublicDir: false,
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
