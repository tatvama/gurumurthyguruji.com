import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface AshramCardProps {
  name: string;
  location: string;
  status: string;
  description: string;
  statusLabel?: string;
}

const COSMIC =
  "radial-gradient(ellipse at center,rgba(132,88,68,0.18) 0%,transparent 50%)," +
  "linear-gradient(135deg,#4b0d13 0%,#5b1118 35%,#65161c 65%,#430a10 100%)";

export function AshramCard({ name, location, status, description, statusLabel }: AshramCardProps) {
  const isActive = status === "Active";

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-antique-gold/20 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-antique-gold/40 hover:shadow-[0_10px_30px_rgba(75,13,19,0.12)]">

      {/* Card top banner — cosmic */}
      <div
        className="relative flex items-center justify-between overflow-hidden px-5 py-4"
        style={{ background: COSMIC }}
      >
        {/* gold top line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-antique-gold/70 to-transparent" />
        {/* OM watermark */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-end justify-end overflow-hidden select-none pr-2 pb-1 opacity-[0.08]">
          <span className="font-heading text-[64px] leading-none text-champagne">ॐ</span>
        </div>

        {/* icon */}
        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-antique-gold/30 bg-antique-gold/15 transition-transform duration-300 group-hover:scale-110">
          <svg className="h-5 w-5 text-champagne" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
          </svg>
        </div>

        {/* status badge */}
        <span
          className={cn(
            "relative z-10 rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em]",
            isActive
              ? "border-champagne/30 bg-champagne/15 text-champagne"
              : "border-pearl/20 bg-pearl/10 text-pearl/50",
          )}
        >
          {statusLabel ?? status}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col px-5 py-4">
        <h3 className="font-heading text-[15px] font-bold leading-snug text-deep-brown transition-colors duration-300 group-hover:text-maroon-accent">
          {name}
        </h3>
        <div className="mt-1.5 flex items-center gap-1.5">
          <MapPin className="h-3 w-3 shrink-0 text-saffron-accent" />
          <span className="text-[11px] font-medium text-deep-brown/60">{location}</span>
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-deep-brown/70">
          {description}
        </p>
      </div>

      {/* bottom gold line */}
      <div className="h-[1.5px] bg-gradient-to-r from-transparent via-antique-gold/40 to-transparent" />
    </div>
  );
}
