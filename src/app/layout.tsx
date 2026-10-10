import type { Metadata, Viewport } from "next";
import { inter, carterOne, tourney, audiowide, balooBhai2 } from "@/lib/fonts";
import { Footer } from "@/components/main/footer";
import { Navbar } from "@/components/main/navbar";
import { StarsCanvas } from "@/components/main/star-background";
import { cn } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { SplashScreen } from "@/components/sub/videoIntro";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mohd Zaid | Full-Stack Software Engineer",
    template: "%s | Mohd Zaid",
  },
  description: "Mohd Zaid is a full-stack software engineer building backend systems, multi-tenant SaaS and AI-powered products with Node.js, Fastify, PostgreSQL, Next.js and Azure.",
  keywords: [
    "Mohd Zaid",
    "Full-Stack Software Engineer",
    "Backend Developer",
    "Node.js",
    "Fastify",
    "PostgreSQL",
    "Multi-tenant SaaS",
    "Row-Level Security",
    "Next.js",
    "React",
    "TypeScript",
    "AI Engineer",
    "RAG",
    "Azure",
    "Freelance Developer",
  ],
  authors: [{ name: "Mohd Zaid", url: "https://www.zaidfolio.space/" }],
  creator: "Mohd Zaid",
  publisher: "Mohd Zaid",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.zaidfolio.space/",
    title: "Mohd Zaid | Full-Stack Software Engineer",
    description: "Mohd Zaid is a full-stack software engineer building backend systems, multi-tenant SaaS and AI-powered products with Node.js, Fastify, PostgreSQL, Next.js and Azure.",
    siteName: "Mohd Zaid",
    images: [
      {
        url: "https://www.zaidfolio.space/logo.png",
        alt: "Mohd Zaid portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohd Zaid | Full-Stack Software Engineer",
    description: "Mohd Zaid is a full-stack software engineer building backend systems, multi-tenant SaaS and AI-powered products with Node.js, Fastify, PostgreSQL, Next.js and Azure.",
    images: ["https://www.zaidfolio.space/logo.png"],
    creator: "@zaidrazvi09",
  },
  metadataBase: new URL("https://www.zaidfolio.space/"),
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/notes/rss.xml" },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#030014",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${carterOne.variable} ${tourney.variable} ${audiowide.variable} ${balooBhai2.variable} overflow-x-hidden`}>
      <body
        className={cn(
          "bg-[#030014] overflow-y-scroll",
          inter.className,
        )}
      >
        <SplashScreen />
        <StarsCanvas />
        <Navbar />
        {children}
        <SpeedInsights />
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
