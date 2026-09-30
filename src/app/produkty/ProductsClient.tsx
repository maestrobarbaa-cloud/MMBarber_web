"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Star, Flame, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { createProduct, updateProduct, deleteProduct, addReview, deleteReview, createReservation, createCategory, deleteCategory, createBid } from "../admin/produkty/actions";

type AuctionBid = {
  id: string;
  bidderName: string;
  amount: number;
  createdAt: Date;
}

type ProductReview = {
  id: string;
  author: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
}

type ProductCategory = {
  id: string;
  name: string;
}

type Product = {
  id: string;
  name: string;
  description: string | null;
  usage: string | null;
  brand: string | null;
  price: number | null;
  discountPrice: number | null;
  stock: number;
  rating: number | null; // Barber rating
  imageUrl: string | null;
  categoryId: string | null;
  category?: ProductCategory | null;
  reviews?: ProductReview[];
  isAuction?: boolean;
  auctionEndsAt?: Date | null;
  bids?: AuctionBid[];
};

export default function ProductsClient({ initialProducts, initialCategories }: { initialProducts: Product[], initialCategories: ProductCategory[] }) {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [activeBrand, setActiveBrand] = useState<string>("ALL");
  const maxAvailablePrice = Math.max(...initialProducts.map(p => p.discountPrice || p.price || 0), 1000);
  const [priceLimit, setPriceLimit] = useState<number>(maxAvailablePrice);
  
  // Modal state for Product Edit/Add
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    usage: "",
    brand: "",
    price: "",
    discountPrice: "",
    stock: "0",
    rating: "5.0",
    imageUrl: "",
    categoryId: "",
    isAuction: false,
    auctionEndsAt: ""
  });

  // State for Review form
  const [reviewFormOpen, setReviewFormOpen] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState({
    author: "",
    rating: "5",
    comment: ""
  });

  // State for Reservation form
  const [reservationFormOpen, setReservationFormOpen] = useState<string | null>(null);
  const [reservationData, setReservationData] = useState({
    name: "",
    date: "",
    time: ""
  });

  // State for Bid form
  const [bidFormOpen, setBidFormOpen] = useState<string | null>(null);
  const [bidData, setBidData] = useState({
    bidderName: "",
    amount: "",
    pickupDate: "",
    pickupTime: ""
  });

  // State for Wishlist
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("mmbarber_wishlist");
    if (savedWishlist) {
      try { setWishlist(JSON.parse(savedWishlist)); } catch(e) {}
    }
    const checkAuth = () => {
      setIsAdminAuth(sessionStorage.getItem("mmbarber_admin_auth") === "true");
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("mmbarber_admin_auth_changed", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("mmbarber_admin_auth_changed", checkAuth);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReviewData(prev => ({ ...prev, [name]: value }));
  };

  const handleReservationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReservationData(prev => ({ ...prev, [name]: value }));
  };

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBidData(prev => ({ ...prev, [name]: value }));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
      localStorage.setItem("mmbarber_wishlist", JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const submitBid = async (productId: string) => {
    if (!bidData.bidderName.trim() || !bidData.amount.trim() || !bidData.pickupDate || !bidData.pickupTime) return;
    try {
      const pickupDateTime = `${bidData.pickupDate}T${bidData.pickupTime}:00`;
      await createBid(productId, bidData.bidderName, parseFloat(bidData.amount), pickupDateTime);
      setBidData({ bidderName: "", amount: "", pickupDate: "", pickupTime: "" });
      setBidFormOpen(null);
      window.location.reload();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleAddCategory = async () => {
    const newCat = prompt("Zadejte název nové kategorie (např. Parfémy):");
    if (newCat && newCat.trim() !== "") {
      await createCategory(newCat.trim());
      window.location.reload();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Opravdu chcete smazat tuto kategorii?")) {
      await deleteCategory(id);
      window.location.reload();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      description: formData.description || undefined,
      usage: formData.usage || undefined,
      brand: formData.brand || undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
      stock: formData.stock ? parseInt(formData.stock) : 0,
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
      imageUrl: formData.imageUrl || undefined,
      categoryId: formData.categoryId || undefined,
      isAuction: formData.isAuction,
      auctionEndsAt: formData.auctionEndsAt ? new Date(formData.auctionEndsAt) : null
    };

    if (isEditing && formData.id) {
      await updateProduct(formData.id, payload);
      window.location.reload(); 
    } else {
      await createProduct(payload);
      window.location.reload(); 
    }
    closeModal();
  };

  const handleEdit = (product: Product) => {
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description || "",
      usage: product.usage || "",
      brand: product.brand || "",
      price: product.price ? product.price.toString() : "",
      discountPrice: product.discountPrice ? product.discountPrice.toString() : "",
      stock: product.stock.toString(),
      rating: product.rating ? product.rating.toString() : "5.0",
      imageUrl: product.imageUrl || "",
      categoryId: product.categoryId || "",
      isAuction: product.isAuction || false,
      auctionEndsAt: product.auctionEndsAt ? new Date(product.auctionEndsAt).toISOString().slice(0, 16) : ""
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Opravdu chcete smazat tento produkt?")) {
      await deleteProduct(id);
      window.location.reload();
    }
  };

  const submitReview = async (productId: string) => {
    if (!reviewData.author.trim() || !reviewData.comment.trim()) return;
    await addReview(productId, {
      author: reviewData.author,
      rating: parseInt(reviewData.rating),
      comment: reviewData.comment
    });
    window.location.reload();
  };

  const submitReservation = async (productId: string) => {
    if (!reservationData.name.trim() || !reservationData.date || !reservationData.time) {
      alert("Vyplňte prosím všechna pole pro rezervaci.");
      return;
    }
    
    try {
      const pickupDateTime = new Date(`${reservationData.date}T${reservationData.time}`);
      await createReservation(productId, reservationData.name, pickupDateTime);
      alert("Produkt byl úspěšně rezervován! Čekáme na vás na prodejně.");
      window.location.reload();
    } catch (e: any) {
      alert(e.message || "Došlo k chybě při rezervaci.");
    }
  };

  const deleteReviewHandler = async (reviewId: string) => {
    if (confirm("Smazat tento komentář?")) {
      await deleteReview(reviewId);
      window.location.reload();
    }
  };

  const openAddModal = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      usage: "",
      brand: "",
      price: "",
      discountPrice: "",
      stock: "0",
      rating: "5.0",
      imageUrl: "",
      categoryId: "",
      isAuction: false,
      auctionEndsAt: ""
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Filter grouped products based on active category, brand and price
  const filteredProducts = products.filter(p => {
    const pPrice = p.discountPrice || p.price || 0;
    const passesPrice = pPrice <= priceLimit;
    const passesBrand = activeBrand === "ALL" || p.brand === activeBrand;
    return passesPrice && passesBrand;
  });

  const availableBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean))) as string[];

  const uncategorizedProducts = filteredProducts.filter(p => !p.categoryId);
  const validCategories = categories.map(cat => ({
    ...cat,
    products: filteredProducts.filter(p => p.categoryId === cat.id)
  })).filter(cat => cat.products.length > 0 || isAdminAuth);

  const displayedCategories = activeCategory === "ALL" 
    ? validCategories 
    : validCategories.filter(cat => cat.id === activeCategory);

  return (
    <>
      {isAdminAuth && (
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-16">
          <button 
            onClick={openAddModal}
            className="bg-gradient-to-r from-mafia-gold/80 to-mafia-gold hover:from-mafia-gold hover:to-yellow-500 text-mafia-black font-bold py-3 px-8 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all uppercase tracking-widest text-sm"
          >
            + Přidat produkt
          </button>
          <button 
            onClick={handleAddCategory}
            className="bg-mafia-dark border border-mafia-gold text-mafia-gold font-bold py-3 px-8 rounded-full shadow-lg transition-all uppercase tracking-widest text-sm"
          >
            + Nová kategorie
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 flex-shrink-0">
          <div className="sticky top-32 bg-mafia-dark/50 p-6 rounded-2xl border border-neutral-800 backdrop-blur-md">
            <h3 className="text-xl font-heading font-black text-mafia-gold mb-6 uppercase tracking-widest border-b border-neutral-700 pb-4">
              Kategorie
            </h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveCategory("ALL")}
                  className={`w-full text-left px-4 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all ${activeCategory === "ALL" ? 'bg-mafia-gold text-mafia-black shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}
                >
                  Všechny produkty
                </button>
              </li>
              {validCategories.map(cat => (
                <li key={cat.id} className="relative group">
                  <button 
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all ${activeCategory === cat.id ? 'bg-mafia-gold text-mafia-black shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}
                  >
                    {cat.name} <span className="opacity-50 text-xs ml-1">({cat.products.length})</span>
                  </button>
                  {isAdminAuth && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }} 
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Smazat kategorii"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  )}
                </li>
              ))}
              {uncategorizedProducts.length > 0 && (
                <li>
                  <button 
                    onClick={() => setActiveCategory("UNCATEGORIZED")}
                    className={`w-full text-left px-4 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all ${activeCategory === "UNCATEGORIZED" ? 'bg-mafia-gold text-mafia-black shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}
                  >
                    Ostatní <span className="opacity-50 text-xs ml-1">({uncategorizedProducts.length})</span>
                  </button>
                </li>
              )}
            </ul>
            
            {/* Price Filter */}
            <div className="mt-8 pt-6 border-t border-neutral-700">
              <h3 className="text-xl font-heading font-black text-mafia-gold mb-4 uppercase tracking-widest">
                Max. Cena: {priceLimit.toLocaleString('cs-CZ')} Kč
              </h3>
              <input 
                type="range" 
                min="0" 
                max={maxAvailablePrice} 
                step="50"
                value={priceLimit}
                onChange={(e) => setPriceLimit(Number(e.target.value))}
                className="w-full accent-mafia-gold h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-2 font-bold">
                <span>0 Kč</span>
                <span>{maxAvailablePrice.toLocaleString('cs-CZ')} Kč</span>
              </div>
            </div>

            {/* Brand Filter */}
            {availableBrands.length > 0 && (
              <div className="mt-8 pt-6 border-t border-neutral-700">
                <h3 className="text-xl font-heading font-black text-mafia-gold mb-4 uppercase tracking-widest">
                  Značka
                </h3>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="brand" 
                      checked={activeBrand === "ALL"}
                      onChange={() => setActiveBrand("ALL")}
                      className="w-4 h-4 accent-mafia-gold"
                    />
                    <span className={`text-lg transition-colors ${activeBrand === "ALL" ? "text-mafia-gold font-bold" : "text-neutral-400 group-hover:text-white"}`}>Všechny značky</span>
                  </label>
                  {availableBrands.map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="brand" 
                        checked={activeBrand === brand}
                        onChange={() => setActiveBrand(brand)}
                        className="w-4 h-4 accent-mafia-gold"
                      />
                      <span className={`text-lg transition-colors ${activeBrand === brand ? "text-mafia-gold font-bold" : "text-neutral-400 group-hover:text-white"}`}>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-mafia-dark/50 rounded-2xl border border-neutral-700/50 backdrop-blur-sm">
              <p className="text-neutral-400 text-lg">Zatím zde nejsou žádné produkty.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-24">
              
              {/* Categories */}
              {displayedCategories.map((category) => (
                <div key={category.id} className="relative">
                  <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-3xl md:text-5xl font-heading font-black text-smoke-white tracking-widest uppercase">
                      {category.name}
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-mafia-gold/50 to-transparent"></div>
                  </div>

                  {category.products.length === 0 ? (
                    <p className="text-neutral-500 mb-8">Tato kategorie je zatím prázdná (vidí jen admin).</p>
                  ) : (
                    <div className="flex flex-col gap-16 md:gap-24">
                      {category.products.map(product => <React.Fragment key={product.id}>{renderProductCard(product)}</React.Fragment>)}
                    </div>
                  )}
                </div>
              ))}

              {/* Uncategorized */}
              {(activeCategory === "ALL" || activeCategory === "UNCATEGORIZED") && uncategorizedProducts.length > 0 && (
                <div className="relative">
                  <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-3xl md:text-5xl font-heading font-black text-smoke-white tracking-widest uppercase">
                      Ostatní
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-neutral-600 to-transparent"></div>
                  </div>
                  <div className="flex flex-col gap-16 md:gap-24">
                    {uncategorizedProducts.map(product => <React.Fragment key={product.id}>{renderProductCard(product)}</React.Fragment>)}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      {/* Admin Edit Modal */}
      {isModalOpen && isAdminAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <div className="bg-mafia-dark border border-mafia-gold/50 p-8 rounded-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-heading font-black mb-6 text-mafia-gold uppercase tracking-widest">{isEditing ? "Upravit produkt" : "Přidat nový produkt"}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-neutral-300">Kategorie</label>
                  <select 
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full bg-mafia-black border border-neutral-700 rounded-lg p-3 text-white focus:border-mafia-gold outline-none"
                  >
                    <option value="">-- Bez kategorie --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-neutral-300">Název *</label>
                  <input 
                    required
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-mafia-black border border-neutral-700 rounded-lg p-3 text-white focus:border-mafia-gold outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-1 text-neutral-300">Značka</label>
                  <p className="text-xs text-neutral-500 mb-2">Zadejte značku produktu. Podle ní budou moci zákazníci vyhledávat a filtrovat (např. Reuzel, Nish Man).</p>
                  <input 
                    type="text" 
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full bg-mafia-black border border-neutral-700 rounded-lg p-3 text-white focus:border-mafia-gold outline-none"
                    placeholder="Např. Reuzel"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2 text-neutral-300">Fotka produktu</label>
                  <div className="space-y-3">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full bg-mafia-black border border-neutral-700 rounded-lg p-2 text-white text-sm file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-mafia-gold file:text-mafia-black hover:file:bg-mafia-gold/80"
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Nebo vložte URL:</span>
                      <input 
                        type="text" 
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="flex-1 bg-mafia-black border border-neutral-700 rounded-lg p-2 text-white text-sm focus:border-mafia-gold outline-none"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-neutral-300">Cena (Kč)</label>
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-mafia-black border border-neutral-700 rounded-lg p-3 text-white focus:border-mafia-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-mafia-gold">Akční cena (Kč)</label>
                  <input 
                    type="number" 
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                    className="w-full bg-mafia-black border border-mafia-gold/50 rounded-lg p-3 text-white focus:border-mafia-gold outline-none"
                  />
                </div>
                <div className="flex flex-col gap-4 border border-blue-500/30 p-5 rounded-xl bg-blue-900/10 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-blue-400">
                    <input 
                      type="checkbox" 
                      name="isAuction"
                      checked={formData.isAuction}
                      onChange={handleInputChange}
                      className="w-5 h-5 accent-blue-500"
                    />
                    Nastavit produkt jako aukci
                  </label>
                  <p className="text-xs text-blue-300/70 -mt-2">Místo běžné rezervace budou zákazníci moci přihazovat své částky. Produkt získá zákazník (nebo více zákazníků podle "Počtu na prodejně") s nejvyšší nabídkou.</p>
                  {formData.isAuction && (
                    <div className="mt-2">
                      <label className="block text-sm font-bold mb-1 text-blue-400">Konec aukce</label>
                      <p className="text-xs text-blue-300/70 mb-2">Vyberte přesný datum a čas, kdy má aukce automaticky skončit a vyhodnotit výherce.</p>
                      <input 
                        type="datetime-local" 
                        name="auctionEndsAt"
                        value={formData.auctionEndsAt}
                        onChange={handleInputChange}
                        className="w-full bg-mafia-black border border-blue-500/50 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-green-400">Počet na prodejně</label>
                  <input 
                    type="number" 
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full bg-mafia-black border border-green-500/50 rounded-lg p-3 text-white focus:border-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-neutral-300">Hodnocení Barberů (1-5)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="1"
                    max="5"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full bg-mafia-black border border-neutral-700 rounded-lg p-3 text-white focus:border-mafia-gold outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2 text-neutral-300">Účely (krátký štítek)</label>
                  <input 
                    type="text" 
                    name="usage"
                    value={formData.usage}
                    onChange={handleInputChange}
                    className="w-full bg-mafia-black border border-neutral-700 rounded-lg p-3 text-white focus:border-mafia-gold outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2 text-neutral-300">Popis</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-mafia-black border border-neutral-700 rounded-lg p-3 text-white focus:border-mafia-gold outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-neutral-800">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="bg-transparent border border-neutral-600 hover:bg-neutral-800 text-white font-bold py-3 px-8 rounded-lg uppercase tracking-wider text-sm transition-colors"
                >
                  Zrušit
                </button>
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-mafia-gold/80 to-mafia-gold hover:from-mafia-gold hover:to-yellow-500 text-mafia-black font-bold py-3 px-8 rounded-lg uppercase tracking-wider text-sm transition-all"
                >
                  {isEditing ? "Uložit změny" : "Přidat produkt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  function renderProductCard(product: Product) {
    const reviews = product.reviews || [];
    const avgPublicRating = reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : null;

    return (
      <div className="flex flex-col gap-8">
        <div 
          className="group bg-mafia-dark/80 rounded-[2rem] overflow-hidden border border-neutral-800 hover:border-mafia-gold/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] flex flex-col md:flex-row even:md:flex-row-reverse backdrop-blur-md relative"
        >
          {isAdminAuth && (
            <div className="absolute top-6 left-6 z-20 flex gap-3">
              <button 
                onClick={() => handleEdit(product)}
                className="bg-blue-600/90 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-xl text-xs font-bold uppercase tracking-wider backdrop-blur-md"
              >
                Upravit
              </button>
              <button 
                onClick={() => handleDelete(product.id)}
                className="bg-red-600/90 hover:bg-red-500 text-white px-4 py-2 rounded-lg shadow-xl text-xs font-bold uppercase tracking-wider backdrop-blur-md"
              >
                Smazat
              </button>
            </div>
          )}
          
          <div className="relative w-full md:w-1/2 min-h-[400px] md:min-h-[500px] bg-mafia-black overflow-hidden group">
            {/* START OF BADGES & WISHLIST */}
            <div className="absolute top-6 left-6 z-30 flex flex-col items-start gap-3">
              <button 
                onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                className={`p-3 rounded-full backdrop-blur-md shadow-xl transition-all duration-300 transform hover:scale-110 ${wishlist.includes(product.id) ? 'bg-red-500 text-white' : 'bg-mafia-black/50 text-white/70 hover:text-white hover:bg-mafia-black/80'}`}
              >
                <Heart size={24} className={wishlist.includes(product.id) ? 'fill-current' : ''} />
              </button>
              {product.isAuction && (
                <div className="bg-blue-600/90 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.5)] flex items-center gap-1.5 backdrop-blur-md border border-blue-400/30">
                  <Flame size={14} /> Aukce
                </div>
              )}
              {product.discountPrice && (
                <div className="bg-red-600/90 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-[0_0_15px_rgba(220,38,38,0.5)] flex items-center gap-1.5 backdrop-blur-md border border-red-400/30">
                  <Star size={14} /> Sleva!
                </div>
              )}
              {product.stock > 0 && product.stock <= 3 && (
                <div className="bg-mafia-gold/90 text-mafia-black px-4 py-1.5 rounded-full text-xs font-black uppercase shadow-[0_0_15px_rgba(212,175,55,0.5)] flex items-center gap-1.5 backdrop-blur-md border border-mafia-gold/30">
                  <Clock size={14} /> Poslední kusy
                </div>
              )}
            </div>
            {/* END OF BADGES */}
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-neutral-800">
                <span className="text-8xl material-icons opacity-50">inventory_2</span>
              </div>
            )}
            {/* Dark gradient overlay for text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-mafia-black/80 via-transparent to-transparent pointer-events-none"></div>

            {product.price && (
              <div className="absolute top-8 right-8 flex flex-col items-end gap-3 z-10">
                {product.discountPrice ? (
                  <>
                    <div className="bg-red-600/90 text-white font-black px-5 py-2 rounded-full shadow-2xl text-sm md:text-xl line-through opacity-80 backdrop-blur-md">
                      {product.price.toLocaleString('cs-CZ')} Kč
                    </div>
                    <div className="bg-gradient-to-r from-mafia-gold/90 to-mafia-gold text-mafia-black font-black px-8 py-4 md:px-10 md:py-5 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.4)] backdrop-blur-xl text-2xl md:text-4xl tracking-tighter">
                      {product.discountPrice.toLocaleString('cs-CZ')} Kč
                    </div>
                  </>
                ) : (
                  <div className="bg-gradient-to-r from-mafia-gold/90 to-mafia-gold text-mafia-black font-black px-8 py-4 md:px-10 md:py-5 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.4)] backdrop-blur-xl text-2xl md:text-4xl tracking-tighter">
                    {product.price.toLocaleString('cs-CZ')} Kč
                  </div>
                )}
              </div>
            )}

            <div className="absolute bottom-8 left-8 z-10 flex flex-col gap-3">
              {product.isAuction && product.auctionEndsAt && (
                <div className="bg-blue-600/90 text-white font-bold px-5 py-3 rounded-xl shadow-2xl backdrop-blur-xl border border-blue-400/50">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-200 animate-pulse shadow-[0_0_10px_white] inline-block mr-2"></span>
                  Aukce končí: {new Date(product.auctionEndsAt).toLocaleString('cs-CZ')}
                </div>
              )}
              {product.stock > 0 ? (
                product.stock <= 3 ? (
                  <div className="bg-mafia-black/80 backdrop-blur-xl border border-red-500/50 p-4 rounded-xl shadow-2xl w-full max-w-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-red-400 font-bold text-sm uppercase flex items-center gap-2">
                        <Flame size={14} className="animate-pulse" /> Téměř vyprodáno
                      </span>
                      <span className="text-white font-black">{product.stock} ks</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-red-500 h-2 rounded-full w-[25%] animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-500/90 text-white font-bold px-5 py-3 rounded-xl shadow-2xl backdrop-blur-xl flex items-center gap-3 border border-green-400/50">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-200 animate-pulse shadow-[0_0_10px_white]"></span>
                    Skladem: {product.stock} ks
                  </div>
                )
              ) : (
                <div className="bg-red-500/90 text-white font-bold px-5 py-3 rounded-xl shadow-2xl backdrop-blur-xl border border-red-400/50 flex items-center gap-2">
                  <CheckCircle2 size={18} /> Vyprodáno
                </div>
              )}
            </div>
          </div>
          
          <div className="p-10 md:p-16 w-full md:w-1/2 flex flex-col justify-center bg-mafia-dark/40">
            <div className="flex flex-col gap-6 mb-10">
              {product.brand && (
                <span className="text-mafia-gold font-bold tracking-widest uppercase text-sm border border-mafia-gold/30 px-3 py-1 rounded-full w-fit">
                  {product.brand}
                </span>
              )}
              <h3 className="text-4xl md:text-6xl font-heading font-black text-smoke-white group-hover:text-mafia-gold transition-colors tracking-widest uppercase leading-tight">
                {product.name}
              </h3>
              
              <div className="flex flex-wrap gap-4 items-center">
                {product.rating && (
                  <div className="flex items-center space-x-2 bg-mafia-black/80 px-5 py-3 rounded-xl border border-mafia-gold/20 shadow-lg" title="Hodnocení Barberů">
                    <span className="text-mafia-gold text-2xl material-icons" style={{fontSize: '24px'}}>content_cut</span>
                    <span className="text-smoke-white text-2xl font-black">{product.rating.toFixed(1)}</span>
                  </div>
                )}
                {avgPublicRating && (
                  <div className="flex items-center space-x-2 bg-mafia-black/80 px-5 py-3 rounded-xl border border-mafia-gold/20 shadow-lg" title="Hodnocení Zákazníků">
                    <span className="text-mafia-gold text-2xl">★</span>
                    <span className="text-smoke-white text-2xl font-black">{avgPublicRating}</span>
                  </div>
                )}
              </div>
            </div>
            
            {product.usage && (
              <div className="mb-10 inline-flex items-center px-6 py-3 rounded-xl text-sm md:text-base font-black bg-mafia-gold/10 text-mafia-gold border border-mafia-gold/30 w-fit shadow-inner uppercase tracking-widest">
                {product.usage}
              </div>
            )}
            
            {product.description && (
              <p className="text-neutral-300 text-xl md:text-2xl leading-relaxed md:leading-loose mb-12 font-medium">
                {product.description}
              </p>
            )}

            <div className="mt-auto flex flex-col gap-6">
              {product.isAuction ? (
                <button
                  onClick={() => {
                    setBidFormOpen(bidFormOpen === product.id ? null : product.id);
                    setReservationFormOpen(null);
                    setReviewFormOpen(null);
                  }}
                  className="bg-blue-600/90 hover:bg-blue-500 text-white font-black py-5 px-10 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all w-full text-lg md:text-xl text-center uppercase tracking-widest"
                >
                  Přihodit do aukce
                </button>
              ) : product.stock > 0 && (
                <button
                  onClick={() => {
                    setReservationFormOpen(reservationFormOpen === product.id ? null : product.id);
                    setBidFormOpen(null);
                    setReviewFormOpen(null);
                  }}
                  className="bg-smoke-white hover:bg-neutral-300 text-mafia-black font-black py-5 px-10 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all w-full text-lg md:text-xl text-center uppercase tracking-widest"
                >
                  Rezervovat k vyzvednutí
                </button>
              )}
              <button 
                onClick={() => {
                  setReviewFormOpen(reviewFormOpen === product.id ? null : product.id);
                  setReservationFormOpen(null);
                  setBidFormOpen(null);
                }}
                className="text-mafia-gold/80 hover:text-mafia-gold font-bold underline underline-offset-8 self-start transition-colors uppercase tracking-widest text-sm"
              >
                Hodnocení zákazníků ({reviews.length})
              </button>
            </div>
          </div>
        </div>

        {/* Bid Section (Aukce) */}
        {bidFormOpen === product.id && (
          <div className="bg-mafia-black/90 p-8 md:p-12 rounded-[2rem] border border-blue-500/30 w-full max-w-4xl mx-auto shadow-[0_0_40px_rgba(37,99,235,0.15)] backdrop-blur-xl transform transition-all">
            <h4 className="text-3xl font-heading font-black text-smoke-white mb-4 uppercase tracking-widest">Aukce produktu</h4>
            <p className="text-neutral-400 mb-10 text-lg">Zadejte své jméno a příjmení, částku a kdy byste si produkt vyzvedli. Pokud budete na konci aukce mezi nejvyššími nabídkami, produkt získáte.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="block text-sm font-bold text-blue-400 mb-3 uppercase tracking-wider">Jméno a Příjmení</label>
                <input 
                  type="text"
                  name="bidderName"
                  value={bidData.bidderName}
                  onChange={handleBidChange}
                  className="w-full bg-mafia-dark border border-neutral-700 focus:border-blue-500 rounded-xl p-4 text-white text-lg outline-none transition-colors"
                  placeholder="Např. Tomáš Novák"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-400 mb-3 uppercase tracking-wider">Vaše nabídka (Kč)</label>
                <input 
                  type="number"
                  name="amount"
                  value={bidData.amount}
                  onChange={handleBidChange}
                  className="w-full bg-mafia-dark border border-neutral-700 focus:border-blue-500 rounded-xl p-4 text-white text-lg outline-none transition-colors"
                  placeholder="Např. 500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-400 mb-3 uppercase tracking-wider">Datum vyzvednutí</label>
                <input 
                  type="date"
                  name="pickupDate"
                  value={bidData.pickupDate}
                  onChange={handleBidChange}
                  className="w-full bg-mafia-dark border border-neutral-700 focus:border-blue-500 rounded-xl p-4 text-white text-lg outline-none transition-colors"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-400 mb-3 uppercase tracking-wider">Přibližný čas</label>
                <input 
                  type="time"
                  name="pickupTime"
                  value={bidData.pickupTime}
                  onChange={handleBidChange}
                  className="w-full bg-mafia-dark border border-neutral-700 focus:border-blue-500 rounded-xl p-4 text-white text-lg outline-none transition-colors"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mb-10">
              <button 
                onClick={() => setBidFormOpen(null)}
                className="bg-transparent border border-neutral-600 hover:bg-neutral-800 text-white font-bold py-4 px-8 rounded-xl uppercase tracking-widest transition-colors"
              >
                Zrušit
              </button>
              <button 
                onClick={() => submitBid(product.id)}
                className="bg-gradient-to-r from-blue-600/80 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-black py-4 px-10 rounded-xl text-lg uppercase tracking-widest shadow-lg transition-all"
              >
                Přihodit
              </button>
            </div>

            {/* List of current bids */}
            {product.bids && product.bids.length > 0 && (
              <div>
                <h5 className="text-xl font-heading font-black text-smoke-white mb-6 uppercase tracking-widest border-b border-neutral-800 pb-4">Aktuální nabídky</h5>
                <div className="space-y-4">
                  {product.bids.map((bid, index) => (
                    <div key={bid.id} className={`p-4 rounded-xl border flex justify-between items-center ${index < product.stock ? 'bg-blue-900/20 border-blue-500/50' : 'bg-mafia-dark border-neutral-800'}`}>
                      <div>
                        <span className="text-white font-bold text-lg mr-4">{index + 1}. {bid.bidderName}</span>
                        <span className="text-neutral-500 text-sm">{new Date(bid.createdAt).toLocaleString('cs-CZ')}</span>
                      </div>
                      <div className={`text-xl font-black ${index < product.stock ? 'text-blue-400' : 'text-neutral-500'}`}>
                        {bid.amount.toLocaleString('cs-CZ')} Kč
                        {index < product.stock && <span className="ml-3 text-xs uppercase text-blue-400 font-bold border border-blue-400/30 px-2 py-1 rounded">Vyhrává</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reservation Section */}
        {reservationFormOpen === product.id && (
          <div className="bg-mafia-black/90 p-8 md:p-12 rounded-[2rem] border border-mafia-gold/30 w-full max-w-4xl mx-auto shadow-[0_0_40px_rgba(212,175,55,0.15)] backdrop-blur-xl transform transition-all">
            <h4 className="text-3xl font-heading font-black text-smoke-white mb-4 uppercase tracking-widest">Rezervace na prodejně</h4>
            <p className="text-neutral-400 mb-10 text-lg">Zadejte své jméno a orientační čas, kdy se pro produkt zastavíte. Jeden kus vám schováme stranou.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div>
                <label className="block text-sm font-bold text-mafia-gold mb-3 uppercase tracking-wider">Vaše Jméno</label>
                <input 
                  type="text"
                  name="name"
                  value={reservationData.name}
                  onChange={handleReservationChange}
                  className="w-full bg-mafia-dark border border-neutral-700 focus:border-mafia-gold rounded-xl p-4 text-white text-lg outline-none transition-colors"
                  placeholder="Např. Jan Novák"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-mafia-gold mb-3 uppercase tracking-wider">Datum vyzvednutí</label>
                <input 
                  type="date"
                  name="date"
                  value={reservationData.date}
                  onChange={handleReservationChange}
                  className="w-full bg-mafia-dark border border-neutral-700 focus:border-mafia-gold rounded-xl p-4 text-white text-lg outline-none transition-colors"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-mafia-gold mb-3 uppercase tracking-wider">Přibližný čas</label>
                <input 
                  type="time"
                  name="time"
                  value={reservationData.time}
                  onChange={handleReservationChange}
                  className="w-full bg-mafia-dark border border-neutral-700 focus:border-mafia-gold rounded-xl p-4 text-white text-lg outline-none transition-colors"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setReservationFormOpen(null)}
                className="bg-transparent border border-neutral-600 hover:bg-neutral-800 text-white font-bold py-4 px-8 rounded-xl uppercase tracking-widest transition-colors"
              >
                Zrušit
              </button>
              <button 
                onClick={() => submitReservation(product.id)}
                className="bg-gradient-to-r from-mafia-gold/80 to-mafia-gold hover:from-mafia-gold hover:to-yellow-500 text-mafia-black font-black py-4 px-10 rounded-xl text-lg uppercase tracking-widest shadow-lg transition-all"
              >
                Potvrdit rezervaci
              </button>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {reviewFormOpen === product.id && (
          <div className="bg-mafia-dark/50 p-8 md:p-12 rounded-[2rem] border border-neutral-800 w-full max-w-4xl mx-auto backdrop-blur-sm">
            <h4 className="text-3xl font-heading font-black text-smoke-white mb-10 uppercase tracking-widest">Zkušenosti ostatních</h4>
            
            <div className="space-y-6 mb-12">
              {reviews.length === 0 ? (
                <p className="text-neutral-500 text-lg italic">Zatím nebylo přidáno žádné hodnocení. Buďte první!</p>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="bg-mafia-black/60 p-6 rounded-2xl border border-neutral-800 relative shadow-lg">
                    {isAdminAuth && (
                      <button 
                        onClick={() => deleteReviewHandler(review.id)}
                        className="absolute top-6 right-6 text-red-500/50 hover:text-red-500 text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Smazat
                      </button>
                    )}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="text-mafia-gold font-bold text-xl tracking-widest">
                        {Array(review.rating).fill('★').join('')}{Array(5 - review.rating).fill('☆').join('')}
                      </span>
                      <span className="text-white font-bold text-lg">{review.author}</span>
                      <span className="text-neutral-600 text-sm font-medium">
                        {new Date(review.createdAt).toLocaleDateString('cs-CZ')}
                      </span>
                    </div>
                    <p className="text-neutral-300 text-lg leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            <div className="bg-mafia-black p-8 rounded-2xl border border-neutral-800">
              <h5 className="font-heading font-black text-xl mb-6 text-mafia-gold uppercase tracking-widest">Přidat hodnocení</h5>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input 
                    type="text"
                    name="author"
                    placeholder="Vaše jméno"
                    value={reviewData.author}
                    onChange={handleReviewChange}
                    className="w-full bg-mafia-dark border border-neutral-700 rounded-xl p-4 text-white focus:border-mafia-gold outline-none transition-colors"
                  />
                  <select 
                    name="rating"
                    value={reviewData.rating}
                    onChange={handleReviewChange}
                    className="w-full bg-mafia-dark border border-neutral-700 rounded-xl p-4 text-white focus:border-mafia-gold outline-none transition-colors"
                  >
                    <option value="5">5 Hvězdiček - Perfektní</option>
                    <option value="4">4 Hvězdičky - Velmi dobré</option>
                    <option value="3">3 Hvězdičky - Průměr</option>
                    <option value="2">2 Hvězdičky - Slabé</option>
                    <option value="1">1 Hvězdička - Nedoporučuji</option>
                  </select>
                </div>
                <textarea
                  name="comment"
                  placeholder="Váš upřímný názor na tento produkt..."
                  value={reviewData.comment}
                  onChange={handleReviewChange}
                  rows={4}
                  className="w-full bg-mafia-dark border border-neutral-700 rounded-xl p-4 text-white focus:border-mafia-gold outline-none transition-colors"
                ></textarea>
                <button 
                  onClick={() => submitReview(product.id)}
                  className="bg-mafia-gold/20 hover:bg-mafia-gold text-mafia-gold hover:text-mafia-black border border-mafia-gold font-bold py-4 px-8 rounded-xl uppercase tracking-widest transition-all w-full md:w-auto"
                >
                  Odeslat hodnocení
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
