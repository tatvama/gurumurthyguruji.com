"use client";

export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LotusDivider } from "@/components/ui/lotus-divider";
import { Link } from "@/components/ui/locale-link";
import Image from "next/image";

const lora = "var(--font-lora), Georgia, serif";
const baskervville = "var(--font-baskervville), 'Baskervville', serif";
const caveat = "var(--font-caveat), 'Caveat', cursive";

const pink = "#CC3366";
const terracotta = "#C2765D";
const ink = "#2A2A2A";
const body = "#3A3A3A";

/* ── Reusable bits ─────────────────────────────────────────────────────── */

function GoldUnderline({ width = 260 }: { width?: number }) {
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

/* Pink left-bordered pull quote (the recurring callout in the story) */
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

/* Para helper */
function P({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={className}
      style={{ fontFamily: lora, fontSize: "17px", lineHeight: "1.95", color: body }}
    >
      {children}
    </p>
  );
}

export default function DivineBirthPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-pearl bg-chakra-texture pt-32 pb-24 relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-40 right-0 w-80 h-80 bg-saffron-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-antique-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">


          {/* ── HERO ──────────────────────────────────────────────────── */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center mb-12">

            {/* ── Framed portrait (pre-rendered ornate frame) ────────── */}
            <div className="md:col-span-4 flex justify-center md:justify-start">
              <Image
                src="/images/guruji_frame_web_divineBirthOfPujyaSri.webp"
                alt="Pujya Sri Gurumurthy Guruji in an ornate golden frame"
                width={420}
                height={520}
                sizes="(max-width: 768px) 80vw, 38vw"
                className="h-auto w-full max-w-[360px] object-contain"
                priority
              />
            </div>

            {/* ── Title block ─────────────────────────────────────────── */}
            <div className="md:col-span-8 flex flex-col items-center md:items-start text-center md:text-left" style={{ maxWidth: "780px" }}>
              {/* "PUJYA SRI" — centered over the block */}
              <h1
                className="w-full text-center mb-1"
                style={{
                  fontFamily: baskervville,
                  fontSize: "clamp(38px, 5.5vw, 64px)",
                  fontWeight: 500,
                  letterSpacing: "10px",
                  color: ink,
                  lineHeight: 1.05,
                }}
              >
                PUJYA SRI
              </h1>

              {/* Gold underline — centered */}
              <div
                className="mb-5 self-center"
                style={{
                  height: "4px",
                  width: "180px",
                  background:
                    "linear-gradient(to right, transparent 0%, #d4af37 20%, #d4af37 80%, transparent 100%)",
                  borderRadius: "2px",
                }}
              />

              {/* Subtitle — line 1 left, "JOURNEY OF" centered (image-2 style) */}
              <div
                className="w-full mb-5"
                style={{
                  fontFamily: baskervville,
                  fontSize: "clamp(14px, 3.4vw, 22px)",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "clamp(2px, 0.9vw, 6px)",
                  lineHeight: 1.65,
                  color: pink,
                }}
              >
                <span className="block text-center md:text-left">
                  The Divine Birth &amp; Spiritual
                </span>
                <span className="block text-center">Journey Of</span>
              </div>

              {/* Cursive description */}
              <p
                className="mb-5"
                style={{
                  fontFamily: caveat,
                  fontSize: "28.8px",
                  fontWeight: 400,
                  lineHeight: "1.6",
                  color: terracotta,
                }}
              >
                A spiritual saint who is blessed from Shri Thrayambak Guruji
                (Sadhguru) who resided in the Himalayas, aged about 1008 Years.
                Let&rsquo;s talk about the back story of Pujya Sri Gurumurthy Guruji.
              </p>

              {/* Journey line */}
              <p
                style={{
                  fontFamily: lora,
                  fontSize: "16px",
                  fontWeight: 700,
                  lineHeight: "1.75",
                  color: ink,
                }}
              >
                Journey through Time:{" "}
                <span style={{ fontWeight: 400 }}>
                  Dr. Sri Gurumurthy Guruji and the Evolution of Puttenahalli &mdash; A
                  Glimpse into the Past.
                </span>
              </p>
            </div>
          </section>

          <LotusDivider className="mb-12" />

          {/* ── DIVINE BIRTH ──────────────────────────────────────────── */}
          <section className="mb-14">
            <h2
              style={{
                fontFamily: baskervville,
                fontSize: "30px",
                fontWeight: 500,
                color: pink,
                marginBottom: "10px",
              }}
            >
              Divine Birth
            </h2>
            <GoldUnderline width={150} />

            <div className="space-y-6">
              <P>
                In the sacred land of Karnataka, where rivers carry the memory of
                rishis and the soil bears the footsteps of saints, lies a humble
                village called <strong>Kottanagatta</strong>, nestled in the
                Channarayapatna Taluk of Hassan district. This quiet land, rich in
                spiritual fragrance and ancestral purity, was destined to witness
                the descent of a divine soul — a soul born not merely out of worldly
                karma, but out of divine intent.
              </P>
              <P>
                It was a full moon night, February 22, 1978, the auspicious day of{" "}
                <strong>Shuddha Pournami</strong>, when the silver light bathed the
                earth in celestial peace. In the vibrant city of Bengaluru, to the
                devout couple Sri Nanjappa and Smt. Parvatamma, a child was born —
                not merely into a family, but into a <strong>lineage of light</strong>.
              </P>
              <P>
                The moment of birth itself was extraordinary. According to Jyotish
                (Vedic astrology), five major planets aligned on the same celestial
                longitude, forming one of the rarest and most auspicious yogas seen
                in generations. Astrologers were stunned, whispering in awe:
              </P>
            </div>

            <PullQuote>
              &ldquo;This is not an ordinary birth. This is a divine soul, returning
              with the blessings of countless lifetimes. His destiny will not be
              small. He has descended for a higher work.&rdquo;
            </PullQuote>

            <div className="space-y-6">
              <P>
                From childhood, the signs were unmistakable. His eyes did not wander
                to toys or trivial temptations, but remained immersed in stillness.
                His smile carried silence. His very presence radiated a peace far
                beyond his years. Even during play, he would pause suddenly, sit in
                deep thought, and gaze at the sky as if communing with unseen realms.
              </P>
              <P className="!font-semibold">
                <strong>
                  &ldquo;Though this child was born into our home, his heart belongs
                  to a divine world. He does not cry like others. His silence speaks
                  more than our words.&rdquo;
                </strong>
              </P>
              <p
                style={{
                  fontFamily: lora,
                  fontSize: "15px",
                  fontStyle: "italic",
                  color: body,
                }}
              >
                — Mother&rsquo;s words
              </p>
            </div>
          </section>

          <LotusDivider className="mb-12" />

          {/* ── THE DIVINE VISION OF 1994 ─────────────────────────────── */}
          <section className="mb-14">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left: heading + text */}
              <div className="md:col-span-7">
                <h2
                  style={{
                    fontFamily: baskervville,
                    fontSize: "30px",
                    fontWeight: 500,
                    color: pink,
                    marginBottom: "10px",
                  }}
                >
                  The Divine Vision Of 1994
                </h2>
                <GoldUnderline width={230} />
                <div className="space-y-6">
                  <P>
                    <strong>The year was 1994.</strong> In those days, the southern
                    part of Bangalore, Puttenahalli — today a bustling corner of J.P.
                    Nagar — was a completely different world. It was still a quiet
                    village, almost like the edge of a forest. The narrow mud paths
                    echoed with the creak of bullock carts, and instead of skyscrapers,
                    there were open fields of ragi and jowar swaying in the wind. The
                    fragrance of flowers, tulasi, and incense lingered in the air around
                    every simple home.
                  </P>
                  <P>
                    <strong>
                      In this serene setting lived Pujya Sri Gurumurthy Guruji,
                      immersed in a life of devotion.
                    </strong>{" "}
                    His home was modest: walls of clay, a tiled roof, a small courtyard
                    where plants bloomed. At the very heart of his home stood a Tulasi
                    platform (Tulasi Katte) — sacred, simple, and radiant with daily
                    worship. Each morning he lit a lamp there, each evening he placed
                    offerings with deep reverence.
                  </P>
                </div>
              </div>

              {/* Vision image */}
              <div className="md:col-span-5">
                <Image
                  src="/images/img_sg2_divineBirthOfPujyaSri.webp"
                  alt="Guruji's divine Darshan of Shirdi Sai Baba"
                  width={480}
                  height={300}
                  sizes="(max-width: 768px) 90vw, 40vw"
                  className="w-full h-auto object-contain"
                  style={{
                    borderRadius: "10px",
                    border: "1px solid rgba(201,168,76,0.4)",
                    boxShadow: "0 8px 30px rgba(201,130,43,0.12)",
                  }}
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
                  Guruji&rsquo;s divine Darshan of Shirdi Sai Baba
                </p>
                <P className="mt-6">
                  From that day, the boy was no longer just a seeker. He was chosen,
                  blessed, and empowered by the eternal master himself — Mahavatar Babaji.
                </P>
              </div>
            </div>

            <PullQuote>
              &ldquo;Gracious child, did I not tell you that whenever you call upon
              me, I shall appear? Behold, Sadhguru has now cleared the path.&rdquo;
            </PullQuote>

            <div className="space-y-6">
              <P>
                <strong>The Divine Vision:</strong> One quiet evening, as the sun
                dipped and painted the sky in orange hues, birds returned to their
                nests. Guruji sat near the Tulasi platform, lit the evening lamp, and
                closed his eyes in meditation. At that very moment, a gentle,
                otherworldly radiance began to spread around the Tulasi plant. This
                was no ordinary light — it was soft, fragrant like sandalwood,
                carrying with it a peace that touched the very soul.
              </P>
              <P>
                From within that radiant glow appeared the divine form of Shirdi Sai
                Baba. Seated calmly, draped in white robes, His eyes shone with
                brilliance — yet filled with a mother&rsquo;s compassion. Guruji&rsquo;s
                heart trembled with bliss. It felt as though decades of devotion had
                blossomed into this single moment of grace.
              </P>
            </div>

            <PullQuote>
              ✨ Baba&rsquo;s Message — &ldquo;Baa Baro&rdquo; (&ldquo;Come,
              Come&rdquo;). As Guruji&rsquo;s heart overflowed, Baba&rsquo;s voice
              filled the space: &ldquo;Baa Baro… Come, Come…&rdquo;
            </PullQuote>

            <div className="space-y-6">
              <P>
                It was not just a sound — it was an inner call. The meaning was clear:
              </P>
              <P>
                <strong>
                  &ldquo;Children, come to me. Leave behind doubt, fear, and sorrow. I
                  am here.&rdquo;
                </strong>
              </P>
              <P>
                That divine call was not limited to Guruji&rsquo;s ears — it seemed to
                ripple through the very winds of Puttenahalli, sanctifying the soil,
                the trees, and the silence of the village.
              </P>
              <P>
                <strong>🌿 The Spiritual Transformation of a Village:</strong> In
                those days, Puttenahalli was still undeveloped, untouched by the
                city&rsquo;s noise. But from that evening onward, the place became a
                seedbed of spirituality.
              </P>
              <P>
                The mud houses, the quiet fields, the Tulasi platform — all bore
                witness to a cosmic event. From then on, Guruji became a guiding light
                for many seekers, spreading Baba&rsquo;s message, and transforming the
                once-forgotten village into a sacred space of remembrance.
              </P>
              <P>
                Thus, that evening in 1994 was not merely a personal vision — it
                became a divine milestone, forever etched into the soul of the land
                itself.
              </P>
            </div>
          </section>

          <LotusDivider className="mb-12" />

          {/* ── THE WANDERER (Malik) ──────────────────────────────────── */}
          <section className="mb-4">
            <p
              className="mb-8"
              style={{
                fontFamily: lora,
                fontSize: "15px",
                fontWeight: 700,
                lineHeight: "1.75",
                color: ink,
              }}
            >
              As years passed, this inner connection to the unseen world only
              deepened. Then came an evening that would remain etched in his soul
              forever.
            </p>

            <div className="space-y-6">
              {[
                <>
                  &ldquo;On that evening, as I lay in the arms of slumber, a voice
                  resounded within, calling out &lsquo;Malik.&rsquo; Suddenly, that
                  enchanting voice awakened me, and before me stood an elderly figure,
                  his grown beard radiating profound wisdom. His very presence
                  reminded me of a great holy power.&rdquo;
                </>,
                <>
                  &ldquo;Clothed in a white shroud that veiled his head, wearing a
                  creased and weathered off-white kurta, he held a Bhiksha bowl in his
                  grasp. <strong>The whiteness of his beard and the grace of his
                  demeanor made me think he was a wanderer or a destitute soul.</strong>{" "}
                  But remembering my mother&rsquo;s counsel not to engage with
                  strangers, I politely asked him to leave.&rdquo;
                </>,
                <>
                  &ldquo;Though confusion pressed upon me, I found the courage to
                  speak. But the old man raised his hand toward the heavens and said,{" "}
                  <strong>&lsquo;Malik. Kind child, I recognize your essence — but do
                  you recognize mine? Are you not concerned with completing the task
                  left unfinished?&rsquo;</strong>&rdquo;
                </>,
                <>
                  &ldquo;His words ignited a realization within me, hinting that this
                  wanderer was no ordinary man, but a celestial sage. Yet I again asked
                  him to depart. In reply, the old man reassured,{" "}
                  <strong>&lsquo;Very well. The doors shall open. Malik is the
                  Sovereign.&rsquo;</strong> With that, he turned to leave.&rdquo;
                </>,
                <>
                  &ldquo;He had barely taken a few steps when he seemed to dissolve into
                  thin air, vanishing before my eyes. A deep distress filled me as I
                  wondered if he had gone hungry. Compassion moved me to rush outside,
                  but no trace of him could be found. How swiftly he had vanished! The
                  mystery of his sudden disappearance stayed with me, like an eternal
                  echo of that encounter.&rdquo;
                </>,
              ].map((q, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-2xl border border-champagne/30 bg-white/55 p-5 shadow-sm backdrop-blur-sm"
                >
                  <span
                    className="shrink-0"
                    style={{ fontSize: "18px", lineHeight: "1.7", marginTop: "1px" }}
                  >
                    ⚙️
                  </span>
                  <p
                    style={{
                      fontFamily: lora,
                      fontSize: "16px",
                      lineHeight: "1.9",
                      color: body,
                    }}
                  >
                    {q}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── CONTINUE THE JOURNEY ─────────────────────────────────── */}
          <section className="mt-16 mb-4 text-center">
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
            <Link
              href="/journey-of-awakening"
              style={{
                fontFamily: lora,
                fontSize: "23px",
                color: terracotta,
                fontStyle: "italic",
                textDecoration: "none",
              }}
              className="hover:underline"
            >
              Read More About Pujya Sri Guuruji - You Might Have Missed It
            </Link>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
