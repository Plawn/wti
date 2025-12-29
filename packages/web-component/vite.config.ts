import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    solid(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'WTIElement',
      formats: ['es', 'iife'],
      fileName: (format) => `wti-element.${format}.js`,
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Bundle everything for standalone use
        inlineDynamicImports: true,
        assetFileNames: 'wti-element.[ext]',
      },
    },
    sourcemap: true,
    minify: 'esbuild',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
