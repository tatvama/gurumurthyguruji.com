"use client";

export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LotusDivider } from "@/components/ui/lotus-divider";
import Image from "next/image";

const lora = "var(--font-lora), Georgia, serif";
const baskervville = "var(--font-baskervville), 'Baskervville', serif";
const caveat = "var(--font-caveat), 'Caveat', cursive";

const pink      = "#CC3366";
const terracotta = "#C2765D";
const ink       = "#2A2A2A";
const body      = "#3A3A3A";

/* ── Helpers ─────────────────────────────────────────────────────────── */

function GoldUnderline({ width = 220 }: { width?: number }) {
  return (
    <div className="flex mb-6">
      <div
        style={{
          height: "4px",
          width: `${width}px`,
          background:
            "linear-gradient(to right, #d4af37 0%, #d4af37 75%, transparent 100%)",
          borderRadius: "2px",
        }}
      />
    </div>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      className="my-9"
      style={{
        borderLeft: "4px solid #E07B4A",
        paddingLeft: "20px",
        fontFamily: lora,
        fontSize: "17px",
        lineHeight: "1.85",
        fontStyle: "italic",
        color: pink,
      }}
    >
      {children}
    </blockquote>
  );
}

function P({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={className}
      style={{ fontFamily: lora, fontSize: "17px", lineHeight: "1.95", color: body }}
    >
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h2
        style={{
          fontFamily: lora,
          fontSize: "26px",
          fontWeight: 700,
          color: pink,
          marginBottom: "10px",
        }}
      >
        {children}
      </h2>
      <GoldUnderline width={140} />
    </>
  );
}

export default function BabajiGracePage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-pearl bg-chakra-texture pt-32 pb-24 relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-40 right-0 w-80 h-80 bg-saffron-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-antique-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">


          {/* ── HERO TITLE ────────────────────────────────────────────── */}
          <div className="text-center mb-10">
            <h1
              style={{
                fontFamily: baskervville,
                fontSize: "38px",
                fontWeight: 500,
                letterSpacing: "8px",
                color: ink,
                lineHeight: 1.15,
                marginBottom: "10px",
              }}
            >
              MAHAVATAR BABAJI&rsquo;S GRACE
            </h1>
            <div className="flex justify-center mb-4">
              <div
                style={{
                  height: "4px",
                  width: "320px",
                  background:
                    "linear-gradient(to right, transparent 0%, #d4af37 20%, #d4af37 80%, transparent 100%)",
                  borderRadius: "2px",
                }}
              />
            </div>
            <p
              style={{
                fontFamily: baskervville,
                fontSize: "29px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "6px",
                color: pink,
                lineHeight: 1.5,
              }}
            >
              THE CALL OF THE HIMALAYAS
            </p>
          </div>

          <LotusDivider className="mb-12" />

          {/* ── INTRO: 1996 — two-column ──────────────────────────────── */}
          <section className="mb-14">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

              {/* Vision image */}
              <div className="md:col-span-5">
                <Image
                  src="/images/sadhguru_darshan_guruji_tumbnail-scaled.webp"
                  alt="Guruji's divine Darshan of Mahavatar Babaji with the five-headed serpent"
                  width={520}
                  height={390}
                  sizes="(max-width: 768px) 90vw, 40vw"
                  className="w-full h-auto object-cover"
                  style={{
                    borderRadius: "10px",
                    border: "1px solid rgba(201,168,76,0.4)",
                    boxShadow: "0 8px 30px rgba(201,130,43,0.12)",
                  }}
                  priority
                />
                <p
                  className="text-center mt-3"
                  style={{
                    fontFamily: lora,
                    fontSize: "13px",
                    fontStyle: "italic",
                    color: terracotta,
                  }}
                >
                  Guruji&rsquo;s divine Darshan of Mahavatar Babaji with the five-headed serpent
                </p>
              </div>

              {/* Text */}
              <div className="md:col-span-7 space-y-6">
                <P>
                  It was the year 1996, in the quiet, forest-clad hills near Dalavayi
                  Kodalli of Kanakapura. Hidden there was Basavana Betta, a land of
                  ancient sanctity where sages were said to have meditated in ages past.
                  One evening, while Pujya Shri Gurumurthy Guruji was staying at a
                  friend&rsquo;s home, a few men posing as sadhus came with a strange tale.
                </P>
                <P>
                  They said, &ldquo;A rare serpent gem, a Nagamani, has appeared in the
                  forest. But such a gem will only reveal its radiance in the presence
                  of one born under a rare star. You must come with us, for only then
                  can the treasure be found.&rdquo;
                </P>
              </div>
            </div>
          </section>

          {/* ── THE DIVINE VISION AT BASAVANA BETTA ─────────────────── */}
          <section className="mb-14">
            <SectionHeading>The Divine Vision At Basavana Betta &ndash; 1996</SectionHeading>

            <div className="pl-0 md:pl-10 space-y-6">
              <P>
                Their words sounded mystical, but hidden behind them was nothing more
                than greed. Still, with the innocence of a pure heart and the trust
                that perhaps a divine sight awaited, Guruji agreed to accompany them.
              </P>
              <P>
                As they walked through the dense forest, darkness wrapped around like
                a veil. The moonlight faintly lit the narrow paths, while owls hooted
                and unseen creatures stirred among the trees. The atmosphere itself
                felt otherworldly, as though destiny was preparing for something far
                greater than what the sadhus imagined.
              </P>
              <P>
                By the time they reached the sacred slopes of Basavana Betta, the hour
                had shifted into Brahma Muhurta — the silent, holy time before dawn
                when the veil between heaven and earth grows thin. The sadhus were
                restless, eyes gleaming with the hope of seizing the mythical gem. But
                the divine plan was of a different kind.
              </P>
              <P>
                Suddenly, the forest was pierced by an unearthly radiance. A flood of
                light descended as if the very heavens had opened. In that brilliant
                aura stood Mahavatar Babaji Himself, radiant, eternal,
                beyond human description. Behind Him shimmered the luminous presence of
                a divine serpent — a celestial naga — its hood spread in majesty,
                glowing like a crown of eternal guardianship.
              </P>
              <P>
                The sadhus trembled in shock. They had sought a mere stone, but before
                their eyes stood the true jewel of immortality. For Guruji, that moment
                was not of fear but of awakening. The light did not merely shine upon
                his eyes — it poured into his soul. His being was infused with grace,
                strength, and the silent command of destiny.
              </P>
            </div>

            <PullQuote>
              The seekers of the Nagamani found nothing but their own disappointment.
              Yet in the very same forest, Guruji received a treasure greater than any
              gem on earth — the divine vision of Babaji.
            </PullQuote>
          </section>

          {/* ── MOUNTAIN / DARK PANORAMA ──────────────────────────────── */}
          <section
            className="mb-14 relative overflow-hidden rounded-2xl"
            style={{
              background:
                "linear-gradient(to bottom, rgba(30,40,55,0.88) 0%, rgba(20,28,42,0.92) 100%)",
              padding: "60px 40px",
            }}
          >
            {/* Mountain silhouette suggestion via gradient */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 110%, rgba(90,110,140,0.35) 0%, transparent 65%)",
              }}
            />
            <p
              className="relative z-10 text-center"
              style={{
                fontFamily: lora,
                fontSize: "clamp(14px, 1.6vw, 17px)",
                lineHeight: "2",
                color: "rgba(255,255,255,0.82)",
                maxWidth: "760px",
                margin: "0 auto",
              }}
            >
              That night, Basavana Betta became the stage of a sacred drama: man&rsquo;s
              greed collapsed, while God&rsquo;s grace unfolded. What seemed like deception
              became the doorway to revelation. From that hour, the course of
              Guruji&rsquo;s life was forever changed. He was no longer just a young
              seeker — he had become the chosen one, marked by the light of Babaji,
              destined to carry forth the flame of Kriya Yoga and spiritual truth.
            </p>
          </section>

          {/* ── THE GIFT OF JNANA DEEKSHA ─────────────────────────────── */}
          <section className="mb-14">
            <SectionHeading>The Gift Of Jnana Deeksha</SectionHeading>

            <div className="pl-0 md:pl-10 space-y-6">
              <P>
                That night at Basavana Betta, when the forest glowed with unearthly
                radiance, Mahavatar Babaji appeared before young Gurumurthy Guruji.
                His eyes were filled with compassion, his presence like a current of
                eternal silence.
              </P>
              <P>
                <strong>Babaji spoke softly:</strong>
              </P>
              <p
                style={{
                  fontFamily: lora,
                  fontSize: "17px",
                  lineHeight: "1.95",
                  color: terracotta,
                  fontStyle: "italic",
                }}
              >
                &ldquo;Child, your heart is pure. Only a soul untouched by worldly
                delusion is ready to behold the true vision of wisdom. Tonight, I
                bestow upon you the Jnana Deeksha — not a ritual of the outer world,
                but the awakening of your inner being.&rdquo;
              </p>
              <P>
                In that moment, Guruji felt a surge of light pour into him. His breath
                deepened, his thoughts stilled, and his entire being vibrated with
                divine energy. It was not a ceremony — it was a transmission of the
                living flame of truth.
              </P>
            </div>
          </section>

          <LotusDivider className="mb-12" />

          {/* ── THE CALL OF THE HIMALAYAS ─────────────────────────────── */}
          <section className="mb-14">
            <SectionHeading>The Call Of The Himalayas</SectionHeading>

            <div className="pl-0 md:pl-10 space-y-6">
              <P>After the blessing, Babaji&rsquo;s voice carried the weight of destiny:</P>
              <P>
                <strong>
                  &ldquo;This vision is only the beginning. Your true journey lies ahead.&rdquo;
                </strong>
              </P>
              <p
                style={{
                  fontFamily: lora,
                  fontSize: "17px",
                  lineHeight: "1.95",
                  color: terracotta,
                  fontStyle: "italic",
                }}
              >
                &ldquo;The Himalayas are calling you. There, in the eternal silence of the
                snow-clad peaks, the hidden doors of knowledge will open. It is there
                you will receive the complete grace of Kriya Yoga. That yoga is your
                path, your dharma, your mission.&rdquo;
              </p>
              <P>
                The forest fell deeper into silence. The moon hid behind drifting
                clouds. Babaji&rsquo;s form slowly dissolved into pure light, yet his
                words were etched forever in Guruji&rsquo;s heart.
              </P>
            </div>
          </section>

          {/* ── THE ETERNAL PHILOSOPHY OF BABAJI ─────────────────────── */}
          <section className="mb-16">
            <SectionHeading>The Eternal Philosophy Of Babaji</SectionHeading>

            <div className="pl-0 md:pl-10">
              <p
                className="mb-5"
                style={{
                  fontFamily: lora,
                  fontSize: "17px",
                  lineHeight: "1.9",
                  color: ink,
                  fontWeight: 700,
                }}
              >
                Babaji&rsquo;s teaching was simple yet profound:
              </p>
              <ul className="space-y-4">
                {[
                  "The body is only an instrument; the soul is the true goal.",
                  "Within the rhythm of breath lies the secret of God. He who masters the breath awakens the infinite power within.",
                  "Kriya Yoga is the eternal bridge—it purifies life, steadies the mind, and unites the soul with the Supreme.",
                  "Deeksha is not external ritual but an inner transmission—the living current flowing from Guru to disciple.",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3"
                    style={{
                      fontFamily: lora,
                      fontSize: "17px",
                      lineHeight: "1.85",
                      color: body,
                    }}
                  >
                    <span
                      style={{
                        color: "#C9A84C",
                        marginTop: "4px",
                        flexShrink: 0,
                        fontSize: "16px",
                      }}
                    >
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── CONTINUE THE JOURNEY ─────────────────────────────────── */}
          <section className="mt-4 mb-4 text-center">
            <p
              style={{
                fontFamily: baskervville,
                fontSize: "22px",
                fontWeight: 500,
                letterSpacing: "6px",
                textTransform: "uppercase",
                color: ink,
                marginBottom: "10px",
              }}
            >
              🌸 CONTINUE THE JOURNEY 🌸
            </p>
            <div className="flex justify-center mb-6">
              <div
                style={{
                  height: "3px",
                  width: "220px",
                  background:
                    "linear-gradient(to right, transparent 0%, #d4af37 20%, #d4af37 80%, transparent 100%)",
                  borderRadius: "2px",
                }}
              />
            </div>
            <p
              style={{
                fontFamily: lora,
                fontSize: "23px",
                color: terracotta,
                fontStyle: "italic",
              }}
            >
              Read More About Pujya Sri Guuruji - You Might Have Missed It
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
