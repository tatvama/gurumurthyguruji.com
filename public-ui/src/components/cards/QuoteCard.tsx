import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";

interface QuoteCardProps {
  quote: string;
  category: string;
  className?: string;
}

export function QuoteCard({ quote, category, className }: QuoteCardProps) {
  return (
    <div className={cn("bg-white rounded-[24px] p-8 border border-champagne/30 shadow-sm hover:shadow-[0_10px_25px_rgba(201,130,43,0.08)] hover:border-saffron-accent/35 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group", className)}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-accent/20 via-antique-gold/20 to-transparent" />
      <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 md:-top-4 md:-right-4 text-champagne/10 group-hover:text-saffron-accent/10 group-hover:scale-105 transition-all duration-500">
        <Quote className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24" />
      </div>
      <div className="relative z-10 flex flex-col h-full">
        <span className="text-[10px] font-bold uppercase tracking-widest text-saffron-accent mb-4 inline-block bg-saffron-accent/10 border border-saffron-accent/15 px-3.5 py-1 rounded-full w-fit">
          {category}
        </span>
        <p className="font-heading text-xl text-deep-brown leading-relaxed italic mt-auto mb-4 group-hover:text-deep-brown/90 transition-colors">
          "{quote}"
        </p>
      </div>
    </div>
  );
}
