import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Experience | MM Barber",
  description: "Interaktivní 3D zážitek MM Barber Studio",
  robots: { index: false, follow: false },
};

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
