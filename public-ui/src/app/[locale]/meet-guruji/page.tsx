"use client";

import { useState } from "react";
import { postAudienceBooking } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LotusDivider } from "@/components/ui/lotus-divider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ashrams } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { CheckCircle2, Sparkles } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().min(10, "Please enter a valid mobile number"),
  profession: z.string().min(2, "Profession is required"),
  location: z.string().min(5, "Please enter Area, City, Taluk, District"),
  howKnown: z.string().min(2, "This field is required"),
  nearestAshram: z.string().min(1, "Please select an ashram"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function MeetGurujiPage() {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setServerError("");
    try {
      await postAudienceBooking(data);
      setIsSubmitted(true);
    } catch (err: any) {
      setServerError(err?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-pearl bg-chakra-texture pt-32 pb-24 relative overflow-hidden">
        {/* Soft Background Glows */}
        <div className="absolute top-40 right-0 w-80 h-80 bg-saffron-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-antique-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
          
          <div className="text-center mb-16">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-antique-gold/40 bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-antique-gold backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" /> {t("meet.badge")}
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-deep-brown mb-6">
              {t("meet.title.a")} <span className="italic text-gradient-gold">{t("meet.title.b")}</span>
            </h1>
            <p className="text-xl text-deep-brown/85 max-w-2xl mx-auto leading-relaxed">
              {t("meet.subtitle")}
            </p>
          </div>

          <LotusDivider className="mb-16" />

          <div className="bg-white border-gold-double rounded-[3rem] p-8 md:p-12 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('/images/pattern-chakras.png')] bg-repeat opacity-[0.05] bg-[size:110px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-saffron-accent/10 via-transparent to-transparent pointer-events-none" />
            
            {isSubmitted ? (
              <div className="text-center py-20 relative z-10">
                <div className="w-20 h-20 bg-saffron-accent/15 border border-saffron-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-saffron-accent" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-deep-brown mb-4">{t("meet.success.title")}</h2>
                <p className="text-lg text-deep-brown/80 max-w-md mx-auto">
                  {t("meet.success.body")}
                </p>
                <Button
                  className="mt-8 border-saffron-accent text-saffron-accent hover:bg-saffron-accent/5 font-semibold"
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                >
                  {t("meet.success.again")}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-semibold text-deep-brown/90">{t("meet.f.name")}</Label>
                    <Input id="fullName" {...register("fullName")} placeholder={t("meet.f.name.ph")} className="bg-white/80" />
                    {errors.fullName && <p className="text-red-800/80 text-sm font-semibold mt-1">{errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="font-semibold text-deep-brown/90">{t("meet.f.mobile")}</Label>
                    <Input id="mobile" {...register("mobile")} placeholder={t("meet.f.mobile.ph")} className="bg-white/80" />
                    {errors.mobile && <p className="text-red-800/80 text-sm font-semibold mt-1">{errors.mobile.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profession" className="font-semibold text-deep-brown/90">{t("meet.f.profession")}</Label>
                    <Input id="profession" {...register("profession")} placeholder={t("meet.f.profession.ph")} className="bg-white/80" />
                    {errors.profession && <p className="text-red-800/80 text-sm font-semibold mt-1">{errors.profession.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="font-semibold text-deep-brown/90">{t("meet.f.place")}</Label>
                    <Input id="location" {...register("location")} placeholder={t("meet.f.place.ph")} className="bg-white/80" />
                    {errors.location && <p className="text-red-800/80 text-sm font-semibold mt-1">{errors.location.message}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="howKnown" className="font-semibold text-deep-brown/90">{t("meet.f.howknown")}</Label>
                    <Input id="howKnown" {...register("howKnown")} placeholder={t("meet.f.howknown.ph")} className="bg-white/80" />
                    {errors.howKnown && <p className="text-red-800/80 text-sm font-semibold mt-1">{errors.howKnown.message}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="nearestAshram" className="font-semibold text-deep-brown/90">{t("meet.f.ashram")}</Label>
                    <select
                      id="nearestAshram"
                      {...register("nearestAshram")}
                      className="flex h-12 w-full rounded-md border border-champagne/30 bg-white/80 px-3 py-2 text-sm text-deep-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-accent/60 transition-all cursor-pointer"
                    >
                      <option value="">{t("meet.f.ashram.ph")}</option>
                      {ashrams.filter(a => a.status === "Active").map(a => (
                        <option key={a.id} value={a.location}>{a.location} - {a.name}</option>
                      ))}
                    </select>
                    {errors.nearestAshram && <p className="text-red-800/80 text-sm font-semibold mt-1">{errors.nearestAshram.message}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="message" className="font-semibold text-deep-brown/90">{t("meet.f.message")}</Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder={t("meet.f.message.ph")}
                      className="min-h-[150px] bg-white/80"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center pt-6 border-t border-champagne/20">
                  {serverError && (
                    <p className="w-full text-red-700 text-sm font-semibold bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4 text-center">{serverError}</p>
                  )}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full md:w-auto min-w-[240px] cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t("meet.submitting") : t("meet.submit")}
                  </Button>
                  <p className="mt-4 text-sm text-deep-brown/70 text-center font-medium">
                    {t("meet.note")}
                  </p>
                </div>
              </form>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
