import { prisma } from "@/lib/prisma"
import ProductsClient from "./ProductsClient"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      reviews: { orderBy: { createdAt: 'desc' } }
    }
  })

  const categories = await prisma.productCategory.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="min-h-screen bg-mafia-black pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration matching web design */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-mafia-gold/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mafia-gold/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mafia-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <h1 className="text-4xl md:text-6xl font-heading font-black text-smoke-white mb-6 tracking-[0.2em] md:tracking-[0.3em] uppercase">
            Naše Produkty
          </h1>
          <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-mafia-gold/20 via-mafia-gold to-mafia-gold/20 mx-auto mb-8 shadow-[0_0_20px_var(--color-mafia-gold-glow)]"></div>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-sans">
            Pečlivě vybrané produkty, které používáme v našem holičství a doporučujeme pro vaši každodenní rutinu.
          </p>
        </div>

        <ProductsClient initialProducts={products} initialCategories={categories} />
      </div>
    </div>
  )
}
