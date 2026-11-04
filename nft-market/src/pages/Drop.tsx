import { Check } from "lucide-react";
import Button from "../components/ui/Button";
import Backdrop from "../components/ui/Backdrop";
import ReleaseCountdown from "../components/marketplace/ReleaseCountdown";
import { ITEMS, DROP, RELEASE_AT } from "../data/cubbie";
import Viewer3D from "../components/three/Viewer3D";
import { CUBBIE_MODEL } from "../data/models";
import studio from "../assets/environments/collectible-studio.webp";
import type { CatalogItem } from "../types";

const FEATURED = ITEMS.find((i) => i.id === 6) || ITEMS[0];

const STEPS = [
  ["Browse", "Open any character to see its artwork and details. No wallet needed."],
  ["Collect (demo)", "Add it to your collection. This is simulated and saved in this browser only."],
  ["Keep it", "Your demo collection, wishlist and history live in My Cubbie."],
];

// The Drop: release presentation. No date is invented: the countdown appears
// only when VITE_CUBBIE_DROP_AT is set to a real release time.
export default function Drop({ owned = [], onBuy }: { owned?: number[]; onBuy: (item: CatalogItem) => void }) {
  const date = RELEASE_AT
    ? new Date(RELEASE_AT).toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" })
    : null;

  const facts: [string, string][] = [
    ["Collection", DROP.code],
    ["Characters", String(ITEMS.length)],
    ["Release", date || "To be announced"],
    ["Format", "Digital collectible (demo)"],
    ["Status", "Not minted"],
    ["Blockchain", "No contract connected"],
  ];

  const isOwned = owned.includes(FEATURED.id);

  return (
    <main className="pb-8">
      {/* RELEASE PRESENTATION */}
      <section className="relative isolate py-9 md:py-16" aria-labelledby="dr-title">
        <Backdrop src={studio} eager opacity={0.6} fit="50% 60%" />
        <div className="mx-auto grid w-full max-w-[var(--container-xl)] items-center gap-7 px-[var(--gutter,16px)] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-8">
          <div className="relative mx-auto w-full max-w-[400px] before:absolute before:inset-0 before:-translate-x-3.5 before:translate-y-3.5 before:rounded-[var(--radius-md)] before:border before:border-strong before:content-['']">
            <img className="relative block aspect-[928/1152] h-auto w-full rounded-[var(--radius-md)] bg-[var(--color-void)] object-cover" src={DROP.banner} alt={`${DROP.title} artwork`} width="928" height="1152" decoding="async" fetchPriority="high" />
          </div>

          <div>
            <p className="font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-acc">The drop / {DROP.code}</p>
            <h1 id="dr-title" className="display break-words text-t-4xl [text-wrap:balance]">{DROP.title}</h1>
            <p className="max-w-[52ch] text-t-lg leading-[var(--leading-body)] text-dim [text-wrap:pretty]">
              The first chapter of the Cubbie Universe: {ITEMS.length} characters, each a different way to be someone in the same world.
            </p>

            {RELEASE_AT ? (
              <>
                <ReleaseCountdown until={RELEASE_AT} />
                <p className="mt-4 text-sm leading-[1.5] text-dim">Releases {date}</p>
              </>
            ) : (
              <p className="mt-5 font-m text-sm font-medium uppercase tracking-[var(--tracking-wide)] text-acc" role="status">Release date to be announced.</p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" href="#the-collection">Explore the Collection</Button>
              <Button size="lg" variant="ghost" href="#my-cubbie">My Cubbie</Button>
            </div>
          </div>
        </div>
      </section>

      {/* RELEASE INFORMATION */}
      <section className="mx-auto mt-24 w-full max-w-[1320px] px-[clamp(16px,3vw,32px)]" aria-labelledby="dr-info">
        <h2 id="dr-info" className="mb-5 border-b border-edge pb-4 font-d text-t-xl font-semibold leading-[1.2]">Release information</h2>
        <dl className="grid grid-cols-2 md:grid-cols-3">
          {facts.map(([k, v]) => (
            <div key={k} className="border-b border-edge py-4 pr-4">
              <dt className="text-t-xs tracking-[0.04em] text-dim">{k}</dt>
              <dd className="mt-1 font-d text-t-lg font-medium leading-[1.25]">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CUBBIE IN 3D */}
      <section className="mx-auto mt-24 grid w-full max-w-[1320px] items-center gap-6 px-[clamp(16px,3vw,32px)] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-8" aria-labelledby="dr-3d">
        <div className="w-full max-w-[360px]">
          <Viewer3D src={CUBBIE_MODEL.url} poster={CUBBIE_MODEL.poster} alt="Preview of the Cubbie 3D model" />
        </div>
        <div>
          <p className="font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim">Interactive</p>
          <h2 id="dr-3d" className="display my-2 mb-3 text-t-2xl">The Cubbie in 3D</h2>
          <p className="text-sm leading-[1.5] text-dim">
            Turn it, zoom in and look closer. The 3D view loads only when you ask for it, so the page stays fast on your phone.
          </p>
          <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-dim">This is a preview of the Cubbie 3D model. Models for each character are not available yet.</p>
        </div>
      </section>

      {/* FEATURED DROP */}
      <section className="mx-auto mt-24 grid w-full max-w-[1320px] items-center gap-6 px-[clamp(16px,3vw,32px)] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-8" aria-labelledby="dr-feat">
        <div className="w-full max-w-[360px]">
          <img className="block aspect-[928/1152] h-auto w-full rounded-[var(--radius-lg)] border border-edge bg-[var(--color-art-stage)] object-cover" src={FEATURED.img} alt={`${FEATURED.name}, featured character`} width="928" height="1152" loading="lazy" decoding="async" />
        </div>
        <div>
          <p className="font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim">Featured character / {FEATURED.code}</p>
          <h2 id="dr-feat" className="display my-2 mb-3 text-t-2xl">{FEATURED.name}</h2>
          <p className="text-sm leading-[1.5] text-dim">
            {FEATURED.description || "One of the characters in this drop."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {isOwned ? (
              <Button variant="ghost" disabled>
                <Check size={14} aria-hidden="true" /> Demo collected
              </Button>
            ) : (
              <Button onClick={() => onBuy(FEATURED)}>Collect (demo)</Button>
            )}
            <Button variant="ghost" href={`#character/${FEATURED.slug}`}>View character</Button>
          </div>
          <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-dim">Demo collecting is simulated and saved in this browser. No transaction takes place.</p>
        </div>
      </section>

      {/* IN THIS DROP */}
      <section className="mx-auto mt-24 w-full max-w-[1320px] px-[clamp(16px,3vw,32px)]" aria-labelledby="dr-all">
        <h2 id="dr-all" className="mb-5 border-b border-edge pb-4 font-d text-t-xl font-semibold leading-[1.2]">In this drop</h2>
        <ul className="m-0 grid list-none grid-cols-3 gap-x-3 gap-y-4 p-0 min-[560px]:grid-cols-4 md:grid-cols-6">
          {ITEMS.map((i) => (
            <li key={i.id}>
              <a className="grid gap-1" href={`#character/${i.slug}`}>
                <img className="block aspect-[928/1152] h-auto w-full rounded-[var(--radius-sm)] border border-edge object-cover transition-[border-color,transform] duration-[var(--dur-base)] hover:-translate-y-0.5 hover:border-acc" src={i.thumb || i.img} alt="" width="464" height="576" loading="lazy" decoding="async" />
                <span className="font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim">{i.code}</span>
                <b className="font-d text-sm font-medium">{i.name}</b>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* HOW COLLECTING WORKS */}
      <section className="mx-auto mt-24 w-full max-w-[1320px] px-[clamp(16px,3vw,32px)]" aria-labelledby="dr-how">
        <h2 id="dr-how" className="mb-5 border-b border-edge pb-4 font-d text-t-xl font-semibold leading-[1.2]">How collecting works</h2>
        <ol className="m-0 grid list-none gap-5 p-0 md:grid-cols-3 md:gap-6">
          {STEPS.map(([t, d], n) => (
            <li key={t} className="grid gap-1.5 border-t border-edge pt-4">
              <span className="font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-acc">0{n + 1}</span>
              <b className="font-d text-t-lg font-medium">{t}</b>
              <span className="text-sm leading-[1.5] text-dim">{d}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
