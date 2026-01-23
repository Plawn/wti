import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const uiPkg = JSON.parse(
  readFileSync(resolve(__dirname, '../../packages/ui/package.json'), 'utf-8'),
);

export default defineConfig({
  plugins: [solid()],
  define: {
    __WTI_VERSION__: JSON.stringify(uiPkg.version),
  },
  server: {
    port: 5173,
  },
  resolve: {
    alias: [
      // CSS exports FIRST (more specific paths must come before less specific)
      {
        find: '@wti/ui/styles.css',
        replacement: resolve(__dirname, '../../packages/ui/src/styles/global.css'),
      },
      // Package main entries AFTER
      { find: '@wti/ui', replacement: resolve(__dirname, '../../packages/ui/src/index.tsx') },
      { find: '@wti/core', replacement: resolve(__dirname, '../../packages/core/src/index.ts') },
    ],
  },
});
