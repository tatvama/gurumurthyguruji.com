import { cn } from "@/lib/utils";

type Variant = "default" | "om" | "full";

/**
 * Sacred divider with three display modes:
 * - "default"  — lotus SVG flanked by hairlines
 * - "om"       — OM glyph flanked by hairlines (for dark sections)
 * - "full"     — ✦ lotus OM lotus ✦ with extended lines
 */
export function LotusDivider({
  className,
  variant = "default",
  dark = false,
}: {
  className?: string;
  variant?: Variant;
  dark?: boolean;
}) {
  const lineColor = dark
    ? "rgba(216,183,106,0.35)"
    : "rgba(185,147,69,0.42)";

  const Line = ({ rtl }: { rtl?: boolean }) => (
    <span
      className="h-px flex-1"
      style={{
        background: `linear-gradient(${rtl ? "270deg" : "90deg"}, ${lineColor}, transparent)`,
      }}
    />
  );

  if (variant === "om") {
    return (
      <div className={cn("flex items-center gap-4 py-6", className)}>
        <Line />
        <span
          className="font-heading text-xl"
          style={{ color: dark ? "rgba(216,183,106,0.65)" : "rgba(185,147,69,0.72)" }}
        >
          ॐ
        </span>
        <Line rtl />
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className={cn("flex items-center gap-3 py-8", className)}>
        <Line />
        <div
          className="flex items-center gap-2"
          style={{ color: dark ? "rgba(216,183,106,0.55)" : "rgba(185,147,69,0.60)" }}
        >
          <span style={{ fontSize: "0.55rem" }}>✦</span>
          <LotusIcon />
          <span className="font-heading text-base">ॐ</span>
          <LotusIcon />
          <span style={{ fontSize: "0.55rem" }}>✦</span>
        </div>
        <Line rtl />
      </div>
    );
  }

  // Default
  return (
    <div className={cn("flex items-center gap-4 py-8", className)}>
      <Line />
      <LotusIcon
        style={{ color: dark ? "rgba(216,183,106,0.62)" : "rgba(185,147,69,0.70)" }}
      />
      <Line rtl />
    </div>
  );
}

function LotusIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      {/* Centre petal — points up */}
      <path d="M24 4C24 4 19 13 19 21C19 24.3 21.24 27 24 27C26.76 27 29 24.3 29 21C29 13 24 4 24 4Z" />
      {/* Left petal */}
      <path
        d="M7 11C7 11 12 18 18 21C18 21 14 13 7 11Z"
        opacity="0.55"
      />
      {/* Right petal */}
      <path
        d="M41 11C41 11 36 18 30 21C30 21 34 13 41 11Z"
        opacity="0.55"
      />
      {/* Lower left petal */}
      <path
        d="M4 26C4 26 10 28 18 26C18 26 12 22 4 26Z"
        opacity="0.38"
      />
      {/* Lower right petal */}
      <path
        d="M44 26C44 26 38 28 30 26C30 26 36 22 44 26Z"
        opacity="0.38"
      />
      {/* Stem / water line */}
      <rect x="22.5" y="27" width="3" height="10" rx="1.5" opacity="0.28" />
      {/* Base leaves */}
      <path
        d="M12 36C12 36 18 33 24 37C30 33 36 36 36 36C36 36 30 42 24 40C18 42 12 36 12 36Z"
        opacity="0.22"
      />
    </svg>
  );
}
