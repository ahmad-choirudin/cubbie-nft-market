import { useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import ArtCard from "./ArtCard";
import "./Marketplace.css";

function compressImage(file, maxSize = 640) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Gagal membaca gambar."));

    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error("File bukan gambar yang valid."));

      image.onload = () => {
        const scale = Math.min(
          1,
          maxSize / Math.max(image.width, image.height)
        );

        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Tidak dapat memproses gambar."));
          return;
        }

        context.fillStyle = "#090A09";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}

export default function Create({
  created = [],
  owner = "You",
  onCreate,
  onRemove,
}) {
  const [img, setImg] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const pickImage = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Pilih file gambar JPG, PNG, atau WEBP.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 8 MB.");
      return;
    }

    try {
      const compressed = await compressImage(file);
      setImg(compressed);
    } catch (err) {
      setError(err.message || "Gagal memproses gambar.");
    }
  };

  const submit = (event) => {
    event.preventDefault();
    setError("");

    const cleanName = name.trim();
    const numericPrice = Number(price);

    if (!img) {
      setError("Tambahkan gambar Cubbie terlebih dahulu.");
      return;
    }

    if (cleanName.length < 2 || cleanName.length > 40) {
      setError("Nama harus terdiri dari 2–40 karakter.");
      return;
    }

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0.001 ||
      numericPrice > 1000
    ) {
      setError("Masukkan harga antara 0.001 dan 1000 ETH.");
      return;
    }

    if (created.length >= 20) {
      setError("Maksimal 20 kreasi. Hapus salah satu untuk melanjutkan.");
      return;
    }

    if (typeof onCreate !== "function") {
      setError("Fitur pembuatan belum tersedia.");
      return;
    }

    setBusy(true);

    try {
      onCreate({
        id: Date.now(),
        name: cleanName,
        img,
        price: numericPrice,
        likes: 0,
        owner: owner || "You",
        left: 86400,
        mine: true,
        demo: true,
      });

      setName("");
      setPrice("");
      setImg(null);
    } catch {
      setError("Gagal menambahkan kreasi. Silakan coba lagi.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mk">
      <section className="mk-sec">
        <div className="mk-head">
          <h2>Create NFT</h2>
          <span className="mk-count">Demo creation</span>
        </div>

        <div className="cr">
          <form className="cr-form" onSubmit={submit}>
            <label className="cr-drop">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={pickImage}
              />

              {img ? (
                <img src={img} alt="Cubbie preview" />
              ) : (
                <span>
                  <ImagePlus size={26} />
                  Choose your Cubbie artwork
                </span>
              )}
            </label>

            <label className="cr-field">
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Cubbie Samurai"
                maxLength={40}
                required
              />
            </label>

            <label className="cr-field">
              Demo price (ETH)
              <input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="0.5"
                inputMode="decimal"
                type="number"
                step="0.001"
                min="0.001"
                max="1000"
                required
              />
            </label>

            {error && (
              <p className="cr-err" role="alert">
                {error}
              </p>
            )}

            <button
              className="mk-bid cr-go"
              type="submit"
              disabled={busy}
            >
              {busy ? "Creating..." : "Add to Demo Collection"}
            </button>

            <p className="text-xs leading-relaxed text-dim">
              This is a local demo. Your artwork and details are saved in
              this browser. No NFT is minted and no blockchain transaction
              takes place.
            </p>
          </form>

          <div className="cr-prev">
            <small>Live Preview</small>

            <ArtCard
              item={{
                name: name.trim() || "Your Cubbie",
                img,
                owner: owner || "You",
                price: price || "0",
                mine: true,
              }}
              priceLabel="Demo preview"
            />
          </div>
        </div>
      </section>

      {created.length > 0 && (
        <section className="mk-sec">
          <div className="mk-head">
            <h2>Your Creations</h2>
            <span className="mk-count">
              {created.length} / 20
            </span>
          </div>

          <div className="cr-list">
            {created.map((item) => (
              <div key={item.id} className="cr-row">
                <img src={item.img} alt={item.name} />

                <div>
                  <b>{item.name}</b>
                  <small>{item.price} ETH · Demo</small>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove?.(item.id)}
                  aria-label={`Remove ${item.name}`}
                  title="Remove creation"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
