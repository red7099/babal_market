import React, { useState } from 'react';
import { X, Wallet, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TopUpModal: React.FC = () => {
  const { isTopUpOpen, setIsTopUpOpen, topUpWallet, user } = useApp();
  const [selectedAmount, setSelectedAmount] = useState<number>(200);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isDone, setIsDone] = useState(false);

  if (!isTopUpOpen) return null;

  const handleTopUp = () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (amount > 0) {
      topUpWallet(amount);
      setIsDone(true);
      setTimeout(() => {
        setIsDone(false);
        setIsTopUpOpen(false);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={() => setIsTopUpOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading font-black text-xl text-white">
              Top Up Babal Pay Wallet
            </h2>
            <p className="text-xs text-slate-400">
              Current balance: <strong className="text-emerald-400 font-mono">${user.walletBalance.toFixed(2)}</strong>
            </p>
          </div>
        </div>

        {isDone ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">Funds Added!</h3>
            <p className="text-xs text-slate-400">Your Babal Pay balance has been updated instantly.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Amount Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Select Top-Up Amount
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[50, 100, 200, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2.5 rounded-xl font-mono font-bold text-xs border transition-all ${
                      selectedAmount === amt && !customAmount
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-950 text-slate-200 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    +${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Or Custom Amount ($)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="e.g. 250"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Zero top-up fee. Instant balance reflection.</span>
            </div>

            <button
              onClick={handleTopUp}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20"
            >
              Confirm Top-Up of ${customAmount || selectedAmount}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
