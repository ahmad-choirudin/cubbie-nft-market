import { Heart } from "lucide-react";
import Avatar from "../ui/Avatar";
import Card from "../ui/Card";
import CollectibleMetadata from "./CollectibleMetadata";
import type { KeyboardEvent, ReactNode } from "react";
import type { CollectibleCardItem } from "../../types";

interface ArtCardProps {
  item: CollectibleCardItem;
  onOpen?: () => void;
  likes?: number | null;
  liked?: boolean;
  time?: string | null;
  priceLabel?: string;
  hideMeta?: boolean;
  favorite?: boolean;
  onToggleFavorite?: (() => void) | null;
  className?: string;
  featured?: boolean;
  children?: ReactNode;
}

export default function ArtCard({
  item,
  onOpen,
  likes = null,
  liked = false,
  time = null,
  priceLabel = "Demo price",
  hideMeta = false,
  favorite = false,
  onToggleFavorite = null,
  className = "",
  featured = false,
  children,
}: ArtCardProps) {
  const { name, owner, price } = item;
  const img = item.thumb || item.img; // cards show the small version

  // When the card has its own action buttons (children), the artwork is a
  // mouse shortcut only, so keyboard users do not tab through it twice.
  const open = onOpen
    ? {
        onClick: onOpen,
        ...(children
          ? {}
          : {
              onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen();
                }
              },
              role: "button",
              tabIndex: 0,
              "aria-label": `Open ${name}`,
            }),
      }
    : {};

  const shot = (
    <div className="relative aspect-[var(--card-ratio)] cursor-pointer overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-art-stage)] after:absolute after:inset-0 after:pointer-events-none after:bg-[radial-gradient(70%_38%_at_50%_100%,color-mix(in_srgb,var(--color-accent)_26%,transparent),transparent_72%)] after:opacity-[0.55] after:transition-opacity after:duration-[var(--dur-base)] after:content-[''] group-hover:after:opacity-100 [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-[var(--dur-slow)] [&_img]:ease-[var(--ease)] group-hover:[&_img]:scale-[1.03]" {...open}>
      {img ? <img src={img} alt={name} width="464" height="576" loading="lazy" decoding="async" /> : <div className="h-full w-full bg-[var(--color-void)]" />}
      {likes !== null && (
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-[var(--color-overlay)] px-[9px] py-[3px] font-m text-t-xs font-medium tabular-nums text-ink">
          <Heart size={11} fill={liked ? "currentColor" : "none"} aria-hidden="true" /> {likes}
        </span>
      )}
      {time && <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-[var(--color-overlay)] px-[9px] py-[3px] font-m text-t-xs font-medium tabular-nums text-ink">{time}</span>}
    </div>
  );

  return (
    <Card as="article" interactive className={`group flex flex-col p-2 transition-[border-color,transform,box-shadow] duration-[var(--dur-base)] ease-[var(--ease)] hover:border-strong hover:shadow-[var(--shadow-md)] motion-safe:hover:-translate-y-0.5 max-[560px]:p-1.5 ${featured ? "md:col-span-2 md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:grid-rows-[1fr_auto_auto] md:gap-x-[clamp(24px,5vw,64px)] md:p-4" : ""} ${className}`}>
      {onToggleFavorite ? (
        <div className={`relative ${featured ? "md:row-span-3" : ""}`}>
          {shot}
          <button
            type="button"
            className={`absolute right-0 top-0 z-[1] grid size-[var(--tap)] place-items-center bg-transparent transition-colors before:absolute before:size-8 before:rounded-full before:border before:border-strong before:bg-[var(--color-overlay)] before:transition-colors before:content-[''] hover:before:border-ink [&_svg]:relative ${favorite ? "text-acc before:border-acc" : "text-ink"}`}
            aria-pressed={favorite}
            aria-label={favorite ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
            onClick={onToggleFavorite}
          >
            <Heart size={16} fill={favorite ? "currentColor" : "none"} />
          </button>
        </div>
      ) : (
        <div className={featured ? "md:row-span-3" : ""}>{shot}</div>
      )}
      <CollectibleMetadata item={item} className={featured ? "md:col-start-2 md:row-start-1" : ""} />
      <div className={`mx-1 my-3 [overflow-wrap:anywhere] font-d text-t-base font-semibold leading-[1.3] md:text-t-lg ${featured ? "md:col-start-2 md:row-start-2 md:mb-5 md:mt-0 md:self-end md:text-t-2xl" : ""}`}>{name}</div>
      {!hideMeta && (owner || price != null) && (
        <div className={`mx-1 flex items-center justify-between text-sm max-[560px]:flex-col max-[560px]:items-start max-[560px]:gap-2 ${featured ? "md:col-start-2 md:row-start-3" : ""}`}>
          {owner && (
            <div className="flex min-w-0 items-center gap-2">
              {img && <Avatar src={img} size={26} flat={!!item.mine} />}
              <div className="min-w-0">
                <small className="block text-t-xs font-normal text-dim">Sample owner</small>
                {owner}
              </div>
            </div>
          )}
          {price != null && (
            <div className="text-right font-semibold tabular-nums max-[560px]:text-left">
              <small className="block text-t-xs font-normal text-dim">{priceLabel}</small>
              {price} ETH
            </div>
          )}
        </div>
      )}
      {children && <div className={`mx-1 mb-1 mt-3 flex items-center justify-between border-t border-edge pt-3 max-[560px]:flex-col max-[560px]:items-stretch max-[560px]:gap-1 ${featured ? "md:col-start-2 md:row-start-4 md:mt-[22px]" : ""}`}>{children}</div>}
    </Card>
  );
}
