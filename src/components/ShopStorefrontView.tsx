import React, { useState } from 'react';
import {
  Store,
  ShieldCheck,
  Star,
  Users,
  MapPin,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  PlusCircle,
  Package,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';

export const ShopStorefrontView: React.FC = () => {
  const {
    shops,
    products,
    selectedShopId,
    setSelectedShopId,
    setIsShopCreatorOpen,
    user,
  } = useApp();

  const [followedShops, setFollowedShops] = useState<string[]>(['shop-1']);

  const currentShop = shops.find((s) => s.id === selectedShopId);

  const toggleFollow = (shopId: string) => {
    setFollowedShops((prev) =>
      prev.includes(shopId) ? prev.filter((id) => id !== shopId) : [...prev, shopId]
    );
  };

  // If viewing a specific shop
  if (currentShop) {
    const shopProducts = products.filter((p) => p.shopId === currentShop.id);
    const isFollowed = followedShops.includes(currentShop.id);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Back Button */}
        <button
          onClick={() => setSelectedShopId(null)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Shops
        </button>

        {/* Shop Cover Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 mb-8 shadow-2xl">
          <div className="h-48 sm:h-64 w-full relative">
            <img
              src={currentShop.banner}
              alt={currentShop.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          </div>

          {/* Shop Info Overlay */}
          <div className="relative px-6 pb-6 pt-2 sm:px-8 sm:pb-8 -mt-16 sm:-mt-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-slate-950 bg-slate-900 shadow-2xl flex-shrink-0">
                <img
                  src={currentShop.avatar}
                  alt={currentShop.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
                    {currentShop.name}
                  </h1>
                  {currentShop.isVerified && (
                    <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs font-mono text-amber-400">{currentShop.handle}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    <span className="font-bold text-white">{currentShop.rating.toFixed(1)}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{currentShop.location}</span>
                  </div>
                  <span>•</span>
                  <span>{currentShop.totalSales.toLocaleString()} sales</span>
                </div>
              </div>
            </div>

            {/* Follow & Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleFollow(currentShop.id)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  isFollowed
                    ? 'bg-slate-800 text-slate-200 border border-slate-700'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{isFollowed ? 'Following' : '+ Follow Shop'}</span>
                <span className="text-[11px] opacity-75 font-mono">
                  ({currentShop.followerCount + (isFollowed ? 1 : 0)})
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Story & Policies Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="font-heading font-extrabold text-base text-white mb-2">
              About {currentShop.name}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">{currentShop.bio}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {currentShop.badges.map((b, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5 text-xs text-slate-300">
            <h3 className="font-heading font-bold text-sm text-white mb-2">
              Store Guarantees
            </h3>
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Shipping Policy</strong>
                <span className="text-slate-400">{currentShop.shippingPolicy}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <RotateCcw className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Babal Escrow Warranty</strong>
                <span className="text-slate-400">{currentShop.returnPolicy}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shop's Products */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading font-black text-xl text-white">
                Catalog by {currentShop.name} ({shopProducts.length})
              </h2>
              <p className="text-xs text-slate-400">Authentic goods shipped directly from this shop</p>
            </div>
          </div>

          {shopProducts.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 text-xs">
              <Package className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              This shop has not published any items yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shopProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Directory View of all shops
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold mb-2">
            <Store className="w-3.5 h-3.5" /> Babal Merchant Community
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
            Discover Independent Shops
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Explore verified artisan studios, tech creators, and local collectives.
          </p>
        </div>

        <button
          onClick={() => setIsShopCreatorOpen(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Open My Small Shop</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {shops.map((shop) => {
          const shopProds = products.filter((p) => p.shopId === shop.id);
          const isFollowed = followedShops.includes(shop.id);

          return (
            <div
              key={shop.id}
              onClick={() => setSelectedShopId(shop.id)}
              className="group bg-slate-900 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden cursor-pointer shadow-lg hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between"
            >
              <div>
                {/* Banner Header */}
                <div className="h-32 w-full relative overflow-hidden bg-slate-950">
                  <img
                    src={shop.banner}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                  {shop.isVerified && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold flex items-center gap-1 shadow">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </span>
                  )}
                </div>

                {/* Avatar and Info */}
                <div className="px-6 pt-3">
                  <div className="flex items-center gap-3 -mt-8 relative z-10 mb-3">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-900 bg-slate-950 shadow-md flex-shrink-0">
                      <img
                        src={shop.avatar}
                        alt={shop.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-extrabold text-lg text-white group-hover:text-amber-400 transition-colors">
                        {shop.name}
                      </h3>
                      <span className="text-xs font-mono text-amber-400">{shop.handle}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">{shop.bio}</p>

                  <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{shop.rating.toFixed(1)}</span>
                    </div>
                    <span>{shop.totalSales.toLocaleString()} sales</span>
                    <span>{shopProds.length} products</span>
                  </div>
                </div>
              </div>

              {/* Product Preview Thumbnails */}
              <div className="p-4 bg-slate-950/40 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  {shopProds.slice(0, 3).map((p) => (
                    <img
                      key={p.id}
                      src={p.images[0]}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-800"
                    />
                  ))}
                  {shopProds.length > 3 && (
                    <span className="text-[11px] font-mono text-slate-500 pl-1">
                      +{shopProds.length - 3} more
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center">
                  Visit Storefront →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
