import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/data";

/**
 * Floating WhatsApp button for quick, low-friction contact.
 * Uses the placeholder number in siteConfig — replace with the real one.
 */
export function WhatsAppFloat() {
  return (
    <a
      href={siteConfig.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Guruji's seva team on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-premium-lg transition-transform duration-300 hover:scale-110 focus-visible:scale-110"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.5s]" />
      <MessageCircle className="relative h-7 w-7" strokeWidth={2} />
      <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-full bg-deep-brown px-3 py-1.5 text-xs font-medium text-pearl opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 md:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
