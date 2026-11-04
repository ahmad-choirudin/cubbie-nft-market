import Badge from "../ui/Badge";
import type { CollectibleCardItem } from "../../types";

export default function CollectibleMetadata({ item, className = "" }: { item: CollectibleCardItem; className?: string }) {
  const { code, series, rarity, soldOut } = item;

  if (!code && !series && !rarity && !soldOut) return null;

  const top = rarity === "Epic" || rarity === "Legendary";

  return (
    <div className={`mx-1 mt-3 flex flex-wrap items-center gap-2 ${className}`}>
      {code && <span className="font-m text-[12px] text-dim">{code}</span>}
      {series && <Badge>{series}</Badge>}
      {rarity && <Badge tone={top ? "accent" : "neutral"}>{rarity}</Badge>}
      {soldOut && <Badge>Sold out</Badge>}
    </div>
  );
}
