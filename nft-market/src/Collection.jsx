import { Eye } from "lucide-react";
import ArtCard from "./ArtCard";
import "./Marketplace.css";

export default function Collection({
  items = [],
  owned = [],
  onOpen,
}) {
  // Tampilkan NFT yang dibeli dalam demo maupun yang dibuat sendiri.
  const mine = items.filter(
    (item) => owned.includes(item.id) || item.mine === true
  );

  const createdCount = mine.filter((item) => item.mine === true).length;
  const ownedCount = mine.filter((item) => owned.includes(item.id)).length;

  return (
    <main className="mk">
      <section className="mk-sec">
        <div className="mk-head">
          <h2>My Collection</h2>

          <span className="mk-count">
            {mine.length} Cubbies
          </span>
        </div>

        {mine.length === 0 ? (
          <div className="mk-empty">
            <p>
              Your collection is waiting for its first Cubbie.
              Explore the marketplace or create your own character.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <a className="mk-bid" href="#marketplace">
                Browse Marketplace
              </a>

              <a className="mk-bid" href="#create">
                Create Cubbie
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-7 flex flex-wrap gap-x-6 gap-y-2 font-m text-[10px] uppercase tracking-[0.14em] text-dim">
              <span>{ownedCount} Demo purchases</span>
              <span>{createdCount} Your creations</span>
            </div>

            <div className="mk-grid">
              {mine.map((item) => (
                <ArtCard
                  key={item.id}
                  item={item}
                  onOpen={() => onOpen?.(item)}
                  priceLabel={
                    item.mine
                      ? "Your creation"
                      : "Demo ownership"
                  }
                >
                  <button
                    type="button"
                    className="mk-hist"
                    onClick={() => onOpen?.(item)}
                  >
                    <Eye size={14} />
                    View
                  </button>
                </ArtCard>
              ))}
            </div>
          </>
        )}

        <p className="mt-8 text-xs leading-relaxed text-dim">
          Collection data is stored locally in this browser.
          Ownership shown here is for demonstration only and is not
          verified on a blockchain.
        </p>
      </section>
    </main>
  );
}
