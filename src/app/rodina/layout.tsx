import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MMBarber Rodina | Prověření živnostníci a služby Uherské Hradiště",
  description: "Naše komunita prověřených řemeslníků a služeb v Uherském Hradišti. Vodaři, elektrikáři, gastro, reality a další partneři, kterým důvěřujeme. Spojujeme kvalitu a poctivé řemeslo.",
  keywords: [
    "živnostníci Uherské Hradiště", 
    "služby Uherské Hradiště", 
    "vodaři Uherské Hradiště", 
    "elektrikáři Uherské Hradiště", 
    "reality Uherské Hradiště", 
    "gastronomie Uherské Hradiště", 
    "MMBarber partneři", 
    "MMBarber rodina",
    "řemeslníci Uherské Hradiště"
  ],
};

export default function RodinaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
