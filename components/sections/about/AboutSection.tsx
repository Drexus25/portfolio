"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { User, Sparkles } from "lucide-react";
import HoloCard from '../../ui/HoloCard';

const PROFILE_CARDS = [
  "/profile/profile-card1.webp",
  "/profile/profile-card2.webp",
  "/profile/profile-card3.webp",
];

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    // Preload card images into browser cache so switching is instantaneous
    PROFILE_CARDS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const timer = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % PROFILE_CARDS.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // "who am i ?" animation transforms
  const titleOpacity = useTransform(scrollYProgress, [0, 0.22, 0.35], [1, 0.8, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.25]);
  const titleY = useTransform(scrollYProgress, [0, 0.35], [0, -60]);
  const titleFilter = useTransform(
    scrollYProgress,
    [0, 0.35],
    ["blur(0px)", "blur(14px)"]
  );
  const titlePointerEvents = useTransform(scrollYProgress, (v) =>
    v > 0.3 ? "none" : "auto"
  );

  // Content (Name, Description, Image) transforms
  const contentOpacity = useTransform(scrollYProgress, [0.28, 0.45], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.28, 0.48], [60, 0]);
  const contentScale = useTransform(scrollYProgress, [0.28, 0.48], [0.96, 1]);

  // Subtle image parallax depth
  const imageY = useTransform(scrollYProgress, [0.3, 1], [35, -35]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative h-[220vh] bg-[#f6fbff]"
    >
      {/* Sticky viewport frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* Phase 1: "who am i ?" Dramatic Parallax Title */}
        <motion.div
          style={{
            opacity: titleOpacity,
            scale: titleScale,
            y: titleY,
            filter: titleFilter,
            pointerEvents: titlePointerEvents,
          }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20"
        >

          <h1 className="font-jomolhari text-6xl sm:text-7xl md:text-8xl text-neutral-900 tracking-tight">
            who am i ?
          </h1>
        </motion.div>

        {/* Phase 2: Profile Content (Name, Description, Image Placeholder) */}
        <motion.div
          style={{
            opacity: contentOpacity,
            y: contentY,
            scale: contentScale,
          }}
          className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center"
        >
          {/* Left Column: Name & Brief Description */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-6">

            <div>
              {/* <p className="text-xs sm:text-sm text-neutral-400 mb-2">
                Hello, I&apos;m
              </p> */}
              <h2 className="font-jomolhari text-xl sm:text-2xl lg:text-4xl text-neutral-900 leading-tight">
                the ambitious developer.
              </h2>
            </div>

            <div className="space-y-4 text-neutral-600 font-arial text-sm sm:text-base leading-relaxed max-w-xl">
              <p>
                Hi, my name is <span className="text-[#157eb6] font-medium">Rhyu Santosa</span>, an undergraduate Informatics Engineering student at Brawijaya University with a strong sense of responsibility and
                the ability to work effectively in groups. With strong problem-solving skills through creative and efficient
                approaches. Highly motivated to continuously develop skills and contribute to organizational growth.
              </p>
            </div>
          </div>

          {/* Right Column: Holographic Profile Card with Parallax Offset */}
          <div className="md:col-span-5 flex justify-center items-center">
            <motion.div
              style={{ y: imageY }}
              className="relative flex justify-center items-center"
            >
              <HoloCard
                image={PROFILE_CARDS[currentCardIndex]}
                alt={`Profile Card ${currentCardIndex + 1}`}
                preset="swirl"
                foilColor="#e2e6ec"
                intensity={0.4}
                scale={1}
                edgeSparkle={0.8}
                frame={4}
                glare={0.5}
                tiltMax={14}
                hoverScale={1.04}
                radius={18}
                width={320}
                idle
                shadow
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
      
    </section>
  );
}
