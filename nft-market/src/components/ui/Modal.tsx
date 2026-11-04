import { useEffect, useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { X } from "lucide-react";

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

// Accessible dialog: Escape and backdrop close it, Tab stays inside, the page
// behind does not scroll, and focus returns to where it was when it closes.
// Pass `labelledBy` (id of the title) or `label`. className "split" = artwork layout.
interface ModalProps {
  onClose: () => void;
  labelledBy?: string;
  label?: string;
  className?: string;
  children: ReactNode;
}

export default function Modal({ onClose, labelledBy, label, className = "", children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeFn = useRef(onClose);
  closeFn.current = onClose;
  const split = className.split(/\s+/).includes("split");
  const dialogClass = [
    "relative max-h-[calc(100dvh-32px)] w-full max-w-[560px] overflow-y-auto overscroll-contain rounded-[var(--radius-lg)] border border-strong bg-card shadow-[var(--shadow-lg)]",
    split && "grid max-w-[960px] grid-cols-1 md:grid-cols-2",
    className.split(/\s+/).filter((name) => name !== "split").join(" "),
  ].filter(Boolean).join(" ");

  useEffect(() => {
    const prev = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const onKey = (e: KeyboardEvent<HTMLDivElement> | globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        closeFn.current();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const nodes = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);

    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] grid place-items-center bg-[var(--color-scrim)] p-3 md:p-6" onClick={() => closeFn.current()}>
      <div
        className={dialogClass}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : label}
      >
        <button type="button" className="fixed right-4 top-[calc(env(safe-area-inset-top,0px)+16px)] z-[2] grid size-[var(--tap)] place-items-center rounded-full border border-strong bg-[var(--color-overlay)] text-ink transition-colors hover:border-acc hover:text-acc md:absolute md:right-3 md:top-3" ref={closeRef} onClick={() => closeFn.current()} aria-label="Close">
          <X size={18} />
        </button>

        {children}
      </div>
    </div>
  );
}
