import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'playwright/index': 'src/playwright/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  clean: true,
  external: ['@playwright/test', '@neowhale/storefront'],
  treeshake: true,
  sourcemap: true,
})
