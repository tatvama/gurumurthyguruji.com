"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { postAudienceBooking } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ashrams } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { CheckCircle2, Sparkles, CalendarCheck, ShieldCheck, Infinity, Users, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COSMIC =
  "radial-gradient(ellipse at center,rgba(132,88,68,0.22) 0%,transparent 40%)," +
  "radial-gradient(ellipse at left center,rgba(110,18,32,0.20) 0%,transparent 55%)," +
  "radial-gradient(ellipse at right center,rgba(110,18,32,0.18) 0%,transparent 55%)," +
  "linear-gradient(135deg,#4b0d13 0%,#5b1118 25%,#65161c 50%,#571116 75%,#430a10 100%)";

const GOLD_LINE =
  "absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-antique-gold/70 to-transparent";

const trustPoints = [
  { icon: ShieldCheck, label: "Always Free of Charge" },
  { icon: CalendarCheck, label: "Flexible Scheduling" },
  { icon: Infinity,     label: "No Caste, Creed Barrier" },
  { icon: Users,        label: "Personal 1-on-1 Darshan" },
];

const formSchema = z.object({
  fullName:      z.string().min(2, "Name must be at least 2 characters"),
  mobile:        z.string().min(10, "Please enter a valid mobile number"),
  email:         z.string().email("Enter a valid email address"),
  profession:    z.string().min(2, "Profession is required"),
  city:          z.string().min(2, "City is required"),
  district:      z.string().min(2, "District is required"),
  state:         z.string().min(2, "State is required"),
  howKnown:      z.string().min(2, "This field is required"),
  nearestAshram: z.string().min(1, "Please select an ashram"),
  message:       z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function FieldWrap({
  id, label, error, children,
}: {
  id: string; label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-deep-brown/70">
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-[11.5px] font-semibold text-red-700">{error}</p>
      )}
    </div>
  );
}

/* ── Custom Ashram Dropdown ───────────────────────────────────────── */
interface SelectOption { value: string; label: string }

function CustomSelect({
  options,
  placeholder,
  value,
  onChange,
  error,
}: {
  options: SelectOption[];
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  /* close on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={[
          "flex h-11 w-full items-center justify-between rounded-md border px-3 text-sm transition-all",
          "bg-pearl/40 text-left",
          open
            ? "border-antique-gold/70 ring-2 ring-antique-gold/25 shadow-[0_0_0_3px_rgba(185,147,69,0.08)]"
            : "border-champagne/35 hover:border-antique-gold/45",
          error ? "border-red-400" : "",
        ].join(" ")}
      >
        <span className={selected ? "text-deep-brown" : "text-deep-brown/30"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-antique-gold/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-60 overflow-y-auto rounded-xl border border-antique-gold/30 bg-white py-1.5 shadow-[0_8px_32px_rgba(75,13,19,0.14)] ring-1 ring-antique-gold/10"
          >
            {options.map((opt) => {
              const isActive = opt.value === value;
              return (
                <li
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={[
                    "flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors duration-150",
                    isActive
                      ? "bg-antique-gold/10 text-deep-brown font-semibold"
                      : "text-deep-brown/75 hover:bg-champagne/30 hover:text-deep-brown",
                  ].join(" ")}
                >
                  <span>{opt.label}</span>
                  {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-antique-gold" />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MeetGurujiPage() {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = () => setPhotoBase64(reader.result as string);
    reader.readAsDataURL(file);
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const ashramOptions: { value: string; label: string }[] = ashrams
    .filter((a) => a.status === "Active")
    .map((a) => ({ value: a.location, label: `${a.location} — ${a.name}` }));

  const onSubmit = async (data: FormValues) => {
    setServerError("");
    try {
      await postAudienceBooking({ ...data, photo: photoBase64 || undefined });
      setIsSubmitted(true);
    } catch (err: any) {
      setServerError(err?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 relative overflow-x-hidden bg-pearl bg-chakra-texture">

        {/* ── Hero Banner ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-28 pb-14" style={{ background: COSMIC }}>
          <div className={`${GOLD_LINE} top-0`} />
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden pt-28">
            <span className="font-heading text-[320px] leading-none text-champagne opacity-[0.04]">ॐ</span>
          </div>
          <div className="pointer-events-none absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-saffron-accent/15 blur-[80px]" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-maroon-accent/20 blur-[60px]" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto max-w-2xl px-4 text-center md:px-8"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/20 bg-champagne/8 px-4 py-1.5">
              <Sparkles className="h-3 w-3 text-champagne" />
              <span className="text-[9px] font-bold uppercase tracking-[0.26em] text-champagne/70">
                {t("meet.badge")}
              </span>
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight text-pearl sm:text-5xl lg:text-6xl">
              {t("meet.title.a")}{" "}
              <span className="italic text-champagne">{t("meet.title.b")}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pearl/60">
              {t("meet.subtitle")}
            </p>

            {/* Trust chips row */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {trustPoints.map((tp, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-full border border-champagne/15 bg-champagne/8 px-3 py-1">
                  <tp.icon className="h-3 w-3 text-champagne/60" />
                  <span className="text-[9.5px] font-semibold text-champagne/60">{tp.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <div className={`${GOLD_LINE} bottom-0`} />
        </section>

        {/* ── Form Section ──────────────────────────────────────────── */}
        <section className="py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="overflow-hidden rounded-3xl border border-antique-gold/25 shadow-[0_8px_48px_rgba(75,13,19,0.13)]"
            >
              {/* Card cosmic header */}
              <div className="relative px-7 py-6 md:px-10" style={{ background: COSMIC }}>
                <div className={`${GOLD_LINE} top-0`} />
                <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden select-none pr-6 opacity-[0.07]">
                  <span className="font-heading text-[110px] leading-none text-champagne">ॐ</span>
                </div>
                <div className="relative z-10">
                  <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.24em] text-champagne/45">
                    Sacred Request
                  </p>
                  <h2 className="font-heading text-xl font-bold leading-tight text-pearl sm:text-2xl">
                    Personal Audience Request Form
                  </h2>
                  <p className="mt-1 text-[12.5px] text-pearl/50">
                    All fields marked * are required. We respond within 2–3 days.
                  </p>
                </div>
                <div className={`${GOLD_LINE} bottom-0`} />
              </div>

              {/* Form body */}
              <div className="bg-white px-7 py-8 md:px-10">
                {isSubmitted ? (
                  <div className="flex flex-col items-center py-14 text-center">
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-saffron-accent/20 bg-saffron-accent/10">
                      <CheckCircle2 className="h-10 w-10 text-saffron-accent" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-deep-brown">
                      {t("meet.success.title")}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-deep-brown/70">
                      {t("meet.success.body")}
                    </p>
                    <Button
                      className="mt-7 border-saffron-accent text-saffron-accent hover:bg-saffron-accent/5"
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                    >
                      {t("meet.success.again")}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Photo upload */}
                    <div className="flex flex-col items-center gap-3">
                      <div
                        onClick={() => photoInputRef.current?.click()}
                        className="relative cursor-pointer"
                        style={{ width: 88, height: 88 }}
                      >
                        {photoPreview ? (
                          <img src={photoPreview} alt="Photo" style={{ width: 88, height: 88, borderRadius: "50%", objectFit: "cover", border: "2.5px solid #b9934a" }} />
                        ) : (
                          <div style={{ width: 88, height: 88, borderRadius: "50%", background: "#fdf8f0", border: "2px dashed #b9934a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b9934a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                            <span style={{ fontSize: 9, color: "#b9934a", fontWeight: 600, letterSpacing: "0.05em" }}>PHOTO</span>
                          </div>
                        )}
                        <div style={{ position: "absolute", bottom: 2, right: 2, width: 22, height: 22, borderRadius: "50%", background: "#b9934a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                        </div>
                      </div>
                      <p className="text-[11px] text-deep-brown/40">Optional — tap to upload your photo</p>
                      <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handlePhotoChange} />
                    </div>

                    {/* Row 1: Name + Mobile */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <FieldWrap id="fullName" label={t("meet.f.name")} error={errors.fullName?.message}>
                        <Input
                          id="fullName"
                          {...register("fullName")}
                          placeholder={t("meet.f.name.ph")}
                          className="h-11 border-champagne/35 bg-pearl/40 text-sm placeholder:text-deep-brown/30 focus-visible:border-antique-gold/50 focus-visible:ring-antique-gold/20"
                        />
                      </FieldWrap>
                      <FieldWrap id="mobile" label={t("meet.f.mobile")} error={errors.mobile?.message}>
                        <Input
                          id="mobile"
                          {...register("mobile")}
                          placeholder={t("meet.f.mobile.ph")}
                          className="h-11 border-champagne/35 bg-pearl/40 text-sm placeholder:text-deep-brown/30 focus-visible:border-antique-gold/50 focus-visible:ring-antique-gold/20"
                        />
                      </FieldWrap>
                    </div>

                    {/* Row 2: Email + Profession */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <FieldWrap id="email" label="Email Address *" error={(errors as any).email?.message}>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          placeholder="your@email.com"
                          className="h-11 border-champagne/35 bg-pearl/40 text-sm placeholder:text-deep-brown/30 focus-visible:border-antique-gold/50 focus-visible:ring-antique-gold/20"
                        />
                      </FieldWrap>
                      <FieldWrap id="profession" label={t("meet.f.profession")} error={errors.profession?.message}>
                        <Input
                          id="profession"
                          {...register("profession")}
                          placeholder={t("meet.f.profession.ph")}
                          className="h-11 border-champagne/35 bg-pearl/40 text-sm placeholder:text-deep-brown/30 focus-visible:border-antique-gold/50 focus-visible:ring-antique-gold/20"
                        />
                      </FieldWrap>
                    </div>

                    {/* Row 3: City + District + State */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                      <FieldWrap id="city" label="City / Town *" error={(errors as any).city?.message}>
                        <Input
                          id="city"
                          {...register("city")}
                          placeholder="City or Town"
                          className="h-11 border-champagne/35 bg-pearl/40 text-sm placeholder:text-deep-brown/30 focus-visible:border-antique-gold/50 focus-visible:ring-antique-gold/20"
                        />
                      </FieldWrap>
                      <FieldWrap id="district" label="District *" error={(errors as any).district?.message}>
                        <Input
                          id="district"
                          {...register("district")}
                          placeholder="District"
                          className="h-11 border-champagne/35 bg-pearl/40 text-sm placeholder:text-deep-brown/30 focus-visible:border-antique-gold/50 focus-visible:ring-antique-gold/20"
                        />
                      </FieldWrap>
                      <FieldWrap id="state" label="State *" error={(errors as any).state?.message}>
                        <Input
                          id="state"
                          {...register("state")}
                          placeholder="State"
                          className="h-11 border-champagne/35 bg-pearl/40 text-sm placeholder:text-deep-brown/30 focus-visible:border-antique-gold/50 focus-visible:ring-antique-gold/20"
                        />
                      </FieldWrap>
                    </div>

                    {/* How did you come to know */}
                    <FieldWrap id="howKnown" label={t("meet.f.howknown")} error={errors.howKnown?.message}>
                      <Input
                        id="howKnown"
                        {...register("howKnown")}
                        placeholder={t("meet.f.howknown.ph")}
                        className="h-11 border-champagne/35 bg-pearl/40 text-sm placeholder:text-deep-brown/30 focus-visible:border-antique-gold/50 focus-visible:ring-antique-gold/20"
                      />
                    </FieldWrap>

                    {/* Nearest Ashram — custom dropdown */}
                    <FieldWrap id="nearestAshram" label={t("meet.f.ashram")} error={errors.nearestAshram?.message}>
                      <Controller
                        name="nearestAshram"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <CustomSelect
                            options={ashramOptions}
                            placeholder={t("meet.f.ashram.ph")}
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.nearestAshram?.message}
                          />
                        )}
                      />
                    </FieldWrap>

                    {/* Message */}
                    <FieldWrap id="message" label={t("meet.f.message")}>
                      <Textarea
                        id="message"
                        {...register("message")}
                        placeholder={t("meet.f.message.ph")}
                        className="min-h-[120px] border-champagne/35 bg-pearl/40 text-sm placeholder:text-deep-brown/30 focus-visible:border-antique-gold/50 focus-visible:ring-antique-gold/20"
                      />
                    </FieldWrap>

                    {/* Divider + Submit */}
                    <div className="border-t border-champagne/20 pt-6">
                      {serverError && (
                        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-center text-[12.5px] font-semibold text-red-700">
                          {serverError}
                        </p>
                      )}
                      <div className="flex flex-col items-center gap-3">
                        <Button
                          type="submit"
                          size="lg"
                          disabled={isSubmitting}
                          className="h-auto w-full border-0 bg-gradient-to-r from-saffron-accent to-antique-gold px-10 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:brightness-110 sm:w-auto sm:min-w-[260px]"
                        >
                          {isSubmitting ? t("meet.submitting") : t("meet.submit")}
                        </Button>
                        <p className="text-[11.5px] italic text-deep-brown/45">
                          {t("meet.note")}
                        </p>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <div className="pb-10" />
      </main>
      <Footer />
    </>
  );
}
