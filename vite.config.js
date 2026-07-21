import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Исходники лежат в src/, сборка кладётся в dist/
  root: './src',
  base: './',
  publicDir: path.resolve(__dirname, 'src/public'),

  plugins: [
    // Минификация HTML при production-сборке
    createHtmlPlugin({ minify: true }),

    // Оптимизация растровых картинок (фон, карточки) и SVG
    ViteImageOptimizer({
      test: /\.(jpe?g|png|svg|webp)$/i,
      includePublic: false,
      logStats: true,
      png: { quality: 80, palette: true },
      jpeg: { quality: 80, progressive: true },
      jpg: { quality: 80, progressive: true },
      webp: { quality: 80 },
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: { overrides: { removeViewBox: false, cleanupIds: false } },
          },
          'removeDimensions',
        ],
      },
      cache: true,
      cacheLocation: './.cache',
    }),
  ],

  css: {
    devSourcemap: true,
  },

  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },

  server: {
    port: 3000,
  },
});
