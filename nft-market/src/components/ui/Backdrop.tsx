// Full-bleed atmosphere image behind a section. The parent must be
// position: relative. Purely decorative, so it is hidden from screen readers.
import type { CSSProperties } from "react";

interface BackdropProps {
  src: string;
  eager?: boolean;
  fit?: string;
  opacity?: number;
  className?: string;
}

export default function Backdrop({ src, eager = false, fit = "50% 50%", opacity = 0.5, className = "" }: BackdropProps) {
  return (
    <div className={`bd pointer-events-none absolute inset-0 z-[-1] overflow-hidden after:absolute after:inset-0 after:bg-[linear-gradient(var(--color-bg),transparent_26%,transparent_66%,var(--color-bg))] after:content-[''] ${className}`} aria-hidden="true" style={{ "--bd-opacity": opacity, "--bd-pos": fit } as CSSProperties}>
      <img
        src={src}
        alt=""
        className="block h-full w-full object-cover opacity-[var(--bd-opacity,0.5)] [object-position:var(--bd-pos,50%_50%)]"
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : undefined}
      />
    </div>
  );
}
