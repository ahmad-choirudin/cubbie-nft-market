import { useEffect, useRef, useState } from "react";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

import Header from "./Header";
import Footer from "./Footer";
import Marketplace from "./Marketplace";
import Collection from "./Collection";
import Create from "./Create";
import Avatar from "./Avatar";

import operator from "./assets/operator.webp";
import bomber from "./assets/bomber.webp";
import seraph from "./assets/seraph.webp";
import chrome from "./assets/chrome.webp";
import urban from "./assets/urban.webp";
import ronin from "./assets/ronin.webp";
import gentleman from "./assets/gentleman.webp";
import boss from "./assets/boss.webp";
import casual from "./assets/casual.webp";
import kimono from "./assets/kimono.webp";
import astronaut from "./assets/astronaut.webp";
import dojo from "./assets/dojo.webp";
import king from "./assets/king.webp";
import striker from "./assets/striker.webp";
import ninjachef from "./assets/ninjachef.webp";
import rocker from "./assets/rocker.webp";

// --------------------------------------------------
// SAMPLE MARKETPLACE DATA
// Semua harga, likes, owner, dan timer adalah data demo.
// --------------------------------------------------

const ITEMS = [
  { id: 1, name: "Cubbie Operator", img: operator, price: 0.8, likes: 92, owner: "@wzard", left: 11904 },
  { id: 2, name: "Cubbie Ronin", img: ronin, price: 1.2, likes: 148, owner: "@nishar", left: 8420 },
  { id: 3, name: "Cubbie Chrome", img: chrome, price: 2.4, likes: 203, owner: "@kilau", left: 15310 },
  { id: 4, name: "Cubbie Bomber", img: bomber, price: 0.65, likes: 61, owner: "@rimba", left: 5290 },
  { id: 5, name: "Cubbie Urban", img: urban, price: 0.95, likes: 77, owner: "@gema", left: 20100 },
  { id: 6, name: "Cubbie Seraph", img: seraph, price: 4.89, likes: 312, owner: "@nishar", left: 3790 },
  { id: 7, name: "Cubbie Gentleman", img: gentleman, price: 0.7, likes: 54, owner: "@wzard", left: 9800 },
  { id: 8, name: "Cubbie Boss", img: boss, price: 1.1, likes: 88, owner: "@gema", left: 14200 },
  { id: 9, name: "Cubbie Casual", img: casual, price: 0.5, likes: 39, owner: "@rimba", left: 7300 },
  { id: 10, name: "Cubbie Kimono", img: kimono, price: 1.6, likes: 121, owner: "@kilau", left: 18600 },
  { id: 11, name: "Cubbie Astronaut", img: astronaut, price: 2.1, likes: 176, owner: "@nishar", left: 12500 },
  { id: 12, name: "Cubbie Dojo", img: dojo, price: 0.85, likes: 67, owner: "@wzard", left: 6100 },
  { id: 13, name: "Cubbie King", img: king, price: 3.5, likes: 264, owner: "@nishar", left: 21700 },
  { id: 14, name: "Cubbie Striker", img: striker, price: 0.6, likes: 45, owner: "@gema", left: 4400 },
  { id: 15, name: "Cubbie Ninja Chef", img: ninjachef, price: 1.9, likes: 139, owner: "@kilau", left: 16800 },
  { id: 16, name: "Cubbie Rocker", img: rocker, price: 1.4, likes: 102, owner: "@rimba", left: 10900 },
];

const RELEASE = 3 * 3600 + 24 * 60 + 56;

const pad = (n) => String(n).padStart(2, "0");

const hms = (s) => {
  s = Math.max(0, s);

  return [
    Math.floor(s / 3600),
    Math.floor((s % 3600) / 60),
    s % 60,
  ].map(pad);
};

// --------------------------------------------------
// LOCAL STORAGE
// --------------------------------------------------

function usePersist(key, init, ok = () => true) {
  const [v, setV] = useState(() => {
    try {
      const r = localStorage.getItem(key);
      const p = r ? JSON.parse(r) : init;

      return Array.isArray(init)
        ? Array.isArray(p)
          ? p.filter(ok)
          : init
        : p;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      // Local storage unavailable.
    }
  }, [key, v]);

  return [v, setV];
}

const short = (a) => `${a.slice(0, 6)}…${a.slice(-4)}`;

// --------------------------------------------------
// CLOCK
// --------------------------------------------------

function useClock() {
  const t0 = useRef(Date.now());
  const [sec, setSec] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setSec(Math.floor((Date.now() - t0.current) / 1000));
    }, 1000);

    return () => clearInterval(i);
  }, []);

  return sec;
}

// --------------------------------------------------
// WALLET
// --------------------------------------------------

const OFF_KEY = "cubbie-wallet-off";

const walletOff = {
  get: () => {
    try {
      return localStorage.getItem(OFF_KEY) === "1";
    } catch {
      return false;
    }
  },

  set: (on) => {
    try {
      if (on) {
        localStorage.setItem(OFF_KEY, "1");
      } else {
        localStorage.removeItem(OFF_KEY);
      }
    } catch {
      // Local storage unavailable.
    }
  },
};

function useWallet() {
  const [acc, setAcc] = useState(null);
  const [bal, setBal] = useState(null);

  const load = async (a) => {
    setAcc(a);

    if (!a) {
      return setBal(null);
    }

    try {
      const b = await window.ethereum.request({
        method: "eth_getBalance",
        params: [a, "latest"],
      });

      setBal((parseInt(b, 16) / 1e18).toFixed(3));
    } catch {
      setBal(null);
    }
  };

  useEffect(() => {
    const e = window.ethereum;

    if (!e) return;

    const sync = () => {
      e.request({ method: "eth_accounts" })
        .then((l) => load(l[0] || null))
        .catch(() => {});
    };

    if (!walletOff.get()) sync();

    const onAcc = (l) => {
      if (!walletOff.get()) {
        load(l[0] || null);
      }
    };

    const onChain = () => {
      if (!walletOff.get()) sync();
    };

    e.on?.("accountsChanged", onAcc);
    e.on?.("chainChanged", onChain);

    return () => {
      e.removeListener?.("accountsChanged", onAcc);
      e.removeListener?.("chainChanged", onChain);
    };
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      throw new Error(
        "Wallet not found. Please install MetaMask first."
      );
    }

    const l = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    walletOff.set(false);
    load(l[0] || null);
  };

  return {
    acc,
    bal,
    connect,
    disconnect: () => {
      walletOff.set(true);
      load(null);
    },
  };
}

// --------------------------------------------------
// SCROLL REVEAL
// --------------------------------------------------

function useReveal(dep) {
  useEffect(() => {
    const els = document.querySelectorAll(".rv:not(.in)");

    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (list) => {
        list.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    els.forEach((e) => io.observe(e));

    return () => io.disconnect();
  }, [dep]);
}

// --------------------------------------------------
// COUNTDOWN RING
// --------------------------------------------------

function Ring({ s }) {
  const r = 84;
  const c = 2 * Math.PI * r;

  return (
    <svg
      viewBox="0 0 200 200"
      className="ring"
      aria-label="Demo countdown"
    >
      <circle
        cx="100"
        cy="100"
        r={r}
        className="trk"
      />

      <circle
        cx="100"
        cy="100"
        r={r}
        className="prg"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - s / 60)}
        transform="rotate(-90 100 100)"
      />

      <text
        x="100"
        y="106"
        textAnchor="middle"
      >
        Demo Timer
      </text>
    </svg>
  );
}

// --------------------------------------------------
// MAIN APPLICATION
// --------------------------------------------------

export default function App() {
  const w = useWallet();
  const sec = useClock();

  const rail = useRef(null);
  const closeRef = useRef(null);

  const [owned, setOwned] = usePersist(
    "cubbie-owned",
    [],
    (x) => typeof x === "number"
  );

  const [liked, setLiked] = usePersist(
    "cubbie-liked",
    [],
    (x) => typeof x === "number"
  );

  const [created, setCreated] = usePersist(
    "cubbie-created",
    [],
    (x) =>
      x &&
      typeof x.name === "string" &&
      typeof x.img === "string" &&
      typeof x.price === "number"
  );

  const [toast, setToast] = useState(null);
  const [sel, setSel] = useState(null);
  const [menu, setMenu] = useState(false);

  // Navigation
  const pageFromHash = () => {
    if (location.hash === "#marketplace") return "market";
    if (location.hash === "#collection") return "collection";
    if (location.hash === "#create") return "create";

    return "home";
  };

  const [page, setPage] = useState(pageFromHash);

  useEffect(() => {
    const onHash = () => {
      setPage(pageFromHash());
      setMenu(false);
    };

    window.addEventListener("hashchange", onHash);

    return () => {
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (page === "home" && location.hash) {
      setTimeout(() => {
        document
          .querySelector(location.hash)
          ?.scrollIntoView();
      }, 0);
    }
  }, [page]);

  useReveal(page);

  // Modal keyboard and scroll management
  useEffect(() => {
    if (!sel) return;

    const prev = document.activeElement;

    const onKey = (e) => {
      if (e.key === "Escape") {
        setSel(null);
      }
    };

    window.addEventListener("keydown", onKey);

    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);

      document.body.style.overflow = overflow;

      prev?.focus?.();
    };
  }, [sel]);

  // Toast
  const say = (msg, ok = true) => {
    setToast({ msg, ok });

    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // MetaMask connection
  const connect = () => {
    if (!window.ethereum) {
      const mobile = /Android|iPhone|iPad|iPod/i.test(
        navigator.userAgent
      );

      const url = mobile
        ? `https://metamask.app.link/dapp/${location.host}${location.pathname}${location.search}`
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

    w.connect().catch((e) => say(e.message, false));
  };

  // Demo purchase
  const buy = (item) => {
    if (!w.acc) {
      return say("Connect your wallet first to buy.", false);
    }

    if (w.bal !== null && +w.bal < item.price) {
      return say(
        `Your balance of ${w.bal} ETH is lower than ${item.price} ETH.`,
        false
      );
    }

    setOwned((o) =>
      o.includes(item.id) ? o : [...o, item.id]
    );

    setSel(null);

    say(`${item.name} added to your demo collection.`);
  };

  // Likes
  const toggleLike = (id) => {
    setLiked((l) =>
      l.includes(id)
        ? l.filter((x) => x !== id)
        : [...l, id]
    );
  };

  const [h, m, s] = hms(RELEASE - sec);

  const hero = [
    ITEMS[0],
    ITEMS[1],
    ITEMS[2],
  ];

  const items = [...ITEMS, ...created];

  const me = w.acc ? short(w.acc) : "@you";

  // Create NFT
  const onCreate = (n) => {
    setCreated((c) => [...c, n]);

    say(`${n.name} added to your demo marketplace.`);

    location.hash = "#marketplace";
  };

  // Remove created NFT
  const onRemove = (id) => {
    setCreated((c) => c.filter((x) => x.id !== id));

    setOwned((o) => o.filter((x) => x !== id));
  };

  return (
    <>
      <Header
        owned={owned.length}
        wallet={
          w.acc
            ? `${short(w.acc)} · ${w.bal ?? "—"} ETH`
            : null
        }
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
      ) : page === "collection" ? (
        <Collection
          items={items}
          owned={owned}
          onOpen={setSel}
        />
      ) : page === "market" ? (
        <Marketplace
          items={items}
          sec={sec}
          owned={owned}
          liked={liked}
          onOpen={setSel}
          onBid={buy}
        />
      ) : (
        <>
          {/* HERO */}
          <section className="hero" id="hero">
            <div className="panel">
              <div className="stack">
                {hero.map((i, k) => (
                  <figure
                    key={i.id}
                    className={`pol p${k}`}
                  >
                    <img
                      src={i.img}
                      alt={i.name}
                      decoding="async"
                    />

                    <figcaption>
                      <span>{i.name}</span>
                      <span>{i.price} ETH</span>
                    </figcaption>
                  </figure>
                ))}
              </div>

              <div className="copy">
                <span className="eyebrow">
                  Cubbie Universe / Collectibles
                </span>

                <h1>
                  Collect
                  <br />
                  Extraordinary
                  <br />
                  Cubbies.
                </h1>

                <p>
                  Explore the Cubbie character collection.
                  Discover distinctive designs, browse
                  the marketplace, and create your own
                  Cubbie artwork.
                </p>

                <div className="row">
                  <a className="btn" href="#marketplace">
                    Explore Market
                  </a>

                  <a className="btn ghost" href="#release">
                    Discover
                  </a>
                </div>

                <div className="who">
                  <div className="av">
                    {ITEMS.slice(3, 6).map((i) => (
                      <Avatar
                        key={i.id}
                        src={i.img}
                        size={32}
                      />
                    ))}
                  </div>

                  <div>
                    <span>Character collection</span>
                    <small>Sample marketplace data</small>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TICKER */}
          <div className="band" aria-hidden="true">
            <div className="track">
              {Array.from({ length: 24 }, (_, k) => (
                <span key={k}>
                  CUBBIE UNIVERSE
                  <i>✳</i>
                </span>
              ))}
            </div>
          </div>

          {/* DEMO DROP */}
          <section
            className="release rv"
            id="release"
          >
            <div className="frame">
              <img
                src={seraph}
                alt="Cubbie Seraph"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div>
              <div className="date">
                Demo / Countdown
              </div>

              <h2>
                Cubbie Seraph
                <br />
                Character Spotlight
              </h2>

              <div className="cd">
                <div className="boxes">
                  <div className="box">
                    <b>{h}</b>
                    <small>hrs</small>
                  </div>

                  <div className="box">
                    <b>{m}</b>
                    <small>min</small>
                  </div>

                  <div className="box">
                    <b>{s}</b>
                    <small>sec</small>
                  </div>
                </div>

                <Ring s={+s} />
              </div>

              <div className="owner">
                <Avatar src={seraph} size={44} />

                <div>
                  <small>Sample owner</small>
                  @nishar
                </div>
              </div>

              <button
                className="btn"
                onClick={() => setSel(ITEMS[5])}
              >
                Explore Character
              </button>
            </div>
          </section>

          {/* TOP ARTWORKS */}
          <section
            className="sec rv"
            id="market"
          >
            <h2>Top Artworks</h2>

            <div className="railwrap">
              <button
                className="arr l"
                aria-label="Previous artworks"
                onClick={() =>
                  rail.current?.scrollBy({
                    left: -320,
                    behavior: "smooth",
                  })
                }
              >
                <ChevronLeft size={18} />
              </button>

              <div className="rail" ref={rail}>
                {ITEMS.map((i) => {
                  const [a, b, c] = hms(i.left - sec);

                  return (
                    <article
                      key={i.id}
                      className="card"
                      tabIndex={0}
                      role="button"
                      aria-label={`View ${i.name}`}
                      onClick={() => setSel(i)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" ||
                          e.key === " "
                        ) {
                          e.preventDefault();
                          setSel(i);
                        }
                      }}
                    >
                      <div className="shot">
                        <img
                          src={i.img}
                          alt={i.name}
                          loading="lazy"
                          decoding="async"
                        />

                        <div className="tm">
                          {a}:{b}:{c}
                        </div>
                      </div>

                      <div className="ct">
                        {i.name}

                        <span>
                          <Heart
                            size={14}
                            fill="currentColor"
                          />

                          {i.likes +
                            (liked.includes(i.id) ? 1 : 0)}
                        </span>
                      </div>

                      <div className="ow">
                        <Avatar
                          src={i.img}
                          size={30}
                        />

                        <div>
                          <small>Sample owner</small>
                          {i.owner}
                        </div>
                      </div>

                      <div className="bid">
                        <span>
                          {owned.includes(i.id)
                            ? "Owned"
                            : "Demo price"}
                        </span>

                        <b>{i.price} ETH</b>
                      </div>
                    </article>
                  );
                })}
              </div>

              <button
                className="arr r"
                aria-label="Next artworks"
                onClick={() =>
                  rail.current?.scrollBy({
                    left: 320,
                    behavior: "smooth",
                  })
                }
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </section>
        </>
      )}

      <Footer />

      {/* ARTWORK MODAL */}
      {sel && (
        <div
          className="scrim"
          onClick={() => setSel(null)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={sel.name}
          >
            <button
              className="x"
              ref={closeRef}
              onClick={() => setSel(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <img src={sel.img} alt={sel.name} />

            <div className="info">
              <small>
                CUBBIE COLLECTION / DEMO
              </small>

              <h3>{sel.name}</h3>

              <p className="date">
                Sample owner: {sel.owner}
              </p>

              <div className="pr">
                {sel.price}
                <span> ETH</span>
              </div>

              <div className="row">
                {owned.includes(sel.id) ? (
                  <button
                    className="btn ghost"
                    disabled
                  >
                    <Check size={14} />
                    You own this
                  </button>
                ) : (
                  <button
                    className="btn"
                    onClick={() => buy(sel)}
                  >
                    Buy Now
                  </button>
                )}

                <button
                  className="btn ghost"
                  onClick={() => toggleLike(sel.id)}
                >
                  <Heart
                    size={14}
                    fill={
                      liked.includes(sel.id)
                        ? "currentColor"
                        : "none"
                    }
                  />

                  {liked.includes(sel.id)
                    ? "Liked"
                    : "Like"}
                </button>
              </div>

              <p className="date">
                Demo interface. No blockchain transaction
                or smart contract is executed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div
          className={`toast ${toast.ok ? "" : "err"}`}
          role="status"
        >
          {toast.ok ? (
            <Check size={16} />
          ) : (
            <AlertCircle size={16} />
          )}

          {toast.msg}
        </div>
      )}
    </>
  );
}
