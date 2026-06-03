import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PremiumBackground } from "@/components/PremiumBackground";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SV Closures | Premium Plastic Caps, Closures & Spouts Manufacturer",
  description: "SV Closures Private Limited is India's leading manufacturer & exporter of plastic caps, dispensing closures, spouts, and custom packaging systems since 1998.",
  keywords: [
    "plastic caps",
    "bottle closures",
    "spout caps",
    "flip top caps",
    "dispensing systems",
    "industrial packaging",
    "SV Closures Gujarat",
    "export closures manufacturer India",
    "leak proof caps",
    "edible oil caps"
  ],
  authors: [{ name: "SV Closures Private Limited" }],
  openGraph: {
    title: "SV Closures | Premium Plastic Caps & Closures Manufacturer",
    description: "Manufacturing high-quality plastic caps, closures, spouts, and dispensing systems trusted by industries worldwide.",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/logo.png", width: 800, height: 600, alt: "SV Closures Logo" }]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <PremiumBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
