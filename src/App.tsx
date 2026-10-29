/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MarketplaceView } from './components/MarketplaceView';
import { ShopStorefrontView } from './components/ShopStorefrontView';
import { MyShopDashboard } from './components/MyShopDashboard';
import { GlobalInventoryView } from './components/GlobalInventoryView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { CreatorHubView } from './components/CreatorHubView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ShopCreatorModal } from './components/ShopCreatorModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TopUpModal } from './components/TopUpModal';
import { AdminPanelView } from './components/AdminPanelView';
import { BugBountyView } from './components/BugBountyView';
import { OpenSourceView } from './components/OpenSourceView';
import { P2PNodeHubView } from './components/P2PNodeHubView';
import { WalletDashboardView } from './components/WalletDashboardView';
import { DownloadAppModal } from './components/DownloadAppModal';
import { NepalTourismView } from './components/NepalTourismView';
import { DisciplineGameView } from './components/DisciplineGameView';
import { ServicesHubView } from './components/ServicesHubView';
import { LiveScoresView } from './components/LiveScoresView';
import { LanguageCurrencyModal } from './components/LanguageCurrencyModal';
import { BabalNepalLogo } from './components/BabalNepalLogo';
import { Sparkles, Store, ShieldCheck, Heart, MapPin, Boxes, ArrowUp, Lock, Terminal, Code, Server, Coins, Smartphone, Download, Mountain, Target, Briefcase, Trophy } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, selectedShopId, user, setIsAssistantOpen, isAssistantOpen, setIsDownloadModalOpen } = useApp();

  // Stealth /admin and #admin route handler (User Requested: Admin panel only accessible via /admin)
  React.useEffect(() => {
    const checkAdminTrigger = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#admin' || path === '/admin' || hash.includes('/admin')) {
        setActiveTab('admin');
      }
    };
    checkAdminTrigger();
    window.addEventListener('hashchange', checkAdminTrigger);
    window.addEventListener('popstate', checkAdminTrigger);
    return () => {
      window.removeEventListener('hashchange', checkAdminTrigger);
      window.removeEventListener('popstate', checkAdminTrigger);
    };
  }, [setActiveTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Navigation */}
      <Navbar />

      {/* Main View Area */}
      <div className="flex-1">
        {activeTab === 'market' && <MarketplaceView />}

        {activeTab === 'scores' && <LiveScoresView />}

        {activeTab === 'services' && <ServicesHubView />}

        {activeTab === 'tourism' && <NepalTourismView />}

        {activeTab === 'discipline_game' && <DisciplineGameView />}

        {activeTab === 'shops' && (
          <>
            {selectedShopId && selectedShopId === user.userShopId ? (
              <MyShopDashboard />
            ) : (
              <ShopStorefrontView />
            )}
          </>
        )}

        {activeTab === 'inventory' && <GlobalInventoryView />}

        {activeTab === 'creator' && <CreatorHubView />}

        {activeTab === 'orders' && <OrderTrackingView />}

        {activeTab === 'assistant' && <AIAssistantDrawer isEmbedded={true} />}

        {activeTab === 'bounty' && <BugBountyView />}

        {activeTab === 'opensource' && <OpenSourceView />}

        {activeTab === 'node' && <P2PNodeHubView />}

        {activeTab === 'wallet' && <WalletDashboardView />}

        {activeTab === 'download' && <WalletDashboardView />}

        {activeTab === 'admin' && <AdminPanelView />}
      </div>

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <ShopCreatorModal />
      <CartDrawer />
      <CheckoutModal />
      <TopUpModal />
      <DownloadAppModal />
      <LanguageCurrencyModal />

      {/* Floating AI Assistant Drawer (when not in full embedded tab) */}
      {activeTab !== 'assistant' && <AIAssistantDrawer isEmbedded={false} />}

      {/* Floating Quick AI Trigger Pill (Bottom Right) */}
      {activeTab !== 'assistant' && !isAssistantOpen && (
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-2xl shadow-violet-600/50 border border-violet-400/40 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 group"
          title="Open Babal Genius AI Shopping Assistant"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <span>Ask Babal Genius AI</span>
          <span className="px-1.5 py-0.5 rounded-full bg-black/30 text-[10px] font-mono text-amber-300">
            2.5
          </span>
        </button>
      )}

      {/* Modern Marketplace Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 mt-20 pt-12 pb-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-900">
            {/* Col 1 */}
            <div className="space-y-3">
              <BabalNepalLogo size="sm" showSubtitle={false} />
              <p className="text-slate-400 leading-relaxed text-xs">
                नेपालको आफ्नै विकेन्द्रीकृत बजार — uniting independent artisans, mountain adventure guides, heritage hotels, and global shoppers with real-time P2P escrow.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Escrow Protected Commerce & Tourism</span>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Marketplace Features
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>• Launch a Vendor Shop in 30 Seconds</li>
                <li>• One Tab Global Inventory Command</li>
                <li>• Live GPS Order Telematics & Route Mapping</li>
                <li>• Babal Genius Personal AI Assistant</li>
                <li>• 6 Secure Multi-Gateways with Escrow</li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Fulfillment Hubs
              </h4>
              <ul className="space-y-1.5 text-slate-400 font-mono text-[11px]">
                <li>📍 Kathmandu Central Depot (Nepal)</li>
                <li>📍 Silicon Valley Tech Hub (USA)</li>
                <li>📍 Pokhara Organic Valley (Nepal)</li>
                <li>📍 London & Tokyo Air Cargo Hub</li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Accepted Payment Gateways
              </h4>
              <p className="text-slate-400 text-xs">
                Babal Pay 1-Click Wallet, Stripe Visa/Mastercard/Amex, Apple Pay, Google Pay, Klarna Pay-in-4, USDC Crypto Escrow, and Cash on Delivery.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-amber-400">
                  Babal Pay
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-blue-400">
                  Stripe 3DS
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                  Apple Pay
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-pink-400">
                  Klarna
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-purple-400">
                  Web3 Escrow
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
            <span>
              &copy; {new Date().getFullYear()} Babal Market. Engineered with precision for global creators.
            </span>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <span>Security Audited</span>
              <span>•</span>
              <button
                onClick={() => {
                  setActiveTab('bounty');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Terminal className="w-3 h-3" />
                <span>Bug Bounty ($25k)</span>
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setActiveTab('opensource');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Code className="w-3 h-3" />
                <span>Open Source (GitHub)</span>
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setActiveTab('node');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Server className="w-3 h-3" />
                <span>P2P Node (Mining)</span>
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setActiveTab('wallet');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Coins className="w-3 h-3" />
                <span>Token Wallet (Staking)</span>
              </button>
              <span>•</span>
              <button
                onClick={() => setIsDownloadModalOpen(true)}
                className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Smartphone className="w-3 h-3" />
                <span>Download App (Web & APK)</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
