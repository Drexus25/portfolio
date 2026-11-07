"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [isAbout, setIsAbout] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const aboutEl = document.getElementById("about");
      if (!aboutEl) return;

      const rect = aboutEl.getBoundingClientRect();
      // When the about section reaches/overlaps the navbar position (~80px from top)
      const inAbout = rect.top <= 80 && rect.bottom >= 80;
      setIsAbout(inAbout);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-12 left-1/2 -translate-x-1/2 z-50 w-[90%] backdrop-blur-3xl px-8 py-4 border rounded-full flex flex-row justify-between items-center transition-colors duration-300 ${
        isAbout ? "border-black text-black" : "border-white text-white"
      }`}
    >
      <div>
        <p className="font-jomolhari text-2xl transition-colors duration-300">
          {"{lost?}"}
        </p>
      </div>
      <div className="flex flex-row gap-6 items-center text-lg transition-colors duration-300">
        <a href="#about" className="hover:opacity-80 transition-opacity cursor-pointer">
          about
        </a>
        <a className="hover:opacity-80 transition-opacity cursor-pointer">activities</a>
        <a className="hover:opacity-80 transition-opacity cursor-pointer">projects</a>
        <a className="hover:opacity-80 transition-opacity cursor-pointer">contact</a>
      </div>
    </nav>
  );
}
