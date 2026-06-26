"use client";

export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LotusDivider } from "@/components/ui/lotus-divider";
import Image from "next/image";

const lora         = "var(--font-lora), Georgia, serif";
const baskervville = "var(--font-baskervville), 'Baskervville', serif";
const pink         = "#CC3366";
const terracotta   = "#C2765D";
const gold         = "#C9A84C";
const ink          = "#2A2A2A";
const body         = "#3A3A3A";

/* ── Helpers ─────────────────────────────────────────────────────────── */

function GoldUnderline({ width = 160 }: { width?: number }) {
  return (
    <div className="flex mb-5">
      <div
        style={{
          height: "3px",
          width: `${width}px`,
          background: "linear-gradient(to right, #d4af37 0%, #d4af37 75%, transparent 100%)",
          borderRadius: "2px",
        }}
      />
    </div>
  );
}

/* Section heading — terracotta/pink, uppercase, gold underline */
function SH({ children, width = 160 }: { children: React.ReactNode; width?: number }) {
  return (
    <>
      <h2
        style={{
          fontFamily: lora,
          fontSize: "clamp(18px, 2.2vw, 22px)",
          fontWeight: 700,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#C36",
          marginBottom: "8px",
        }}
      >
        {children}
      </h2>
      <GoldUnderline width={width} />
    </>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: lora, fontSize: "17px", lineHeight: "1.95", color: body }}>
      {children}
    </p>
  );
}

/* Indented body block (right-column style from screenshots) */
function Indent({ children }: { children: React.ReactNode }) {
  return <div className="pl-0 md:pl-10 space-y-5">{children}</div>;
}

export default function TurningPointPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-pearl bg-chakra-texture pt-32 pb-24 relative overflow-hidden">
        <div className="absolute top-40 right-0 w-80 h-80 bg-saffron-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-antique-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">

          {/* ── HERO TITLE ──────────────────────────────────────────── */}
          <div className="text-center mb-10">
            <h1
              style={{
                fontFamily: baskervville,
                fontSize: "clamp(26px, 7vw, 41px)",
                fontWeight: 500,
                letterSpacing: "clamp(3px, 1.4vw, 8px)",
                color: ink,
                lineHeight: 1.15,
                marginBottom: "10px",
              }}
            >
              THE TURNING POINT
            </h1>
            <div className="flex justify-center mb-4">
              <div
                style={{
                  height: "4px",
                  width: "220px",
                  background:
                    "linear-gradient(to right, transparent 0%, #d4af37 20%, #d4af37 80%, transparent 100%)",
                  borderRadius: "2px",
                }}
              />
            </div>
            <p
              style={{
                fontFamily: 'var(--font-baskervville), "Baskervville", sans-serif',
                fontSize: "clamp(15px, 4vw, 29px)",
                fontWeight: 500,
                textTransform: "uppercase",
                lineHeight: 1.4,
                letterSpacing: "clamp(2px, 1.4vw, 7px)",
                color: "#C36",
              }}
            >
              DIRECT INITIATION FROM MAHAVATAR BABAJI
            </p>
          </div>

          {/* ── YOUNG GURUJI PHOTO ──────────────────────────────────── */}
          <div className="flex justify-center mb-8">
            <div
              className="group w-full overflow-hidden"
              style={{
                maxWidth: "820px",
                borderRadius: "6px",
                border: "1px solid rgba(201,168,76,0.35)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
              }}
            >
              <Image
                src="/images/guruji_theTurningPoint.webp"
                alt="Pujya Sri Gurumurthy Guruji The Turning Point"
                width={768}
                height={495}
                sizes="(max-width: 768px) 92vw, 820px"
                className="w-full h-auto object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                priority
              />
            </div>
          </div>

          {/* Caption + bullets — aligned to the image width */}
          <div className="mb-12 space-y-4 w-full mx-auto px-4 md:px-7" style={{ maxWidth: "820px" }}>
            <P>
              At just <strong>18 years of age</strong>, when most youths are caught in the
              whirlwinds of confusion and worldly desire, the young seeker received something
              that saints and sages wait lifetimes for a <strong>direct, divine initiation
              into Kriya Yoga</strong> from none other than <strong>Mahavatar Babaji
              Himself</strong>.
            </P>
            <ul className="space-y-2 pl-5" style={{ listStyleType: "disc" }}>
              {[
                "It was not a dream.",
                "It was not imagination.",
                <>It was a <strong>living transmission of light</strong>.</>,
              ].map((item, i) => (
                <li key={i} style={{ fontFamily: lora, fontSize: "17px", lineHeight: "1.9", color: body }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <LotusDivider className="mb-12" />

          {/* ── THE MOMENT OF GRACE ─────────────────────────────────── */}
          <section className="mb-12">
            <SH width={210}>The Moment Of Grace</SH>
            <Indent>
              <P>
                In the sacred stillness of deep meditation, Mahavatar Babaji appeared not
                in physical form, but in spirit, radiant with eternal grace. In a moment
                beyond time, Babaji touched him, blessed him, and infused him with the{" "}
                <strong>living current of Kriya Yoga</strong> the very breath of divine
                evolution.
              </P>
              <P>
                Such initiations are rare, rarer than seeing a star fall to earth. Yet here
                was a young man, humble in heart and pure in soul, chosen to receive the{" "}
                <strong>sacred current of the Guru Parampara</strong> through the grace of
                the Immortal Master.
              </P>
            </Indent>
          </section>

          {/* ── A LIFE TRANSFORMED ──────────────────────────────────── */}
          <section className="mb-12">
            <SH width={185}>A Life Transformed</SH>
            <Indent>
              <P>
                From that instant, his life was no longer his own. He belonged to the
                mission. With no pride and no advertisement, he began walking silently on the
                path, carrying the fire of Kriya Yoga not merely as a practice, but as a{" "}
                <strong>living flame</strong>.
              </P>
              <P>That fire now burns bright.</P>
            </Indent>
          </section>

          {/* ── KRIYA YOGA FOR ALL ──────────────────────────────────── */}
          <section className="mb-12">
            <SH width={185}>Kriya Yoga For All</SH>
            <Indent>
              <P>
                Without boundaries of caste, creed, gender, age, or nation without
                commercialization or conditions{" "}
                <strong>Pujya Sri Gurumurthy Guruji</strong> shares Kriya Yoga freely with
                all who seek inner peace and divine connection.
              </P>
              <P>
                He did not choose this path.{" "}
                <strong>The path chose him.</strong>
              </P>
              <P>And through him, thousands have once again found light.</P>
            </Indent>
          </section>

          <LotusDivider className="mb-12" />

          {/* ── A DIVINE MESSAGE ────────────────────────────────────── */}
          <section className="mb-16">
            <SH width={185}>A Divine Message</SH>
            <Indent>
              <P>
                His birth was not just the beginning of a human life it was a divine
                message to the world:
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
                That even in the age of darkness, the light of truth shall descend quietly
                through those who are prepared in silence.
              </p>
              <p
                style={{
                  fontFamily: lora,
                  fontSize: "17px",
                  lineHeight: "1.9",
                  color: ink,
                  fontWeight: 700,
                }}
              >
                🌿✨ May all who come to him find that same light, that same peace, and that
                same eternal connection.
              </p>
            </Indent>
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
              style={{ fontFamily: lora, fontSize: "23px", color: terracotta, fontStyle: "italic" }}
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
