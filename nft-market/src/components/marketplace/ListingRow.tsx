import { Eye, ShoppingBag } from "lucide-react";
import Badge from "../ui/Badge";
import type { Collectible } from "../../types";

// Marketplace listing: a row with the price and the Collect action up front.
// (The Collection page uses GalleryCard, which is image-first.)
export const LISTING_COLS = "grid-cols-[72px_minmax(0,1fr)] md:grid-cols-[88px_minmax(0,1fr)_150px_auto]";

interface ListingRowProps {
  item: Collectible;
  owned: boolean;
  onOpen: () => void;
  onCollect: () => void;
}

export default function ListingRow({ item, owned, onOpen, onCollect }: ListingRowProps) {
  const { name, code, series, rarity, soldOut, price } = item;
  const img = item.thumb || item.img;
  const top = rarity === "Epic" || rarity === "Legendary";

  return (
    <li className={`grid ${LISTING_COLS} items-center gap-x-4 gap-y-3 border-b border-edge py-4 md:gap-x-6`}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${name}`}
        className="row-span-2 block aspect-[var(--card-ratio)] w-full overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-art-stage)] p-0 md:row-span-1"
      >
        {img && <img src={img} alt="" width="464" height="576" loading="lazy" decoding="async" className="block h-full w-full object-cover" />}
      </button>

      <div className="min-w-0">
        <button
          type="button"
          onClick={onOpen}
          className="block max-w-full bg-transparent p-0 text-left font-d text-t-base font-semibold leading-[1.25] transition-colors hover:text-acc [overflow-wrap:anywhere]"
        >
          {name}
        </button>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {code && <span className="font-m text-[12px] text-dim">{code}</span>}
          {series && <Badge>{series}</Badge>}
          {rarity && <Badge tone={top ? "accent" : "neutral"}>{rarity}</Badge>}
          {soldOut && <Badge>Sold out</Badge>}
        </div>
      </div>

      <div className="col-start-2 flex items-center justify-between gap-3 md:contents">
        <div className="md:text-right">
          <small className="block text-t-xs text-dim">{owned ? "Owned" : "Demo price"}</small>
          {price != null ? (
            <b className="font-d text-t-lg font-semibold tabular-nums">
              {price} <span className="text-t-xs font-medium text-dim">ETH</span>
            </b>
          ) : (
            <span className="text-dim">-</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="inline-flex min-h-[var(--tap)] items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-strong bg-transparent px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg disabled:cursor-default disabled:opacity-45 max-[560px]:tracking-[0.08em]"
            onClick={onCollect}
            disabled={owned || !!soldOut}
          >
            <ShoppingBag size={13} aria-hidden="true" />
            {owned ? "Owned" : soldOut ? "Sold out" : "Collect"}
          </button>

          <button
            type="button"
            className="inline-flex min-h-[var(--tap)] items-center gap-1.5 bg-transparent px-2 text-sm text-dim transition-colors hover:text-ink"
            onClick={onOpen}
            aria-label={`View ${name}`}
          >
            <Eye size={14} aria-hidden="true" />
            <span className="hidden md:inline">View</span>
          </button>
        </div>
      </div>
    </li>
  );
}
