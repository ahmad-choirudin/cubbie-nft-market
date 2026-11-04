
import type { Collectible } from "../types";

export type DiscoverySort = "default" | "az" | "za";

export const SORTS = {
  default: { label: "Default", fn: (a, b) => a.id - b.id },
  az: { label: "Name A–Z", fn: (a, b) => a.name.localeCompare(b.name) },
  za: { label: "Name Z–A", fn: (a, b) => b.name.localeCompare(a.name) },
} satisfies Record<
  DiscoverySort,
  { label: string; fn: (a: Collectible, b: Collectible) => number }
>;

const NUMBER_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen", "Twenty", "Twenty-one", "Twenty-two",
  "Twenty-three", "Twenty-four",
];

export const countWord = (n: number) => NUMBER_WORDS[n] ?? String(n);

const norm = (s: string) =>
  String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

// Traits may be plain strings or { label | trait_type | name, value } objects.
export function formatTrait(t: unknown): string | null {
  if (typeof t === "string") return t;
  if (!t || typeof t !== "object") return null;

  const trait = t as {
    label?: unknown;
    trait_type?: unknown;
    name?: unknown;
    value?: unknown;
  };

  const label = trait.label ?? trait.trait_type ?? trait.name;

  if (trait.value != null && label) return `${label}: ${trait.value}`;
  if (trait.value != null) return String(trait.value);

  return label ? String(label) : null;
}

// Label/value rows for the details panels. Empty values are left out.
export function itemFacts(
  item: Collectible
): [string, string | number | null | undefined][] {
  const supply = item.edition?.supply;
  const hasNumber = item.edition?.number != null;

  const edition =
    hasNumber && supply != null
      ? `${item.edition!.number} / ${supply}`
      : null;

  const facts: [string, string | number | null | undefined][] = [
    ["ID", item.code],
    ["Style", item.category],
    ["Series", item.series],
    ["Rarity", item.rarity],
    ["Edition", edition],
    ["Supply", !hasNumber && supply != null ? `${supply} pieces` : null],
  ];

  return facts.filter(([, value]) => value);
}

export const traitList = (item: Collectible): string[] =>
  (Array.isArray(item.traits) ? item.traits : [])
    .map(formatTrait)
    .filter((trait): trait is string => trait !== null);

function searchText(item: Collectible) {
  return norm(
    [
      item.name,
      item.code,
      item.slug && item.slug.replace(/-/g, " "),
      item.category,
      item.series,
      item.rarity,
      item.description,
      ...traitList(item),
    ]
      .filter(Boolean)
      .join(" ")
  );
}

// Search, filters and sorting all apply together (logical AND).
export interface FilterState {
  query?: string;
  category?: string;
  series?: string;
  rarity?: string;
  savedOnly?: boolean;
  sort?: DiscoverySort;
}

export function filterItems<T extends Collectible>(
  items: T[],
  state: FilterState,
  ctx: { liked?: number[] } = {}
): T[] {
  const {
    query = "",
    category = "all",
    series = "all",
    rarity = "all",
    savedOnly = false,
    sort = "default",
  } = state;

  const { liked = [] } = ctx;
  const tokens = norm(query).split(/\s+/).filter(Boolean);

  const out = items.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (series !== "all" && item.series !== series) return false;
    if (rarity !== "all" && item.rarity !== rarity) return false;
    if (savedOnly && !liked.includes(item.id)) return false;

    if (tokens.length) {
      const hay = searchText(item);
      if (!tokens.every((t) => hay.includes(t))) return false;
    }

    return true;
  });

  return out.sort((SORTS[sort] || SORTS.default).fn);
}
