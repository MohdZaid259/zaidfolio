import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/main/footer";
import { Navbar } from "@/components/main/navbar";
import { StarsCanvas } from "@/components/main/star-background";
import { cn } from "@/lib/utils";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Zaid | Full-Stack Developer & Designer",
    template: "%s | Zaid Portfolio",
  },
  description:
    "Portfolio of Zaid, a full-stack developer and creative designer. Explore projects, skills, and achievements in modern web development, UI/UX, and scalable applications.",
  keywords: [
    "Zaid",
    "Full-Stack Developer",
    "Web Developer",
    "Frontend Engineer",
    "Backend Developer",
    "UI/UX Designer",
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "Portfolio",
    "Software Engineer",
  ],
  authors: [{ name: "Zaid" }],
  creator: "Zaid",
  publisher: "Zaid",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://yourdomain.com",
    title: "Zaid | Full-Stack Developer & Designer",
    description:
      "Discover Zaid’s portfolio – showcasing expertise in web development, design, and scalable digital solutions.",
    siteName: "Zaid Portfolio",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Zaid Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zaid | Full-Stack Developer & Designer",
    description:
      "Check out Zaid’s portfolio: full-stack development, design, and creative problem-solving.",
    images: ["/logo.png"],
    creator: "@yourTwitterHandle",
  },
  metadataBase: new URL("https://yourdomain.com"),
  alternates: {
    canonical: "https://yourdomain.com",
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
    <html lang="en">
      <body
        className={cn(
          "bg-[#030014] overflow-y-scroll overflow-x-hidden",
          inter.className
        )}
      >
        {/* <video autoPlay muted loop playsInline>
          <source src="video.webm" type="video/webm" />
        </video> */}
          <SmoothCursor />
          <StarsCanvas />
          <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
