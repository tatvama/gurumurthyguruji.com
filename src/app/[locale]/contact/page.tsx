"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LotusDivider } from "@/components/ui/lotus-divider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "@/components/ui/locale-link";
import { siteConfig } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { useState } from "react";

export default function ContactPage() {
  const { t } = useLanguage();

  const [data, setData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(data)
    setData({
      name: "",
      email: "",
      subject: "",
      message: ""
    })
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-ivory bg-chakra-texture pt-32 pb-24 relative overflow-hidden">
        {/* Soft Background Accent Glows */}
        <div className="absolute top-40 right-0 w-80 h-80 bg-saffron-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-antique-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">

          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-deep-brown mb-6">
              {t("contact.hero.title")} <span className="bg-gradient-to-r from-maroon-accent to-saffron-accent bg-clip-text text-transparent italic text-gold-glow">{t("contact.hero.titleAccent")}</span>
            </h1>
            <p className="text-xl text-deep-brown/85 max-w-2xl mx-auto leading-relaxed">
              {t("contact.hero.subtitle")}
            </p>
          </div>

          <LotusDivider className="mb-16" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact Details */}
            <div className="space-y-12">
              <div>
                <h2 className="font-heading text-3xl font-bold text-deep-brown mb-8">{t("contact.details.heading")}</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-saffron-accent/10 border border-saffron-accent/20 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-saffron-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-deep-brown text-base">{t("contact.details.phoneLabel")}</h3>
                      <a href={siteConfig.phoneHref} className="text-deep-brown/70 mt-1 font-medium hover:text-saffron-accent transition-colors block">
                        {siteConfig.phoneDisplay}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-saffron-accent/10 border border-saffron-accent/20 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-saffron-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-deep-brown text-base">{t("contact.details.emailLabel")}</h3>
                      <a href={`mailto:${siteConfig.email}`} className="text-deep-brown/70 mt-1 font-medium hover:text-saffron-accent transition-colors block">
                        {siteConfig.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-saffron-accent/10 border border-saffron-accent/20 rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-saffron-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-deep-brown text-base">{t("contact.details.ashramLabel")}</h3>
                      <p className="text-deep-brown/70 mt-1 font-medium leading-relaxed">
                        {t("contact.details.ashramName")}<br />
                        {t("contact.details.ashramLocation")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="rounded-[2rem] overflow-hidden bg-white shadow-xl aspect-video relative flex items-center justify-center group">
                <div className="absolute inset-0 bg-[url('/images/pattern-chakras.png')] bg-repeat opacity-[0.06] bg-[size:120px] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-saffron-accent/10 via-transparent to-transparent pointer-events-none" />
                <div className="text-center relative z-10 text-deep-brown">
                  <div className="w-12 h-12 rounded-full bg-saffron-accent/15 border border-saffron-accent/20 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-saffron-accent" />
                  </div>
                  <p className="font-heading text-lg font-bold">{t("contact.map.title")}</p>
                  <p className="text-xs text-deep-brown/70 font-medium mt-0.5">{t("contact.map.subtitle")}</p>
                </div>
              </div>

            </div>

            {/* General Contact Form */}
            <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-champagne/30 shadow-xl relative overflow-hidden group h-fit">
              <div className="absolute inset-0 bg-[url('/images/pattern-chakras.png')] bg-repeat opacity-[0.05] bg-[size:110px] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-saffron-accent/10 via-transparent to-transparent pointer-events-none" />

              <h2 className="font-heading text-3xl font-bold text-deep-brown mb-6 relative z-10">{t("contact.form.heading")}</h2>
              <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold text-deep-brown/90">{t("contact.form.nameLabel")}</Label>
                  <Input id="name" name="name" placeholder={t("contact.form.namePlaceholder")} className="bg-white/80" value={data.name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold text-deep-brown/90">{t("contact.form.emailLabel")}</Label>
                  <Input id="email" name="email" type="email" placeholder={t("contact.form.emailPlaceholder")} className="bg-white/80" value={data.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="font-semibold text-deep-brown/90">{t("contact.form.subjectLabel")}</Label>
                  <Input id="subject" name="subject" placeholder={t("contact.form.subjectPlaceholder")} className="bg-white/80" value={data.subject} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="font-semibold text-deep-brown/90">{t("contact.form.messageLabel")}</Label>
                  <Textarea id="message" name="message" placeholder={t("contact.form.messagePlaceholder")} className="min-h-[150px] bg-white/80" value={data.message} onChange={handleChange} />
                </div>
                <Button type="submit" size="lg" className="w-full cursor-pointer">
                  {t("contact.form.submit")}
                </Button>
              </form>
              <p className="text-sm text-center text-deep-brown/70 mt-6 relative z-10 font-medium">
                {t("contact.form.guidanceNote")} <Link href="/meet-guruji" className="underline font-bold text-saffron-accent hover:text-antique-gold">{t("contact.form.guidanceLink")}</Link> {t("contact.form.guidanceNoteEnd")}
              </p>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
