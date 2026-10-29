import React, { useState } from 'react';
import {
  Wallet,
  Coins,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Send,
  Download,
  DollarSign,
  Filter,
  Layers,
  ChevronRight,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WalletDashboardView: React.FC = () => {
  const {
    deviceHosting,
    user,
    stakingPositions,
    walletTransactions,
    stakeTokens,
    unstakeTokens,
    claimStakingRewards,
    setActiveTab,
    setIsTopUpOpen,
    setIsDownloadModalOpen,
  } = useApp();

  // Staking Form State
  const [stakeAmount, setStakeAmount] = useState<string>('50');
  const [selectedLockDays, setSelectedLockDays] = useState<number>(90);
  const [stakingFeedback, setStakingFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isStakingLoading, setIsStakingLoading] = useState(false);

  // Filter state for transactions
  const [txFilter, setTxFilter] = useState<string>('all');

  // Staking APY mapping
  const apyRates: { [days: number]: number } = {
    30: 12.5,
    90: 18.5,
    180: 24.0,
    365: 32.0,
  };

  // Calculations
  const liquidTokens = deviceHosting.minedTokens;
  const stakedTokens = stakingPositions
    .filter((p) => p.status === 'Active')
    .reduce((sum, p) => sum + p.amountStaked, 0);
  const totalAccruedRewards = stakingPositions
    .filter((p) => p.status === 'Active')
    .reduce((sum, p) => sum + p.accruedRewards, 0);
  const totalTokens = liquidTokens + stakedTokens + totalAccruedRewards;
  const tokenPriceUsd = 1.25;
  const totalFiatValuation = totalTokens * tokenPriceUsd;

  const handleStakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(stakeAmount);
    if (isNaN(amt) || amt <= 0) {
      setStakingFeedback({ success: false, message: 'Please enter a valid amount of $BABAL tokens.' });
      return;
    }

    setIsStakingLoading(true);
    setTimeout(() => {
      const res = stakeTokens(amt, selectedLockDays);
      setStakingFeedback(res);
      setIsStakingLoading(false);
      if (res.success) {
        setStakeAmount('');
      }
    }, 600);
  };

  const filteredTransactions = walletTransactions.filter((tx) => {
    if (txFilter === 'all') return true;
    if (txFilter === 'mining') return tx.type === 'MINING_REWARD';
    if (txFilter === 'staking') return tx.type === 'STAKING_YIELD' || tx.type === 'STAKED_PRINCIPAL' || tx.type === 'UNSTAKED_PRINCIPAL';
    if (txFilter === 'p2p') return tx.type === 'P2P_TRANSFER_IN' || tx.type === 'P2P_TRANSFER_OUT';
    if (txFilter === 'purchases') return tx.type === 'ESCROW_PURCHASE';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 border border-amber-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                $BABAL NATIVE NETWORK TOKEN
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                1 $BABAL = $1.25 USD
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono">
                Proof of Uptime Mining Active
              </span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
              Babal <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Token Wallet & Staking</span> Vault
            </h1>

            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Manage your decentralized marketplace tokens, stake $BABAL into high-yield validator pools for passive network rewards, and track real-time cryptographic transaction proofs.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => {
                setActiveTab('node');
              }}
              className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Pass Tokens to Peer Node</span>
            </button>
            <button
              onClick={() => setIsTopUpOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              <span>Top Up Babal Pay (${user.walletBalance.toFixed(2)})</span>
            </button>
          </div>
        </div>

        {/* 4 Balances Breakdown Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[11px] text-slate-400 font-mono block">TOTAL ASSET VALUATION</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white font-mono">
                {totalTokens.toFixed(2)}
              </span>
              <span className="text-xs text-amber-400 font-mono font-bold">$BABAL</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono block mt-1">
              &asymp; ${totalFiatValuation.toFixed(2)} USD
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[11px] text-slate-400 font-mono block">LIQUID AVAILABLE TOKENS</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-400 font-mono">
                {liquidTokens.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-mono">$BABAL</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono block mt-1">
              Ready for P2P transfers & shopping
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[11px] text-slate-400 font-mono block">STAKED IN MINING POOLS</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-indigo-400 font-mono">
                {stakedTokens.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-mono">$BABAL</span>
            </div>
            <span className="text-[11px] text-indigo-300 font-mono block mt-1">
              Up to 32% APY validator yield
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[11px] text-slate-400 font-mono block">LIVE ACCRUED REWARDS</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">
                +{totalAccruedRewards.toFixed(4)}
              </span>
              <span className="text-xs text-slate-400 font-mono">$BABAL</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono block mt-1 animate-pulse">
              ● Live Compounding Yield
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Staking Pool & Active Positions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stake Tokens Form (User Highlighted Request) */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6">
          <div className="space-y-1 pb-4 border-b border-slate-800">
            <h2 className="text-lg font-black text-white font-heading flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <span>Stake Tokens for Mining Rewards</span>
            </h2>
            <p className="text-xs text-slate-400">
              Lock your $BABAL tokens to validate marketplace shard blocks and earn guaranteed staking yield.
            </p>
          </div>

          {stakingFeedback && (
            <div
              className={`p-3.5 rounded-xl text-xs font-mono border flex items-center gap-2 ${
                stakingFeedback.success
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
              }`}
            >
              {stakingFeedback.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{stakingFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handleStakeSubmit} className="space-y-5">
            {/* Amount */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <label className="text-slate-300 uppercase font-bold">STAKE AMOUNT</label>
                <span className="text-slate-400">
                  Available: <strong className="text-amber-400">{liquidTokens.toFixed(2)} $BABAL</strong>
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="1"
                  max={liquidTokens}
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-amber-400 focus:outline-none focus:border-amber-500 font-mono pr-20"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setStakeAmount((liquidTokens * 0.5).toFixed(0))}
                    className="px-2 py-1 rounded bg-slate-800 text-[10px] font-mono text-slate-300 hover:text-white"
                  >
                    50%
                  </button>
                  <button
                    type="button"
                    onClick={() => setStakeAmount(liquidTokens.toFixed(0))}
                    className="px-2 py-1 rounded bg-amber-500/20 text-[10px] font-mono text-amber-300 font-bold hover:bg-amber-500/30"
                  >
                    MAX
                  </button>
                </div>
              </div>
            </div>

            {/* Lock Period & APY Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider block">
                CHOOSE LOCK PERIOD & APY
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[30, 90, 180, 365].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setSelectedLockDays(days)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedLockDays === days
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block">{days} Days</span>
                    <span className="text-sm font-extrabold text-emerald-400 font-mono block mt-0.5">
                      {apyRates[days]}% APY
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary preview */}
            <div className="bg-slate-950 rounded-2xl p-3.5 border border-slate-800/80 space-y-1.5 text-xs font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Selected APY:</span>
                <span className="text-emerald-400 font-bold">{apyRates[selectedLockDays]}% Annually</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Yield:</span>
                <span className="text-amber-400 font-bold">
                  +{(((parseFloat(stakeAmount) || 0) * (apyRates[selectedLockDays] / 100) * selectedLockDays) / 365).toFixed(2)} $BABAL
                </span>
              </div>
              <div className="flex justify-between">
                <span>Penalty for Early Exit:</span>
                <span className="text-slate-300">0.00% (Instant Release)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isStakingLoading || liquidTokens <= 0}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
            >
              {isStakingLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Locking in Staking Contract...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Stake {stakeAmount || '0'} $BABAL Now</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right 2 Columns: Active Staking Positions & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Staking Positions */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <h3 className="text-lg font-black text-white font-heading flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Active Staking Positions ({stakingPositions.filter((p) => p.status === 'Active').length})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Earning continuous node consensus yield directly into your unspent reward vault.
                </p>
              </div>
            </div>

            {stakingPositions.filter((p) => p.status === 'Active').length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs font-mono">
                No active staking positions. Stake your tokens above to earn up to 32% APY!
              </div>
            ) : (
              <div className="space-y-3">
                {stakingPositions
                  .filter((p) => p.status === 'Active')
                  .map((pos) => (
                    <div
                      key={pos.id}
                      className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-white font-mono">
                            {pos.amountStaked} $BABAL
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                            {pos.apyPercent}% APY
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            ({pos.lockPeriodDays} Days Lock)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                          <span>Accrued Yield:</span>
                          <span className="text-emerald-400 font-bold">
                            +{pos.accruedRewards.toFixed(4)} $BABAL
                          </span>
                          <span>(&asymp; ${(pos.accruedRewards * 1.25).toFixed(2)})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => claimStakingRewards(pos.id)}
                          disabled={pos.accruedRewards <= 0}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Claim Yield</span>
                        </button>
                        <button
                          onClick={() => unstakeTokens(pos.id)}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Unlock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Unstake All</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <h3 className="text-lg font-black text-white font-heading flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <span>Wallet Transaction Ledger</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Cryptographic transaction audit trail for mining rewards, staking, and P2P transfers.
                </p>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono">
                {['all', 'mining', 'staking', 'p2p', 'purchases'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setTxFilter(f)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                      txFilter === f
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-slate-400 border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">TX TYPE</th>
                    <th className="py-2.5 px-3">DESCRIPTION</th>
                    <th className="py-2.5 px-3">COUNTERPARTY</th>
                    <th className="py-2.5 px-3">AMOUNT ($BABAL)</th>
                    <th className="py-2.5 px-3">FIAT ($)</th>
                    <th className="py-2.5 px-3">TIMESTAMP</th>
                    <th className="py-2.5 px-3">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.type.includes('REWARD') || tx.type.includes('YIELD') || tx.type.includes('IN')
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-200">
                        {tx.title}
                      </td>
                      <td className="py-3 px-3 text-slate-400 truncate max-w-[140px]">
                        {tx.counterparty || 'Consensus Network'}
                      </td>
                      <td className="py-3 px-3 font-bold font-mono">
                        <span className={tx.tokenAmount >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {tx.tokenAmount >= 0 ? `+${tx.tokenAmount.toFixed(2)}` : tx.tokenAmount.toFixed(2)} $BABAL
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono">
                        ${Math.abs(tx.fiatValue).toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        {tx.timestamp}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
