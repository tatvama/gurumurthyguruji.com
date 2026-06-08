"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

export function NewsletterSignup() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <section className="section-cream relative py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="card-elegant relative overflow-hidden p-8 text-center sm:p-12">
          <div className="bg-divine-glow pointer-events-none absolute inset-0" />
          <div className="relative z-10">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-champagne/20 text-antique-gold">
              <Mail className="h-7 w-7" strokeWidth={1.6} />
            </span>
            <h2 className="font-heading mt-5 text-3xl font-medium text-deep-brown sm:text-4xl">
              Receive Daily Wisdom
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-deep-brown/70">
              A short teaching from Guruji, gently delivered. No noise — only grace.
            </p>

            {submitted ? (
              <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-antique-gold/10 px-5 py-3 text-sm font-semibold text-antique-gold">
                <Check className="h-4 w-4" /> Thank you — you are subscribed with grace. 🙏
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setSubmitted(true);
                }}
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  aria-label="Email address"
                  className="h-12 flex-1 rounded-md border border-champagne/40 bg-white px-4 text-sm text-deep-brown outline-none transition-all placeholder:text-deep-brown/40 focus:border-antique-gold focus:ring-2 focus:ring-antique-gold/30"
                />
                <button
                  type="submit"
                  className="btn-shimmer h-12 rounded-md bg-antique-gold px-7 text-sm font-semibold tracking-wide text-deep-brown transition-all hover:-translate-y-0.5 hover:bg-champagne hover:shadow-premium"
                >
                  Subscribe
                </button>
              </form>
            )}
            <p className="mt-4 text-xs text-deep-brown/50">
              We honour your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
