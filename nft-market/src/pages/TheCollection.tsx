import { useMemo, useState } from "react";
import { Heart, RotateCcw } from "lucide-react";
import GalleryCard from "../components/collection/GalleryCard";
import Divider from "../components/ui/Divider";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import SearchField from "../components/ui/SearchField";
import Select from "../components/ui/Select";
import Backdrop from "../components/ui/Backdrop";
import theVoid from "../assets/backgrounds/the-void.webp";
import { SORTS, countWord, filterItems } from "../utils/discover";
import type { CatalogItem } from "../types";
import type { DiscoverySort } from "../utils/discover";

// Rarity filter: lime boxes. The pips show how rare the tier is (1 to 5).
const RARITY_ORDER = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
const tier = (name: string) => RARITY_ORDER.indexOf(name);

function RarityFilter({ value, onChange, options, total }: {
  value: string;
  onChange: (value: string) => void;
  options: { name: string; count: number }[];
  total: number;
}) {
  if (!options.length) return null;

  const sorted = [...options].sort((a, b) => (tier(a.name) + 99) % 99 - (tier(b.name) + 99) % 99);

  const box = (active: boolean) =>
    `inline-flex min-h-[var(--tap)] items-center gap-2.5 rounded-[var(--radius-sm)] border px-4 kicker leading-none transition-colors ${
      active ? "border-acc bg-acc text-bg" : "border-strong bg-transparent text-dim hover:border-acc hover:text-ink"
    }`;

  return (
    <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by rarity">
      <button type="button" className={box(value === "all")} aria-pressed={value === "all"} onClick={() => onChange("all")}>
        All
        <small className="font-m text-t-xs font-medium opacity-70">{total}</small>
      </button>

      {sorted.map((o) => {
        const active = value === o.name;
        const pips = tier(o.name) + 1;

        return (
          <button
            key={o.name}
            type="button"
            className={box(active)}
            aria-pressed={active}
            onClick={() => onChange(active ? "all" : o.name)}
          >
            {pips > 0 && (
              <span className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: pips }).map((_, i) => (
                  <span key={i} className="size-1.5 bg-current" />
                ))}
              </span>
            )}
            {o.name}
            <small className="font-m text-t-xs font-medium opacity-70">{o.count}</small>
          </button>
        );
      })}
    </div>
  );
}

// Counts per value of a field, in order of first appearance. Empty values are skipped.
const facet = (items: CatalogItem[], field: "rarity") => {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    const value = item[field];
    if (value) counts.set(value, (counts.get(value) || 0) + 1);
  });
  return [...counts].map(([name, count]) => ({ name, count }));
};

export default function TheCollection({ items, liked = [], onOpen, onToggleLike }: {
  items: CatalogItem[];
  liked?: number[];
  onOpen?: (item: CatalogItem) => void;
  onToggleLike?: (id: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<DiscoverySort>("default");
  const [rarity, setRarity] = useState("all");
  const [savedOnly, setSavedOnly] = useState(false);

  // Only offer filters that the real data can answer.
  const rarities = useMemo(() => facet(items, "rarity"), [items]);

  const savedCount = items.filter((i) => liked.includes(i.id)).length;
  const onChain = items.some((i) => i.blockchain?.enabled);

  const shown = useMemo(
    () => filterItems(items, { query, rarity, savedOnly, sort }, { liked }),
    [items, query, rarity, savedOnly, sort, liked]
  );

  const dirty =
    query.trim() !== "" || rarity !== "all" || savedOnly || sort !== "default";

  const reset = () => {
    setQuery("");
    setSort("default");
    setRarity("all");
    setSavedOnly(false);
  };

  const total = items.length;
  const countText =
    shown.length === total
      ? `${shown.length} ${shown.length === 1 ? "Cubbie" : "Cubbies"}`
      : `${shown.length} of ${total} Cubbies`;

  const noSavedYet = savedOnly && savedCount === 0 && !query.trim() && rarity === "all";

  return (
    <main className="mx-auto w-full max-w-[1320px] px-[clamp(16px,3vw,32px)] pb-24 pt-6 text-ink sm:pt-10">
      {/* INTRODUCTION */}
      <header className="relative isolate" aria-labelledby="co-title">
        <Backdrop src={theVoid} opacity={0.4} fit="50% 40%" className="!inset-[-24px_-16px_-8px] opacity-80 [-webkit-mask-image:linear-gradient(110deg,#000_0%,transparent_88%)] [mask-image:linear-gradient(110deg,#000_0%,transparent_88%)]" />
        <p className="mb-[clamp(20px,3vw,36px)] font-m text-t-xs font-medium leading-[1.4] tracking-[var(--tracking-wide)] text-dim">CUBBIE MARKET / COLLECTION 001</p>

        <div className="grid gap-[clamp(24px,4vw,40px)] md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
          <h1 id="co-title" className="display max-w-[12ch] text-t-5xl text-ink">
            <span>Find your</span> <span>Cubbie.</span>
          </h1>

          <div className="max-w-[46ch] text-base leading-[var(--leading-body)] text-dim">
            <p className="mb-3 text-t-lg leading-[1.45] text-ink">
              {countWord(total)} identities. One universe. Discover the characters that define the Cubbie world.
            </p>
            <p>
              Explore the characters, discover their identities, and find the pieces that belong in your universe.
            </p>
          </div>
        </div>

        <div className="relative mt-[clamp(32px,5vw,56px)] before:absolute before:left-0 before:top-[-1px] before:h-[3px] before:w-16 before:bg-acc" aria-hidden="true">
          <Divider />
        </div>

        <dl className="grid grid-cols-3">
          {[
            ["Characters", total],
            ["In wishlist", savedCount],
            ["Status", onChain ? "On-chain" : "Demo, not minted"],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 border-b border-edge py-4 pr-4 sm:border-b-0 sm:border-l sm:pl-4 first:sm:border-l-0 first:sm:pl-0">
              <dt className="text-t-xs tracking-[0.04em] text-dim">{label}</dt>
              <dd className={`mt-1 font-d font-medium leading-[1.15] tabular-nums ${label === "Status" ? "text-base sm:text-t-lg" : "text-base sm:text-t-xl"}`}>{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* SEARCH, FILTER, SORT */}
      <section className="mt-[clamp(32px,5vw,56px)]" aria-label="Search and filter the collection">
        <div className="mb-3 flex min-w-0 gap-2.5 max-[640px]:flex-col">
          <SearchField
            value={query}
            onChange={setQuery}
            onClear={() => setQuery("")}
            label="Search the collection"
            placeholder="Search by name or ID"
          />

          <Select
            className="md:!max-w-[220px]"
            label="Sort by"
            value={sort}
            onChange={(value) => setSort(value as DiscoverySort)}
            options={Object.entries(SORTS).map(([key, value]) => [key, value.label] as [string, string])}
          />
        </div>

        <RarityFilter value={rarity} onChange={setRarity} options={rarities} total={total} />

        <div className="my-2 mb-5 flex flex-wrap items-center justify-between gap-3 border-t border-edge pt-3">
          <p className="font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim" role="status" aria-live="polite">
            {countText}
          </p>

          <div className="flex gap-2 max-[560px]:w-full">
            <button
              type="button"
              className={`inline-flex min-h-[var(--tap)] items-center gap-2 rounded-full border px-4 font-b text-sm text-ink transition-colors disabled:cursor-default disabled:opacity-40 hover:border-ink max-[560px]:flex-1 max-[560px]:justify-center ${savedOnly ? "border-acc bg-[var(--color-accent-soft)] text-acc" : "border-strong bg-transparent"}`}
              aria-pressed={savedOnly}
              onClick={() => setSavedOnly((v) => !v)}
            >
              <Heart size={14} fill={savedOnly ? "currentColor" : "none"} aria-hidden="true" />
              Wishlist
              <b className="font-m text-t-xs font-medium text-dim">{savedCount}</b>
            </button>

            <button type="button" className="inline-flex min-h-[var(--tap)] items-center gap-2 rounded-full border border-strong bg-transparent px-4 font-b text-sm text-ink transition-colors hover:border-ink disabled:cursor-default disabled:opacity-40 max-[560px]:flex-1 max-[560px]:justify-center" onClick={reset} disabled={!dirty}>
              <RotateCcw size={13} aria-hidden="true" />
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* GRID */}
      {shown.length === 0 ? (
        noSavedYet ? (
          <EmptyState
            title="Your wishlist is empty."
            description="Tap the heart on any Cubbie to keep it here. Your wishlist is saved in this browser."
          >
            <Button variant="ghost" onClick={() => setSavedOnly(false)}>
              Browse all Cubbies
            </Button>
          </EmptyState>
        ) : (
          <EmptyState
            title="No Cubbies match."
            description="Try another name or ID, or clear the filters to see the full collection."
          >
            <Button variant="ghost" onClick={reset}>
              Reset filters
            </Button>
          </EmptyState>
        )
      ) : (
        <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-9 p-0 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {shown.map((item) => (
            <li key={item.id} className="min-w-0">
              <GalleryCard
                item={item}
                favorite={liked.includes(item.id)}
                onToggleFavorite={() => onToggleLike?.(item.id)}
                onOpen={() => onOpen?.(item)}
              />
            </li>
          ))}
        </ul>
      )}

      <p className="mt-7 max-w-[60ch] text-sm leading-relaxed text-dim">
        Wishlist and demo ownership are stored locally in this browser. Nothing here is minted or verified on a
        blockchain.
      </p>
    </main>
  );
}
