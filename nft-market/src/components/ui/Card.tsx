import { createElement, type ComponentPropsWithoutRef, type ElementType } from "react";

// tone: card | surface    interactive: lifts on hover (use when the card is clickable)
type CardProps<E extends ElementType> = {
  as?: E;
  tone?: "card" | "surface";
  padded?: boolean;
  interactive?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<E>, "as" | "tone" | "padded" | "interactive" | "className">;

export default function Card<E extends ElementType = "div">({
  as,
  tone = "card",
  padded = false,
  interactive = false,
  className = "",
  ...props
}: CardProps<E>) {
  const Tag = as ?? "div";
  const cls = [
    "rounded-[var(--radius-md)] border border-edge bg-card text-ink shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-text)_4%,transparent)]",
    tone === "surface" && "bg-surface",
    padded && "p-6",
    interactive && "transition-[border-color,transform,box-shadow] duration-[var(--dur-base)] ease-[var(--ease)] hover:border-strong hover:shadow-[var(--shadow-md)] motion-safe:hover:-translate-y-0.5",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return createElement(Tag, { ...props, className: cls } as ComponentPropsWithoutRef<E>);
}
