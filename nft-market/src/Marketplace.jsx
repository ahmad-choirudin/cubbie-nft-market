import { Heart, Eye, ShoppingBag, ArrowRight, Wallet, LayoutGrid, ImagePlus, Tag, Check } from "lucide-react";
import "./Marketplace.css";

const pad = (n) => String(n).padStart(2, "0");
const hms = (s) => {
  s = Math.max(0, s);
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map(pad).join(":");
};

// Koleksi populer: isi "ids" dengan id NFT dari ITEMS (4 id: 1 besar + 3 kecil)
const COLLECTIONS = [
  { name: "Cubbie Armor", by: "@wzard", ids: [1, 3, 4, 5] },
  { name: "Cubbie Warriors", by: "@nishar", ids: [2, 4, 5, 1] },
  { name: "Cubbie Genesis", by: "@kilau", ids: [6, 3, 2, 5] },
];

const STEPS = [
  { icon: Wallet, title: "Set up your wallet", text: "Install MetaMask, then press Register to connect your wallet to Cubbie." },
  { icon: LayoutGrid, title: "Create your collection", text: "Group your Cubbies into one collection with a name and a short description." },
  { icon: ImagePlus, title: "Add your NFTs", text: "Upload your artwork, set a title, and choose the collection it belongs to." },
  { icon: Tag, title: "List them for sale", text: "Choose an auction or a fixed price, then set how much you want to sell for." },
];

export default function Marketplace({ items, sec, owned, liked, onOpen, onBid }) {
  const byId = (id) => items.find((i) => i.id === id);

  // Top creators: jumlahkan harga NFT per owner
  const creators = Object.values(
    items.reduce((acc, i) => {
      acc[i.owner] = acc[i.owner] || { owner: i.owner, img: i.img, total: 0 };
      acc[i.owner].total += i.price;
      return acc;
    }, {})
  );

  return (
    <main className="mk">
      <section className="mk-sec">
        <h2>Top Creators</h2>
        <div className="mk-creators">
          {creators.map((c) => (
            <div key={c.owner} className="mk-creator">
              <div className="mk-ava"><img src={c.img} alt="" /><span className="mk-tick"><Check size={10} /></span></div>
              <b>{c.owner}</b>
              <small>{c.total.toFixed(2)} ETH</small>
            </div>
          ))}
        </div>
      </section>

      <section className="mk-sec">
        <div className="mk-head">
          <h2>Today's Picks</h2>
          <a href="#market">Explore more <ArrowRight size={14} /></a>
        </div>
        <div className="mk-grid">
          {items.map((i) => (
            <article key={i.id} className="mk-card">
              <div className="mk-shot" onClick={() => onOpen(i)}>
                <img src={i.img} alt={i.name} />
                <span className="mk-like"><Heart size={11} fill={liked.includes(i.id) ? "currentColor" : "none"} /> {i.likes + (liked.includes(i.id) ? 1 : 0)}</span>
                <span className="mk-time">{hms(i.left - sec)}</span>
              </div>
              <div className="mk-title">{i.name}</div>
              <div className="mk-meta">
                <div className="mk-by"><img src={i.img} alt="" /><div><small>Creator</small>{i.owner}</div></div>
                <div className="mk-price"><small>{owned.includes(i.id) ? "Owned" : "Current Bid"}</small>{i.price} ETH</div>
              </div>
              <div className="mk-act">
                <button className="mk-bid" onClick={() => onBid(i)} disabled={owned.includes(i.id)}>
                  <ShoppingBag size={13} /> {owned.includes(i.id) ? "Owned" : "Place Bid"}
                </button>
                <button className="mk-hist" onClick={() => onOpen(i)}><Eye size={14} /> View History</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mk-sec">
        <div className="mk-head">
          <h2>Popular Collection</h2>
          <a href="#market">Explore more <ArrowRight size={14} /></a>
        </div>
        <div className="mk-cols">
          {COLLECTIONS.map((c) => (
            <div key={c.name} className="mk-col">
              <div className="mk-colhead">
                <img src={byId(c.ids[0])?.img} alt="" />
                <div><b>{c.name}</b><small>Created by {c.by}</small></div>
              </div>
              <div className="mk-mosaic">
                {c.ids.map((id, k) => (
                  <img key={k} src={byId(id)?.img} alt="" onClick={() => onOpen(byId(id))} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mk-sec">
        <h2>Create and sell your NFTs</h2>
        <div className="mk-steps">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="mk-step">
              <span className="mk-ic"><Icon size={18} /></span>
              <b>{title}</b>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
