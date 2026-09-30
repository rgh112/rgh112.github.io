import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kunheeryu.com',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  vite: { build: { sourcemap: false } },
});
