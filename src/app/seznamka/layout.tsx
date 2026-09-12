import { getDb } from "@/lib/jsonDb";
import { redirect } from "next/navigation";
import React from "react";

export default async function SeznamkaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = await getDb();
  const visibility = db.settings["visibility_card_seznamka"];
  const isHidden = visibility === "hidden" || visibility === "locked";
  
  if (isHidden) {
    return (
      <div className="min-h-screen bg-mafia-black text-white flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center text-center max-w-md gap-4">
          <h1 className="text-4xl font-heading font-black text-mafia-gold tracking-widest uppercase">
            NEDOSTUPNÉ
          </h1>
          <p className="text-white/60 font-mono text-sm uppercase tracking-wider">
            Tato sekce je dočasně uzamčena. Zkuste to prosím později.
          </p>
          <a href="/" className="mt-8 px-6 py-2 border border-mafia-gold text-mafia-gold font-bold uppercase tracking-widest hover:bg-mafia-gold hover:text-black transition-colors">
            Zpět na domovskou stránku
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
