# CUBBIE MARKET — Development Conventions

## Structure (`nft-market/src`)
- `pages/` one file per route (hash-based, see `hooks/useHashPage.ts`).
- `components/layout|marketplace|ui/` layout, domain components, small reusable UI.
- `data/` static data (`cubbie.ts` = Collection 001, `ecosystem.ts` = links).
- `hooks/` React hooks. `utils/` pure helpers. `styles/` CSS per area, `tokens.css` = design tokens.
- `assets/` backgrounds, banners, characters, environments, lore, models.

## Rules
1. Never invent likes, owners or edition numbers. Rarity, supply, price and sold-out flags are labeled sample placeholders in `data/cubbie.ts`. Empty means null, and null is not shown.
2. Local or simulated ownership must be identified as local, never as blockchain-verified.
3. Components: PascalCase `.tsx`, default export. Hooks start with `use` and use `.ts`. Utils are named exports.
4. Colors, fonts, spacing and breakpoints come from `styles/tokens.css` (see `docs/DESIGN_SYSTEM.md`). No new hard-coded hex values.
5. Images are WebP, lazy-loaded below the fold, with intrinsic width/height set.
6. localStorage keys live only in `utils/storage.ts` (`STORAGE_KEYS`).
7. No new dependency unless the phase needs it.
8. One phase at a time: verify (`npm run build`) before starting the next.
9. Item `category` (outfit style) is a working label based on how each character looks. Edit it in `data/cubbie.ts`; filters read whatever values exist.
10. Routes are hashes handled in `hooks/useHashPage.ts`. Add new pages there and in `App.tsx`.
11. Ownership wording lives in `utils/ownership.ts`. Always label collecting as local until real contract interactions are implemented.
12. Collector data (owned, wishlist, history, profile) lives in localStorage under `STORAGE_KEYS`.
13. Artwork rules and folders are in `docs/ASSETS.md`. Run `npm run check:assets` after touching images.
14. Story text lives in `src/data/lore.ts`. It is a draft until `LORE_IS_DRAFT` is set to false.
15. 3D and Web3 notes are in `docs/3D_AND_WEB3.md`. Keep three.js and ethers out of the main bundle (lazy or dynamic import only).
16. Global element resets live in `@layer base` (see `index.css`; layer order is theme, base, components, utilities). Never add unlayered element rules: they beat Tailwind utilities and break spacing and colors.
17. Titles use the `.display` class (Archivo 800, stretched, uppercase). Mono labels and buttons use `.kicker`. Do not re-create these styles with ad-hoc utilities.
18. Section backgrounds (`Backdrop`) are rare: only the hero, the drop and the closing band on Home. Atmosphere is the film grain in `index.css`; there is no particle canvas.
21. One catalog, shared with Cubbie World: when a character exists on both sites, its name, theme, series label and description come from Cubbie World. Story chapter 01 is the official text from Cubbie Story on Cubbie World.
