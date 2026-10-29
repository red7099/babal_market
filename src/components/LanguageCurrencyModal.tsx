import React from 'react';
import { useApp } from '../context/AppContext';
import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_CURRENCIES,
  SupportedLanguage,
  SupportedCurrency,
} from '../utils/localization';
import { X, Globe, Coins, Check, ArrowRight } from 'lucide-react';

export const LanguageCurrencyModal: React.FC = () => {
  const {
    isLangCurrencyModalOpen,
    setIsLangCurrencyModalOpen,
    language,
    setLanguage,
    currency,
    setCurrency,
    t,
  } = useApp();

  if (!isLangCurrencyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {t('nav.languageCurrency')}
              </h2>
              <p className="text-xs text-slate-400">
                Choose your preferred interface language and display currency
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLangCurrencyModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Language Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Select Language (भाषा)
              </label>
              <span className="text-xs text-slate-400">
                Active: {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.nativeName}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl" role="img" aria-label={lang.name}>
                        {lang.flag}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {lang.nativeName}
                        </div>
                        <div className="text-xs text-slate-400">{lang.name}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Currency Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Display Currency (मुद्रा)
              </label>
              <span className="text-xs text-slate-400">
                Active: {SUPPORTED_CURRENCIES.find((c) => c.code === currency)?.name}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SUPPORTED_CURRENCIES.map((curr) => {
                const isSelected = currency === curr.code;
                return (
                  <button
                    key={curr.code}
                    onClick={() => setCurrency(curr.code)}
                    className={`flex flex-col p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg font-bold text-emerald-400">
                        {curr.symbol}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {curr.code}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-200 truncate">
                      {curr.name}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      1 USD ≈ {curr.ratePerUSD} {curr.code}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <div>
              <span className="text-slate-200 font-semibold">Decentralized P2P Pricing:</span> Prices for Nepal hotels, trekking passes, and artisan goods automatically convert using real-time rates.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={() => setIsLangCurrencyModalOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
          >
            <span>{t('common.save')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
