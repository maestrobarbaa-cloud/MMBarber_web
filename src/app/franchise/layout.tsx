import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MMBARBER FRANCHISE | Business Opportunity | Start Your Own Barbershop",
  description: "Join the MMBARBER legacy. Premium barbershop franchise opportunity in Central Europe. Professional concept, strong brand identity, and complete business support for entrepreneurs.",
  keywords: [
    "barbershop franchise Europe",
    "men's grooming business opportunity",
    "start a barbershop",
    "MMBarber franchise",
    "barbershop investment",
    "business partnership Europe",
    "premium barber brand",
    "grooming business concept"
  ],
  openGraph: {
    title: "MMBARBER FRANCHISE | Build Your Own Legacy",
    description: "Take the lead with a proven barbershop concept. Full support, heritage style, and a brand people trust.",
    url: "https://mmbarber.cz/franchise",
    siteName: "MMBARBER",
    locale: "en_US",
    alternateLocale: ["cs_CZ"],
    type: "website",
  },
  alternates: {
    canonical: "https://mmbarber.cz/franchise",
    languages: {
      "cs-CZ": "https://mmbarber.cz/franchise",
      "en-US": "https://mmbarber.cz/franchise",
    },
  },
};

export default function FranchiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
