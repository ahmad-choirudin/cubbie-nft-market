import { ECOSYSTEM, WORLD_URL } from "../../data/ecosystem";

const EXPLORE = [
  ["The Collection", "#the-collection"],
  ["Marketplace", "#marketplace"],
  ["The Drop", "#the-drop"],
  ["My Cubbie", "#my-cubbie"],
  ["Lore", "#lore"],
];

const CREDITS = [
  ["Portfolio", "https://www.ahmadchoirudin.my.id/"],
  ["GitHub", "https://github.com/ahmad-choirudin"],
];

const head = "font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim";
const linkCls = "inline-flex min-h-[32px] items-center transition-colors hover:text-acc";
const externalProps = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function Footer() {
  return (
    <footer className="relative z-[1] mt-24 border-t border-edge text-dim md:mt-36 [&>div:first-child]:border-b [&>div:first-child]:border-edge [&_a]:transition-colors [&_a:hover]:text-acc">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <p className="display text-t-3xl text-ink">Cub<span className="text-acc">bie</span></p>
          <p className={`${head} mt-3 text-acc`}>Market · Collect your universe.</p>
          <p className="mt-4 max-w-[38ch] text-sm text-dim">
            The collectible gallery of the Cubbie Universe. Listings, owners and prices are sample data; collection activity is saved in this browser and does not submit on-chain transactions.
          </p>
          <a href={WORLD_URL} {...externalProps} className="mt-5 inline-flex min-h-[var(--tap)] items-center font-d text-sm font-semibold text-acc underline underline-offset-4">
            Enter Cubbie World
          </a>
        </div>

        <div>
          <p className={head}>Explore</p>
          <ul className="mt-4 list-none space-y-1 p-0 text-sm">
            {EXPLORE.map(([label, href]) => (
              <li key={href}>
                <a href={href} className={linkCls}>{label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={head}>Universe</p>
          <ul className="mt-4 list-none space-y-1 p-0 text-sm">
            {ECOSYSTEM.map((e) => (
              <li key={e.key}>
                {e.href ? (
                  <a href={e.href} {...(e.href.startsWith("#") ? {} : externalProps)} className={linkCls}>{e.label}</a>
                ) : (
                  <span className="inline-flex min-h-[32px] items-center text-dim">{e.label} · soon</span>
                )}
              </li>
            ))}
            <li>
              <a href="https://x.com/CubbieOG" {...externalProps} className={linkCls}>X</a>
            </li>
          </ul>
        </div>
      </div>

      <div className={`${head} flex flex-wrap justify-center gap-x-6 gap-y-1 px-4 py-6 text-center`}>
        <span>© 2026 Cubbie NFT Marketplace</span>
        {CREDITS.map(([label, href]) => (
          <a key={href} href={href} {...externalProps} className="inline-flex min-h-[32px] items-center transition-colors hover:text-acc">{label}</a>
        ))}
      </div>
    </footer>
  );
}
