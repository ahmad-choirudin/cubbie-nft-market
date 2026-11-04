import { useId } from "react";
import { Heart, Check } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { itemFacts, traitList } from "../../utils/discover";
import type { Collectible } from "../../types";

interface ArtworkModalProps {
  item: Collectible;
  owned: number[];
  liked: number[];
  onClose: () => void;
  onBuy: (item: Collectible) => void;
  onToggleLike: (id: number) => void;
  mode?: "market" | "discover";
}

// mode "market"   -> demo price, buy and like
// mode "discover" -> browsing only: metadata and wishlist, no price or buy
export default function ArtworkModal({
  item,
  owned,
  liked,
  onClose,
  onBuy,
  onToggleLike,
  mode = "market",
}: ArtworkModalProps) {
  const titleId = useId();

  const discover = mode === "discover";
  const isLiked = liked.includes(item.id);
  const traits = traitList(item);
  const facts = itemFacts(item);

  return (
    <Modal
      key={item.id}
      onClose={onClose}
      labelledBy={titleId}
      className="split"
    >
      <img
        className="block h-auto max-h-[46dvh] w-full aspect-square rounded-t-[var(--radius-lg)] bg-[var(--color-void)] object-contain p-3 md:h-full md:min-h-[360px] md:max-h-none md:rounded-l-[var(--radius-lg)] md:rounded-tr-none md:object-cover md:p-0"
        src={item.img || item.poster || ""}
        alt={item.name}
      />

      <div className="min-w-0 self-center p-[clamp(20px,3vw,36px)]">
        <small className="font-m text-t-xs font-medium tracking-[0.14em] text-dim">
          {discover
            ? "CUBBIE MARKET / COLLECTION 001"
            : "CUBBIE MARKET / DEMO LISTING"}
        </small>

        <h3 id={titleId} className="mt-2 font-d text-t-2xl font-bold leading-[1.05]">{item.name}</h3>

        {item.description && (
          <p className="mt-3 text-base leading-relaxed text-dim">{item.description}</p>
        )}

        {facts.length > 0 && (
          <dl className="mt-6 border-t border-edge">
            {facts.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-edge py-3 text-sm">
                <dt className="text-dim">{k}</dt>
                <dd className="m-0 text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        {traits.length > 0 && (
          <ul className="mt-4 flex list-none flex-wrap gap-2 p-0" aria-label="Traits">
            {traits.map((t) => (
              <li key={t} className="rounded-full border border-strong px-3 py-1 text-sm">{t}</li>
            ))}
          </ul>
        )}

        {!discover && item.owner && (
          <p className="mt-4 text-sm leading-relaxed text-dim">
            Sample owner: {item.owner}
          </p>
        )}

        {!discover && item.price != null && (
          <div className="mt-6 font-d text-t-2xl font-semibold">
            {item.price}
            <span className="text-base text-dim"> ETH</span>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2.5">
          {!discover && (owned.includes(item.id) ? (
            <Button variant="ghost" disabled>
              <Check size={14} />
              Demo collected
            </Button>
          ) : (
            <Button
              onClick={() => onBuy(item)}
              disabled={item.soldOut}
            >
              {item.soldOut
                ? "Sold out (demo)"
                : "Collect (demo)"}
            </Button>
          ))}

          <Button
            variant="ghost"
            aria-pressed={isLiked}
            onClick={() => onToggleLike(item.id)}
          >
            <Heart
              size={14}
              fill={isLiked ? "currentColor" : "none"}
            />
            {discover
              ? isLiked
                ? "In your wishlist"
                : "Add to wishlist"
              : isLiked
                ? "Liked"
                : "Like"}
          </Button>
        </div>

        {item.slug && !item.mine && (
          <a
            href={`#character/${item.slug}`}
            onClick={() => onClose()}
            className="mt-4 inline-block text-acc underline underline-offset-4"
          >
            Open the full character page
          </a>
        )}

        <p className="mt-4 text-sm leading-relaxed text-dim">
          Demo: saved in this browser only.
        </p>
      </div>
    </Modal>
  );
}
