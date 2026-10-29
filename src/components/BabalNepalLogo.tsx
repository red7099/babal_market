import React from 'react';
import logoImg from '../assets/images/babal_market_logo_1793115365992.jpg';

interface BabalNepalLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BabalNepalLogo: React.FC<BabalNepalLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  const iconDimensions = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }[size];

  const brandTextSize = {
    sm: 'text-base',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}
      title="Babal Market - नेपालको सर्वोत्कृष्ट बजार"
    >
      {/* 3D Himalayan Gold & Crimson Emblem */}
      <div className={`relative ${iconDimensions} shrink-0`}>
        {/* Ambient Glow Aura */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-600 to-yellow-400 opacity-60 group-hover:opacity-100 blur-[3px] transition-all duration-300"></div>

        {/* Master Emblem Image & Frame */}
        <div className="relative w-full h-full rounded-2xl bg-slate-950 p-[1.5px] border border-amber-500/40 shadow-xl overflow-hidden transform group-hover:scale-105 transition-all duration-300">
          <img
            src={logoImg}
            alt="Babal Market Nepal Logo"
            className="w-full h-full object-cover rounded-[14px]"
          />

          {/* Online Blockchain Node Pulse */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          </div>
        </div>
      </div>

      {/* Typography: Prestigious Bilingual Lockup */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <div className="flex items-baseline">
            <span className={`font-black tracking-tight text-white group-hover:text-amber-400 transition-colors uppercase ${brandTextSize}`}>
              BABAL
            </span>
            <span className={`font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-rose-400 ml-1.5 ${brandTextSize}`}>
              MARKET
            </span>
          </div>

          {/* Authentic Cultural Badge */}
          <span className="inline-flex items-center gap-1 text-[10px] font-black tracking-widest px-1.5 py-0.5 rounded bg-gradient-to-r from-rose-600/25 to-amber-500/25 text-amber-300 border border-amber-500/40 uppercase">
            <span className="text-rose-400">नेपाल</span>
            <span className="w-1 h-1 rounded-full bg-amber-400"></span>
            <span>PRO</span>
          </span>
        </div>

        {/* Subtitle / Cultural Slogan */}
        {showSubtitle && (
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 font-medium tracking-wide">
            <span className="text-rose-400 font-bold">नेपालको आफ्नै बजार</span>
            <span className="text-slate-600" aria-hidden="true">•</span>
            <span className="text-slate-300">Decentralized P2P Bazaar</span>
          </div>
        )}
      </div>
    </div>
  );
};
