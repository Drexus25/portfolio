import WarpText from "@/components/ui/WarpText";
import WaterCaustics from "@/components/hero/WaterCaustics";
import AboutSection from "@/components/sections/about/AboutSection";
import SkillsSection from "@/components/sections/skills/SkillsSection";

export default function Home() {
  return (
    <main >
      {/* Interactive Sunlight Caustics Background Layer */}
      <section className="min-h-screen w-full bg-[radial-gradient(circle_at_bottom,#CCEBFF,#0099FF)] relative overflow-hidden flex flex-col justify-between">
        <WaterCaustics className="opacity-40" />

        {/* Hero Content Area */}
        <div className="relative flex-1 flex items-center justify-center">

        </div>

        {/* Hero Interactive Warp Typography */}
        <div className="absolute bottom-10 left-6 sm:left-10 w-[92vw] max-w-4xl h-[260px] z-20">
          <WarpText
            text={"what stands in the way,\nbecomes the way."}
            color="#ffffff"
            fontFamily="var(--font-jomolhari), serif"
            fontSize="clamp(2.5rem, 5.5vw, 5.5rem)"
            lineHeight={1.05}
            letterSpacing="-0.02em"
            align="left"
            className="h-full w-full"
            pointerInfluence={0.45}
            pointerStrength={0.4}
          />
        </div>
      </section>
      
      <AboutSection />
      <SkillsSection />
    </main>
  );
}
