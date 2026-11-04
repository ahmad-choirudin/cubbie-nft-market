import { createElement, type ElementType, type ReactNode } from "react";

export default function SectionHeading({ title, aside, as: Tag = "h2" }: {
  title: ReactNode;
  aside?: ReactNode;
  as?: ElementType;
}) {
  return (
    <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-edge">
      {createElement(Tag, { className: "display m-0 border-0 pb-[18px] text-t-2xl" }, title)}
      {aside && <span className="whitespace-nowrap pb-[18px] text-t-xs uppercase tracking-[0.16em] text-dim">{aside}</span>}
    </div>
  );
}
