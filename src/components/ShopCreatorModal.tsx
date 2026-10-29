import React, { useState } from 'react';
import {
  X,
  Store,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Image as ImageIcon,
  ArrowRight,
  Globe,
  Tag,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ShopCreatorModal: React.FC = () => {
  const {
    isShopCreatorOpen,
    setIsShopCreatorOpen,
    createShop,
    user,
    setSelectedShopId,
    setActiveTab,
  } = useApp();

  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('Kathmandu & Global Fulfillment');
  const [shippingPolicy, setShippingPolicy] = useState('Free shipping on orders over $60. Dispatched within 24h.');
  const [returnPolicy, setReturnPolicy] = useState('30-day money-back guarantee with Babal Escrow protection.');
  const [banner, setBanner] = useState(
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
  );
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );
  const [badges, setBadges] = useState<string[]>(['Artisan Verified', 'Fast Shipper']);

  if (!isShopCreatorOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!handle || handle === `@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`) {
      setHandle(`@${val.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newShop = createShop({
      name: name.trim(),
      handle: handle.trim() || `@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      ownerName: user.name,
      ownerEmail: user.email,
      bio: bio.trim() || 'Welcome to our Babal Market storefront! Quality handcrafted items made with passion.',
      avatar,
      banner,
      isVerified: true,
      badges,
      location,
      shippingPolicy,
      returnPolicy,
    });

    setIsShopCreatorOpen(false);
    setSelectedShopId(newShop.id);
    setActiveTab('shops');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsShopCreatorOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-black text-2xl text-white">
                Launch Your Babal Shop
              </h2>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                Free Forever
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Join our global bazaar in 30 seconds and start selling to shoppers worldwide.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Shop Name & Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Shop Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Himalaya Leather Craft"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Shop Handle
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@himalayaleather"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-amber-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Shop Story & Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell buyers what makes your products special, your craftsmanship or design ethos..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Location & Policies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" /> Origin / Workshop Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Return Guarantee
              </label>
              <input
                type="text"
                value={returnPolicy}
                onChange={(e) => setReturnPolicy(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Banner & Avatar Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-400" /> Choose Shop Banner Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  label: 'Artisan Workshop',
                  url: 'https://images.unsplash.com/photo-1606744888344-493238955de0?auto=format&fit=crop&w=1200&q=80',
                },
                {
                  label: 'Futuristic Studio',
                  url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
                },
                {
                  label: 'Botanical Garden',
                  url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
                },
              ].map((style) => (
                <button
                  type="button"
                  key={style.url}
                  onClick={() => setBanner(style.url)}
                  className={`relative rounded-xl overflow-hidden border-2 h-16 transition-all ${
                    banner === style.url ? 'border-amber-400 shadow-md shadow-amber-500/20' : 'border-slate-800 opacity-60'
                  }`}
                >
                  <img src={style.url} alt={style.label} className="w-full h-full object-cover" />
                  <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-[11px] font-bold text-white">
                    {style.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Shop Perks */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs space-y-1.5 text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" /> Babal Merchant Perks Included:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400 text-[11px] pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> AI product description copywriter
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Automated inventory tracking
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Instant zero-fee payouts
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Seller shield badge
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Open Shop Now & Start Adding Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
