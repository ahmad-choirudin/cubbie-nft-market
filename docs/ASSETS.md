# CUBBIE MARKET — Asset System

All artwork lives in `nft-market/src/assets/` and is imported by the code, so Vite hashes and bundles it. Format is WebP, except 3D models (`.glb`).

| Folder | Contents | Used by |
| --- | --- | --- |
| `characters/` | 24 full images, `cubbie-01.webp` to `cubbie-24.webp` (928x1152) | hero, character pages, modal |
| `characters/thumbs/` | same names, 464px wide | cards, lists, avatars |
| `backgrounds/` | wide atmosphere images (1376x768) | hero, bands, lore chapters |
| `environments/` | portal, pedestal, studio | final CTA, collector section, drop page |
| `banners/` | `genesis-drop.webp` | Home and The Drop |
| `lore/` | `the-beginning`, `lore-visual`, `ancient-artifact` | Lore page |
| `models/` | `cubbie-main.glb` | Phase 09 (not wired in yet) |

## Rules
- Lists and cards use `item.thumb`, detail views use `item.img`. Never load full images in a grid.
- Below the fold: `loading="lazy" decoding="async"`. The first visible image uses `fetchpriority="high"`.
- Always set `width` and `height` (or CSS `aspect-ratio`) so the layout does not jump.
- Keep original aspect ratios. Do not crop artwork to squares.
- Do not delete an old asset until the check below passes with its replacement.

## Adding or replacing a character image
1. Put `cubbie-NN.webp` in `characters/`.
2. Make thumbnails: `pip install pillow`, then `python3 scripts/make-thumbs.py` (from `nft-market`).
3. Add the character to `COLLECTION_001` in `src/data/cubbie.ts`.
4. Run `npm run check:assets`.

## Verifying references
`npm run check:assets` fails when code points to a file that does not exist or a character has no thumbnail. It warns about unused files and files over 300 KB (5 MB for models).
