import { Inter, Carter_One, Tourney, Audiowide, Baloo_Bhai_2} from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const carterOne = Carter_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-carter",
  display: "swap",
});

export const tourney = Tourney({
  subsets: ["latin"],
  weight: ["100"],  
  variable: "--font-tourney",
  display: "swap",
});

export const audiowide = Audiowide({
  subsets: ["latin"],
  weight: "400",  
  variable: "--font-audiowide",
  display: "swap",
});

export const balooBhai2 = Baloo_Bhai_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-baloo-bhai-2",
  display: "swap",
});
