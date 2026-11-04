import { useEffect } from "react";

// Fades in elements marked with the .rv class once they scroll into view.
export default function useReveal(dep: unknown) {
  useEffect(() => {
    const els = document.querySelectorAll(".rv:not(.in)");

    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (list) => {
        list.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    els.forEach((e) => io.observe(e));

    return () => io.disconnect();
  }, [dep]);
}