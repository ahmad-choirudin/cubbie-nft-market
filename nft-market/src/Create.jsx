import { useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import ArtCard from "./ArtCard";
import "./Marketplace.css";

function compress(file, max = 640) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("This file is not a valid image."));
      img.onload = () => {
        const r = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * r);
        c.height = Math.round(img.height * r);
        const x = c.getContext("2d");
        x.fillStyle = "#000";
        x.fillRect(0, 0, c.width, c.height);
        x.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function Create({ created, owner, onCreate, onRemove }) {
  const [img, setImg] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const pick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr("");
    if (!f.type.startsWith("image/")) return setErr("Please choose an image file (JPG, PNG, WEBP).");
    if (f.size > 8 * 1024 * 1024) return setErr("Image is too large. Use one under 8 MB.");
    try { setImg(await compress(f)); } catch (x) { setErr(x.message); }
  };

  const submit = async (e) => {
    e.preventDefault();
    const n = name.trim();
    const p = parseFloat(price);
    if (!img) return setErr("Add an image for your Cubbie.");
    if (n.length < 2 || n.length > 40) return setErr("Name must be 2 to 40 characters.");
    if (!(p >= 0.001) || p > 1000) return setErr("Enter a price between 0.001 and 1000 ETH.");
    if (created.length >= 20) return setErr("You reached the limit of 20 NFTs. Remove one first.");
    setBusy(true);
    onCreate({ id: Date.now(), name: n, img, price: p, likes: 0, owner, left: 86400, mine: true });
    setBusy(false);
  };

  return (
    <main className="mk">
      <section className="mk-sec">
        <h2>Create NFT</h2>
        <div className="cr">
          <form className="cr-form" onSubmit={submit}>
            <label className="cr-drop">
              <input type="file" accept="image/*" onChange={pick} />
              {img ? <img src={img} alt="Preview" /> : <span><ImagePlus size={26} />Tap to choose an image</span>}
            </label>

            <label className="cr-field">Name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Cubbie Samurai" maxLength={40} />
            </label>

            <label className="cr-field">Price (ETH)
              <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.5" inputMode="decimal" type="number" step="0.001" min="0" />
            </label>

            {err && <p className="cr-err" role="alert">{err}</p>}
            <button className="mk-bid cr-go" type="submit" disabled={busy}>Create NFT</button>
          </form>

          <div className="cr-prev">
            <small>Preview</small>
            <ArtCard item={{ name: name.trim() || "Your Cubbie", img, owner, price: price || "0", mine: true }} />
          </div>
        </div>
      </section>

      {created.length > 0 && (
        <section className="mk-sec">
          <h2>Your creations</h2>
          <div className="cr-list">
            {created.map((i) => (
              <div key={i.id} className="cr-row">
                <img src={i.img} alt="" />
                <div><b>{i.name}</b><small>{i.price} ETH</small></div>
                <button onClick={() => onRemove(i.id)} aria-label={`Remove ${i.name}`}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
