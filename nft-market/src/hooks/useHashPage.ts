import { useEffect, useRef, useState } from "react";
import type { Page } from "../types";

const BRAND = "CUBBIE NFT MARKETPLACE";

const TITLES: Partial<Record<Page, string>> = {
  home: `${BRAND} — Collect Your Universe`,
  discover: `The Collection — ${BRAND}`,
  market: `Marketplace — ${BRAND}`,
  mycubbie: `My Cubbie — ${BRAND}`,
  drop: `The Drop — ${BRAND}`,
  lore: `Lore and World — ${BRAND}`,
  create: `Create a Cubbie — ${BRAND}`,
  "not found": `Page not found — ${BRAND}`,
};

// "#character/<slug>" is the Character Vault page for one collectible.
// "#collection" is the old address of My Cubbie and still works.
// Any other hash is an unknown page.
const pageFromHash = (): Page => {
  const h = location.hash;

  if (h === "" || h === "#" || h.startsWith("#gt-")) return "home";
  if (h === "#marketplace") return "market";
  if (h === "#my-cubbie" || h === "#collection") return "mycubbie";
  if (h === "#the-collection") return "discover";
  if (h === "#the-drop") return "drop";
  if (h === "#lore") return "lore";
  if (h === "#create") return "create";
  if (h.startsWith("#character/")) return "character";

  return "not found";
};

// Returns [page, hash]. Also keeps the document title in sync and moves
// scroll and keyboard focus to the new page after a navigation.
export default function useHashPage(onNavigate?: () => void): [Page, string] {
  const [page, setPage] = useState<Page>(pageFromHash);
  const [hash, setHash] = useState(() => location.hash);
  const navigateRef = useRef(onNavigate);
  navigateRef.current = onNavigate;
  const firstRun = useRef(true);

  useEffect(() => {
    const onHash = () => {
      setPage(pageFromHash());
      setHash(location.hash);
      navigateRef.current?.();
    };

    window.addEventListener("hashchange", onHash);

    return () => {
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  // Character pages share one "page" value, so the hash (the slug) is part of
  // the key. Going Previous/Next now scrolls to the top like any other page.
  const navKey = page === "character" ? hash : page;

  useEffect(() => {
    // The character page sets its own title (it knows the name).
    if (page !== "character") {
      document.title = TITLES[page] || TITLES.home || BRAND;
    }

    // "instant" overrides the global smooth scrolling, so a long page does not
    // animate all the way back up.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const anchored = page === "home" && location.hash;

    // Do not steal focus on first load.
    if (!firstRun.current && !anchored) {
      const main = document.querySelector("main");

      if (main) {
        main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
      }
    }

    firstRun.current = false;

    if (anchored) {
      const t = setTimeout(() => {
        document.querySelector(location.hash)?.scrollIntoView();
      }, 0);

      return () => clearTimeout(t);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navKey]);

  return [page, hash];
}
