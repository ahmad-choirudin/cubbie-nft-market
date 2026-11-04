import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const VARIANTS = {
  solid: "border-acc bg-acc text-bg hover:border-transparent hover:bg-[color-mix(in_srgb,var(--color-accent)_82%,var(--color-text))]",
  ghost: "border-strong bg-transparent text-ink hover:border-acc hover:text-acc",
  quiet: "border-transparent bg-transparent px-3 text-dim hover:border-transparent hover:bg-transparent hover:text-acc",
  danger: "border-danger bg-transparent text-[var(--color-danger-text)] hover:border-danger hover:bg-[var(--color-danger-soft)]",
};

type ButtonCommonProps = {
  variant?: keyof typeof VARIANTS;
  size?: "sm" | "md" | "lg";
  icon?: boolean;
  full?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
};

type NativeButtonProps = ButtonCommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children" | "disabled"> & {
    href?: never;
  };

type LinkButtonProps = ButtonCommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    href: string;
  };

type ButtonProps = NativeButtonProps | LinkButtonProps;

// variant: solid | ghost | quiet | danger    size: sm | md | lg
// icon: square icon-only button (give it an aria-label)
// loading: shows a spinner and disables the button
export default function Button(props: ButtonProps) {
  const {
    variant = "solid",
    size = "md",
    icon = false,
    full = false,
    loading = false,
    disabled = false,
    className = "",
    children,
    href,
    ...rest
  } = props;
  const off = disabled || loading;

  const cls = [
    "inline-flex min-h-[var(--tap)] items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] border px-6 kicker leading-none transition-[background-color,color,border-color,transform] duration-[var(--dur-fast)] ease-[var(--ease)] active:translate-y-px disabled:cursor-default disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:opacity-50",
    VARIANTS[variant],
    size === "sm" && "min-h-10 px-4 text-t-xs",
    size === "lg" && "min-h-[52px] px-8 text-t-sm",
    icon && "size-[var(--tap)] px-0",
    icon && size === "sm" && "size-10",
    full && "w-full",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = <>{loading && <span className="size-[14px] animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />}{children}</>;

  if (typeof href === "string") {
    const anchorProps = rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href">;

    return (
      <a
        {...anchorProps}
        href={href}
        className={cls}
        aria-busy={loading || undefined}
        aria-disabled={off ? true : undefined}
        tabIndex={off ? -1 : undefined}
      >
        {content}
      </a>
    );
  }

  const buttonProps = rest as Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children" | "disabled">;

  return (
    <button
      {...buttonProps}
      className={cls}
      type={buttonProps.type ?? "button"}
      disabled={off}
      aria-busy={loading || undefined}
    >
      {content}
    </button>
  );
}
