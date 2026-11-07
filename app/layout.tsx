import type { Metadata } from "next";
import { Space_Grotesk, Jomolhari } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import SmoothScroll from "@/components/providers/SmoothScroll";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jomolhari = Jomolhari({
  variable: "--font-jomolhari",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Portfolio — Creative Developer & Designer",
  description: "Crafting digital experiences that merge beauty with function",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jomolhari.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col font-jomolhari"
        style={{ fontFamily: "var(--font-jomolhari), serif" }}
      >
        <SmoothScroll>
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
