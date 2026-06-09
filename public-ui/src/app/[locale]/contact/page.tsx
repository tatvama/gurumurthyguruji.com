"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Link } from "@/components/ui/locale-link";
import { siteConfig } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { useState } from "react";
import { postContact } from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

const contactItems = [
  {
    key: "phone",
    icon: Phone,
    labelKey: "contact.details.phoneLabel" as const,
    href: siteConfig.phoneHref,
    value: siteConfig.phoneDisplay,
  },
  {
    key: "email",
    icon: Mail,
    labelKey: "contact.details.emailLabel" as const,
    href: `mailto:${siteConfig.email}`,
    value: siteConfig.email,
  },
  {
    key: "address",
    icon: MapPin,
    labelKey: "contact.details.ashramLabel" as const,
    href: null,
    valueKey: "ashram" as const,
  },
];

export default function ContactPage() {
  const { t } = useLanguage();

  const [data, setData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [serverErrors, setServerErrors] = useState<{ field: string; message: string }[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const fieldError = (field: string) =>
    serverErrors.find((e) => e.field === field)?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setServerErrors([]);
    try {
      await postContact(data);
      setStatus("success");
      setData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setServerErrors(
        err?.errors || [{ field: "general", message: err?.message || "Something went wrong. Please try again." }]
      );
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-ivory bg-chakra-texture pt-28 pb-24 relative overflow-hidden">

        {/* Background glows */}
        <div className="absolute top-40 right-0 w-96 h-96 bg-saffron-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-antique-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">

          {/* ── Page Header ─────────────────────────────────────────── */}
          <div className="text-center mb-12">
            
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-deep-brown mb-4">
              {t("contact.hero.title")}{" "}
              <span className="italic bg-gradient-to-r from-maroon-accent to-saffron-accent bg-clip-text text-transparent">
                {t("contact.hero.titleAccent")}
              </span>
            </h1>
            <p className="text-base md:text-lg text-deep-brown/70 max-w-xl mx-auto leading-relaxed">
              {t("contact.hero.subtitle")}
            </p>
          </div>

          {/* ── Two-column grid ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-start">

            {/* ── LEFT: Contact info + map ─────────────────────────── */}
            <div className="flex flex-col gap-6">

              {/* Section label */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-deep-brown">
                  {t("contact.details.heading")}
                </h2>
                <p className="text-sm text-deep-brown/55 mt-1">
                  We'd love to hear from you
                </p>
              </div>

              {/* Contact info cards */}
              <div className="flex flex-col gap-3">

                {/* Phone */}
                <a
                  href={siteConfig.phoneHref}
                  className="group flex items-center gap-4 rounded-2xl border border-champagne/40 bg-white/70 p-4 shadow-sm hover:shadow-md hover:border-saffron-accent/30 transition-all duration-200"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-saffron-accent/10 border border-saffron-accent/20 group-hover:bg-saffron-accent/15 transition-colors">
                    <Phone className="h-5 w-5 text-saffron-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-deep-brown/45">
                      {t("contact.details.phoneLabel")}
                    </p>
                    <p className="text-sm font-semibold text-deep-brown truncate mt-0.5">
                      {siteConfig.phoneDisplay}
                    </p>
                  </div>
                  <div className="ml-auto text-saffron-accent/0 group-hover:text-saffron-accent/60 transition-colors">
                    <Send className="h-4 w-4 -rotate-45" />
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="group flex items-center gap-4 rounded-2xl border border-champagne/40 bg-white/70 p-4 shadow-sm hover:shadow-md hover:border-saffron-accent/30 transition-all duration-200"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-saffron-accent/10 border border-saffron-accent/20 group-hover:bg-saffron-accent/15 transition-colors">
                    <Mail className="h-5 w-5 text-saffron-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-deep-brown/45">
                      {t("contact.details.emailLabel")}
                    </p>
                    <p className="text-sm font-semibold text-deep-brown truncate mt-0.5">
                      {siteConfig.email}
                    </p>
                  </div>
                  <div className="ml-auto text-saffron-accent/0 group-hover:text-saffron-accent/60 transition-colors">
                    <Send className="h-4 w-4 -rotate-45" />
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-start gap-4 rounded-2xl border border-champagne/40 bg-white/70 p-4 shadow-sm">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-saffron-accent/10 border border-saffron-accent/20 mt-0.5">
                    <MapPin className="h-5 w-5 text-saffron-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-deep-brown/45">
                      {t("contact.details.ashramLabel")}
                    </p>
                    <p className="text-sm font-semibold text-deep-brown mt-0.5 leading-relaxed">
                      {t("contact.details.ashramName")}
                    </p>
                    <p className="text-xs text-deep-brown/55 mt-0.5">
                      {t("contact.details.ashramLocation")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="relative min-h-[180px] rounded-2xl overflow-hidden border border-champagne/40 bg-white/70 shadow-sm flex items-center justify-center group">
                <div className="absolute inset-0 bg-[url('/images/pattern-chakras.png')] bg-repeat opacity-[0.06] bg-[size:100px] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-saffron-accent/8 via-transparent to-antique-gold/8 pointer-events-none" />
                <div className="relative z-10 text-center px-6 py-8">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-saffron-accent/12 border border-saffron-accent/20 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-6 w-6 text-saffron-accent" />
                  </div>
                  <p className="font-heading text-base font-bold text-deep-brown">
                    {t("contact.map.title")}
                  </p>
                  <p className="text-xs text-deep-brown/55 mt-1">
                    {t("contact.map.subtitle")}
                  </p>
                </div>
              </div>

            </div>

            {/* ── RIGHT: Contact form ──────────────────────────────── */}
            <div className="relative rounded-[2rem] border border-champagne/30 bg-white shadow-xl overflow-hidden">

              {/* Card background texture */}
              <div className="absolute inset-0 bg-[url('/images/pattern-chakras.png')] bg-repeat opacity-[0.04] bg-[size:110px] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-saffron-accent/6 via-transparent to-transparent pointer-events-none" />

              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-saffron-accent via-antique-gold to-saffron-accent" />

              <div className="relative z-10 p-6 md:p-10">

                {/* Form heading */}
                <div className="mb-7">
                  <h2 className="font-heading text-2xl font-bold text-deep-brown">
                    {t("contact.form.heading")}
                  </h2>
                  <p className="text-sm text-deep-brown/55 mt-1">
                    We typically reply within 24 hours
                  </p>
                </div>

                {status === "success" ? (
                  <div className="flex flex-col items-center text-center py-12 gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 border border-green-200">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-deep-brown">Message Sent!</h3>
                      <p className="text-sm text-deep-brown/65 mt-1">
                        Thank you for reaching out. We will get back to you shortly.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="mt-2 border-saffron-accent text-saffron-accent hover:bg-saffron-accent hover:text-white"
                      onClick={() => setStatus("idle")}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form className="space-y-5" onSubmit={handleSubmit}>

                    {/* Name + Email side by side on md+ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-deep-brown/60">
                          {t("contact.form.nameLabel")}
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder={t("contact.form.namePlaceholder")}
                          className="bg-white/80 rounded-xl h-11 border-champagne/60 focus:border-saffron-accent/50 focus:ring-saffron-accent/20"
                          value={data.name}
                          onChange={handleChange}
                          required
                        />
                        {fieldError("name") && (
                          <p className="text-red-600 text-xs font-medium">{fieldError("name")}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-deep-brown/60">
                          {t("contact.form.emailLabel")}
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder={t("contact.form.emailPlaceholder")}
                          className="bg-white/80 rounded-xl h-11 border-champagne/60 focus:border-saffron-accent/50 focus:ring-saffron-accent/20"
                          value={data.email}
                          onChange={handleChange}
                          required
                        />
                        {fieldError("email") && (
                          <p className="text-red-600 text-xs font-medium">{fieldError("email")}</p>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-deep-brown/60">
                        {t("contact.form.subjectLabel")}
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder={t("contact.form.subjectPlaceholder")}
                        className="bg-white/80 rounded-xl h-11 border-champagne/60 focus:border-saffron-accent/50 focus:ring-saffron-accent/20"
                        value={data.subject}
                        onChange={handleChange}
                        required
                      />
                      {fieldError("subject") && (
                        <p className="text-red-600 text-xs font-medium">{fieldError("subject")}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-deep-brown/60">
                        {t("contact.form.messageLabel")}
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder={t("contact.form.messagePlaceholder")}
                        className="min-h-[130px] bg-white/80 rounded-xl border-champagne/60 focus:border-saffron-accent/50 focus:ring-saffron-accent/20 resize-none"
                        value={data.message}
                        onChange={handleChange}
                        required
                      />
                      {fieldError("message") && (
                        <p className="text-red-600 text-xs font-medium">{fieldError("message")}</p>
                      )}
                    </div>

                    {/* General error */}
                    {status === "error" && fieldError("general") && (
                      <p className="text-red-600 text-sm font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                        {fieldError("general")}
                      </p>
                    )}

                    {/* Submit */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full cursor-pointer h-12 text-sm font-semibold tracking-wide rounded-xl"
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Sending…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          {t("contact.form.submit")}
                        </span>
                      )}
                    </Button>
                  </form>
                )}

                {/* Footer note */}
                <p className="text-xs text-center text-deep-brown/50 mt-5 leading-relaxed">
                  {t("contact.form.guidanceNote")}{" "}
                  <Link
                    href="/meet-guruji"
                    className="font-bold text-saffron-accent underline underline-offset-2 hover:text-antique-gold transition-colors"
                  >
                    {t("contact.form.guidanceLink")}
                  </Link>{" "}
                  {t("contact.form.guidanceNoteEnd")}
                </p>

              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
