import { createElement, type ComponentPropsWithoutRef, type ElementType } from "react";
import type { CSSProperties } from "react";

type PageContainerProps<E extends ElementType> = {
  as?: E;
  size?: string;
  className?: string;
  style?: CSSProperties;
} & Omit<ComponentPropsWithoutRef<E>, "as" | "size" | "className" | "style">;

export default function PageContainer<E extends ElementType = "div">({
  as,
  size = "xl",
  className = "",
  style,
  ...props
}: PageContainerProps<E>) {
  const Tag = as ?? "div";

  return createElement(Tag, {
    ...props,
    className: `mx-auto w-full px-4 md:px-8 ${className}`,
    style: { maxWidth: `var(--container-${size})`, ...style },
  });
}
