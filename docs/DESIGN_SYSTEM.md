# CUBBIE NFT MARKETPLACE — Design System

Tailwind CSS v4 utilities are configured through the CSS-first `@theme` block in `nft-market/src/index.css`. Shared Cubbie values live in `nft-market/src/styles/tokens.css`; prefer those values or theme utilities over new hard-coded values.

## Color
Palette: black, charcoal, lime, off-white. Lime marks one focus per screen. Warm and cool accents were removed.
| Role | Token | Value |
| --- | --- | --- |
| Background | `--color-bg` | #090a09 |
| Surface | `--color-surface` (`--color-bg-2`) | #111411 |
| Card | `--color-card` | #171b17 |
| Accent (lime) | `--color-accent` | #c4f56a |
| Text (off-white) | `--color-text` | #ecefe8 |
| Muted | `--color-muted` (`--color-text-2`) | #92998f |
| Border | `--color-border` | #292f28 |

Also: `--color-border-strong`, `--color-danger`, `--color-danger-text`, `--color-accent-soft`, `--color-overlay`, `--color-scrim`, `--color-void`.

## Typography
- **Archivo Variable** (`--font-display`, from `@fontsource-variable/archivo/wdth.css`): headings. The `.display` class sets weight 800, `font-stretch: 112%`, uppercase, tracking -0.035em, line-height 0.9.
- **Inter** (`--font-body`): body text, fields.
- **IBM Plex Mono** (`--font-mono`): labels, IDs, numbers. The `.kicker` class (mono, uppercase, wide tracking) also styles buttons and navigation links.
- Scale: `--text-xs` to `--text-5xl`. Display sizes: `--text-4xl` (section titles, 3.5rem) and `--text-5xl` (hero, 4.5rem). Responsive steps are set once in `tokens.css` at 820px and 560px, so page CSS never hard-codes a font size.
- Tailwind CSS v4 utilities: `text-t-xs` ... `text-t-5xl`, `font-d`, `font-b`, `font-m`, and palette utilities such as `bg-bg`, `text-acc`, `text-dim`, and `border-edge`.

## Breakpoints (CSS and Tailwind are aligned)
sm 560px, md 820px, lg 1100px. Use mobile-first.

## Spacing and layout
4px scale `--space-1` to `--space-9`, `--gutter`, `--section-y`, containers `--container-sm` to `--container-xl` (use `PageContainer`). Collectible artwork ratio: `--card-ratio` (4 / 5).

## Components (`src/components/ui`)
| Component | Notes |
| --- | --- |
| `Button` | variant `solid / ghost / quiet / danger`, size `sm / md / lg`, `icon`, `full`, `loading`; renders `<a>` when given `href` |
| `Input` | label, hint, error |
| `Select` | `options={[[value, label], ...]}` |
| `SearchField` | search input with clear button |
| `Backdrop` | atmosphere image behind a section (decorative, lazy by default) |
| `Card` | tone `card / surface`, `padded`, `interactive` |
| `Modal` | focus trap, Escape, scroll lock, focus restore |
| `Badge`, `Avatar`, `Divider`, `EmptyState`, `LoadingState`, `SectionHeading`, `Toast` | unchanged API |

## Layers
`--z-header` 20, `--z-modal` 50, `--z-toast` 60.

## Styling boundaries
- CSS layer order is `theme, base, components, utilities`. The reset sits in `@layer base`, so utilities always win. Unlayered CSS (the small `.hc-*` and `.v3-*` files) beats utilities; keep it to scoped class selectors only.
- Reusable controls, dialogs, navigation, and the Home layout use Tailwind utilities. `Gate.css` and the Tailwind v3 configuration have been removed.
- `index.css` retains the reset, token-backed document defaults, motion preferences, page/toast keyframes, and canvas layering. `tokens.css` remains the source of brand values.
- Page layouts, forms, cards, and modal styling use Tailwind utilities. The remaining `HeroCarousel.css` and `Viewer3D.css` are limited to composed 3D/carousel state and motion effects. Prefer Tailwind utilities for new or touched UI.
- The ambient particle canvas is decorative, pointer-transparent, and supports reduced motion.

## Collection vs Marketplace
The two pages share the same data but must look different:
- **Collection** is a gallery. `components/collection/GalleryCard`: large image, caption (code, series), name in display type, wishlist heart. No price, no buy button.
- **Marketplace** is a listings table. `components/marketplace/ListingRow`: small thumbnail, name and badges, price, Collect action. Column header on desktop, stacked rows on mobile.
- `ArtCard` stays for Home, My Cubbie and Create.

## Lime boxes
Primary actions and filters are solid lime boxes (`Button variant="solid"`, rarity filter, carousel arrows, the Market tag in the logo). Use them sparingly: one clear lime focus per area.
