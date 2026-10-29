import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  ShieldCheck,
  Store,
  Boxes,
  Zap,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  Globe2,
  Smartphone,
  Laptop,
  Gem,
  Shirt,
  Leaf,
  Home,
  Headphones,
  Keyboard,
  Watch,
  Camera,
  Cpu,
  Layers,
  Flame,
  Droplets,
  Radio,
  Gamepad2,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';

export interface CategoryItem {
  id: string;
  name: string;
  nepali: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  ring: string;
  glow: string;
  badge: string;
  isLive?: boolean;
  subCategories: {
    id: string;
    name: string;
    nepali: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

export const MARKET_CATEGORIES: CategoryItem[] = [
  {
    id: 'All',
    name: 'All',
    nepali: 'सबै सामान',
    icon: Boxes,
    gradient: 'from-amber-500 via-orange-500 to-amber-600',
    ring: 'border-amber-400',
    glow: 'shadow-amber-500/25',
    badge: 'CATALOG',
    subCategories: [
      { id: 'all', name: 'All Products', nepali: 'सबै', icon: Boxes },
      { id: 'trending', name: 'Trending Now', nepali: 'लोकप्रिय', icon: TrendingUp },
      { id: 'verified', name: '100% Genuine', nepali: 'प्रमाणित', icon: ShieldCheck },
    ],
  },
  {
    id: 'Phones & Mobile Devices',
    name: 'Phones & Mobile',
    nepali: 'स्मार्टफोन तथा मोबाइल',
    icon: Smartphone,
    gradient: 'from-blue-600 via-indigo-600 to-cyan-400',
    ring: 'border-cyan-400',
    glow: 'shadow-cyan-500/30',
    badge: '5G LIVE 🔴',
    isLive: true,
    subCategories: [
      { id: 'all', name: 'All Phones', nepali: 'सबै फोन', icon: Smartphone },
      { id: 'Flagship 5G', name: 'Flagship 5G', nepali: 'फ्ल्यागशिप ५जी', icon: Zap },
      { id: 'iPhones', name: 'Apple iPhones', nepali: 'आईफोन', icon: Smartphone },
      { id: 'Samsung Galaxy', name: 'Samsung Galaxy', nepali: 'सामसुङ', icon: Cpu },
      { id: 'Budget & Gaming', name: 'Budget & Gaming', nepali: 'गेमिङ फोन', icon: Gamepad2 },
      { id: 'NTA MDMS Verified', name: 'NTA MDMS Registered', nepali: 'एनटीए प्रमाणित', icon: ShieldCheck },
    ],
  },
  {
    id: 'Tech & Gadgets',
    name: 'Tech & Gadgets',
    nepali: 'प्रविधि तथा ग्याजेट',
    icon: Laptop,
    gradient: 'from-violet-600 via-purple-600 to-fuchsia-500',
    ring: 'border-violet-400',
    glow: 'shadow-violet-500/30',
    badge: 'TECH LAB',
    subCategories: [
      { id: 'all', name: 'All Tech', nepali: 'सबै ग्याजेट', icon: Laptop },
      { id: 'Audio & ANC', name: 'Audio & Earbuds', nepali: 'इयरबड्स', icon: Headphones },
      { id: 'Keyboards', name: 'Mechanical Keyboards', nepali: 'किबोर्ड', icon: Keyboard },
      { id: 'Smart Wearables', name: 'Smart Watches', nepali: 'स्मार्टवाच', icon: Watch },
      { id: 'Cameras', name: 'Cameras & Drones', nepali: 'क्यामेरा', icon: Camera },
    ],
  },
  {
    id: 'Artisan & Handmade',
    name: 'Artisan & Craft',
    nepali: 'हस्तकला तथा सिर्जना',
    icon: Gem,
    gradient: 'from-emerald-600 via-teal-600 to-teal-400',
    ring: 'border-emerald-400',
    glow: 'shadow-emerald-500/30',
    badge: 'HERITAGE',
    subCategories: [
      { id: 'all', name: 'All Crafts', nepali: 'सबै हस्तकला', icon: Gem },
      { id: 'Pashmina', name: 'Pashmina & Shawls', nepali: 'पश्मिना', icon: Shirt },
      { id: 'Singing Bowls', name: 'Singing Bowls & Brass', nepali: 'सिङ्गिङ बाउल', icon: Sparkles },
      { id: 'Thangka', name: 'Thangka & Sacred Art', nepali: 'थाङ्का कला', icon: Layers },
    ],
  },
  {
    id: 'Fashion & Apparel',
    name: 'Fashion & Wear',
    nepali: 'पहिरन तथा फेसन',
    icon: Shirt,
    gradient: 'from-rose-600 via-pink-600 to-amber-500',
    ring: 'border-rose-400',
    glow: 'shadow-rose-500/30',
    badge: 'STYLE',
    subCategories: [
      { id: 'all', name: 'All Apparel', nepali: 'सबै फेसन', icon: Shirt },
      { id: 'Dhaka', name: 'Dhaka & Cultural', nepali: 'ढाका टोपी', icon: Sparkles },
      { id: 'Streetwear', name: 'Streetwear & Hoodies', nepali: 'स्ट्रिटवेयर', icon: Flame },
      { id: 'Outerwear', name: 'Himalayan Jackets', nepali: 'हिलालयन ज्याकेट', icon: ShieldCheck },
    ],
  },
  {
    id: 'Organic & Wellness',
    name: 'Organic Wellness',
    nepali: 'प्राङ्गारिक जडीबुटी',
    icon: Leaf,
    gradient: 'from-lime-600 via-emerald-600 to-green-500',
    ring: 'border-lime-400',
    glow: 'shadow-lime-500/30',
    badge: 'PURE 100%',
    subCategories: [
      { id: 'all', name: 'All Organic', nepali: 'सबै जडीबुटी', icon: Leaf },
      { id: 'Honey', name: 'Wild Forest Honey', nepali: 'जङ्गली मह', icon: Droplets },
      { id: 'Shilajit', name: 'Pure Shilajit', nepali: 'शिलाजित', icon: Flame },
      { id: 'Teas', name: 'Himalayan Teas', nepali: 'अग्र्यानिक चिया', icon: Leaf },
    ],
  },
  {
    id: 'Home & Living',
    name: 'Home & Living',
    nepali: 'गृह तथा सजावट',
    icon: Home,
    gradient: 'from-amber-600 via-yellow-600 to-orange-500',
    ring: 'border-yellow-400',
    glow: 'shadow-amber-500/30',
    badge: 'LIFESTYLE',
    subCategories: [
      { id: 'all', name: 'All Home', nepali: 'सबै सामान', icon: Home },
      { id: 'Rugs', name: 'Handmade Rugs', nepali: 'गलैँचा', icon: Layers },
      { id: 'Copper', name: 'Copper & Metalware', nepali: 'तामाको भाँडा', icon: Sparkles },
    ],
  },
];

export const MarketplaceView: React.FC = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setIsShopCreatorOpen,
    setActiveTab,
    setIsAssistantOpen,
  } = useApp();

  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Active category item
  const activeCategoryItem = MARKET_CATEGORIES.find((c) => c.id === selectedCategory) || MARKET_CATEGORIES[0];

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'All' && product.category !== selectedCategory) {
          return false;
        }

        // Subcategory filter
        if (selectedSubCategory !== 'all') {
          const sub = selectedSubCategory.toLowerCase();
          const matchSub = product.subCategory?.toLowerCase().includes(sub);
          const matchTag = product.tags.some((t) => t.toLowerCase().includes(sub));
          const matchName = product.name.toLowerCase().includes(sub);
          const matchDesc = product.description.toLowerCase().includes(sub);
          const matchSpecs = product.specs.some(
            (s) => s.label.toLowerCase().includes(sub) || s.value.toLowerCase().includes(sub)
          );
          if (!matchSub && !matchTag && !matchName && !matchDesc && !matchSpecs) {
            return false;
          }
        }

        // Verified shop only
        if (verifiedOnly && !product.shopVerified) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchShop = product.shopName.toLowerCase().includes(q);
          const matchTag = product.tags.some((t) => t.toLowerCase().includes(q));
          const matchSku = product.sku.toLowerCase().includes(q);
          return matchName || matchDesc || matchShop || matchTag || matchSku;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedSubCategory, verifiedOnly, searchQuery, sortBy]);
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, selectedCategory, verifiedOnly, searchQuery, sortBy]);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Hero Left Copy */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Next-Gen AI Bazaar & Multi-Vendor Hub</span>
              </div>

              <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
                Shop Extraordinary. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
                  Build Your Own Shop.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
                Welcome to <strong>Babal Market</strong> — where independent artisan and tech shops
                sell globally. Powered by AI inventory command, real-time GPS order tracking, and
                instant multi-gateway payments.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setIsShopCreatorOpen(true)}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all flex items-center gap-2 group"
                >
                  <Store className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Launch Your Shop in 30s</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => setActiveTab('creator')}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500/20 to-amber-500/20 hover:from-rose-500/30 hover:to-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-rose-500/10"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>Creator & Student Learn-Earn Hub</span>
                </button>

                <button
                  onClick={() => setActiveTab('inventory')}
                  className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition-all flex items-center gap-2"
                >
                  <Boxes className="w-4 h-4 text-blue-400" />
                  <span>Global Inventory Tab</span>
                </button>
              </div>

              {/* Trust & Feature Badges */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-800/80 max-w-lg">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>100% Escrow Protected</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Globe2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Live GPS Tracking</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Instant 1-Click Pay</span>
                </div>
              </div>
            </div>

            {/* Hero Right: Interactive Featured Teaser */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl p-1 bg-gradient-to-tr from-amber-500/40 via-orange-500/20 to-violet-600/40 shadow-2xl">
                <div className="bg-slate-900/90 rounded-[22px] p-5 backdrop-blur-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" /> TRENDING ON BABAL
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                      Live Catalog
                    </span>
                  </div>

                  {products.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 flex items-center gap-3 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedCategory(p.category);
                      }}
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-14 h-14 rounded-lg object-cover bg-slate-800 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-amber-400/90 font-medium truncate">
                          {p.shopName}
                        </div>
                        <div className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                          {p.name}
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          ${p.price.toFixed(2)} • {p.stock} units left
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 text-center">
                    <span className="text-[11px] text-slate-400">
                      Join 1,200+ local creators & global brands today.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Category Navigation */}
      <section className="sticky top-[100px] z-30 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/90 py-3 px-4 sm:px-6 lg:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Main Categories Row with Round Live Icons */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
              {MARKET_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                const itemCount =
                  cat.id === 'All'
                    ? products.length
                    : products.filter((p) => p.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedSubCategory('all');
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-full border transition-all flex-shrink-0 group cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-amber-400/80 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/50'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    {/* Completely Round Live Icon Avatar */}
                    <div className="relative">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                          isSelected
                            ? `bg-gradient-to-tr ${cat.gradient} text-slate-950 font-black scale-105 ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-950`
                            : 'bg-slate-800 text-slate-300 border border-slate-700 group-hover:scale-105 group-hover:text-amber-400'
                        }`}
                      >
                        <Icon className="w-5 h-5 transition-transform group-hover:rotate-6" />
                      </div>

                      {/* Live pulsating badge / glow indicator */}
                      {cat.isLive && (
                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-slate-950"></span>
                        </span>
                      )}
                    </div>

                    {/* Category Text & Nepali label */}
                    <div className="text-left pr-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold whitespace-nowrap transition-colors ${
                            isSelected ? 'text-amber-300 font-extrabold' : 'text-slate-200 group-hover:text-white'
                          }`}
                        >
                          {cat.name}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {itemCount}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block whitespace-nowrap">
                        {cat.nepali}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Controls: Verified toggle & Sort */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none bg-slate-900 px-3 py-2 rounded-full border border-slate-800 hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-800 cursor-pointer"
                />
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Shops</span>
              </label>

              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-2 rounded-full border border-slate-800 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="featured" className="bg-slate-900 text-slate-200">
                    Featured
                  </option>
                  <option value="price-low" className="bg-slate-900 text-slate-200">
                    Price: Low to High
                  </option>
                  <option value="price-high" className="bg-slate-900 text-slate-200">
                    Price: High to Low
                  </option>
                  <option value="rating" className="bg-slate-900 text-slate-200">
                    Highest Rated
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Subcategories Row with Fine Round Icons */}
          {activeCategoryItem && activeCategoryItem.subCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-slate-800/60">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 pl-1 shrink-0 flex items-center gap-1">
                <span>Sub-Hub:</span>
              </span>
              {activeCategoryItem.subCategories.map((sub) => {
                const SubIcon = sub.icon;
                const isSubSelected = selectedSubCategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubCategory(sub.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                      isSubSelected
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold'
                        : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-800'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        isSubSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <SubIcon className="w-3 h-3" />
                    </div>
                    <span>{sub.name}</span>
                    <span className="text-[10px] opacity-75 hidden sm:inline">({sub.nepali})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Product Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-extrabold text-xl text-white">
              {selectedCategory === 'All' ? 'Explore All Products' : selectedCategory}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {filteredProducts.length} items from independent Babal merchants
            </p>
          </div>

          {searchQuery && (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
              <span>Search: &ldquo;{searchQuery}&rdquo;</span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-amber-400 font-bold hover:underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800/80 p-8 max-w-lg mx-auto">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-lg text-white">No products found</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Try adjusting your search terms or switching category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setVerifiedOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
