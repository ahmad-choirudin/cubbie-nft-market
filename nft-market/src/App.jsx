import { useEffect, useRef, useState } from "react";
import { Heart, ChevronLeft, ChevronRight, X, Check, AlertCircle } from "lucide-react";
import operator from "./assets/operator.jpg";
import bomber from "./assets/bomber.jpg";
import seraph from "./assets/seraph.jpg";
import chrome from "./assets/chrome.jpg";
import urban from "./assets/urban.jpg";
import ronin from "./assets/ronin.jpg";

// Koleksi CUBBIE. `left` = sisa detik lelang saat halaman dibuka.
const ITEMS = [
  { id: 1, name: "Cubbie Operator", img: operator, price: 0.8, likes: 92, owner: "@wzard", left: 11904 },
  { id: 2, name: "Cubbie Ronin", img: ronin, price: 1.2, likes: 148, owner: "@nishar", left: 8420 },
  { id: 3, name: "Cubbie Chrome", img: chrome, price: 2.4, likes: 203, owner: "@kilau", left: 15310 },
  { id: 4, name: "Cubbie Bomber", img: bomber, price: 0.65, likes: 61, owner: "@rimba", left: 5290 },
  { id: 5, name: "Cubbie Urban", img: urban, price: 0.95, likes: 77, owner: "@gema", left: 20100 },
  { id: 6, name: "Cubbie Seraph", img: seraph, price: 4.89, likes: 312, owner: "@nishar", left: 3790 },
];
const RELEASE = 3 * 3600 + 24 * 60 + 56;
const pad = (n) => String(n).padStart(2, "0");
const hms = (s) => { s = Math.max(0, s); return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map(pad); };
const short = (a) => `${a.slice(0, 6)}…${a.slice(-4)}`;

function useClock() {
  const t0 = useRef(Date.now());
  const [sec, setSec] = useState(0);
  useEffect(() => { const i = setInterval(() => setSec(Math.floor((Date.now() - t0.current) / 1000)), 1000); return () => clearInterval(i); }, []);
  return sec;
}

function useWallet() {
  const [acc, setAcc] = useState(null);
  const [bal, setBal] = useState(null);
  const load = async (a) => {
    setAcc(a);
    if (!a) return setBal(null);
    const b = await window.ethereum.request({ method: "eth_getBalance", params: [a, "latest"] });
    setBal((parseInt(b, 16) / 1e18).toFixed(3));
  };
  useEffect(() => {
    const e = window.ethereum;
    if (!e) return;
    e.request({ method: "eth_accounts" }).then((l) => load(l[0] || null)).catch(() => {});
    const on = (l) => load(l[0] || null);
    e.on?.("accountsChanged", on);
    return () => e.removeListener?.("accountsChanged", on);
  }, []);
  const connect = async () => {
    if (!window.ethereum) throw new Error("Wallet tidak ditemukan. Pasang MetaMask dulu.");
    load((await window.ethereum.request({ method: "eth_requestAccounts" }))[0]);
  };
  return { acc, bal, connect, disconnect: () => load(null) };
}

function Ring({ s }) {
  const r = 84, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 200 200" className="ring" aria-label="Time to Release">
      <circle cx="100" cy="100" r={r} className="trk" />
      <circle cx="100" cy="100" r={r} className="prg" strokeDasharray={c} strokeDashoffset={c * (1 - s / 60)} transform="rotate(-90 100 100)" />
      <text x="100" y="106" textAnchor="middle">Time to Release</text>
    </svg>
  );
}

export default function App() {
  const w = useWallet();
  const sec = useClock();
  const rail = useRef(null);
  const [sel, setSel] = useState(null);
  const [owned, setOwned] = useState([]);
  const [liked, setLiked] = useState([]);
  const [toast, setToast] = useState(null);

  const say = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3200); };
  const connect = () => w.connect().catch((e) => say(e.message, false));

  // Simulasi beli. Untuk transaksi asli, panggil smart contract (ethers/viem) di sini.
  const buy = (i) => {
    if (!w.acc) return say("Connect your wallet first to buy.", false);
    if (w.bal !== null && +w.bal < i.price) return say(`Saldo ${w.bal} ETH is lower than ${i.price} ETH.`, false);
    setOwned((o) => [...o, i.id]); setSel(null); say(`${i.name} is now yours.`);
  };
  const toggleLike = (id) => setLiked((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  const [h, m, s] = hms(RELEASE - sec);
  const hero = [ITEMS[0], ITEMS[1], ITEMS[2]];

  return (
    <>
      <header className="top">
        <a className="brand" href="#">Cubbie</a>
        <nav><a href="#market">Marketplace</a><a href="#release">Drops</a><a href="#hero">About</a></nav>
        <div className="reg">
          {w.acc
            ? <button className="btn ghost sm" onClick={w.disconnect} title="Disconnect wallet"><span className="dot" />{short(w.acc)} · {w.bal} ETH</button>
            : <button className="btn" onClick={connect}>Register</button>}
        </div>
      </header>

      <section className="hero" id="hero">
        <div className="panel">
          <div className="stack">
            {hero.map((i, k) => (
              <figure key={i.id} className={`pol p${k}`}>
                <img src={i.img} alt={i.name} />
                <figcaption><span>{i.name}</span><span>{i.price} ETH</span></figcaption>
              </figure>
            ))}
          </div>
          <div className="copy">
            <h1>Collect Extra Ordinary Cubbies.</h1>
            <p>A collection of all-black 3D Cubbie figures minted as NFTs on Ethereum. Pick your favorite Cubbie and own it before the auction ends.</p>
            <div className="row">
              <a className="btn" href="#market">Explore</a>
              <a className="btn ghost" href="#release">How it works?</a>
            </div>
            <div className="who">
              <div className="av">{ITEMS.slice(3).map((i) => <img key={i.id} src={i.img} alt="" />)}</div>
              <div>+500 NFT Collectors<small>★ 4.9</small></div>
            </div>
          </div>
        </div>
      </section>

      <div className="band" aria-hidden="true">
        <div className="track">{Array.from({ length: 24 }, (_, k) => <span key={k}>CUBBIE ART<i>✚</i></span>)}</div>
      </div>

      <section className="release" id="release">
        <div className="frame"><img src={seraph} alt="Cubbie Seraph" /></div>
        <div>
          <div className="date">Upcoming drop</div>
          <h2>Cubbie Seraph: Genesis Edition</h2>
          <div className="cd">
            <div className="boxes">
              <div className="box"><b>{h}</b><small>hrs</small></div>
              <div className="box"><b>{m}</b><small>min</small></div>
              <div className="box"><b>{s}</b><small>sec</small></div>
            </div>
            <Ring s={+s} />
          </div>
          <div className="owner"><img src={seraph} alt="" /><div><small>Owner</small>@nishar</div></div>
          <button className="btn" onClick={() => setSel(ITEMS[5])}>View Drop</button>
        </div>
      </section>

      <section className="sec" id="market">
        <h2>Top Artworks</h2>
        <div className="railwrap">
          <button className="arr l" aria-label="previous", onClick={() => rail.current.scrollBy({ left: -320, beus avior: "smooth" })}><ChevronLeft size={18} /></button>
          <div className="rail" ref={rail}>
            {ITEMS.map((i) => {
              const [a, b, c] = hms(i.left - sec);
              return (
                <article key={i.id} className="card" tabIndex={0} onClick={() => setSel(i)} onKeyDown={(e) => e.key === "Enter" && setSel(i)}>
                  <div className="shot"><img src={i.img} alt={i.name} /><div className="tm">{a}:{b}:{c}</div></div>
                  <div className="ct">{i.name}<span><Heart size={14} fill="currentColor" /> {i.likes + (liked.includes(i.id) ? 1 : 0)}</span></div>
                  <div className="ow"><img src={i.img} alt="" /><div><small>Owner</small>{i.owner}</div></div>
                  <div className="bid"><span>{owned.includes(i.id) ? "Owned" : "Current Bid"}</span><b>{i.price} ETH</b></div>
                </article>
              );
            })}
          </div>
          <button className="arr r" aria-label="Next" onClick={() => rail.current.scrollBy({ left: 320, behavior: "smooth" })}><ChevronRight size={18} /></button>
        </div>
      </section>

      <footer className="foot">© 2026 Cubbie. All artworks belong to the CUBBIE collection.</footer>

      {sel && (
        <div className="scrim" onClick={() => setSel(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={sel.name}>
            <button className="x" onClick={() => setSel(null)} aria-label="Tutup"><X size={18} /></button>
            <img src={sel.img} alt={sel.name} />
            <div className="info">
              <small>CUBBIE COLLECTION</small>
              <h3>{sel.name}</h3>
              <p className="date">Owner {sel.owner}</p>
              <div className="pr">{sel.price} <span>ETH</span></div>
              <div className="row">
                {owned.includes(sel.id)
                  ? <button className="btn ghost" disabled><Check size={14} /> You own this</button>
                  : <button className="btn" onClick={() => buy(sel)}>Buy Now</button>/button>}
                <button className="btn ghost" onClick={() => toggleLike(sel.id)}><Heart size={14} fill={liked.includes(sel.id) ? "currentColor" : "none"} /> Like</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {toast && <div className={`toast ${toast.ok ? "" : "err"}`} role="status">{toast.ok ? <Check size={16} /> : <AlertCircle size={16} />} {toast.msg}</div>}
    </>
  );
}
