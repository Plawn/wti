import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    solid(),
    vanillaExtractPlugin(),
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
    rollupOptions: {
      output: {
        // Bundle everything for standalone use
        inlineDynamicImports: true,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
