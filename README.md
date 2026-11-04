<div align="center">

# CUBBIE NFT MARKETPLACE

**Collect your universe.**

A collectible discovery site for the Cubbie characters, part of the Cubbie Universe.

[

![Cubbie World](https://img.shields.io/badge/Cubbie_World-cubbie.web.id-C4F56A?style=for-the-badge&labelColor=090A09)

](https://cubbie.web.id)
[

![X](https://img.shields.io/badge/X-@CubbieOG-090A09?style=for-the-badge&logo=x&logoColor=white)

](https://x.com/CubbieOG)

</div>

---

> **Preview content.** There is no marketplace contract. Collection actions, wishlists and creations are stored in your browser (localStorage); nothing is minted, bought or verified on-chain. Listings, owners, likes and prices are sample data.

---

## Project Overview

CUBBIE MARKET is the place to discover and collect the characters of the Cubbie Universe. **Cubbie World** ([cubbie.web.id](https://cubbie.web.id)) is where the universe begins. Cubbie Market is where its characters are displayed like designer toys in a gallery.

- **24 characters** in Collection 001, each with its own artwork and ID.
- **Browse freely.** No wallet is needed to explore, wishlist or save characters locally.
- **Optional wallet.** Connect an EVM wallet only if you want to see your address and balance.
- **Honest by design.** Local collection actions are not presented as blockchain transactions.

---

## Tech Stack & Tools



![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)




![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)




![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)




![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)




![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white)




![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-1A1A1A?style=flat-square&logo=react&logoColor=white)




![Ethers](https://img.shields.io/badge/ethers.js-2535A0?style=flat-square&logo=ethereum&logoColor=white)




![Lucide](https://img.shields.io/badge/Lucide_Icons-F56565?style=flat-square&logo=lucide&logoColor=white)



---

## Pages

| Page | Address | What it does |
| --- | --- | --- |
| **The Gate** | `#` | Home: hero, brand statement, featured characters, latest drop, the universe, collector experience |
| **The Collection** | `#the-collection` | Gallery of all 24 characters: image-first cards (`GalleryCard`), filters, search, sort and a persistent wishlist. No prices or buy buttons |
| **Marketplace** | `#marketplace` | Listings table (`ListingRow`): thumbnail, name, price and the Collect action in one row, with search and price sort |
| **Character Vault** | `#character/<slug>` | One page per character: artwork, attributes, collection info and wishlist |
| **The Drop** | `#the-drop` | Release presentation. The countdown shows only when a real date is set |
| **Lore** | `#lore` | Universe introduction, story chapters, collection origins and a link to Cubbie World |
| **My Cubbie** | `#my-cubbie` | Collector profile, local collection, wishlist, event archive and wallet status |
| **Create a Cubbie** | `#create` | Upload an image locally and add it to your browser collection |

---

## Featured Features

### 3D viewer
The Drop page shows an image first. Tapping **View in 3D** loads three.js and the Cubbie model on demand, in a separate chunk, so the rest of the site stays light. If WebGL is unavailable or loading fails, the image stays with a message. Auto-rotate is off when the visitor prefers reduced motion.

### Optional Web3
Any injected EVM wallet (MetaMask, Rabby, Coinbase Wallet and others) can connect through EIP-1193. `ethers` is loaded only when a wallet feature runs. The current UI does not submit marketplace transactions; collection and wishlist changes are stored in this browser.

### Honest data
No rarity, price, likes, owner or edition is ever invented. If a field is empty, it is not shown. Filters for series and rarity appear automatically once real data exists.

### Built for phones
A thoughtful mobile layout, touch-sized controls, lazy-loaded WebP artwork with thumbnails for grids, and `prefers-reduced-motion` support.

---

## Run Locally

```bash
cd nft-market
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check, then create the production bundle |
| `npm run preview` | Preview the production build |
| `npm run check:types` | Type-check only |
| `npm run check:assets` | Verify every asset reference and thumbnail |

---

## Configuration

Copy `nft-market/.env.example` to `.env`. All values are optional.

| Variable | Purpose |
| --- | --- |
| `VITE_CUBBIE_WORLD_URL` | Override the Cubbie World link (`https://` only). Default: `https://cubbie.web.id` |
| `VITE_CUBBIE_DROP_AT` | Real release time (ISO date). Leave empty to hide the countdown |
| `VITE_CUBBIE_CONTRACT` | Deployed contract address. Set only after a contract exists |
| `VITE_CUBBIE_CHAIN_ID` | Chain ID of that contract (for example `11155111` for Sepolia) |

---

## Deploy

**Vercel:** import the repository and set **Root Directory** to `nft-market`. `nft-market/vercel.json` sets the Vite build (`npm run build`, output `dist`). Routing is hash-based (`#marketplace`, `#character/<slug>`), so no rewrites are needed. Add the `VITE_*` variables above in the project settings if you use them.

**GitHub Pages:** build with `GITHUB_PAGES=1 npm run build` so assets load from `/cubbie-nft-market/`.

## Project Structure

```text
nft-market/src
├── pages/        One file per page (hash-based routes)
├── components/   layout, marketplace, three (3D) and ui
├── data/         cubbie.ts (Collection 001), lore.ts, ecosystem.ts, web3.ts
├── hooks/        wallet, hash routing, persistence, reveal, countdown
├── utils/        storage, ownership wording, web3, image helpers
├── styles/       tokens.css (design tokens), carousel and 3D viewer effects
└── assets/       characters, backgrounds, environments, lore, banners, models
```

---

## Design System

| Role | Value |
| --- | --- |
| Background | `#090A09` |
| Surface | `#111411` |
| Card | `#171B17` |
| Signature lime | `#C4F56A` |
| Text | `#ECEFE8` |
| Muted | `#92998F` |
| Border | `#292F28` |

Typography: **Archivo Variable** (stretched, uppercase) for headlines, **Inter** for body text, **IBM Plex Mono** for technical metadata.
All tokens live in `nft-market/src/styles/tokens.css`. See [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

---

## Adding Real Character Content

Edit `nft-market/src/data/cubbie.ts`. `createCubbie` accepts optional `series`, `rarity`, `description`, `lore`, `traits` and `edition`. Anything left out is not shown. To add artwork, see [`docs/ASSETS.md`](docs/ASSETS.md).

Story text lives in `nft-market/src/data/lore.ts` and is a draft until `LORE_IS_DRAFT` is set to `false`.

---

## Docs

- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md): colors, type, spacing and components
- [`docs/ASSETS.md`](docs/ASSETS.md): artwork folders and rules
- [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md): code structure and rules
- [`docs/3D_AND_WEB3.md`](docs/3D_AND_WEB3.md): the 3D viewer and wallet notes

---

<div align="center">

**One universe. Many characters. Infinite possibilities.**

Built by Ahmad Choirudin · [X / @CubbieOG](https://x.com/CubbieOG) · [Cubbie World](https://cubbie.web.id)

</div>
