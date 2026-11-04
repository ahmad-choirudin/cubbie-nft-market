import { Heart } from "lucide-react";
import type { CollectibleCardItem } from "../../types";

// Collection page card: a gallery piece. Image first, a small caption, no price and no
// buy button. (The Marketplace uses ListingRow, which is price-first.)
interface GalleryCardProps {
  item: CollectibleCardItem;
  favorite?: boolean;
  onToggleFavorite?: (() => void) | null;
  onOpen?: () => void;
}

export default function GalleryCard({ item, favorite = false, onToggleFavorite = null, onOpen }: GalleryCardProps) {
  const { name, code, series, category } = item;
  const img = item.thumb || item.img;
  const tag = series || category;
  const caption = code || tag;

  return (
    <article className="group relative min-w-0">
      <button type="button" onClick={onOpen} aria-label={`Open ${name}`} className="block w-full bg-transparent p-0 text-left">
        <span className="relative block aspect-[var(--card-ratio)] overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-art-stage)] after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(70%_38%_at_50%_100%,color-mix(in_srgb,var(--color-accent)_26%,transparent),transparent_72%)] after:opacity-50 after:transition-opacity after:duration-[var(--dur-base)] after:content-[''] group-hover:after:opacity-100">
          {img && (
            <img
              src={img}
              alt=""
              width="464"
              height="576"
              loading="lazy"
              decoding="async"
              className="block h-full w-full object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease)] group-hover:scale-[1.03]"
            />
          )}
        </span>

        {/* Code and style sit on two fixed lines on phones, so card titles line up across a row. */}
        {caption && (
          <span className="kicker mt-3 flex min-w-0 flex-col text-dim sm:flex-row sm:gap-2">
            {code && <span className="truncate">{code}</span>}
            {code && tag && <span className="hidden sm:inline" aria-hidden="true">·</span>}
            {tag && <span className="truncate">{tag}</span>}
          </span>
        )}

        <span className="display mt-1.5 block min-h-[2.1em] text-t-base leading-[1.05] [overflow-wrap:anywhere]">{name}</span>
      </button>

      {onToggleFavorite && (
        <button
          type="button"
          className={`absolute right-0 top-0 z-[1] grid size-[var(--tap)] place-items-center bg-transparent transition-colors before:absolute before:size-8 before:rounded-full before:border before:border-strong before:bg-[var(--color-overlay)] before:transition-colors before:content-[''] hover:before:border-ink [&_svg]:relative ${favorite ? "text-acc before:border-acc" : "text-ink"}`}
          aria-pressed={favorite}
          aria-label={favorite ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          onClick={onToggleFavorite}
        >
          <Heart size={16} fill={favorite ? "currentColor" : "none"} />
        </button>
      )}
    </article>
  );
}
