import type { ReactNode } from "react";

const TONES = {
  neutral: "border-edge text-dim",
  accent: "border-transparent bg-acc text-bg",
};

export default function Badge({ tone = "neutral", className = "", children }: {
  tone?: keyof typeof TONES;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-pill)] border px-2 py-0.5 font-m text-[11px] leading-[1.5] ${TONES[tone] || TONES.neutral} ${className}`}
    >
      {children}
    </span>
  );
}
