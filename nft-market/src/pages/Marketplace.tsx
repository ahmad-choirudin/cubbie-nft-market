import { useState } from "react";
import ListingRow, { LISTING_COLS } from "../components/marketplace/ListingRow";
import { filterItems } from "../utils/discover";
import SectionHeading from "../components/ui/SectionHeading";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import SearchField from "../components/ui/SearchField";
import Select from "../components/ui/Select";
import type { Collectible } from "../types";

type MarketplaceSort = "newest" | "low" | "high" | "liked";

type SortDefinition = {
  label: string;
  fn: (a: Collectible, b: Collectible) => number;
  needs?: "price" | "likes";
};

const SORTS: Record<MarketplaceSort, SortDefinition> = {
  newest: {
    label: "Newest",
    fn: (a, b) => b.id - a.id,
  },
  low: {
    label: "Price: low to high",
    fn: (a, b) => Number(a.price ?? 0) - Number(b.price ?? 0),
    needs: "price",
  },
  high: {
    label: "Price: high to low",
    fn: (a, b) => Number(b.price ?? 0) - Number(a.price ?? 0),
    needs: "price",
  },
  liked: {
    label: "Most liked",
    fn: (a, b) => (b.likes ?? 0) - (a.likes ?? 0),
    needs: "likes",
  },
};

interface MarketplaceProps {
  items: Collectible[];
  owned: number[];
  liked: number[];
  onOpen: (item: Collectible) => void;
  onBid: (item: Collectible) => void;
}

export default function Marketplace({
  items,
  owned,
  liked,
  onOpen,
  onBid,
}: MarketplaceProps) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<MarketplaceSort>("newest");
  const [creator, setCreator] = useState<string | null>(null);

  // Sample owner filters. Only items that have a sample owner are counted.
  const creators = Object.values(
    items.reduce<Record<string, { owner: string; count: number }>>(
      (acc, i) => {
        if (!i.owner) return acc;

        acc[i.owner] = acc[i.owner] || {
          owner: i.owner,
          count: 0,
        };

        acc[i.owner].count += 1;

        return acc;
      },
      {}
    )
  );

  // Price and likes sorts only appear when some item actually has that data.
  const sorts = (
    Object.entries(SORTS) as [MarketplaceSort, SortDefinition][]
  ).filter(
    ([, value]) =>
      !value.needs ||
      items.some((item) =>
        value.needs === "price"
          ? item.price != null
          : item.likes != null
      )
  );

  // Search, filter and sort.
  const shown = filterItems(items, { query: q })
    .filter((i) => !creator || i.owner === creator)
    .sort(SORTS[sort].fn);

  const reset = () => {
    setQ("");
    setCreator(null);
    setSort("newest");
  };

  return (
    <main className="mx-auto w-full max-w-[1320px] px-[clamp(16px,3vw,32px)] pb-24 pt-6 text-ink sm:pt-12">
      {/* MARKETPLACE */}
      <section>
        <SectionHeading
          title="Marketplace"
          aside={<>{shown.length} listings</>}
        />

        {/* SEARCH AND SORT */}
        <div className="mb-5 flex min-w-0 gap-2.5 max-[640px]:flex-col">
          <SearchField
            value={q}
            onChange={setQ}
            onClear={() => setQ("")}
            label="Search Cubbies"
            placeholder="Search by name or ID"
          />

          <Select
            label="Sort by"
            value={sort}
            onChange={(value) => setSort(value as MarketplaceSort)}
            options={sorts.map(([key, value]) => [key, value.label])}
          />
        </div>

        {/* CREATOR FILTER */}
        {creators.length > 0 && (
          <div
            className="mb-9 flex gap-7 overflow-x-auto px-0.5 pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Filter by sample owner"
          >
            <button
              type="button"
              className={`min-h-[var(--tap)] flex-none border-b py-2 font-b text-sm tracking-[0.02em] transition-colors ${!creator ? "border-acc text-ink" : "border-transparent text-dim hover:text-ink"}`}
              onClick={() => setCreator(null)}
              aria-pressed={!creator}
            >
              All
            </button>

            {creators.map((c) => (
              <button
                type="button"
                key={c.owner}
                className={`min-h-[var(--tap)] flex-none border-b py-2 font-b text-sm tracking-[0.02em] transition-colors ${creator === c.owner ? "border-acc text-ink" : "border-transparent text-dim hover:text-ink"}`}
                onClick={() =>
                  setCreator(creator === c.owner ? null : c.owner)
                }
                aria-pressed={creator === c.owner}
              >
                {c.owner}
                <small className="ml-1.5 inline font-m text-t-xs text-current opacity-60">{c.count}</small>
              </button>
            ))}
          </div>
        )}

        {/* LISTINGS */}
        {shown.length === 0 ? (
          <EmptyState
            title="No Cubbies match your search."
            description="Try a different name or clear the filters."
          >
            <Button variant="ghost" onClick={reset}>
              Clear filters
            </Button>
          </EmptyState>
        ) : (
          <div>
            <div
              className={`hidden md:grid ${LISTING_COLS} gap-x-6 border-b border-edge pb-2 font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim`}
              aria-hidden="true"
            >
              <span className="col-span-2">Item</span>
              <span className="text-right">Price</span>
              <span className="text-right">Action</span>
            </div>

            <ul className="m-0 list-none border-t border-edge p-0 md:border-t-0">
              {shown.map((i) => (
                <ListingRow
                  key={i.id}
                  item={i}
                  owned={owned.includes(i.id)}
                  onOpen={() => onOpen(i)}
                  onCollect={() => onBid(i)}
                />
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* CREATE CTA */}
      <section className="mt-[var(--section-y)] flex flex-wrap items-end justify-between gap-7 border-t border-edge pt-10">
        <div>
          <h2 className="display mb-3 border-0 p-0 text-t-3xl max-[560px]:text-t-2xl">Make your own.</h2>

          <p className="m-0 text-[15px] text-dim">
            Upload an image, give it a name and a demo price. It stays in your browser.
          </p>
        </div>

        <a className="inline-flex min-h-[var(--tap)] items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] border border-acc bg-acc px-6 font-d text-t-sm font-semibold tracking-[0.04em] text-bg transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent)_82%,var(--color-text))]" href="#create">
          Create a Cubbie
        </a>
      </section>
    </main>
  );
}
