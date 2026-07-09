"use client";

import { motion } from "framer-motion";
import Header from "@/components/header/Header";
import AboutHero from "@/components/about/AboutHero";
import AboutImage from "@/components/about/AboutImage";
import StorySection from "@/components/about/StorySection";
import QuoteSection from "@/components/about/QuoteSection";
import Timeline from "@/components/about/Timeline";
import FinalCTA from "@/components/about/FinalCTA";
import Footer from "@/components/home/Footer";
import { useAboutConfig, useArtworkById } from "@/hooks/usePublicData";
import Shimmer from "@/components/ui/Shimmer";

export default function AboutPage() {
  const { data: config } = useAboutConfig();
  const section = config;

  // Resolve artwork images
  const { data: aboutArtwork } = useArtworkById(section?.about_image_artwork_id ?? null);
  const { data: story1Artwork } = useArtworkById(section?.story1_image_artwork_id ?? null);
  const { data: story2Artwork } = useArtworkById(section?.story2_image_artwork_id ?? null);
  const { data: story3Artwork } = useArtworkById(section?.story3_image_artwork_id ?? null);

  const aboutImageUrl = aboutArtwork?.image_url || "";
  const aboutImageLoading = !aboutArtwork && (section?.about_image_artwork_id) ? true : false;
  const introHeading = section?.introduction_heading || "Living Through Landscapes";
  const introParagraphs = (section?.introduction_paragraphs || "For Ashbin Kafle, landscape painting has never been about documentation. It is a quiet practice of attention.").split("\n\n").filter(Boolean);

  const story1 = {
    label: section?.story1_label || "The Journey",
    title: section?.story1_title || "The Journey",
    imageSrc: story1Artwork?.image_url || "",
    imageAlt: story1Artwork?.image_alt || (story1Artwork?.title || "Mountain landscape at sunrise"),
    paragraphs: (section?.story1_paragraphs || "").split("\n\n").filter(Boolean),
  };

  const story2 = {
    label: section?.story2_label || "The Process",
    title: section?.story2_title || "The Process",
    imageSrc: story2Artwork?.image_url || "",
    imageAlt: story2Artwork?.image_alt || (story2Artwork?.title || "Artist working in studio"),
    paragraphs: (section?.story2_paragraphs || "").split("\n\n").filter(Boolean),
  };

  const story3 = {
    label: section?.story3_label || "The Philosophy",
    title: section?.story3_title || "The Philosophy",
    imageSrc: story3Artwork?.image_url || "",
    imageAlt: story3Artwork?.image_alt || (story3Artwork?.title || "Calm landscape painting"),
    paragraphs: (section?.story3_paragraphs || "").split("\n\n").filter(Boolean),
  };

  const fallbackIntro = [
    "For Ashbin Kafle, landscape painting has never been about documentation. It is a quiet practice of attention — of standing still long enough to feel the atmosphere of a place and translating that feeling into colour, edge, and texture.",
    "Growing up surrounded by the hills and open skies of Nepal shaped a visual language rooted in observation. Rather than reproducing what he sees, Ashbin distills landscapes into their essence — light hitting a ridge at dawn, the weight of mist before rain, the silence of a forest floor.",
    "Painting became the natural extension of this way of seeing. It is not about escape, but about presence. A way of holding onto moments that would otherwise dissolve.",
  ];

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

        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          {aboutImageLoading ? (
            <div className="overflow-hidden rounded-[12px]">
              <Shimmer className="h-[50vh] md:h-[65vh] lg:h-[70vh] w-full rounded-[12px]" />
            </div>
          ) : aboutImageUrl ? (
            <AboutImage src={aboutImageUrl} alt="Artist portrait" priority />
          ) : null}
        </div>

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[650px] px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-foreground/50 font-heading">Introduction</p>
              <h2 className="text-3xl font-heading leading-[1.02] tracking-[-0.035em] text-foreground sm:text-4xl">{introHeading}</h2>
              <div className="space-y-6 text-base leading-8 text-foreground/75 sm:text-lg">
                {(introParagraphs.length > 0 ? introParagraphs : fallbackIntro).map((text, i) => <p key={i}>{text}</p>)}
              </div>
            </motion.div>
          </div>
        </section>

        <StorySection label={story1.label} title={story1.title} imagePosition="right" imageSrc={story1.imageSrc} imageAlt={story1.imageAlt} paragraphs={story1.paragraphs.length > 0 ? story1.paragraphs : ["Ashbin's connection with nature began in the hills. Long walks, changing seasons, and the way light transforms a familiar view into something new — these early observations became the foundation of his creative practice."]} />
        <StorySection label={story2.label} title={story2.title} imagePosition="left" imageSrc={story2.imageSrc} imageAlt={story2.imageAlt} paragraphs={story2.paragraphs.length > 0 ? story2.paragraphs : ["In the studio, the process is deliberate and unhurried. Ashbin works primarily in oil and acrylic on canvas or linen, building layers slowly."]} />
        <StorySection label={story3.label} title={story3.title} imagePosition="right" imageSrc={story3.imageSrc} imageAlt={story3.imageAlt} paragraphs={story3.paragraphs.length > 0 ? story3.paragraphs : ["Ashbin believes the most powerful landscapes are the quietest ones. In an image-saturated world, stillness becomes a radical choice."]} />

        <QuoteSection />
        <div className="border-t border-border/60"><Timeline /></div>
        <FinalCTA />
        <Footer />
      </motion.main>
    </>
  );
}
