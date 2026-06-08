import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface AshramCardProps {
  name: string;
  location: string;
  status: string;
  description: string;
  /** Display label for the status pill; `status` itself still drives styling. */
  statusLabel?: string;
}

export function AshramCard({ name, location, status, description, statusLabel }: AshramCardProps) {
  return (
    <Card className="group flex flex-col h-full bg-white border-champagne/30 hover:border-saffron-accent/40 hover:shadow-[0_12px_30px_rgba(201,130,43,0.12)] hover:-translate-y-1 transition-all duration-300 rounded-[24px] overflow-hidden">
      <div className="h-40 bg-gradient-to-br from-saffron-accent/15 via-antique-gold/10 to-pearl relative overflow-hidden flex items-center justify-center border-b border-champagne/20">
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[url('/images/pattern-chakras.png')] bg-repeat opacity-[0.08] bg-[size:100px] pointer-events-none" />
        {/* Soft bottom fade to pearl */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent pointer-events-none" />
        
        {/* Ashram Icon */}
        <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-sm relative z-10 border border-champagne/30 group-hover:scale-110 group-hover:border-saffron-accent/40 transition-all duration-500">
          <svg className="w-8 h-8 text-antique-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
          </svg>
        </div>
      </div>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4 mb-2">
          <CardTitle className="text-xl font-heading font-bold text-deep-brown group-hover:text-saffron-accent transition-colors duration-300">{name}</CardTitle>
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border whitespace-nowrap",
            status === "Active" 
              ? "bg-saffron-accent/10 border-saffron-accent/20 text-saffron-accent" 
              : "bg-deep-brown/5 border-deep-brown/10 text-deep-brown/60"
          )}>
            {statusLabel ?? status}
          </span>
        </div>
        <CardDescription className="flex items-center gap-1.5 text-deep-brown/70 font-medium">
          <MapPin className="w-3.5 h-3.5 text-saffron-accent" />
          {location}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="text-sm text-deep-brown/80 leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
