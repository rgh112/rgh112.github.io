# Kunhee Ryu — Research website

Personal research website built with Astro, TypeScript, SVG, and Three.js.

## Development

Requires Node.js 24.

```sh
npm ci
npm run dev
```

## Build and preview

```sh
npm run build
npm run preview
```

The build checks Astro types and audits the generated public files.

## Publish

Website: https://kunheeryu.com/

The custom domain is preserved by `public/CNAME`; `astro.config.mjs` sets canonical URLs.

Source lives on `main`. GitHub Pages serves the built site from the root of `gh-pages`.
After committing and pushing source changes, publish with:

```sh
npm run deploy
```

This rebuilds and audits the site, then updates `gh-pages` without force-pushing. GitHub authentication and write access to this repository are required.

## Content

- Research stories: `src/data/papers.ts`
- Original figures, captions, and credits: `src/data/paper-figures.ts`
- Profile and research interests: `src/data/profile.ts`
- Homepage narrative: `src/data/story.ts`
- Public CV: `src/pages/cv.astro`

Only explicitly selected public assets belong in `public/`. Original personal documents and private manuscripts are not part of this repository. Paper figures retain their individual attribution and license notices on the website.

## Browser checks

With the local development server running:

```sh
npx playwright install chromium
npm test
```

Set `SITE_URL` to test another preview URL. On Windows the browser helper also supports installed Chrome and Edge.
