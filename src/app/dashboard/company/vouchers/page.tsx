import React from "react";
import VoucherManager from "@/components/company/VoucherManager";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Vouchery | Firemní Dashboard | MM Barber",
  description: "Správa firemních voucherů pro MM Barber seznamku.",
};

export default async function CompanyVouchersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const companyProfile = await prisma.companyProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!companyProfile) {
    redirect("/company/register");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Vouchery pro Matches</h1>
        <p className="text-zinc-400">
          Zde můžete spravovat slevové vouchery a nabídky, které se zobrazí uživatelům po úspěšném matchi na naší seznamce.
          Využijte tuto možnost k přilákání nových zákazníků do vašeho podniku na první rande!
        </p>
      </div>

      <VoucherManager />
    </div>
  );
}
