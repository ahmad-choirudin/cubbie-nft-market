import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Page } from "../../types";
import { ArrowUpRight, X, Menu as MenuIcon } from "lucide-react";
import PageContainer from "./PageContainer";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { WORLD_URL } from "../../data/ecosystem";

// Every item has a destination. Cubbie World is the one external link.
const NAV: { key: string; label: string; href: string; external?: boolean }[] = [
  { key: "collection", label: "Collection", href: "#the-collection" },
  { key: "market", label: "Marketplace", href: "#marketplace" },
  { key: "drop", label: "The Drop", href: "#the-drop" },
  { key: "mycubbie", label: "My Cubbie", href: "#my-cubbie" },
  { key: "lore", label: "Lore", href: "#lore" },
  { key: "world", label: "Cubbie World", href: WORLD_URL, external: true },
];

const isActive = (key: string, page: Page) =>
  (key === "collection" && (page === "discover" || page === "character")) ||
  (key === "market" && page === "market") ||
  (key === "mycubbie" && page === "mycubbie") ||
  (key === "drop" && page === "drop") ||
  (key === "lore" && page === "lore");

// Hash links drive the pages //
const skipToMain = () => {
  const main = document.querySelector("main");

  if (main) {
    main.setAttribute("tabindex", "-1");
    main.focus();
    main.scrollIntoView();
  }
};

const ext = (n: { external?: boolean }) => (n.external ? { target: "_blank", rel: "noopener noreferrer" } : {});

interface HeaderProps {
  page: Page;
  owned: number;
  wallet: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  menu: boolean;
  setMenu: Dispatch<SetStateAction<boolean>>;
}

export default function Header({ page, owned, wallet, onConnect, onDisconnect, menu, setMenu }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Open menu: Escape closes it, Tab stays inside the header, the page behind
  // does not scroll. Closing returns focus to the menu button.
  useEffect(() => {
    if (!menu) {
      if (wasOpen.current) toggleRef.current?.focus();
      wasOpen.current = false;

      return;
    }

    wasOpen.current = true;
    const scrollY = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    headerRef.current?.querySelector<HTMLElement>("#mobile-nav a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);

        return;
      }

      if (e.key !== "Tab" || !headerRef.current) return;

      const items = [...headerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")].filter(
        (el) => el.offsetParent !== null
      );

      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = scrollY;
    };
  }, [menu, setMenu]);

  const count = (key: string) =>
    key === "mycubbie" && owned > 0 ? <Badge tone="accent" className="ml-2">{owned}</Badge> : null;

  const link = "relative inline-flex min-h-[var(--tap)] items-center gap-1 kicker transition-colors";

  return (
    <header className="sticky top-0 z-[var(--z-header)] border-b border-edge bg-[color-mix(in_srgb,var(--color-bg)_94%,transparent)]" ref={headerRef}>
      <Button size="sm" className="absolute left-4 top-[-120px] z-[calc(var(--z-header)+1)] focus:top-2" onClick={skipToMain}>
        Skip to content
      </Button>

      <PageContainer className="flex h-16 items-center gap-4">
        <a href="#" className="flex shrink-0 items-center gap-3" aria-label="Cubbie Market home">
          <span className="display text-t-2xl leading-none">
            Cub<span className="text-acc">bie</span>
          </span>
          <span className="display hidden bg-acc py-1 pl-[1.9rem] pr-6 text-[0.8rem] leading-none tracking-[0.6em] text-bg md:block">
            Market
          </span>
        </a>

        <nav className="mx-auto hidden items-center gap-6 lg:flex" aria-label="Primary">
          {NAV.map((n) => {
            const active = isActive(n.key, page);

            return (
              <a
                key={n.key}
                href={n.href}
                {...ext(n)}
                aria-current={active ? "page" : undefined}
                className={`${link} group ${active ? "text-ink" : "text-dim hover:text-ink"}`}
              >
                {n.label}
                {n.external && <ArrowUpRight size={13} aria-hidden="true" />}
                {count(n.key)}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-1 h-px bg-acc transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {wallet ? (
            <Button variant="ghost" size="sm" onClick={onDisconnect} title="Disconnect wallet" aria-label={`Disconnect wallet ${wallet}`} className="max-w-[160px] sm:max-w-none">
              <span className="size-2 shrink-0 rounded-full bg-acc shadow-[0_0_0_3px_var(--color-accent-glow)]" aria-hidden="true" />
              <span className="truncate normal-case">{wallet}</span>
            </Button>
          ) : (
            <Button size="sm" variant="solid" onClick={onConnect} aria-label="Connect wallet (optional)">
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Wallet</span>
            </Button>
          )}

          <button
            ref={toggleRef}
            type="button"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-sm)] border border-edge transition-colors hover:border-strong lg:hidden"
            aria-label={menu ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menu}
            aria-controls="mobile-nav"
            onClick={() => setMenu((v) => !v)}
          >
            {menu ? <X size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </PageContainer>

      {menu && (
        <>
          <div className="fixed inset-x-0 bottom-0 top-16 bg-[var(--color-scrim)] lg:hidden" aria-hidden="true" onClick={() => setMenu(false)} />
          <nav
            id="mobile-nav"
            aria-label="Mobile navigation"
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-edge bg-bg px-4 pb-4 pt-2 lg:hidden"
            onClick={() => setMenu(false)}
          >
            {NAV.map((n) => (
              <a
                key={n.key}
                href={n.href}
                {...ext(n)}
                aria-current={isActive(n.key, page) ? "page" : undefined}
                className={`flex min-h-[56px] items-center gap-2 border-b border-edge font-d text-t-xl font-semibold last:border-b-0 ${
                  isActive(n.key, page) ? "text-acc" : "text-ink"
                }`}
              >
                {n.label}
                {n.external && <ArrowUpRight size={18} aria-hidden="true" />}
                {count(n.key)}
              </a>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}
