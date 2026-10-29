import React, { useState } from 'react';
import logoImg from '../assets/images/babal_market_logo_1793115365992.jpg';
import { X, Sparkles, Download, Mountain, ShieldCheck, Check } from 'lucide-react';

interface BrandShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandShowcaseModal: React.FC<BrandShowcaseModalProps> = ({ isOpen, onClose }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadLogo = () => {
    const link = document.createElement('a');
    link.href = logoImg;
    link.download = 'babal-market-nepal-official-logo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>OFFICIAL BRAND IDENTITY · बाबाल बजार नेपाल</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-center">
          {/* Logo Showcase Display */}
          <div className="relative mx-auto w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl shadow-rose-600/20 group">
            <img
              src={logoImg}
              alt="Babal Market Master Logo"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
              <span className="text-[11px] font-mono text-amber-300 font-bold px-2 py-1 rounded bg-black/70 backdrop-blur-sm">
                8K Ultra-High Definition
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Babal Market Nepal <span className="text-amber-400 font-light">(बाबाल बजार)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
              Crafted specifically for Nepal: The letter <strong>"B"</strong> is sculpted from the snow-capped summits of Mount Everest and the sacred geometry of the Nepali double-pennant flag, crowned with the radiant golden sun and diamond apex.
            </p>
          </div>

          {/* Symbolism Grid */}
          <div className="grid grid-cols-3 gap-2 text-left">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="font-bold text-amber-400">🏔️ Everest Apex</div>
              <div className="text-[11px] text-slate-400 mt-1">Sagarmatha 8,848m dual peaks shaping the letter B.</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="font-bold text-rose-400">🇳🇵 National Flag</div>
              <div className="text-[11px] text-slate-400 mt-1">Sun & Crescent Moon geometry in 24k gold.</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="font-bold text-emerald-400">⚡ P2P Commerce</div>
              <div className="text-[11px] text-slate-400 mt-1">Zero-server decentralized blockchain bazaar.</div>
            </div>
          </div>

          {/* Download Action */}
          <div className="flex gap-3">
            <button
              onClick={handleDownloadLogo}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Logo Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Download High-Resolution Logo (8K)</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
