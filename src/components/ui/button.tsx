import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "gold" | "dark";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "btn-shimmer inline-flex items-center justify-center whitespace-nowrap font-semibold tracking-wide ring-offset-pearl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            // primary gold — gradient, round corners, warm shadow
            "rounded-xl bg-gradient-to-br from-antique-gold via-[#C8A848] to-champagne text-deep-brown shadow-[0_4px_18px_rgba(185,147,69,0.30)] hover:shadow-[0_8px_26px_rgba(185,147,69,0.44)] hover:-translate-y-0.5":
              variant === "default" || variant === "gold",
            // outline — glass effect, gold border
            "rounded-xl border-[1.5px] border-antique-gold/45 bg-white/50 text-deep-brown backdrop-blur-sm hover:border-antique-gold hover:bg-champagne/10 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(185,147,69,0.15)]":
              variant === "outline",
            // ghost — minimal
            "rounded-lg hover:bg-champagne/10 hover:text-antique-gold text-deep-brown/80":
              variant === "ghost",
            // dark — for maroon/dark section CTAs
            "rounded-xl bg-gradient-to-br from-champagne via-[#E2C975] to-antique-gold text-deep-brown shadow-[0_4px_18px_rgba(0,0,0,0.28)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.36)] hover:-translate-y-0.5":
              variant === "dark",
            // sizes
            "h-11 px-6 text-sm": size === "default",
            "h-9 px-4 text-xs": size === "sm",
            "h-12 px-9 text-base": size === "lg",
            "h-11 w-11": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
