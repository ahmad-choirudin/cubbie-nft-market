import type { CSSProperties } from "react";

export default function Avatar({ src, size = 28, flat = false }: { src: string; size?: number; flat?: boolean }) {
  return (
    <span className="inline-block size-[var(--avatar-size)] shrink-0 overflow-hidden rounded-full border border-strong bg-[var(--color-void)]" style={{ "--avatar-size": `${size}px` } as CSSProperties} aria-hidden="true">
      <img className={`block size-full object-cover [object-position:50%_12%] ${flat ? "" : "scale-[1.25] [transform-origin:50%_12%]"}`} src={src} alt="" loading="lazy" decoding="async" />
    </span>
  );
}