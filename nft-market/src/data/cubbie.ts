import { slugify } from "../utils/format";
import genesisDrop from "../assets/banners/genesis-drop.webp";
import type { CatalogItem, Edition, Trait } from "../types";

// Character artwork. Full size is for detail pages and the hero; thumbs
// (464px wide) are for cards and lists. See docs/ASSETS.md.
const ART = import.meta.glob<string>("../assets/characters/cubbie-*.webp", { eager: true, import: "default" });
const THUMBS = import.meta.glob<string>("../assets/characters/thumbs/cubbie-*.webp", { eager: true, import: "default" });

const nn = (id: number) => String(id).padStart(2, "0");

// Collection 001: [id, name, outfit style].
// Official names: ids 17 to 24 are the same characters as the Cubbie World
// collection (skater, fighter, web3, ai-trainer, coder, mechanic, athlete, dj),
// so they use the World names and the details in WORLD_PIECES below.
// Names for ids 1 to 16 are still working labels taken from each outfit. Edit them
// freely. To add real character content, pass series, rarity, description,
// lore, traits or edition to createCubbie. Anything left out stays null and is
// simply not shown.
const COLLECTION_001: [number, string, string][] = [
  [1, "Vanguard", "Tactical"],
  [2, "Drifter", "Streetwear"],
  [3, "Warden", "Tactical"],
  [4, "Scout", "Tactical"],
  [5, "Sentinel", "Tactical"],
  [6, "Nomad", "Streetwear"],
  [7, "Aviator", "Streetwear"],
  [8, "Ranger", "Tactical"],
  [9, "Exo", "Armor"],
  [10, "Envoy", "Formal"],
  [11, "Noir", "Formal"],
  [12, "Spark", "Streetwear"],
  [13, "Frost", "Streetwear"],
  [14, "Phantom", "Formal"],
  [15, "Captain", "Tactical"],
  [16, "Paladin", "Armor"],
  [17, "Skater", "Creative"],
  [18, "Fighter", "Sport"],
  [19, "Web3", "Tech"],
  [20, "AI Trainer", "Tech"],
  [21, "Coder", "Tech"],
  [22, "Mechanic", "Tactical"],
  [23, "Athlete", "Sport"],
  [24, "DJ", "Creative"],
];

// Details from the Cubbie World collection (same art, same characters).
// theme = what the Cubbie is about, series = World's collection label
// (Original, Cyberpunk or Limited Edition). Keep in sync with Cubbie World.
const WORLD_PIECES: Record<number, { theme: string; series: string; description: string }> = {
  17: { theme: "Street Culture", series: "Original", description: "No rules, just creativity. A streetwear-inspired CUBBIE made for the ride." },
  18: { theme: "Martial Arts", series: "Original", description: "Discipline, strength, and determination. A little warrior with an unstoppable spirit." },
  19: { theme: "Blockchain", series: "Cyberpunk", description: "Exploring decentralized worlds, blockchain technology, and the future of Web3." },
  20: { theme: "Artificial Intelligence", series: "Cyberpunk", description: "Teaching machines to think smarter through data, language, and human intelligence." },
  21: { theme: "Programming", series: "Cyberpunk", description: "Turning ideas into code, one line at a time. Built for the digital world." },
  22: { theme: "Automotive", series: "Original", description: "Built to fix, driven to create. A tribute to mechanical skills and automotive passion." },
  23: { theme: "Fitness", series: "Original", description: "Strength comes from consistency. A fitness-inspired collectible built for progress." },
  24: { theme: "Music", series: "Original", description: "The rhythm never stops. CUBBIE brings music to life with futuristic headphones and DJ energy." },
};

// SAMPLE PLACEHOLDERS: rarity, supply, price, detail trait and sold-out flags
// below are sample values until the collection is finalized. Edit or delete any
// row; whatever is left out is not shown. Likes, owners and edition numbers are
// never invented.
type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

const TIERS: Record<Rarity, { supply: number; price: number }> = {
  Common: { supply: 1000, price: 0.015 },
  Uncommon: { supply: 500, price: 0.03 },
  Rare: { supply: 250, price: 0.06 },
  Epic: { supply: 100, price: 0.12 },
  Legendary: { supply: 25, price: 0.25 },
};

// id -> [rarity, detail trait, sold out (demo)]
const PLACEHOLDER: Record<number, [Rarity, string, boolean?]> = {
  1: ["Common", "Utility vest"],
  2: ["Common", "Neon-sole sneakers"],
  3: ["Rare", "Field coat", true],
  4: ["Common", "Zip jacket"],
  5: ["Uncommon", "Cargo jacket"],
  6: ["Common", "Pullover hoodie"],
  7: ["Uncommon", "Bomber jacket"],
  8: ["Common", "Combat vest"],
  9: ["Legendary", "Exo armor"],
  10: ["Uncommon", "Tailored suit"],
  11: ["Uncommon", "Leather jacket"],
  12: ["Common", "Lime belt"],
  13: ["Common", "Puffer jacket"],
  14: ["Rare", "Long coat", true],
  15: ["Uncommon", "Command jacket"],
  16: ["Epic", "Plated armor"],
  17: ["Rare", "Skateboard"],
  18: ["Rare", "Martial belt"],
  19: ["Epic", "Holo interface"],
  20: ["Legendary", "Holo panels and drone"],
  21: ["Epic", "Laptop rig"],
  22: ["Uncommon", "Work uniform", true],
  23: ["Rare", "Training gear"],
  24: ["Epic", "DJ headphones"],
};

interface CreateCubbieOptions {
  id: number;
  name: string;
  poster: string;
  thumb?: string | null;
  category?: string | null;
  price?: number | null;
  likes?: number | null;
  owner?: string | null;
  series?: string | null;
  rarity?: string | null;
  description?: string | null;
  lore?: string | null;
  traits?: Trait[];
  edition?: Edition;
  soldOut?: boolean;
}

function createCubbie({
  id,
  name,
  poster,
  thumb = null,
  category = null,
  price = null,
  likes = null,
  owner = null,
  series = null,
  rarity = null,
  description = null,
  lore = null,
  traits = [],
  edition = { number: null, supply: null },
  soldOut = false,
}: CreateCubbieOptions): CatalogItem {
  return {
    id,
    code: `CB-${String(id).padStart(3, "0")}`,
    slug: slugify(name),
    name,
    category,
    series,
    rarity,
    description,
    lore,
    poster,
    img: poster,
    thumb,
    glb: null,
    traits,
    edition,
    blockchain: {
      enabled: false,
      chainId: null,
      contractAddress: null,
      tokenId: null,
    },
    price,
    likes,
    owner,
    soldOut,
  };
}

export const ITEMS: CatalogItem[] = COLLECTION_001.map(([id, name, category]) => {
  const ph = PLACEHOLDER[id];
  const tier = ph ? TIERS[ph[0]] : null;
  const wp = WORLD_PIECES[id];

  return createCubbie({
    id,
    name: `Cubbie ${name}`,
    category,
    series: wp?.series ?? null,
    description: wp?.description ?? null,
    poster: ART[`../assets/characters/cubbie-${nn(id)}.webp`],
    thumb: THUMBS[`../assets/characters/thumbs/cubbie-${nn(id)}.webp`],
    rarity: ph?.[0] ?? null,
    price: tier?.price ?? null,
    edition: { number: null, supply: tier?.supply ?? null },
    traits: [
      { trait_type: "Outfit", value: category },
      ...(wp ? [{ trait_type: "Theme", value: wp.theme }] : []),
      ...(ph ? [{ trait_type: "Detail", value: ph[1] }] : []),
    ],
    soldOut: ph?.[2] ?? false,
  });
});

// The drop shown on the Home page. The title comes from the banner file name.
export const DROP = { title: "Genesis Drop", code: "Collection 001", banner: genesisDrop };

// Real release time of the drop, as a ms timestamp, or null when none is set.
// Set VITE_CUBBIE_DROP_AT to an ISO date (e.g. 2026-12-01T12:00:00Z).
// Without it, no countdown is shown, so no time is ever invented.
const dropAt = Date.parse(import.meta.env.VITE_CUBBIE_DROP_AT ?? "");
export const RELEASE_AT = Number.isFinite(dropAt) ? dropAt : null;
