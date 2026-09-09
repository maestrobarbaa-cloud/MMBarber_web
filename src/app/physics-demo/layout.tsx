import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Physics Demo | MM Barber",
  description: "3D fyzikální pískoviště pomocí Rapier",
  robots: { index: false, follow: false },
};

export default function PhysicsDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
