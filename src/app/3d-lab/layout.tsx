import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Lab — Vývojový koutek | MM Barber",
  description: "Vývojový koutek pro správu 3D interaktivních projektů MMBARBER webu",
  robots: { index: false, follow: false },
};

export default function Lab3DLayout({ children }: { children: React.ReactNode }) {
  return children;
}
