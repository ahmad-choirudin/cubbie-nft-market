import { useState } from "react";
import { Eye, ShoppingBag, Search } from "lucide-react";
import ArtCard from "./ArtCard";
import Avatar from "./Avatar";
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
  { name: "Cubbie Royal", by: "@nishar", ids: [13, 10, 11, 15] },
];

const SORTS = {
  newest: { label: "Newest", fn: (a, b) => b.id - a.id },
  low: { label: "Price: low to high", fn: (a, b) => a.price - b.price },
  high: { label: "Price: high to low", fn: (a, b) => b.price - a.price },
  liked: { label: "Most liked", fn: (a, b) => b.likes - a.likes },
  ending: { label: "Ending soon", fn: (a, b) => a.left - b.left },
};

export default function Marketplace({ items, sec, owned, liked, onOpen, onBid }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest");
  const [creator, setCreator] = useState(null);

  const byId = (id) => items.find((i) => i.id === id);

  // Daftar creator untuk filter: jumlah karya per owner
  const creators = Object.values(
    items.reduce((acc, i) => {
      acc[i.owner] = acc[i.owner] || { owner: i.owner, count: 0 };
      acc[i.owner].count += 1;
      return acc;
    }, {})
  );

  const shown = items
    .filter((i) => i.name.toLowerCase().includes(q.trim().toLowerCase()))
    .filter((i) => !creator || i.owner === creator)
    .sort(SORTS[sort].fn);

  const reset = () => { setQ(""); setCreator(null); setSort("newest"); };

  return (
    <main className="mk">
      <section className="mk-sec">
        <div className="mk-head">
          <h2>Today's Picks</h2>
          <span className="mk-count">{shown.length} Cubbies</span>
        </div>

        <div className="mk-tools">
          <label className="mk-search">
            <Search size={15} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Cubbies" aria-label="Search Cubbies" />
          </label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div className="mk-creators" role="group" aria-label="Filter by creator">
          <button className={`mk-creator ${!creator ? "on" : ""}`} onClick={() => setCreator(null)} aria-pressed={!creator}>All</button>
          {creators.map((c) => (
            <button
              key={c.owner}
              className={`mk-creator ${creator === c.owner ? "on" : ""}`}
              onClick={() => setCreator(creator === c.owner ? null : c.owner)}
              aria-pressed={creator === c.owner}
            >
              {c.owner}<small>{c.count}</small>
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <div className="mk-empty">
            <p>No Cubbies match your search.</p>
            <button className="mk-bid" onClick={reset}>Clear filters</button>
          </div>
        ) : (
          <div className={`mk-grid${!q.trim() && !creator ? " curated" : ""}`}>
            {shown.map((i) => (
              <ArtCard
                key={i.id}
                item={i}
                onOpen={() => onOpen(i)}
                likes={i.likes + (liked.includes(i.id) ? 1 : 0)}
                liked={liked.includes(i.id)}
                time={hms(i.left - sec)}
                priceLabel={owned.includes(i.id) ? "Owned" : "Current Bid"}
              >
                <button className="mk-bid" onClick={() => onBid(i)} disabled={owned.includes(i.id)}>
                  <ShoppingBag size={13} /> {owned.includes(i.id) ? "Owned" : "Buy Now"}
                </button>
                <button className="mk-hist" onClick={() => onOpen(i)}><Eye size={14} /> View</button>
              </ArtCard>
            ))}
          </div>
        )}
      </section>

      <section className="mk-sec">
        <div className="mk-head"><h2>Popular Collection</h2></div>
        <div className="mk-cols">
          {COLLECTIONS.map((c) => (
            <div key={c.name} className="mk-col">
              <div className="mk-colhead">
                <Avatar src={byId(c.ids[0])?.img} size={34} />
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

      <section className="mk-sec mk-make">
        <div>
          <h2>Make your own.</h2>
          <p>Upload an image, give it a name and a price.</p>
        </div>
        <a className="mk-bid solid" href="#create">Create NFT</a>
      </section>
    </main>
  );
}
