import { X, Menu as MenuIcon } from "lucide-react";
import { ECOSYSTEM } from "./ecosystem";

const NAV = [
  ["Marketplace", "#marketplace"],
  ["Create", "#create"],
  ["Drops", "#release"],
  ["My Collection", "#collection"],
  ["About", "#hero"],
];

export default function Header({
  owned,
  wallet,
  onConnect,
  onDisconnect,
  menu,
  setMenu,
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-edge bg-bg/85 backdrop-blur-xl">
      <div className="border-b border-edge">
        <div className="mx-auto flex h-8 max-w-[1240px] items-center gap-5 overflow-x-auto px-4 font-m text-[10px] uppercase tracking-[0.16em] text-dim md:px-8">
          <span className="hidden shrink-0 sm:inline">Cubbie Universe</span>

          {ECOSYSTEM.map((e) =>
            e.href ? (
              <a
                key={e.key}
                href={e.href}
                aria-current={e.current ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 transition-colors hover:text-ink ${
                  e.current ? "text-ink" : ""
                }`}
              >
                {e.current && (
                  <span className="h-1.5 w-1.5 rounded-full bg-acc" />
                )}
                {e.label}
              </a>
            ) : (
              <span
                key={e.key}
                aria-disabled="true"
                className="shrink-0 opacity-50"
              >
                {e.label} <span className="text-[9px]">soon</span>
              </span>
            )
          )}
        </div>
      </div>

      <div className="mx-auto flex h-14 max-w-[1240px] items-center px-4 md:px-8">
        <a
          href="#"
          className="shrink-0 font-d text-[15px] font-bold uppercase tracking-[0.32em]"
        >
          Cubbie
        </a>

        <nav className="mx-auto hidden items-center gap-8 md:flex lg:gap-11">
          {NAV.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="group relative py-1.5 font-b text-xs font-medium uppercase tracking-[0.14em] text-dim transition-colors hover:text-ink"
            >
              {label}

              {href === "#collection" && owned > 0 && (
                <span className="ml-2 inline-block min-w-[18px] rounded-full bg-acc px-1.5 text-center text-[10px] font-semibold leading-[1.6] tracking-normal text-bg">
                  {owned}
                </span>
              )}

              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {wallet ? (
            <button
              className="btn ghost sm"
              onClick={onDisconnect}
              title="Disconnect wallet"
            >
              <span className="dot" />
              {wallet}
            </button>
          ) : (
            <button className="btn" onClick={onConnect}>
              Connect Wallet
            </button>
          )}

          <button
            className="grid h-10 w-10 place-items-center border border-edge md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menu}
            onClick={() => setMenu((v) => !v)}
          >
            {menu ? <X size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {menu && (
        <nav
          className="absolute inset-x-0 top-full border-b border-edge bg-bg px-5 pb-3 md:hidden"
          aria-label="Mobile navigation"
          onClick={() => setMenu(false)}
        >
          {NAV.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="block border-b border-edge py-4 font-b text-[13px] uppercase tracking-[0.14em] last:border-b-0"
            >
              {label}

              {href === "#collection" && owned > 0 && (
                <span className="ml-2 inline-block min-w-[18px] rounded-full bg-acc px-1.5 text-center text-[10px] font-semibold leading-[1.6] tracking-normal text-bg">
                  {owned}
                </span>
              )}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
