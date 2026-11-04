import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ITEMS } from "../../data/cubbie";
import type { CatalogItem } from "../../types";
import "../../styles/HeroCarousel.css";

// Characters shown in the hero, in order. Change the ids to feature other characters.
const HERO_IDS = [20, 9, 24, 17, 21, 16];
const SLIDES = HERO_IDS.map((id) => ITEMS.find((i) => i.id === id)).filter((i): i is CatalogItem => Boolean(i));
const AUTOPLAY_MS = 4800;

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Where a slide sits relative to the active one: centre, left or right neighbour, or hidden.
function position(i: number, active: number, n: number): "-1" | "0" | "1" | "far" {
  let off = (((i - active) % n) + n) % n;
  if (off > n / 2) off -= n;
  if (off === 0) return "0";
  if (off === 1) return "1";
  if (off === -1) return "-1";
  return "far";
}

export default function HeroCarousel({ className = "" }: { className?: string }) {
  const n = SLIDES.length;
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(reducedMotion);
  const pointerStart = useRef<{ id: number; x: number } | null>(null);
  const dragged = useRef(false);

  const go = useCallback((d: number) => setIndex((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Restart the interval after each change so manual navigation gets a full interval.
  useEffect(() => {
    if (reduced || n < 2) return;
    const t = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [reduced, n, go, index]);

  if (n === 0) return null;

  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStart.current = { id: event.pointerId, x: event.clientX };
    dragged.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    if (!start || start.id !== event.pointerId) return;

    const distance = event.clientX - start.x;
    pointerStart.current = null;
    if (Math.abs(distance) < 44) return;
    dragged.current = true;
    go(distance < 0 ? 1 : -1);
  };

  const onPointerCancel = () => {
    pointerStart.current = null;
  };

  return (
    <section
      className={`hc ${className}`}
      aria-roledescription="carousel"
      aria-label="Featured characters"
      onKeyDown={onKey}
    >
      <div
        className="hc-stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <span className="hc-glow" aria-hidden="true" />
        <span className="hc-ring" aria-hidden="true" />

        <ul className="hc-slides">
          {SLIDES.map((item, i) => {
            const pos = position(i, index, n);
            const current = pos === "0";

            return (
              <li
                key={item.id}
                className="hc-slide"
                data-pos={pos}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${n}`}
                aria-hidden={!current}
              >
                <a
                  className="hc-card"
                  href={`#character/${item.slug}`}
                  tabIndex={current ? 0 : -1}
                  onClick={(e) => {
                    if (dragged.current) {
                      e.preventDefault();
                      dragged.current = false;
                      return;
                    }
                    if (!current) {
                      e.preventDefault();
                      setIndex(i);
                    }
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    width="464"
                    height="576"
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="hc-bar">
        <div className="hc-ctrl">
          <button type="button" className="hc-btn" onClick={() => go(-1)} aria-label="Previous character">
            <ChevronLeft size={18} aria-hidden="true" />
          </button>

          <div className="hc-dots">
            {SLIDES.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className="hc-dot"
                aria-label={`Show ${item.name}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>

          <button type="button" className="hc-btn" onClick={() => go(1)} aria-label="Next character">
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
