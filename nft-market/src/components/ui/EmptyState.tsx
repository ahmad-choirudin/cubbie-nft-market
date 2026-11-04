import type { ReactNode } from "react";

export default function EmptyState({ title, description, children }: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-edge px-5 py-14 text-center text-dim">
      <p className="m-0 font-d text-lg text-ink">{title}</p>
      {description && <p className="mx-auto mt-2 max-w-[48ch] text-sm leading-relaxed">{description}</p>}
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
