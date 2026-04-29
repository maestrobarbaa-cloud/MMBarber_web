import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Great_Vibes } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { Atmosphere } from "@/components/Atmosphere";
import { CustomCursor } from "@/components/CustomCursor";
import { FilmGrain } from "@/components/FilmGrain";
import { SecurityProvider } from "@/components/SecurityProvider";
import { ClientWrapper } from "@/components/ClientWrapper";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import Script from "next/script";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: 'swap',
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700", "900"],
  display: 'swap',
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mmbarber.cz"),
  title: "MMBARBER Barber & Shop | Nejlepší Barbershop Uherské Hradiště | Pánské holičství",
  description: "Zažijte prémiovou péči v MMBARBER Barber & Shop. Moderní barbershop, heritage styl a unikátní atmosféra v srdci Uherského Hradiště. Nechte se ostříhat od mistrů v oboru – skin fade, úprava vousů břitvou, parkování zdarma.",
  keywords: [
    "MMBARBER",
    "Barbershop Uherské Hradiště",
    "Pánské holičství Uherské Hradiště",
    "nejlepší holič UH",
    "pánský kadeřník Slovácko",
    "stříhání vlasů Uherské Hradiště",
    "úprava vousů břitvou",
    "skin fade UH",
    "parkování zdarma Uherské Hradiště",
    "barbershop Mařatice",
    "kadeřnictví Kunovice",
    "holič Staré Město",
    "franchisa barbershop",
    "investice do podnikání",
    "MM BARBER rodina",
    "instalatér Uherské Hradiště",
    "elektrikář Slovácko",
    "fotograf UH",
    "LFŠ Uherské Hradiště",
    "1.FC Slovácko",
    "Slavnosti vína UH",
    "modern grooming", 
    "international barbershop experience", 
    "heritage grooming club"
  ],
  authors: [{ name: "Tomáš Mička" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://mmbarber.cz",
    languages: {
      "cs-CZ": "https://mmbarber.cz",
      "en-US": "https://mmbarber.cz/en",
    },
  },
  icons: {
    icon: [
      { url: "/icon.png?v=1", type: "image/png" },
      { url: "/logo.png?v=1", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png?v=1", type: "image/png" },
    ],
    shortcut: ["/icon.png?v=1"],
  },
  openGraph: {
    title: "MMBARBER Barber & Shop | Barbershop | Pánské holičství",
    description: "Premium grooming, heritage style, and unique community hub in Uherské Hradiště. Experience the global standard of male grooming.",
    url: "https://mmbarber.cz",
    siteName: "MMBARBER",
    images: [
      {
        url: "/obr/main-hero.png",
        width: 1200,
        height: 630,
        alt: "MMBARBER Barber & Shop Uherské Hradiště",
      },
    ],
    locale: "cs_CZ",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MMBARBER Barber & Shop | Uherské Hradiště",
    description: "Nejlepší barbershop a pánské kadeřnictví v Uherském Hradišti. Mistrovský střih a unikátní styl.",
    images: ["/obr/main-hero.png"],
  },
  verification: {
    google: "google-site-verification-placeholder", // User should replace with actual code
  },
  other: {
    "seznam-wmt": "seznam-verification-placeholder", // User should replace with actual code
  }
};
export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/obr/main-hero.png" as="image" type="image/png" fetchPriority="high" />
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            // Early detection for mobile and graphics tier to prevent layout shifts
            const isMobile = window.innerWidth < 1280;
            if (isMobile) {
              document.documentElement.classList.add('is-mobile-device');
            }
            
            const savedConfig = localStorage.getItem("mmbarber_graphics_config");
            if (savedConfig) {
              const tier = JSON.parse(savedConfig).tier;
              document.documentElement.setAttribute('data-graphics-tier', tier);
            } else {
              // Quick conservative heuristic for first visit
              const cores = navigator.hardwareConcurrency || 4;
              let tier = 'low';
              if (isMobile) {
                tier = (cores >= 8 ? 'medium' : 'low');
              } else {
                if (cores >= 12) tier = 'ultra';
                else if (cores >= 8) tier = 'high';
                else if (cores >= 6) tier = 'medium';
                else tier = 'low';
              }
              document.documentElement.setAttribute('data-graphics-tier', tier);
            }

            const storedNoir = localStorage.getItem('mmbarber_noir_mode');
            const hour = new Date().getHours();
            const isNight = hour >= 19 || hour < 6;
            if (storedNoir === 'true' || (storedNoir === null && isNight)) {
              document.documentElement.classList.add('noir-mode');
            }
          } catch (e) {}
        `}} />
      </head>
      <body 
        className={`${playfair.variable} ${inter.variable} ${greatVibes.variable} antialiased selection:bg-mafia-gold selection:text-mafia-black min-h-screen relative bg-mafia-black overflow-x-hidden`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <SecurityProvider>
            {/* Google Analytics */}
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-4TF9YWGSV5"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                
                // Default consent to denied
                gtag('consent', 'default', {
                  'analytics_storage': 'denied',
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied'
                });

                gtag('js', new Date());
                gtag('config', 'G-4TF9YWGSV5');
              `}
            </Script>

            <Atmosphere />
            <FilmGrain />
            <Header />

            <main className="relative z-10 flex-col flex flex-1">
              {children}
            </main>

            <ClientWrapper />
            
            {/* Global Web Frame - PC/Desktop Only (Subtle Yellow Border & Glow) */}
            <div className="fixed inset-0 pointer-events-none z-[9999] border-[1px] border-mafia-gold/20 shadow-[inset_0_0_15px_rgba(197,160,89,0.05),0_0_15px_rgba(197,160,89,0.05)] hidden md:block">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-mafia-gold/30" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-mafia-gold/30" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-mafia-gold/30" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-mafia-gold/30" />
            </div>

            <ScrollIndicator />
            <CustomCursor />
          </SecurityProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
