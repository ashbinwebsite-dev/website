"use client";

import { motion } from "framer-motion";
import Header from "@/components/header/Header";
import AboutHero from "@/components/about/AboutHero";
import AboutImage from "@/components/about/AboutImage";
import StorySection from "@/components/about/StorySection";
import QuoteSection from "@/components/about/QuoteSection";
import Timeline from "@/components/about/Timeline";
import FinalCTA from "@/components/about/FinalCTA";

export default function AboutPage() {
  return (
    <>
      <Header />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative pt-[80px]"
      >
        <AboutHero />

        {/* Full-width portrait image */}
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <AboutImage
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=80&auto=format&fit=crop"
            alt="Mountain landscape with soft morning light over layered ridges"
            priority
          />
        </div>

        {/* Introduction */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[650px] px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-foreground/50 font-heading">
                Introduction
              </p>
              <h2 className="text-3xl font-heading leading-[1.02] tracking-[-0.035em] text-foreground sm:text-4xl">
                Living Through Landscapes
              </h2>
              <div className="space-y-6 text-base leading-8 text-foreground/75 sm:text-lg">
                <p>
                  For Ashbin Kafle, landscape painting has never been about
                  documentation. It is a quiet practice of attention — of
                  standing still long enough to feel the atmosphere of a place
                  and translating that feeling into colour, edge, and texture.
                </p>
                <p>
                  Growing up surrounded by the hills and open skies of Nepal
                  shaped a visual language rooted in observation. Rather than
                  reproducing what he sees, Ashbin distills landscapes into
                  their essence — light hitting a ridge at dawn, the weight of
                  mist before rain, the silence of a forest floor.
                </p>
                <p>
                  Painting became the natural extension of this way of seeing.
                  It is not about escape, but about presence. A way of holding
                  onto moments that would otherwise dissolve.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Story Section 1 — The Journey */}
        <StorySection
          label="The Journey"
          title="The Journey"
          imagePosition="right"
          imageSrc="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&q=80&auto=format&fit=crop"
          imageAlt="Mountain landscape with mist and layered ridges at sunrise"
          paragraphs={[
            "Ashbin's connection with nature began in the hills. Long walks, changing seasons, and the way light transforms a familiar view into something new — these early observations became the foundation of his creative practice.",
            "Travel deepened his vocabulary. From the Himalayan foothills to coastal shorelines, each landscape offered a different texture, a different quality of light. He began carrying a sketchbook everywhere, learning to see before learning to paint.",
            "These journeys taught him that landscape is never static. It shifts with the hour, the weather, the season. Painting became a way of capturing not just a place, but a particular moment in time.",
          ]}
        />

        {/* Story Section 2 — The Process */}
        <StorySection
          label="The Process"
          title="The Process"
          imagePosition="left"
          imageSrc="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1000&q=80&auto=format&fit=crop"
          imageAlt="Artist working in studio with natural light, paintbrushes and canvas"
          paragraphs={[
            "In the studio, the process is deliberate and unhurried. Ashbin works primarily in oil and acrylic on canvas or linen, building layers slowly. Each piece begins with observation — sketches, notes, and colour studies — before the first brushstroke touches the canvas.",
            "Texture is essential. He works with varied brushwork and palette knife techniques, creating surfaces that reward close looking. The interplay of opaque and translucent passages gives each painting a quiet depth.",
            "Patience is the most important tool. A painting may sit for weeks before Ashbin considers it finished. The goal is not perfection, but presence — a sense that the landscape exists beyond the frame.",
          ]}
        />

        {/* Story Section 3 — The Philosophy */}
        <StorySection
          label="The Philosophy"
          title="The Philosophy"
          imagePosition="right"
          imageSrc="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1000&q=80&auto=format&fit=crop"
          imageAlt="Calm landscape painting leaning against a wall in a sunlit room"
          paragraphs={[
            "Ashbin believes the most powerful landscapes are the quietest ones. In an image-saturated world, stillness becomes a radical choice. His work invites the viewer to slow down, to look longer, to feel rather than just see.",
            "Light is the true subject. Not light as illumination, but light as atmosphere — the way it softens edges, mutes colour, and transforms a scene. Every painting is a study in how light shapes our experience of a place.",
            "Landscape, for Ashbin, is a form of memory. Not of a specific location, but of a feeling — the hush of early morning, the weight of an overcast sky, the warmth of golden hour. These are the moments he paints again and again.",
          ]}
        />

        {/* Quote Section */}
        <QuoteSection />

        {/* Timeline */}
        <div className="border-t border-border/60">
          <Timeline />
        </div>

        {/* Final CTA */}
        <FinalCTA />

        {/* Footer */}
        <footer className="border-t border-border/70 py-16">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-12 lg:grid-cols-3"
            >
              <div>
                <p className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/70 mb-4">
                  About
                </p>
                <p className="text-sm leading-7 text-foreground/75 max-w-md">
                  Ashbin Kafle creates minimal landscapes that prioritize light,
                  atmosphere, and quiet compositional restraint.
                </p>
              </div>

              <div>
                <p className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/70 mb-4">
                  Contact
                </p>
                <a
                  href="mailto:hello@ashbinkafle.com"
                  className="text-sm leading-7 text-foreground/75 hover:text-foreground transition duration-300"
                >
                  hello@ashbinkafle.com
                </a>
              </div>

              <div>
                <p className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/70 mb-4">
                  Social
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://instagram.com/ashbinkafle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm leading-7 text-foreground/75 hover:text-foreground transition duration-300"
                  >
                    Instagram
                  </a>
                  <a
                    href="#"
                    className="text-sm leading-7 text-foreground/75 hover:text-foreground transition duration-300"
                  >
                    Twitter
                  </a>
                </div>
              </div>
            </motion.div>

            <div className="mt-16 pt-8 border-t border-border/70">
              <p className="text-xs text-foreground/50 tracking-[0.2em] uppercase">
                &copy; {new Date().getFullYear()} Ashbin Kafle. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </motion.main>
    </>
  );
}
