import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, Heart } from "lucide-react";
import ArtCard from "../components/marketplace/ArtCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Viewer3D from "../components/three/Viewer3D";
import { DROP } from "../data/cubbie";
import { WORLD_URL } from "../data/ecosystem";
import { itemFacts, traitList } from "../utils/discover";
import { DEMO_OWNERSHIP } from "../utils/ownership";
import type { CatalogItem } from "../types";

// Character Vault: one page per collectible. Only real data is shown; fields
// that are empty (description, series, rarity, traits) are left out.
interface CharacterProps {
  slug: string;
  items: CatalogItem[];
  owned: number[];
  liked: number[];
  onBuy: (item: CatalogItem) => void;
  onToggleLike: (id: number) => void;
  onOpen?: (item: CatalogItem) => void;
}

export default function Character({ slug, items, owned, liked, onBuy, onToggleLike, onOpen }: CharacterProps) {
  const index = items.findIndex((i) => i.slug === slug);
  const item = items[index];

  useEffect(() => {
    document.title = item ? `${item.name} — CUBBIE MARKET` : "Character not found — CUBBIE MARKET";
  }, [item]);

  if (!item) {
    return (
      <main className="mx-auto w-full max-w-[1320px] px-[clamp(16px,3vw,32px)] pb-24 pt-6 text-ink sm:pt-12">
        <EmptyState title="That character is not in the vault." description="The link may be old or mistyped.">
          <Button href="#the-collection">Back to the Collection</Button>
        </EmptyState>
      </main>
    );
  }

  const prev = items[(index - 1 + items.length) % items.length];
  const next = items[(index + 1) % items.length];
  const facts = itemFacts(item);
  const traits = traitList(item);
  const isOwned = owned.includes(item.id);
  const isLiked = liked.includes(item.id);

  // More of the same style, when the style is known.
  const related = item.category
    ? items.filter((i) => i.category === item.category && i.id !== item.id).slice(0, 4)
    : [];

  return (
    <main className="mx-auto w-full max-w-[1320px] px-[clamp(16px,3vw,32px)] pb-24 pt-6 text-ink sm:pt-12">
      <nav className="mb-5 flex items-center gap-2 font-m text-t-xs uppercase tracking-[var(--tracking-wide)] text-dim" aria-label="Breadcrumb">
        <a className="inline-flex min-h-[var(--tap)] items-center gap-1.5 hover:text-acc" href="#the-collection">
          <ArrowLeft size={13} aria-hidden="true" /> The Collection
        </a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{item.code}</span>
      </nav>

      <article className="grid items-start gap-7 md:grid-cols-2 md:gap-8">
        {item.glb ? (
          <Viewer3D src={item.glb} poster={item.img} alt={`${item.name}, a Cubbie character`} priority />
        ) : (
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-edge bg-[var(--color-void)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_80px_var(--color-bg)] after:content-[''] md:sticky md:top-[88px]">
            <img className="block aspect-[928/1152] h-auto w-full object-cover" src={item.img} alt={`${item.name}, a Cubbie character`} width="928" height="1152" decoding="async" fetchPriority="high" />
          </div>
        )}

        <div className="min-w-0">
          <p className="font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim">Character vault / {item.code}</p>
          <h1 className="display break-words text-t-4xl [text-wrap:balance]">{item.name}</h1>

          {item.description ? (
            <p className="mt-4 max-w-[52ch] text-t-lg leading-[var(--leading-body)] text-dim [text-wrap:pretty]">{item.description}</p>
          ) : (
            <p className="mt-4 text-sm leading-[1.5] text-dim">The story of this character has not been written yet.</p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {isOwned ? (
              <Button variant="ghost" disabled>
                <Check size={14} aria-hidden="true" /> Demo collected
              </Button>
            ) : (
              <Button onClick={() => onBuy(item)}>Collect (demo)</Button>
            )}
            <Button variant="ghost" aria-pressed={isLiked} onClick={() => onToggleLike(item.id)}>
              <Heart size={14} fill={isLiked ? "currentColor" : "none"} aria-hidden="true" />
              {isLiked ? "In your wishlist" : "Add to wishlist"}
            </Button>
          </div>

          <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-dim">
            {isOwned && <Badge tone="accent" className="mr-2">Demo ownership</Badge>}
            {DEMO_OWNERSHIP}
          </p>

          {item.lore && (
            <section className="mt-6" aria-labelledby="vt-lore">
              <h2 id="vt-lore" className="font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim">Lore</h2>
              <p className="mt-4 text-base leading-[var(--leading-body)]">{item.lore}</p>
            </section>
          )}

          <section className="mt-6" aria-labelledby="vt-attrs">
            <h2 id="vt-attrs" className="font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim">Attributes</h2>
            {facts.length > 0 && (
              <dl className="mt-3 border-t border-edge">
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
          </section>

          <section className="mt-6" aria-labelledby="vt-coll">
            <h2 id="vt-coll" className="font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim">Collection</h2>
            <dl className="mt-3 border-t border-edge">
              <div className="flex justify-between gap-4 border-b border-edge py-3 text-sm">
                <dt className="text-dim">Collection</dt>
                <dd className="m-0 text-right font-medium">{DROP.code}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-edge py-3 text-sm">
                <dt className="text-dim">Drop</dt>
                <dd className="m-0 text-right font-medium"><a className="text-acc underline underline-offset-[3px]" href="#the-drop">{DROP.title}</a></dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-edge py-3 text-sm">
                <dt className="text-dim">Universe</dt>
                <dd className="m-0 text-right font-medium"><a className="text-acc underline underline-offset-[3px]" href={WORLD_URL} target="_blank" rel="noopener noreferrer">Cubbie World</a></dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-edge py-3 text-sm">
                <dt className="text-dim">Position</dt>
                <dd className="m-0 text-right font-medium">{index + 1} of {items.length}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-edge py-3 text-sm">
                <dt className="text-dim">Status</dt>
                <dd className="m-0 text-right font-medium">Demo, not minted</dd>
              </div>
            </dl>
          </section>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-24" aria-labelledby="vt-more">
          <h2 id="vt-more" className="mb-5 font-d text-t-xl font-semibold leading-[1.2]">More in {item.category}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {related.map((r) => (
              <ArtCard key={r.id} item={r} hideMeta onOpen={() => onOpen?.(r)} />
            ))}
          </div>
        </section>
      )}

      <nav className="mt-16 flex justify-between gap-4 border-t border-edge pt-5" aria-label="Previous and next character">
        <a className="grid min-h-[var(--tap)] gap-1 font-d text-t-lg font-semibold hover:text-acc" href={`#character/${prev.slug}`}>
          <small className="inline-flex items-center gap-1.5 font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim"><ArrowLeft size={12} aria-hidden="true" /> Previous</small>
          {prev.name}
        </a>
        <a href={`#character/${next.slug}`} className="grid min-h-[var(--tap)] gap-1 text-right font-d text-t-lg font-semibold hover:text-acc">
          <small className="inline-flex items-center justify-end gap-1.5 font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim">Next <ArrowRight size={12} aria-hidden="true" /></small>
          {next.name}
        </a>
      </nav>
    </main>
  );
}
