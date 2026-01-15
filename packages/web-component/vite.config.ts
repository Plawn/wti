import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import solid from 'vite-plugin-solid';

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));

/**
 * Plugin to generate a single HTML file with inlined JS and CSS
 * for easy distribution and embedding
 */
function generateStandaloneHtml(): Plugin {
  return {
    name: 'generate-standalone-html',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      const js = readFileSync(resolve(distDir, 'wti-element.iife.js'), 'utf-8');
      const css = readFileSync(resolve(distDir, 'wti-element.css'), 'utf-8');

      // Standalone HTML with everything inlined
      const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WTI - API Documentation</title>
  <style>${css}</style>
</head>
<body>
  <wti-element></wti-element>
  <script>${js}</script>
</body>
</html>`;

      // Template HTML referencing external files
      const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WTI - API Documentation</title>
  <link rel="stylesheet" href="wti-element.css">
</head>
<body>
  <wti-element></wti-element>
  <script src="wti-element.iife.js"></script>
</body>
</html>`;

      writeFileSync(resolve(distDir, 'wti-standalone.html'), standaloneHtml);
      writeFileSync(resolve(distDir, 'index.html'), indexHtml);
      console.log('✓ Generated wti-standalone.html and index.html');
    },
  };
}

export default defineConfig({
  plugins: [
    solid(),
    dts({
      insertTypesEntry: true,
    }),
    generateStandaloneHtml(),
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
    __WTI_VERSION__: JSON.stringify(pkg.version),
  },
});
