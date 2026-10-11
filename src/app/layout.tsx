import type { Metadata, Viewport } from "next";
import { inter } from "@/lib/fonts";
import { Footer } from "@/components/main/footer";
import { Navbar } from "@/components/main/navbar";
import { cn } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { AskChat } from "@/components/sub/ask-chat";
import { Spotlight } from "@/components/ui/spotlight";
import { SplashScreen } from "@/components/sub/splash-screen";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mohd Zaid | AI Full-Stack Engineer",
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
    title: "Mohd Zaid | AI Full-Stack Engineer",
    description: "Mohd Zaid is a full-stack software engineer building backend systems, multi-tenant SaaS and AI-powered products with Node.js, Fastify, PostgreSQL, Next.js and Azure.",
    siteName: "Mohd Zaid",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohd Zaid | AI Full-Stack Engineer",
    description: "Mohd Zaid is a full-stack software engineer building backend systems, multi-tenant SaaS and AI-powered products with Node.js, Fastify, PostgreSQL, Next.js and Azure.",
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
    <html lang="en" className={`${inter.variable} overflow-x-hidden`} suppressHydrationWarning>
      <body
        className={cn(
          "bg-[#030014] overflow-y-scroll",
          inter.className,
        )}
      >
        <SplashScreen />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black">
          Skip to content
        </a>
        <div className="starfield" aria-hidden />
        <Navbar />
        <div id="main">{children}</div>
        {/* Vercel's scripts only exist on Vercel; skip them elsewhere to avoid 404s */}
        {process.env.VERCEL && (
          <>
            <SpeedInsights />
            <Analytics />
          </>
        )}
        <Footer />
        <AskChat />
        <Spotlight />
      </body>
    </html>
  );
}
