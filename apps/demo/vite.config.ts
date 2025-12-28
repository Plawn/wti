import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@wti/ui': resolve(__dirname, '../../packages/ui/src/index.tsx'),
      '@wti/core': resolve(__dirname, '../../packages/core/src/index.ts'),
    },
  },
});
