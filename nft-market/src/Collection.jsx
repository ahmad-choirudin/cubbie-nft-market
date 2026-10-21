import { Eye } from "lucide-react";
import "./Marketplace.css";

export default function Collection({ items, owned, onOpen }) {
  const mine = items.filter((i) => owned.includes(i.id));
  const total = mine.reduce((s, i) => s + i.price, 0);

  return (
    <main className="mk">
      <section className="mk-sec">
        <div className="mk-head">
          <h2>My Collection</h2>
          {mine.length > 0 && <span className="mk-count">{mine.length} Cubbies · {total.toFixed(2)} ETH</span>}
        </div>

        {mine.length === 0 ? (
          <div className="mk-empty">
            <p>You don't own any Cubbies yet. Pick one in the marketplace and it will show up here.</p>
            <a className="mk-bid" href="#marketplace">Browse marketplace</a>
          </div>
        ) : (
          <div className="mk-grid">
            {mine.map((i) => (
              <article key={i.id} className="mk-card">
                <div className="mk-shot" onClick={() => onOpen(i)}><img src={i.img} alt={i.name} /></div>
                <div className="mk-title">{i.name}</div>
                <div className="mk-meta">
                  <div className="mk-by"><img src={i.img} alt="" /><div><small>Creator</small>{i.owner}</div></div>
                  <div className="mk-price"><small>Paid</small>{i.price} ETH</div>
                </div>
                <div className="mk-act">
                  <button className="mk-hist" onClick={() => onOpen(i)}><Eye size={14} /> View</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
