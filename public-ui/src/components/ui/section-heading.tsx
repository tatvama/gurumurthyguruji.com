import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left",
        className,
      )}
    >
      {eyebrow ? (
        <span className={cn("eyebrow", align === "center" && "eyebrow-center")}>{eyebrow}</span>
      ) : null}
      <h2
        className={cn(
          "font-heading mt-4 text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]",
          light ? "text-pearl" : "text-deep-brown",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-5 text-[17px] leading-relaxed",
            light ? "text-pearl/70" : "text-deep-brown/68",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
