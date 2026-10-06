# Creami Club

A responsive Ninja Creami recipe library built with React, TypeScript, and Vite. Includes 50 ingredient-based sample recipes, local food imagery, instant text/nutrition search, combined filters, category collections, and recipe customisation.

## Run locally

Use Node.js 22 or newer (verified with Node 24) and npm.

```sh
cd /workspace/Creami
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev
```

The development server listens on port 3000. No environment variables, API keys, database, or account are required. Food imagery and fonts are bundled locally. `npm run build` produces the deployable `dist/` directory; `npm run preview` serves the production build.

## Validation

```sh
npm test
npm run build
```

Tests cover recipe completeness, calculated nutrition, protein targets, natural-language nutrient queries, ingredient search, and combined filters. Browser validation also covers save/reload, ratings, ingredient scaling, substitutions, navigation, and responsive layouts.

## Architecture

- `src/data/recipes.ts`: structured recipes and generic ingredient composition estimates. Replace this data boundary with an API when needed.
- `src/lib/search.ts`: text aliases, natural-language nutrition constraints, and combined filters.
- `src/App.tsx`: discovery, category browsing, saved collection, recipe cards, and the first-pint guide.
- `src/components/RecipeDetail.tsx`: accessible recipe dialog, quantities, substitutions, ingredient checklist, personal ratings, and made markers.
- `public/images/`: locally bundled generated food photography; provenance in `image-credits.md`.

Nutrition is approximate, derived from generic food-composition estimates for the listed ingredient amounts, and shown per full standard pint. Brand differences, re-spin liquid, and substitutions can change totals. Swapping ingredients shows a note that the original nutrition remains. Recipe ratings are sample starting values; each person's rating, saved recipes, and made markers are stored on their device in localStorage. This is independent recipe inspiration, not affiliated with Ninja. Always follow the manual and fill line for your particular machine.

Each cloud task already runs in an isolated environment. Use the existing checkout; do not create a worktree unless explicitly requested.
