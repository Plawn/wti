import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    solid(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['**/*.test.ts', '**/*.test.tsx'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'WTI',
      formats: ['es'],
      fileName: 'index',
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        'solid-js',
        'solid-js/web',
        'solid-js/store',
        '@wti/core',
      ],
      output: {
        globals: {
          'solid-js': 'SolidJS',
          'solid-js/web': 'SolidJSWeb',
          'solid-js/store': 'SolidJSStore',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'index.css';
          return assetInfo.name || 'asset';
        },
      },
    },
    sourcemap: true,
    minify: 'esbuild',
  },
});
