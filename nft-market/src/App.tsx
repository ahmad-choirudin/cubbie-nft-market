import { useMemo, useState } from "react";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ArtworkModal from "./components/marketplace/ArtworkModal";
import Toast from "./components/ui/Toast";

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Character from "./pages/Character";
import Drop from "./pages/Drop";
import MyCubbie from "./pages/MyCubbie";
import Lore from "./pages/Lore";
import TheCollection from "./pages/TheCollection";
import Create from "./pages/Create";
import NotFound from "./pages/NotFound";

import { ITEMS } from "./data/cubbie";
import usePersist from "./hooks/usePersist";
import useWallet from "./hooks/useWallet";
import useProfile from "./hooks/useProfile";
import useHashPage from "./hooks/useHashPage";
import useReveal from "./hooks/useReveal";
import useToast from "./hooks/useToast";
import { STORAGE_KEYS } from "./utils/storage";
import { shortAddress } from "./utils/format";
import { describeError } from "./utils/web3";
import type {
  Collectible,
  HistoryEvent,
  HistoryEventType,
} from "./types";

const characterSlug = (hash: string) => {
  if (!hash.startsWith("#character/")) return "";

  try {
    return decodeURIComponent(hash.slice("#character/".length));
  } catch {
    return "";
  }
};

export default function App() {
  const w = useWallet();
  const { toast, say } = useToast();

  const saveFailed = () =>
    say(
      "Your browser blocked saving. Changes will be lost when you leave this page.",
      false
    );

  const [owned, setOwned] = usePersist<number[]>(
    STORAGE_KEYS.owned,
    [],
    (x) => typeof x === "number",
    saveFailed
  );

  const [liked, setLiked] = usePersist<number[]>(
    STORAGE_KEYS.liked,
    [],
    (x) => typeof x === "number",
    saveFailed
  );

  const [created, setCreated] = usePersist<Collectible[]>(
    STORAGE_KEYS.created,
    [],
    (x) =>
      Boolean(
        x &&
          typeof x === "object" &&
          "id" in x &&
          typeof x.id === "number" &&
          "name" in x &&
          typeof x.name === "string" &&
          "img" in x &&
          typeof x.img === "string" &&
          "price" in x &&
          typeof x.price === "number"
      ),
    saveFailed
  );

  // Collector history: collecting, wishlisting and creating, newest first.
  const [history, setHistory] = usePersist<HistoryEvent[]>(
    STORAGE_KEYS.history,
    [],
    (x) =>
      Boolean(
        x &&
          typeof x === "object" &&
          "type" in x &&
          typeof x.type === "string" &&
          "itemId" in x &&
          typeof x.itemId === "number" &&
          "name" in x &&
          typeof x.name === "string" &&
          "at" in x &&
          typeof x.at === "string"
      ),
    saveFailed
  );

  const [profile, setProfile] = useProfile(saveFailed);

  const [sel, setSel] = useState<Collectible | null>(null);
  const [menu, setMenu] = useState(false);

  const [page, hash] = useHashPage(() => setMenu(false));

  useReveal(page);

  // MetaMask connection. The wallet is optional: nothing else depends on it.
  const connect = () => {
    if (!window.ethereum) {
      const mobile = /Android|iPhone|iPad|iPod/i.test(
        navigator.userAgent
      );

      const url = mobile
        ? `https://metamask.app.link/dapp/${location.host}${location.pathname}${location.search}${location.hash}`
        : "https://metamask.io/download/";

      say(
        mobile
          ? "MetaMask not found. Opening the MetaMask app…"
          : "MetaMask not found. Opening the install page…",
        false
      );

      setTimeout(() => {
        if (mobile) {
          location.href = url;
        } else {
          window.open(url, "_blank", "noopener");
        }
      }, 1000);

      return;
    }

    w.connect().catch((e) => say(describeError(e), false));
  };

  const items = useMemo(
    () => [...ITEMS, ...created],
    [created]
  );

  // Add one event to the history (kept to the latest 200).
  const log = (type: HistoryEventType, item: Collectible) => {
    const event = {
      type,
      itemId: item.id,
      name: item.name,
      at: new Date().toISOString(),
    };

    setHistory((h) => [event, ...h].slice(0, 200));
  };

  // Collecting is a local preview action; no transaction is submitted.
  const buy = (item: Collectible) => {
    if (owned.includes(item.id)) return;

    if (item.soldOut) {
      say(`${item.name} is sold out in this collection preview.`);
      return;
    }

    setOwned((o) =>
      o.includes(item.id) ? o : [...o, item.id]
    );

    log("collect", item);

    setSel(null);

    say(`${item.name} saved to your local collection.`);
  };

  // Likes and wishlist share one list.
  const toggleLike = (id: number) => {
    const item = items.find((i) => i.id === id);

    if (item) {
      log(
        liked.includes(id) ? "unwishlist" : "wishlist",
        item
      );
    }

    setLiked((l) =>
      l.includes(id)
        ? l.filter((x) => x !== id)
        : [...l, id]
    );
  };

  const me = w.acc ? shortAddress(w.acc) : "@you";

  const walletLabel = w.acc
    ? `${shortAddress(w.acc)}${w.ethBalance ? ` · ${w.bal} ETH` : ""}`
    : null;

  // Created items are kept in this browser only.
  const onCreate = (n: Collectible) => {
    setCreated((c) => [...c, n]);
    log("create", n);

    say(`${n.name} added to your local collection preview.`);

    location.hash = "#marketplace";
  };

  // Remove a created Cubbie everywhere it was stored.
  const onRemove = (id: number) => {
    const gone = items.find((i) => i.id === id);

    if (gone) log("remove", gone);

    setCreated((c) => c.filter((x) => x.id !== id));
    setOwned((o) => o.filter((x) => x !== id));
    setLiked((l) => l.filter((x) => x !== id));
  };

  // Prices only show on the marketplace.
  const modalMode = page === "market" ? "market" : "discover";

  const clearHistory = () => {
    if (
      window.confirm(
        "Clear your collection history? Your collection and wishlist are kept."
      )
    ) {
      setHistory([]);
    }
  };

  const slug = characterSlug(hash);

  return (
    <>
      <Header
        page={page}
        owned={owned.length}
        wallet={walletLabel}
        onConnect={connect}
        onDisconnect={w.disconnect}
        menu={menu}
        setMenu={setMenu}
      />

      {page === "create" ? (
        <Create
          created={created}
          owner={me}
          onCreate={onCreate}
          onRemove={onRemove}
        />
      ) : page === "discover" ? (
        <TheCollection
          items={ITEMS}
          liked={liked}
          onOpen={setSel}
          onToggleLike={toggleLike}
        />
      ) : page === "character" ? (
        <Character
          key={slug}
          slug={slug}
          items={ITEMS}
          owned={owned}
          liked={liked}
          onBuy={buy}
          onToggleLike={toggleLike}
          onOpen={setSel}
        />
      ) : page === "drop" ? (
        <Drop owned={owned} onBuy={buy} />
      ) : page === "lore" ? (
        <Lore />
      ) : page === "mycubbie" ? (
        <MyCubbie
          items={items}
          owned={owned}
          liked={liked}
          history={history}
          profile={profile}
          wallet={w}
          onSaveName={(name) => {
            setProfile((p) => ({ ...p, name }));
            say("Name saved in this browser.");
          }}
          onOpen={setSel}
          onToggleLike={toggleLike}
          onConnect={connect}
          onDisconnect={w.disconnect}
          onClearHistory={clearHistory}
        />
      ) : page === "market" ? (
        <Marketplace
          items={items}
          owned={owned}
          liked={liked}
          onOpen={setSel}
          onBid={buy}
        />
      ) : page === "not found" ? (
        <NotFound />
      ) : (
        <Home
          liked={liked}
          onOpen={setSel}
          onToggleLike={toggleLike}
        />
      )}

      <Footer />

      {sel && (
        <ArtworkModal
          item={sel}
          owned={owned}
          liked={liked}
          onClose={() => setSel(null)}
          onBuy={buy}
          onToggleLike={toggleLike}
          mode={modalMode}
        />
      )}

      <Toast toast={toast} />
    </>
  );
}
