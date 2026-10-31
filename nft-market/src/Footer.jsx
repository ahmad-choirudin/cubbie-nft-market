import { ECOSYSTEM } from "./ecosystem";

const LINKS = [
  ["Portfolio", "https://www.ahmadchoirudin.my.id/"],
  ["GitHub", "https://github.com/ahmad-choirudin"],
  ["X / @CubbieOG", "https://x.com/CubbieOG"],
];

const head = "font-m text-[10px] uppercase tracking-[0.16em] text-dim";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-edge md:mt-36">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-d text-[15px] font-bold uppercase tracking-[0.32em]">Cubbie</p>
          <p className="mt-4 max-w-[38ch] text-sm text-dim">
            Part of the Cubbie Universe. This marketplace is a frontend demo: there is no smart contract, and all listings, owners and prices are sample data.
          </p>
        </div>

        <div>
          <p className={head}>Universe</p>
          <ul className="mt-4 list-none space-y-2 p-0 text-sm">
            {ECOSYSTEM.map((e) => (
              <li key={e.key}>
                {e.href ? (
                  <a href={e.href} className="transition-colors hover:text-acc">{e.label}</a>
                ) : (
                  <span className="text-dim">{e.label} · soon</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={head}>Links</p>
          <ul className="mt-4 list-none space-y-2 p-0 text-sm">
            {LINKS.map(([label, href]) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-acc">{label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="border-t border-edge px-4 py-6 text-center font-m text-[11px] uppercase tracking-[0.16em] text-dim">
        © 2026 Cubbie · Hobby and portfolio project by Ahmad Choirudin
      </p>
    </footer>
  );
}
