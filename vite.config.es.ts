// @clanker - ES module build: 1:1 transpilation preserving source structure
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Collect all TypeScript entry points from src directory.
 * Excludes src/widget which has its own dedicated build (vite.widget.config.ts).
 */
function getEntryPoints(dir: string, base = ''): Record<string, string> {
  const entries: Record<string, string> = {};

  for (const item of readdirSync(dir)) {
    const fullPath = join(dir, item);
    const relativePath = base ? `${base}/${item}` : item;

    if (statSync(fullPath).isDirectory()) {
      // Skip widget folder - it has its own self-contained build
      if (relativePath === 'widget') continue;
      Object.assign(entries, getEntryPoints(fullPath, relativePath));
    } else if (/\.(ts|tsx)$/.test(item)) {
      const entryName = relativePath.replace(/\.(ts|tsx)$/, '');
      entries[entryName] = fullPath;
    }
  }

  return entries;
}

export default defineConfig({
  plugins: [
    react({ jsxRuntime: 'automatic' }),
    dts({
      tsconfigPath: './tsconfig.es.json',
    }),
  ],
  build: {
    outDir: 'es',
    sourcemap: true,
    lib: {
      entry: getEntryPoints(resolve(__dirname, 'src')),
      formats: ['es'],
    },
    rollupOptions: {
      // Externalize all bare imports (any package, not relative/absolute paths)
      external: (id) => !id.startsWith('.') && !id.startsWith('/'),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
});
