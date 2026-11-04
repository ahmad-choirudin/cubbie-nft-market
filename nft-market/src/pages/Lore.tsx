import Badge from "../components/ui/Badge";
import Backdrop from "../components/ui/Backdrop";
import Button from "../components/ui/Button";
import { ITEMS, DROP } from "../data/cubbie";
import { ECOSYSTEM, WORLD_URL } from "../data/ecosystem";
import { CHAPTERS, UNIVERSE } from "../data/lore";
import loreVisual from "../assets/lore/lore-visual.webp";
import ancientArtifact from "../assets/lore/ancient-artifact.webp";
import alienPlanet from "../assets/backgrounds/alien-planet.webp";
// Shared Tailwind class strings for this page.
const IN = "mx-auto w-full max-w-[var(--container-xl)] px-[var(--gutter)]";
const SEC = `${IN} mt-[var(--section-y)]`;
const H2 = "display text-t-3xl [text-wrap:balance]";
const EYEBROW = "font-m text-t-xs font-medium leading-[1.4] uppercase tracking-[var(--tracking-wide)] text-dim";
const LEDE = "max-w-[52ch] text-t-lg leading-[var(--leading-body)] text-dim [text-wrap:pretty]";
const ACTIONS = "mt-8 flex flex-wrap gap-3";
const MASK = "[-webkit-mask-image:radial-gradient(closest-side,#000_62%,transparent_100%)] [mask-image:radial-gradient(closest-side,#000_62%,transparent_100%)]";

const byCategory = ITEMS.reduce<Record<string, number>>((acc, i) => {
  if (i.category) acc[i.category] = (acc[i.category] || 0) + 1;
  return acc;
}, {});

const styleCount = Object.keys(byCategory).length;

// Lore and World Access. The story text lives in data/lore.ts. Character lore
// shows here only for characters that actually have a `lore` field.
export default function Lore() {
  const withLore = ITEMS.filter((i) => i.lore);

  return (
    <main className="overflow-x-clip pb-[72px]">
      {/* UNIVERSE INTRODUCTION */}
      <section className="relative isolate py-[72px] sm:py-28" aria-labelledby="lo-title">
        <Backdrop src={loreVisual} eager opacity={0.6} fit="50% 40%" />
        <div className={IN}>
          <p className={`${EYEBROW} text-acc`}>Lore / The Cubbie Universe</p>
          <h1 id="lo-title" className="display break-words text-t-4xl [text-wrap:balance]">{UNIVERSE.title}</h1>
          <p className={`${LEDE} mt-4`}>{UNIVERSE.lede}</p>
          <div className={ACTIONS}>
            <Button size="lg" href={WORLD_URL} target="_blank" rel="noopener noreferrer">Enter Cubbie World</Button>
            <Button size="lg" variant="ghost" href="#the-collection">Meet the characters</Button>
          </div>
        </div>
      </section>

      {/* STORY CHAPTERS */}
      <section className={SEC} aria-labelledby="lo-chapters">
        <div className="mb-8 flex items-center gap-4">
          <h2 id="lo-chapters" className={H2}>Story chapters</h2>
        </div>

        <ol className="m-0 grid list-none gap-[72px] p-0">
          {CHAPTERS.map((c, k) => (
            <li key={c.id} className="rv grid items-center gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-12">
              <figure
                className={`m-0 overflow-hidden rounded-[var(--radius-md)] border border-edge bg-[var(--color-art-stage)] ${k % 2 === 1 ? "md:order-2" : ""}`}
              >
                <img className="block aspect-video h-auto w-full object-cover" src={c.image} alt={c.alt} width="1376" height="768" loading="lazy" decoding="async" />
              </figure>
              <div>
                <span className="mb-2 flex items-center gap-2 font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-acc">
                  Chapter {c.id}
                  {c.draft && <Badge>Draft</Badge>}
                </span>
                <h3 className="font-d text-t-xl font-semibold leading-[1.2]">{c.title}</h3>
                {c.quote && (
                  <blockquote className="m-0 mt-4 border-l-2 border-acc pl-4 font-d text-t-lg leading-snug">“{c.quote}”</blockquote>
                )}
                <p className="mt-3 max-w-[46ch] text-base leading-[var(--leading-body)] text-dim">{c.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* CHARACTER LORE */}
      <section className={SEC} aria-labelledby="lo-chars">
        <h2 id="lo-chars" className={H2}>The characters</h2>

        {withLore.length > 0 ? (
          <ul className="mt-6 grid list-none grid-cols-2 gap-x-3 gap-y-6 p-0 sm:grid-cols-3 md:grid-cols-4">
            {withLore.map((i) => (
              <li key={i.id}>
                <a className="grid gap-1.5" href={`#character/${i.slug}`}>
                  <img
                    className="block aspect-[928/1152] h-auto w-full rounded-[var(--radius-sm)] border border-edge object-cover"
                    src={i.thumb || i.img}
                    alt=""
                    width="464"
                    height="576"
                    loading="lazy"
                    decoding="async"
                  />
                  <b className="font-d text-t-base font-medium">{i.name}</b>
                  <span className="text-sm leading-[1.5] text-dim">{i.lore}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className={LEDE}>
            Every one of the {ITEMS.length} Cubbies has a story. The stories of the characters are being written, and each will appear on its own character page.
          </p>
        )}

        <div className={ACTIONS}>
          <Button href="#the-collection">Open the Collection</Button>
        </div>
      </section>

      {/* COLLECTION ORIGINS */}
      <section className={`${SEC} grid items-center gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-[72px]`} aria-labelledby="lo-origin">
        <img
          className={`mx-auto block aspect-square h-auto w-[min(100%,420px)] rounded-[var(--radius-lg)] object-cover ${MASK}`}
          src={ancientArtifact}
          alt="An ancient artifact on a pedestal"
          width="1024"
          height="1024"
          loading="lazy"
          decoding="async"
        />
        <div>
          <p className={EYEBROW}>Collection origins</p>
          <h2 id="lo-origin" className={H2}>{DROP.code}</h2>
          <p className={LEDE}>
            The first collection of Cubbie Market. {ITEMS.length} characters, each one a different outfit of the same Cubbie, released as the {DROP.title}.
          </p>
          <dl className="mt-6 grid grid-cols-3">
            {[["Characters", ITEMS.length], ["Styles", styleCount], ["Drop", DROP.title]].map(([label, value]) => (
              <div key={label} className="min-w-0 border-b border-edge py-4 pr-4 md:border-b-0 md:border-l md:pl-4 first:md:border-l-0 first:md:pl-0">
                <dt className="text-t-xs tracking-[0.04em] text-dim">{label}</dt>
                <dd className="mt-1 font-d text-t-lg font-medium leading-tight">{value}</dd>
              </div>
            ))}
          </dl>
          <div className={ACTIONS}>
            <Button variant="ghost" href="#the-drop">View the Drop</Button>
          </div>
        </div>
      </section>

      {/* WORLD ACCESS */}
      <section className="relative isolate mt-[var(--section-y)] py-[clamp(56px,10vw,128px)]" aria-labelledby="lo-world">
        <Backdrop src={alienPlanet} opacity={0.55} fit="50% 50%" />
        <div className={IN}>
          <p className={`${EYEBROW} text-acc`}>World access</p>
          <h2 id="lo-world" className={H2}>Step into Cubbie World.</h2>
          <p className={`${LEDE} mt-3`}>
            Cubbie World is the home of the universe. Cubbie Market is one of its doors.
          </p>

          <ul className="mt-8 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-4">
            {ECOSYSTEM.map((e) => (
              <li
                key={e.key}
                className={`grid min-h-[112px] gap-1.5 rounded-[var(--radius-md)] border p-4 ${
                  e.current
                    ? "border-acc bg-[var(--color-accent-soft)]"
                    : "border-strong bg-[color-mix(in_srgb,var(--color-card)_74%,transparent)]"
                }`}
              >
                <b className="font-d text-t-lg font-semibold">{e.label}</b>
                {e.current ? (
                  <span className="font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim">You are here</span>
                ) : e.href ? (
                  <a
                    className="min-h-6 font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-acc underline underline-offset-[3px]"
                    href={e.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </a>
                ) : (
                  <span className="font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim">Coming soon</span>
                )}
              </li>
            ))}
          </ul>

          <div className={ACTIONS}>
            <Button size="lg" href={WORLD_URL} target="_blank" rel="noopener noreferrer">Visit cubbie.web.id</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
