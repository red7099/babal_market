import React from 'react';
import {
  ShoppingBag,
  Store,
  Boxes,
  MapPin,
  Sparkles,
  Search,
  Wallet,
  PlusCircle,
  Heart,
  User,
  ShieldCheck,
  RotateCcw,
  Video,
  GraduationCap,
  Lock,
  ShieldAlert,
  Terminal,
  Code,
  Radio,
  Server,
  Zap,
  Coins,
  Download,
  Smartphone,
  Globe,
  Mountain,
  Target,
  Briefcase,
  Trophy,
  Activity,
  Flame,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BabalNepalLogo } from './BabalNepalLogo';
import { BrandShowcaseModal } from './BrandShowcaseModal';

export const Navbar: React.FC = () => {
  const [isBrandModalOpen, setIsBrandModalOpen] = React.useState(false);
  const {
    activeTab,
    setActiveTab,
    cartCount,
    setIsCartOpen,
    setIsShopCreatorOpen,
    setIsAssistantOpen,
    setIsTopUpOpen,
    setIsDownloadModalOpen,
    user,
    searchQuery,
    setSearchQuery,
    setSelectedShopId,
    orders,
    marketplaceLockdown,
    deviceHosting,
    language,
    currency,
    setIsLangCurrencyModalOpen,
    t,
    resetAllData,
  } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-slate-950 text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
        <span>
          Welcome to <strong className="font-extrabold tracking-wide">Babal Market</strong> — The AI-Powered Multi-Vendor Bazaar! Free Express Air Delivery on orders over $100.
        </span>
        <span className="hidden md:inline-block bg-black/20 px-2 py-0.5 rounded text-[11px] font-mono">
          Code: BABALVIP (15% OFF)
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Authentic Nepali Likable Logo */}
          <div className="flex items-center gap-2">
            <div
              onClick={() => {
                setActiveTab('market');
                setSelectedShopId(null);
              }}
              className="cursor-pointer"
              title="Babal Market - नेपालको आफ्नै विकेन्द्रीकृत बजार"
            >
              <BabalNepalLogo size="md" />
            </div>

            <button
              onClick={() => setIsBrandModalOpen(true)}
              className="hidden lg:flex items-center gap-1 text-[10px] font-bold text-amber-300 hover:text-amber-200 px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-transparent border border-amber-500/30 hover:border-amber-400/60 transition-all cursor-pointer shadow-sm"
              title="Inspect & Download Official 8K Babal Logo"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>8K Logo</span>
            </button>
          </div>

          {/* Search Bar with /admin Stealth Command Detection */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  const clean = val.trim().toLowerCase();
                  if (clean === '/admin' || clean === 'admin' || clean === '/admin/' || clean === '#admin') {
                    setActiveTab('admin');
                    setSelectedShopId(null);
                    setSearchQuery('');
                    return;
                  }
                  setSearchQuery(val);
                  if (activeTab !== 'market') setActiveTab('market');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const clean = searchQuery.trim().toLowerCase();
                    if (clean === '/admin' || clean === 'admin' || clean === '/admin/' || clean === '#admin') {
                      setActiveTab('admin');
                      setSelectedShopId(null);
                      setSearchQuery('');
                    }
                  }
                }}
                placeholder="Search products, artisan goods, tech gear, or shops..."
                className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder-slate-500 pl-10 pr-20 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded bg-slate-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Header Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* $BABAL Wallet & Top Up Pill */}
            <button
              onClick={() => {
                setActiveTab('wallet');
                setSelectedShopId(null);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs group cursor-pointer ${
                activeTab === 'wallet'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 hover:border-amber-500/50 hover:bg-slate-850'
              }`}
              title="Click to open $BABAL Wallet Dashboard & Staking"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-[10px] text-slate-400 block leading-tight">Token Wallet</span>
                <span className="font-mono font-bold text-amber-400 text-xs">
                  {deviceHosting.minedTokens.toFixed(1)} $BABAL
                </span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 hidden lg:inline-block bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                Stake (18.5%)
              </span>
            </button>

            {/* Download Full App (Web & Android) Header Trigger */}
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 text-slate-300 hover:text-white transition-all text-xs group cursor-pointer"
              title="Download Full App for Web & Android"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-[11px]">Download App</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                APK/Web
              </span>
            </button>

            {/* Launch Shop Action */}
            <button
              onClick={() => {
                if (user.userShopId) {
                  setSelectedShopId(user.userShopId);
                  setActiveTab('shops');
                } else {
                  setIsShopCreatorOpen(true);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition-all transform active:scale-95"
            >
              {user.userShopId ? (
                <>
                  <Store className="w-4 h-4" />
                  <span className="hidden sm:inline">My Shop Studio</span>
                  <span className="sm:hidden">My Shop</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Open My Shop</span>
                </>
              )}
            </button>

            {/* Multi-Language & Multi-Currency Switcher */}
            <button
              onClick={() => setIsLangCurrencyModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 text-slate-200 transition-all text-xs group cursor-pointer"
              title="Change Language & Display Currency (भाषा र मुद्रा परिवर्तन)"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
              <span className="font-bold text-[11px] uppercase text-emerald-400">{currency}</span>
              <span className="text-[10px] text-slate-500">·</span>
              <span className="text-[11px] font-semibold text-slate-300">
                {language === 'ne' ? 'नेपाली' : language === 'hi' ? 'हिन्दी' : language === 'zh' ? '中文' : language === 'ja' ? '日本語' : language.toUpperCase()}
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all group"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-extrabold text-[11px] flex items-center justify-center shadow-lg shadow-rose-500/30 animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="p-2.5 rounded-xl bg-violet-600/20 border border-violet-500/40 hover:bg-violet-600/30 text-violet-300 hover:text-white transition-all group relative"
              title="Ask Babal AI Concierge"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform text-amber-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (with /admin Stealth Command Detection) */}
        <div className="md:hidden pb-2 pt-1 px-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                const clean = val.trim().toLowerCase();
                if (clean === '/admin' || clean === 'admin' || clean === '/admin/' || clean === '#admin') {
                  setActiveTab('admin');
                  setSelectedShopId(null);
                  setSearchQuery('');
                  return;
                }
                setSearchQuery(val);
                if (activeTab !== 'market') setActiveTab('market');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const clean = searchQuery.trim().toLowerCase();
                  if (clean === '/admin' || clean === 'admin' || clean === '/admin/' || clean === '#admin') {
                    setActiveTab('admin');
                    setSelectedShopId(null);
                    setSearchQuery('');
                  }
                }
              }}
              placeholder="खोज्नुहोस् / Search products or shops..."
              className="w-full bg-slate-900/95 text-xs text-slate-200 placeholder-slate-500 pl-9 pr-16 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500/80 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded bg-slate-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 sm:gap-2 py-2 overflow-x-auto no-scrollbar border-t border-slate-900">
          {/* Marketplace */}
          <button
            onClick={() => {
              setActiveTab('market');
              setSelectedShopId(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'market' && !user.userShopId
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('nav.market')}</span>
          </button>

          {/* Multi-Service Hub: Hotel, Bus, Auto/Ride, Medical, Jyotish (User Requested) */}
          <button
            onClick={() => {
              setActiveTab('services');
              setSelectedShopId(null);
            }}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap border cursor-pointer ${
              activeTab === 'services'
                ? 'bg-gradient-to-r from-amber-500 via-emerald-500 to-indigo-600 text-slate-950 shadow-md shadow-amber-500/30 border-amber-400'
                : 'text-amber-300 hover:text-white hover:bg-slate-900 border-amber-500/30 bg-amber-950/20'
            }`}
          >
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span>🛠️ सेवाहरू (Services Hub)</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
              HOTEL • BUS • RIDE • JYOTISH
            </span>
          </button>

          {/* Game Live Scores: NPL, IPL, ICC, Football (User Requested) */}
          <button
            onClick={() => {
              setActiveTab('scores');
              setSelectedShopId(null);
            }}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap border cursor-pointer ${
              activeTab === 'scores'
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-md shadow-red-500/30 border-red-400'
                : 'text-red-400 hover:text-white hover:bg-red-950/40 border-red-500/40 bg-red-950/20'
            }`}
          >
            <div className="relative">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="w-2 h-2 rounded-full bg-red-500 absolute -top-1 -right-1 animate-ping"></span>
            </div>
            <span>🏏 खेल स्कोर (Live Scores)</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-red-600 text-white font-black animate-pulse">
              🔴 NPL • IPL LIVE
            </span>
          </button>

          {/* Nepal Tourism, Tour Packages & Hotels (User Requested) */}
          <button
            onClick={() => {
              setActiveTab('tourism');
              setSelectedShopId(null);
            }}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap border ${
              activeTab === 'tourism'
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/30 border-amber-400'
                : 'text-amber-300 hover:text-amber-200 hover:bg-amber-950/40 border-amber-500/40 bg-amber-950/20'
            }`}
          >
            <Mountain className="w-4 h-4 text-amber-400" />
            <span>{t('nav.tourism')}</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-rose-600 text-white font-extrabold shadow-sm">
              VISIT NEPAL
            </span>
          </button>

          {/* Student Discipline Development Game Dojo (User Requested) */}
          <button
            onClick={() => {
              setActiveTab('discipline_game');
              setSelectedShopId(null);
            }}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap border ${
              activeTab === 'discipline_game'
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 shadow-md shadow-emerald-500/30 border-emerald-400'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 border-emerald-500/40 bg-emerald-950/20'
            }`}
          >
            <Target className="w-4 h-4 text-emerald-400" />
            <span>अनुशासन खेल (Discipline Dojo)</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              STUDENT GAME
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('shops');
              setSelectedShopId(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'shops'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{t('nav.shops')}</span>
          </button>

          {/* Global Inventory Management Tab (User highlighted) */}
          <button
            onClick={() => setActiveTab('inventory')}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 border border-blue-400/40'
                : 'text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 border border-blue-900/40 bg-blue-950/20'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Global Inventory</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Live Hub
            </span>
          </button>

          {/* Creator Hub & Learn-and-Earn (User requested) */}
          <button
            onClick={() => {
              setActiveTab('creator');
              setSelectedShopId(null);
            }}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'creator'
                ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-slate-950 shadow-md shadow-rose-500/20'
                : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/30 border border-amber-500/30 bg-amber-950/10'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Creator Hub</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
              Learn & Earn
            </span>
          </button>

          {/* Real-time Order Tracking Tab */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Order Tracking</span>
            {activeOrdersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>

          {/* AI Shopping Assistant Tab */}
          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'assistant'
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/30'
                : 'text-violet-300 hover:text-violet-200 hover:bg-violet-950/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Concierge</span>
          </button>

          {/* Bug Bounty Program Tab (User Requested) */}
          <button
            onClick={() => {
              setActiveTab('bounty');
              setSelectedShopId(null);
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap border ${
              activeTab === 'bounty'
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md shadow-rose-600/30 border-rose-400/50'
                : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border-rose-900/40 bg-rose-950/10'
            }`}
          >
            <Terminal className="w-4 h-4 text-rose-400" />
            <span>Bug Bounty</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-extrabold border border-rose-500/30">
              $25k
            </span>
          </button>

          {/* Open Source Engine Tab (User Requested) */}
          <button
            onClick={() => {
              setActiveTab('opensource');
              setSelectedShopId(null);
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap border ${
              activeTab === 'opensource'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 border-blue-400/50'
                : 'text-blue-400 hover:text-blue-300 hover:bg-blue-950/30 border-blue-900/40 bg-blue-950/10'
            }`}
          >
            <Code className="w-4 h-4 text-blue-400" />
            <span>Open Source</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
              MIT
            </span>
          </button>

          {/* Decentralized P2P Node & Blockchain Tab (User Requested: Serverless Device Hosting & Token Passing) */}
          <button
            onClick={() => {
              setActiveTab('node');
              setSelectedShopId(null);
            }}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap border ${
              activeTab === 'node'
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-slate-950 shadow-md shadow-amber-500/30 border-amber-400'
                : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/30 border-amber-500/40 bg-amber-950/20'
            }`}
          >
            <Server className="w-4 h-4 text-amber-400" />
            <span>⚡ P2P Node</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${deviceHosting.isHostingActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
              <span>{deviceHosting.minedTokens.toFixed(1)} $BABAL</span>
            </span>
          </button>

          {/* $BABAL Wallet & Staking Dashboard Tab (User Requested) */}
          <button
            onClick={() => {
              setActiveTab('wallet');
              setSelectedShopId(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap border ${
              activeTab === 'wallet'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30 border-emerald-400/50'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30 border-emerald-900/40 bg-emerald-950/15'
            }`}
          >
            <Coins className="w-4 h-4 text-emerald-400" />
            <span>💰 Token Wallet</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
              18.5% APY
            </span>
          </button>

          {/* Admin panel hidden from public view - accessible strictly via /admin search or URL */}

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('Reset local demo data to defaults?')) {
                  resetAllData();
                }
              }}
              title="Reset Demo Data"
              className="p-1.5 text-slate-500 hover:text-slate-300 text-xs rounded hover:bg-slate-900"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </nav>
      </div>

      <BrandShowcaseModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
      />
    </header>
  );
};
