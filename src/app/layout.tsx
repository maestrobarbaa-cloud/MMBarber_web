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
  title: "MMBARBER | Barber shop Uherské Hradiště | Pánské holičství",
  description: "Exkluzivní pánské holičství MMBarber v Uherském Hradišti. Profesionální střihy, úprava vousů a relaxace v rodinné atmosféře. Rezervujte si svůj termín online.",
  keywords: ["barber shop Uherské Hradiště", "pánské holičství", "holič", "střih vlasů", "úprava vousů", "barbershop", "MMBarber"],
  authors: [{ name: "Tomáš Mička" }],
  openGraph: {
    title: "MMBARBER | Barber shop Uherské Hradiště",
    description: "Profesionální střihy a vousy v srdci Uherského Hradiště.",
    url: "https://mmbarber.cz",
    siteName: "MMBARBER",
    locale: "cs_CZ",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
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
