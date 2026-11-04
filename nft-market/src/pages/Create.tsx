import { useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import ArtCard from "../components/marketplace/ArtCard";
import { compressImage } from "../utils/compressImage";
import SectionHeading from "../components/ui/SectionHeading";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import type { ChangeEvent, FormEvent } from "react";
import type { Collectible } from "../types";

interface CreateProps {
  created: Collectible[];
  owner?: string;
  onCreate?: (item: Collectible) => void;
  onRemove?: (id: number) => void;
}

export default function Create({ created, owner = "You", onCreate, onRemove }: CreateProps) {
  const [img, setImg] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const pickImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Choose a JPG, PNG, WEBP or GIF image.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Images can be 8 MB at most.");
      return;
    }

    try {
      const compressed = await compressImage(file);
      setImg(compressed);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not process the image.");
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const cleanName = name.trim();
    const numericPrice = Number(price);

    if (!img) {
      setError("Add your Cubbie artwork first.");
      return;
    }

    if (cleanName.length < 2 || cleanName.length > 40) {
      setError("The name must be 2–40 characters.");
      return;
    }

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0.001 ||
      numericPrice > 1000
    ) {
      setError("Enter a demo price between 0.001 and 1000 ETH.");
      return;
    }

    if (created.length >= 20) {
      setError("You can keep 20 creations at most. Remove one to continue.");
      return;
    }

    if (typeof onCreate !== "function") {
      setError("Creating is not available right now.");
      return;
    }

    setBusy(true);

    try {
      onCreate({
        id: Math.max(Date.now(), ...created.map((c) => c.id + 1)),
        name: cleanName,
        img,
        price: numericPrice,
        likes: 0,
        owner: owner || "You",
        mine: true,
      });

      setName("");
      setPrice("");
      setImg(null);
    } catch {
      setError("Could not add the creation. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1320px] px-[clamp(16px,3vw,32px)] pb-24 pt-6 text-ink sm:pt-12">
      <section>
        <SectionHeading title="Create a Cubbie" aside={<>Demo creation</>} />

        <div className="grid gap-[clamp(28px,4vw,56px)] md:grid-cols-[1.2fr_1fr] md:items-start">
          <form className="flex flex-col gap-5" onSubmit={submit}>
            <label className="relative grid aspect-square max-h-[420px] cursor-pointer place-items-center overflow-hidden rounded-[var(--radius-sm)] border border-dashed border-strong bg-slab text-dim transition-colors hover:border-ink focus-within:border-ink [&_input]:absolute [&_input]:inset-0 [&_input]:cursor-pointer [&_input]:opacity-0 [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_span]:grid [&_span]:justify-items-center [&_span]:gap-2.5 [&_span]:text-sm">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={pickImage}
              />

              {img ? (
                <img src={img} alt="Cubbie preview" />
              ) : (
                <span>
                  <ImagePlus size={26} aria-hidden="true" />
                  Choose your Cubbie artwork
                </span>
              )}
            </label>

            <Input
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Cubbie Samurai"
              maxLength={40}
              required
            />

            <Input
              label="Demo price (ETH)"
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

            {error && (
              <p className="m-0 rounded-[var(--radius-sm)] bg-[var(--color-danger-soft)] px-3.5 py-[11px] text-[13px] text-[var(--color-danger-text)]" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" full loading={busy}>
              {busy ? "Creating..." : "Add to Demo Collection"}
            </Button>

            <p className="text-xs leading-relaxed text-dim">
              This is a local demo. Your artwork and details are saved in
              this browser. No NFT is minted and no blockchain transaction
              takes place.
            </p>
          </form>

          <div className="[&>small]:mb-3 [&>small]:block [&>small]:text-t-xs [&>small]:text-dim">
            <small>Live Preview</small>

            <ArtCard
              item={{
                name: name.trim() || "Your Cubbie",
                img: img ?? undefined,
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
        <section className="mt-[var(--section-y)]">
          <SectionHeading title="Your Creations" aside={<>{created.length} / 20</>} />

          <div className="grid gap-2.5">
            {created.map((item) => (
              <div key={item.id} className="flex items-center gap-3.5 rounded-[var(--radius-sm)] border border-edge bg-card p-2.5">
                <img className="size-[52px] rounded-sm object-cover" src={item.img || ""} alt={item.name} />

                <div className="min-w-0 flex-1 text-sm">
                  <b>{item.name}</b>
                  <small className="block text-t-xs text-dim">{item.price} ETH · Demo</small>
                </div>

                <button
                  type="button"
                  className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-sm)] text-danger transition-colors hover:bg-[var(--color-danger-soft)]"
                  onClick={() => onRemove?.(item.id)}
                  aria-label={`Remove ${item.name}`}
                  title="Remove creation"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
