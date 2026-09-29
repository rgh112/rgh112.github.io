import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://rgh112.github.io',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  vite: { build: { sourcemap: false } },
});
