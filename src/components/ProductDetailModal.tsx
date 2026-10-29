import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  Store,
  Sparkles,
  Layers,
  ArrowRight,
  Package,
  RotateCcw,
  Smartphone,
  Cpu,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProductDetailModal: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    addToCart,
    setIsCheckoutOpen,
    setSelectedShopId,
    setActiveTab,
    toggleWishlist,
    user,
    setIsAssistantOpen,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const product = products.find((p) => p.id === selectedProductId);

  // Initialize selected options from product options
  useEffect(() => {
    if (product?.options && product.options.length > 0) {
      const initial: Record<string, string> = {};
      product.options.forEach((opt) => {
        if (opt.values && opt.values.length > 0) {
          initial[opt.name] = opt.values[0];
        }
      });
      setSelectedOptions(initial);
    } else {
      setSelectedOptions({});
    }
    setSelectedImageIndex(0);
  }, [product?.id]);

  if (!product) return null;

  const isWishlisted = user.wishlistIds.includes(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleSelectOption = (optName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optName]: value }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOptions);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedOptions);
    setSelectedProductId(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductId(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all backdrop-blur-md"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Visual Gallery */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-slate-950/40 border-b md:border-b-0 md:border-r border-slate-800">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.featured && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider">
                Featured Product
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-18 h-18 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-amber-400 scale-95 shadow-md shadow-amber-500/20'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* AI Advisor Card */}
          <div className="mt-4 p-3.5 rounded-xl bg-violet-950/30 border border-violet-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-violet-200">
                Want AI advice on this item?
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedProductId(null);
                setIsAssistantOpen(true);
              }}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline"
            >
              Ask Babal Genius →
            </button>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Vendor Header */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <button
                onClick={() => {
                  setSelectedProductId(null);
                  setSelectedShopId(product.shopId);
                  setActiveTab('shops');
                }}
                className="flex items-center gap-2 group text-left"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-800">
                  <img src={product.shopLogo} alt={product.shopName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-amber-400 flex items-center gap-1 transition-colors">
                    {product.shopName}
                    {product.shopVerified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                    )}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Verified Babal Merchant</span>
                </div>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2 rounded-xl border transition-all ${
                  isWishlisted
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Title & Price */}
            <div className="mt-4">
              <span className="text-xs font-mono text-amber-400/90 tracking-wide uppercase">
                {product.category}
              </span>
              <h2 className="font-heading font-extrabold text-2xl text-white mt-1">
                {product.name}
              </h2>
              <p className="text-sm text-slate-400 mt-1">{product.tagline}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm font-bold text-white">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-slate-400">({product.reviewCount} customer reviews)</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-mono text-emerald-400">
                  Stock: {product.stock} available
                </span>
              </div>

              {/* Price display */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="font-heading font-extrabold text-3xl text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Free Shipping
                </span>
              </div>
            </div>

            {/* Product Options / Variants (Color, Storage, RAM, etc.) */}
            {product.options && product.options.length > 0 && (
              <div className="mt-5 space-y-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Choose Your Options:</span>
                </div>

                {product.options.map((opt) => {
                  const currentValue = selectedOptions[opt.name] || opt.values[0];
                  return (
                    <div key={opt.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">{opt.name}:</span>
                        <span className="text-amber-400 font-bold font-mono">{currentValue}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {opt.values.map((val) => {
                          const isSelected = currentValue === val;
                          return (
                            <button
                              type="button"
                              key={val}
                              onClick={() => handleSelectOption(opt.name, val)}
                              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm shadow-amber-500/20'
                                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              {opt.name.toLowerCase() === 'color' && (
                                <span className="w-2 h-2 rounded-full bg-current inline-block mr-1.5 opacity-80" />
                              )}
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Dedicated Phone Specifications Card */}
            {product.phoneSpecs && (
              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-950 to-indigo-950/40 border border-cyan-500/40 space-y-3">
                <div className="flex items-center justify-between border-b border-cyan-800/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span className="font-heading font-extrabold text-xs text-white">
                      Official Smartphone Hardware & NTA Registry
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>NTA MDMS Verified 🇳🇵</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Brand & Model</span>
                    <span className="font-bold text-white">
                      {product.phoneSpecs.brand} {product.phoneSpecs.model}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Condition</span>
                    <span className="font-bold text-cyan-300">
                      {product.phoneSpecs.condition || 'Brand New'}
                    </span>
                  </div>
                  {product.phoneSpecs.batteryHealth && (
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Battery Endurance</span>
                      <span className="font-bold text-emerald-400">
                        {product.phoneSpecs.batteryHealth}
                      </span>
                    </div>
                  )}
                  {product.phoneSpecs.simType && (
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">SIM Card Type</span>
                      <span className="font-bold text-slate-200">
                        {product.phoneSpecs.simType}
                      </span>
                    </div>
                  )}
                  {product.phoneSpecs.camera && (
                    <div className="col-span-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Camera Array</span>
                      <span className="font-semibold text-slate-200">
                        {product.phoneSpecs.camera}
                      </span>
                    </div>
                  )}
                  {product.phoneSpecs.warrantyMonths && (
                    <div className="col-span-2 p-2 rounded-xl bg-emerald-950/20 border border-emerald-800/30 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-300">
                        Authorized Manufacturer Warranty:
                      </span>
                      <strong className="text-emerald-400 font-mono">
                        {product.phoneSpecs.warrantyMonths} Months Official
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-4 pt-4 border-t border-slate-800 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>

            {/* Specifications */}
            {product.specs && product.specs.length > 0 && (
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" /> Specifications & Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                      <span className="text-slate-400 block text-[11px]">{spec.label}</span>
                      <span className="font-semibold text-slate-200">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping & Warehouse */}
            <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex flex-col gap-1.5 text-slate-400">
              <div className="flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-amber-400" />
                <span>Warehouse Hub: <strong className="text-slate-300">{product.warehouseLocation}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>Dispatches via Babal Express Air in 24 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>30-Day Escrow Protected Return Guarantee</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            {/* Quantity */}
            <div className="flex items-center border border-slate-800 rounded-xl bg-slate-950 p-1 w-full sm:w-auto justify-between">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-300 font-bold"
              >
                -
              </button>
              <span className="w-10 text-center font-mono font-bold text-sm text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-300 font-bold"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => {
                handleAddToCart();
                setSelectedProductId(null);
              }}
              disabled={isOutOfStock}
              className={`flex-1 w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>

            {/* Buy Now */}
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`flex-1 w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20'
              }`}
            >
              <span>Instant Buy</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
