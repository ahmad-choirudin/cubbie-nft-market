import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

// Swipe / scroll-snap carousel with lime arrow boxes and a 01 / 08 counter.
// Give it one child per slide; itemClassName sets the slide width.
interface CarouselProps {
  label: string;
  children: ReactNode;
  itemClassName?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Carousel({ label, children, itemClassName = "" }: CarouselProps) {
  const track = useRef<HTMLUListElement>(null);
  const slides = Children.toArray(children);
  const count = slides.length;
  const [pos, setPos] = useState({ index: 0, atStart: true, atEnd: false });

  const stepOf = (el: HTMLElement) => {
    const first = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;

    return first ? first.offsetWidth + gap : el.clientWidth;
  };

  const update = useCallback(() => {
    const el = track.current;

    if (!el) return;

    const step = stepOf(el) || 1;

    setPos({
      index: Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / step))),
      atStart: el.scrollLeft <= 4,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, [count]);

  useEffect(() => {
    const el = track.current;

    if (!el) return;

    update();
    el.addEventListener("scroll", update, { passive: true });

    const ro = new ResizeObserver(update);

    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = track.current;

    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    el.scrollBy({ left: dir * stepOf(el), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <ul
        ref={track}
        tabIndex={0}
        className="m-0 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto p-0 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <li
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            className={`flex-none snap-start ${itemClassName}`}
          >
            {slide}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="kicker text-dim" aria-live="polite">
          <span className="text-ink">{pad(pos.index + 1)}</span> / {pad(count)}
        </p>

        <div className="flex gap-2">
          <Button icon variant="solid" aria-label="Previous" disabled={pos.atStart} onClick={() => go(-1)}>
            <ChevronLeft size={18} aria-hidden="true" />
          </Button>

          <Button icon variant="solid" aria-label="Next" disabled={pos.atEnd} onClick={() => go(1)}>
            <ChevronRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
