import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
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
      {
        find: '@wti/glass-ui/styles.css',
        replacement: resolve(__dirname, '../../packages/glass-ui/src/styles/global.css'),
      },
      {
        find: '@wti/glass-ui/theme.css',
        replacement: resolve(__dirname, '../../packages/glass-ui/src/styles/theme.css'),
      },
      // Package main entries AFTER
      { find: '@wti/ui', replacement: resolve(__dirname, '../../packages/ui/src/index.tsx') },
      { find: '@wti/core', replacement: resolve(__dirname, '../../packages/core/src/index.ts') },
      {
        find: '@wti/glass-ui',
        replacement: resolve(__dirname, '../../packages/glass-ui/src/index.ts'),
      },
    ],
  },
});
