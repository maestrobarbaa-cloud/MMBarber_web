"use client"

import React, { useState, useEffect } from "react"
import { getProducts, createProduct, updateProduct, deleteProduct, getReservations, updateReservationStatus, getAuctionBids } from "./actions"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [bids, setBids] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const loadData = async () => {
    setLoading(true)
    const [prodData, resData, bidsData] = await Promise.all([
      getProducts(),
      getReservations(),
      getAuctionBids()
    ])
    setProducts(prodData)
    setReservations(resData)
    setBids(bidsData)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateReservationStatus(id, newStatus)
    loadData()
  }

  return (
    <div className="p-8 text-neutral-200">
      <h1 className="text-3xl font-bold mb-8 text-amber-500">Správa Produktů a Rezervací</h1>

      <div className="bg-neutral-800 p-6 rounded-lg mb-12 border border-amber-500/30">
        <h2 className="text-xl font-bold mb-6 text-amber-400">Nové a probíhající rezervace ({reservations.filter(r => r.status === 'NEW').length})</h2>
        {loading ? (
          <p>Načítám rezervace...</p>
        ) : (
          <div className="space-y-4">
            {reservations.length === 0 && (
              <p className="text-neutral-400">Zatím žádné rezervace.</p>
            )}
            {reservations.map(res => (
              <div key={res.id} className={`p-4 rounded-lg border flex flex-col md:flex-row justify-between items-center gap-4 ${res.status === 'NEW' ? 'bg-amber-900/20 border-amber-500' : res.status === 'COMPLETED' ? 'bg-green-900/20 border-green-500' : 'bg-neutral-900/50 border-neutral-700 opacity-60'}`}>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-white">{res.customerName}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${res.status === 'NEW' ? 'bg-amber-500 text-black' : res.status === 'COMPLETED' ? 'bg-green-500 text-black' : 'bg-neutral-600 text-white'}`}>
                      {res.status === 'NEW' ? 'Nová' : res.status === 'COMPLETED' ? 'Vyzvednuto' : 'Zrušeno'}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-300">Produkt: <span className="text-amber-400 font-bold">{res.product?.name}</span></p>
                  <p className="text-sm text-neutral-400">
                    Očekávané vyzvednutí: <span className="text-white font-bold">{new Date(res.pickupDateTime).toLocaleString('cs-CZ')}</span>
                  </p>
                </div>
                
                <div className="flex gap-2">
                  {res.status === 'NEW' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(res.id, 'COMPLETED')}
                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg"
                      >
                        Označit jako vyzvednuto
                      </button>
                      <button 
                        onClick={() => handleStatusChange(res.id, 'CANCELLED')}
                        className="bg-neutral-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg"
                      >
                        Zrušit (vrátit kus)
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-neutral-800 p-6 rounded-lg mb-12 border border-blue-500/30">
        <h2 className="text-xl font-bold mb-6 text-blue-400">Nabídky z Aukcí ({bids.length})</h2>
        {loading ? (
          <p>Načítám nabídky...</p>
        ) : (
          <div className="space-y-4">
            {bids.length === 0 && (
              <p className="text-neutral-400">Zatím žádné nabídky.</p>
            )}
            {bids.map(bid => {
              // Calculate rank within the product
              const productBids = bids.filter(b => b.productId === bid.productId).sort((a, b) => b.amount - a.amount || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
              const rank = productBids.findIndex(b => b.id === bid.id) + 1;
              const isWinning = rank <= (bid.product?.stock || 0);

              return (
                <div key={bid.id} className={`p-4 rounded-lg border flex flex-col md:flex-row justify-between items-center gap-4 ${isWinning ? 'bg-blue-900/20 border-blue-500' : 'bg-neutral-900/50 border-neutral-700 opacity-70'}`}>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-lg text-white">{bid.bidderName}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${isWinning ? 'bg-blue-500 text-white' : 'bg-neutral-600 text-white'}`}>
                        {isWinning ? `Vyhrává (${rank}. místo)` : `${rank}. místo`}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-300">Produkt: <span className="text-blue-400 font-bold">{bid.product?.name}</span></p>
                    <p className="text-sm text-neutral-400">
                      Očekávané vyzvednutí: <span className="text-white font-bold">{bid.pickupDateTime ? new Date(bid.pickupDateTime).toLocaleString('cs-CZ') : 'Neuvedeno'}</span>
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-blue-400">{bid.amount.toLocaleString('cs-CZ')} Kč</span>
                    <span className="text-xs text-neutral-500">{new Date(bid.createdAt).toLocaleString('cs-CZ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Upozornění k editaci</h2>
        <p className="text-neutral-400">
          Produkty nyní můžete přidávat a upravovat přímo z veřejné stránky <a href="/produkty" className="text-amber-500 hover:underline">/produkty</a> pokud máte zapnutý Admin Widget. Formulář na této stránce byl proto pro jednoduchost odstraněn.
        </p>
      </div>

    </div>
  )
}
