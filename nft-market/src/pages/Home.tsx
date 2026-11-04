import type { ReactNode } from "react";
import Backdrop from "../components/ui/Backdrop";
import Button from "../components/ui/Button";
import Carousel from "../components/ui/Carousel";
import ArtCard from "../components/marketplace/ArtCard";
import { ITEMS, DROP, RELEASE_AT } from "../data/cubbie";
import { WORLD_URL } from "../data/ecosystem";
import heroImage from "../assets/backgrounds/alien-planet.webp";
import alienPortal from "../assets/environments/alien-portal.webp";
import pedestal from "../assets/environments/collectible-pedestal.webp";
import loreVisual from "../assets/lore/lore-visual.webp";
import type { Collectible } from "../types";

const WRAP = "mx-auto w-full max-w-[1240px] px-[var(--gutter,16px)]";

// Fades a background image out on every side, so it blends into the page instead of looking like a box.
const FADE =
  "[-webkit-mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,#000_30%,transparent_100%)] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,#000_30%,transparent_100%)]";

// Featured: the characters that also appear in Cubbie World (they carry a series label).
// Falls back to the first eight if none do.
const WITH_SERIES = ITEMS.filter((i) => i.series);
const FEATURED = (WITH_SERIES.length ? WITH_SERIES : ITEMS).slice(0, 8);

const WAYS: [string, string][] = [
  [
    "Browse",
    "Open any character to see its artwork and details. No wallet needed.",
  ],
  [
    "Collect",
    "Save a character to your local collection. No transaction is submitted.",
  ],
  [
    "Keep it",
    "Your local collection, wishlist and history live in My Cubbie.",
  ],
];

// Release date is shown only when VITE_CUBBIE_DROP_AT is set, so no date is invented.
const releaseDate = RELEASE_AT
  ? new Date(RELEASE_AT).toLocaleString(undefined, {
      dateStyle: "long",
      timeStyle: "short",
    })
  : null;

interface BandProps {
  id: string;
  bg?: string;
  fit?: string;
  opacity?: number;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}

// A full-width section with its own background image behind the content.
function Band({
  id,
  bg,
  fit = "50% 50%",
  opacity = 0.5,
  className = "",
  innerClassName = "",
  children,
}: BandProps) {
  return (
    <section
      className={`relative isolate rv py-[clamp(56px,9vw,112px)] ${className}`}
      aria-labelledby={id}
    >
      {bg && (
        <Backdrop
          src={bg}
          opacity={opacity}
          fit={fit}
          className={FADE}
        />
      )}
      <div className={`${WRAP} ${innerClassName}`}>
        {children}
      </div>
    </section>
  );
}

interface HomeProps {
  liked: number[];
  onOpen: (item: Collectible) => void;
  onToggleLike: (id: number) => void;
}

export default function Home({
  liked,
  onOpen,
  onToggleLike,
}: HomeProps) {
  return (
    <main className="overflow-x-clip">
      {/* 1. HERO: one big statement over a full-bleed 16:9 image */}
      <section
        className="relative isolate flex min-h-[min(calc(100svh-4rem),56rem)] items-end overflow-hidden"
        aria-labelledby="gt-title"
      >
        <img
          src={heroImage}
          alt=""
          width="1376"
          height="768"
          fetchPriority="high"
          decoding="async"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[-1] h-full w-full object-cover [object-position:50%_40%]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[-1] bg-[linear-gradient(to_top,var(--color-bg)_4%,color-mix(in_srgb,var(--color-bg)_78%,transparent)_34%,color-mix(in_srgb,var(--color-bg)_20%,transparent)_70%,color-mix(in_srgb,var(--color-bg)_55%,transparent))]"
        />

        <div className={`${WRAP} relative z-[2] pb-[clamp(32px,7vw,88px)] pt-[clamp(48px,10vw,120px)]`}>
          <h1 id="gt-title" className="display text-[clamp(2.6rem,min(12.4vw,22svh),11rem)]">
            <span className="block">Collect</span>
            <span className="block">your</span>
            <span className="block text-acc">universe.</span>
          </h1>

          <p className="mt-6 max-w-[46ch] text-t-xl leading-[1.55] text-ink/80 text-pretty">
            Discover the characters of the Cubbie Universe, displayed like designer toys in a gallery. Browse freely,
            no wallet needed.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" href="#the-collection">
              Explore the collection
            </Button>

            <Button size="lg" variant="ghost" href="#the-drop">
              See the drop
            </Button>
          </div>
        </div>
      </section>

      {/* 2. STATEMENT */}
      <Band
        id="gt-statement"
        className="py-[clamp(72px,12vw,160px)]"
      >
        <h2 id="gt-statement" className="display mb-6 max-w-[12ch] text-t-4xl text-balance">
          Where the universe is put on display.
        </h2>

        <p className="max-w-[36ch] text-t-xl leading-[1.6] text-ink">
          Cubbie World is where the universe begins. Cubbie Market
          is where its characters are collected.
        </p>
      </Band>

      {/* 3. FEATURED */}
      <Band id="gt-featured">
        <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-edge pb-4">
          <h2 id="gt-featured" className="display text-t-2xl">
            Featured characters
          </h2>

          <a className="inline-flex min-h-[var(--tap)] items-center text-sm text-dim underline underline-offset-4 transition-colors hover:text-acc" href="#the-collection">
            View all {ITEMS.length}
          </a>
        </div>

        <Carousel
          label="Featured characters"
          itemClassName="w-[72%] sm:w-[calc((100%-16px)/2)] md:w-[calc((100%-32px)/3)] lg:w-[calc((100%-48px)/4)]"
        >
          {FEATURED.map((i) => (
            <ArtCard
              key={i.id}
              item={i}
              hideMeta
              className="w-full"
              onOpen={() => onOpen(i)}
              favorite={liked.includes(i.id)}
              onToggleFavorite={() => onToggleLike(i.id)}
            />
          ))}
        </Carousel>
      </Band>

      {/* 4. DROP */}
      <Band
        id="gt-drop"
        bg={loreVisual}
        opacity={0.5}
        innerClassName="mx-auto grid max-w-[var(--container-lg)] items-center gap-12 md:grid-cols-2"
      >
        <div className="relative mx-auto w-full max-w-[420px] before:absolute before:inset-0 before:-translate-x-4 before:translate-y-4 before:rounded-lg before:border before:border-strong before:content-['']">
          <img
            className="relative block h-auto w-full rounded-lg bg-[var(--color-void)] object-cover"
            src={DROP.banner}
            alt={`${DROP.title} artwork`}
            width="928"
            height="1152"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div>
          <p className="mb-2 font-m text-t-xs text-acc">{DROP.code}</p>

          <h2 id="gt-drop" className="display max-w-[14ch] text-t-4xl text-balance">
            {DROP.title}
          </h2>

          <p className="max-w-[52ch] text-t-lg leading-[1.6] text-dim text-pretty">
            The first collection of the Cubbie Universe, presented
            with sample listing information.
          </p>

          <p className="my-4 mb-6 font-m text-t-xs text-dim">
            {releaseDate
              ? `Releases ${releaseDate}`
              : "Release date to be announced"}
          </p>

          <Button href="#the-drop">View the drop</Button>
        </div>
      </Band>

      {/* 5. UNIVERSE */}
      <Band
        id="gt-universe"
        innerClassName="max-w-[54rem]"
      >
        <div>
          <h2 id="gt-universe" className="display max-w-[18ch] text-t-4xl text-balance">
            One universe, many characters.
          </h2>

          <p className="mt-3 max-w-[52ch] text-t-lg leading-[1.6] text-dim text-pretty">
            Every Cubbie comes from the same world. Read the lore,
            or step into Cubbie World where it all starts.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#lore">Read the lore</Button>

            <Button
              variant="ghost"
              href={WORLD_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Enter Cubbie World
            </Button>
          </div>
        </div>
      </Band>

      {/* 6. COLLECTOR */}
      <Band
        id="gt-collect"
        innerClassName="grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-18"
      >
        <div>
          <h2 id="gt-collect" className="display mb-6 max-w-[14ch] text-t-4xl text-balance">
            Collect at your own pace.
          </h2>

          <p className="max-w-[52ch] text-t-lg leading-[1.6] text-dim text-pretty">
            Collection activity is saved in this browser. It is not
            minted, transferred, or recorded on-chain.
          </p>

          <img
            className="mt-8 block h-auto w-full max-w-[260px] [mask-image:radial-gradient(closest-side,#000_60%,transparent_100%)]"
            src={pedestal}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>

        <ul className="list-none p-0">
          {WAYS.map(([title, text]) => (
            <li key={title} className="grid gap-1 border-t border-edge py-6 last:border-b">
              <b className="font-d text-t-lg font-medium">{title}</b>
              <span className="text-t-base text-dim">{text}</span>
            </li>
          ))}
        </ul>
      </Band>

      {/* 7. FINAL */}
      <Band
        id="gt-final"
        bg={alienPortal}
        opacity={0.55}
        className="py-[clamp(96px,16vw,200px)]"
        innerClassName="grid justify-items-start gap-2 md:justify-items-center md:text-center"
      >
        <h2 id="gt-final" className="display max-w-[14ch] text-t-4xl text-balance">
          Collect your universe.
        </h2>

        <div className="mt-6 flex flex-wrap gap-3 md:justify-center">
          <Button size="lg" href="#the-collection">
            Open the collection
          </Button>

          <Button
            size="lg"
            variant="ghost"
            href={WORLD_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Enter Cubbie World
          </Button>
        </div>
      </Band>
    </main>
  );
}
