import React from 'react';
import { Star, ShoppingBag, Heart, ShieldCheck, Store, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    setSelectedProductId,
    setSelectedShopId,
    setActiveTab,
    toggleWishlist,
    user,
  } = useApp();

  const isWishlisted = user.wishlistIds.includes(product.id);
  const isLowStock = product.stock > 0 && product.stock <= 15;
  const isOutOfStock = product.stock <= 0;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group relative bg-slate-900/80 rounded-2xl border border-slate-800/80 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image & Badges Container */}
      <div
        onClick={() => setSelectedProductId(product.id)}
        className="relative w-full aspect-square overflow-hidden bg-slate-950 cursor-pointer"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
          {discountPercent && (
            <span className="inline-block px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-bold">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all z-10 ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
              : 'bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Low Stock Banner on Image */}
        {isLowStock && (
          <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-amber-500/90 backdrop-blur-sm text-slate-950 text-[10px] font-bold flex items-center justify-center gap-1 z-10 shadow">
            <AlertCircle className="w-3 h-3" /> Only {product.stock} units remaining!
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Vendor / Shop attribution */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <button
              onClick={() => {
                setSelectedShopId(product.shopId);
                setActiveTab('shops');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors group/shop truncate max-w-[75%]"
            >
              <Store className="w-3.5 h-3.5 text-amber-500/80" />
              <span className="truncate font-medium">{product.shopName}</span>
              {product.shopVerified && (
                <ShieldCheck className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              )}
            </button>
            <span className="text-[11px] font-mono text-slate-500">{product.category}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => setSelectedProductId(product.id)}
            className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors line-clamp-2 cursor-pointer mb-1.5"
          >
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-slate-400 line-clamp-1 mb-3">
            {product.tagline}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3 text-xs">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="ml-1 font-bold text-slate-200">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-500 text-[11px]">({product.reviewCount})</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 text-[11px] font-medium">Babal Verified</span>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-extrabold text-lg text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">
              SKU: {product.sku}
            </span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl font-bold flex items-center justify-center transition-all ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95'
            }`}
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
