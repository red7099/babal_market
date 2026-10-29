import React, { useState } from 'react';
import {
  Server,
  Cpu,
  HardDrive,
  Radio,
  Zap,
  Send,
  Download,
  ShieldCheck,
  Globe,
  Share2,
  Copy,
  CheckCircle,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  Coins,
  RefreshCw,
  Terminal,
  Activity,
  AlertCircle,
  Flame,
  Key,
  Store,
  User,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { P2PPeerNode } from '../types';

export const P2PNodeHubView: React.FC = () => {
  const {
    deviceHosting,
    blockchainBlocks,
    p2pPeers,
    tokenTransfers,
    toggleDeviceHosting,
    setAllocatedStorage,
    passTokensToPeer,
    mineNewBlock,
    downloadOfflineP2PBundle,
    peerSyncProgress,
    setIsDownloadModalOpen,
    setActiveTab,
    autoLinkMobileNode,
    toggleBatteryEcoMode,
    setMobileStorageTier,
    downloadFullAndroidApp,
  } = useApp();

  // Tab inside P2P Hub: 'overview' | 'mobile_node' | 'ledger' | 'peers' | 'transfer' | 'whitepaper'
  const [hubTab, setHubTab] = useState<'overview' | 'mobile_node' | 'ledger' | 'peers' | 'transfer' | 'whitepaper'>('overview');

  // Token passing state
  const [selectedTargetPeerId, setSelectedTargetPeerId] = useState<string>(p2pPeers[0]?.id || '');
  const [customNodeKey, setCustomNodeKey] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('15');
  const [transferMemo, setTransferMemo] = useState<string>('P2P Mesh Hosting Shard Incentive');
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [transferResult, setTransferResult] = useState<{ success: boolean; message: string; txHash?: string } | null>(null);

  // Copy helper
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const copyNodeKey = () => {
    navigator.clipboard?.writeText(deviceHosting.nodePublicKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Format uptime seconds into HH:MM:SS
  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle pass tokens submit
  const handlePassTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      setTransferResult({ success: false, message: 'Please enter a valid $BABAL token amount.' });
      return;
    }

    const target = customNodeKey.trim() || selectedTargetPeerId;
    if (!target) {
      setTransferResult({ success: false, message: 'Please select a destination peer node or enter a public key.' });
      return;
    }

    setIsTransferring(true);
    setTransferResult(null);

    try {
      const res = await passTokensToPeer(target, amt, transferMemo);
      setTransferResult(res);
      if (res.success) {
        setTransferAmount('');
      }
    } catch (err: any) {
      setTransferResult({ success: false, message: err?.message || 'Transfer failed.' });
    } finally {
      setIsTransferring(false);
    }
  };

  const quickFillPeer = (peer: P2PPeerNode) => {
    setSelectedTargetPeerId(peer.id);
    setCustomNodeKey('');
    setHubTab('transfer');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Hero Header & Zero-Server Announcement */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 border border-amber-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                ZERO-SERVER MODE ACTIVE
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                <Server className="w-3.5 h-3.5 text-amber-400" />
                YOUR DEVICE IS THE SERVER
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono">
                Mesh Sync: {peerSyncProgress}%
              </span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
              Babal <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">P2P Blockchain Node</span> & Hosting Mesh
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              No central cloud server required! Every user who opens or downloads Babal Market allocates a tiny sliver of device space to store catalog shards and escrow state. In exchange, your node <strong className="text-amber-400">mines $BABAL tokens</strong> and enables peer-to-peer commerce without AWS, Google Cloud, or third-party gatekeepers.
            </p>
          </div>

          {/* Quick Action: Download Standalone Serverless App */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={downloadOfflineP2PBundle}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-orange-500/25 transition-all transform hover:scale-[1.02] active:scale-95 group"
            >
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span>Download Standalone Zero-Server App</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center font-mono">
              Single portable .html file • Works 100% offline
            </p>
          </div>
        </div>

        {/* Node Live Indicator Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[11px]">DEVICE NODE ID</span>
            <span className="text-amber-400 font-bold tracking-tight truncate block">
              {deviceHosting.nodeId}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">HOSTING STATUS</span>
            <span className={`font-bold flex items-center gap-1.5 ${deviceHosting.isHostingActive ? 'text-emerald-400' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${deviceHosting.isHostingActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
              {deviceHosting.isHostingActive ? 'ACTIVE HOST' : 'PAUSED'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">MINED REWARDS</span>
            <span className="text-emerald-400 font-bold text-sm">
              {deviceHosting.minedTokens.toFixed(2)} $BABAL
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">ACTIVE PEERS</span>
            <span className="text-indigo-400 font-bold">
              {p2pPeers.length + 1} Nodes Online
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">VALIDATED BLOCKS</span>
            <span className="text-rose-400 font-bold">
              #{blockchainBlocks[0]?.height || 14292}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">MESH PING</span>
            <span className="text-cyan-400 font-bold">
              {deviceHosting.networkLatencyMs} ms (P2P Direct)
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        <button
          onClick={() => setHubTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            hubTab === 'overview'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Device Hosting & Mining</span>
        </button>

        {/* Mobile Browser Micro-Node (User Requested) */}
        <button
          onClick={() => setHubTab('mobile_node')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap border cursor-pointer ${
            hubTab === 'mobile_node'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/30 border-emerald-400 font-black'
              : 'text-emerald-400 hover:text-white hover:bg-slate-900 border-emerald-500/30 bg-emerald-950/20'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>📱 Mobile Micro-Node & APK</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950 text-[10px] font-mono font-black">
            12.8 MB
          </span>
        </button>

        <button
          onClick={() => setHubTab('transfer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            hubTab === 'transfer'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Pass Tokens to Peer</span>
          <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[10px] font-mono font-black">
            P2P
          </span>
        </button>

        <button
          onClick={() => setHubTab('peers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            hubTab === 'peers'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Peer Mesh Network</span>
          <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
            {p2pPeers.length}
          </span>
        </button>

        <button
          onClick={() => setHubTab('ledger')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            hubTab === 'ledger'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Blockchain Block Explorer</span>
        </button>

        <button
          onClick={() => setHubTab('whitepaper')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            hubTab === 'whitepaper'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Zero-Server Spec & FAQ</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & HOSTING CONTROL */}
      {hubTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Main Control Card: Device Server Space Switch */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white font-heading">
                    Device Server Space Hosting
                  </h2>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    deviceHosting.isHostingActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {deviceHosting.isHostingActive ? '● MINING $BABAL TOKENS' : '○ HOSTING PAUSED'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Turn your laptop, phone, or desktop into an autonomous hosting node for the Babal marketplace catalog and escrow shard.
                </p>
              </div>

              {/* Master Power Toggle */}
              <button
                onClick={toggleDeviceHosting}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-xs transition-all transform active:scale-95 shadow-lg ${
                  deviceHosting.isHostingActive
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20 hover:bg-emerald-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <Radio className={`w-4 h-4 ${deviceHosting.isHostingActive ? 'animate-pulse' : ''}`} />
                <span>{deviceHosting.isHostingActive ? 'Hosting Server Space: ON' : 'Hosting Server Space: OFF'}</span>
              </button>
            </div>

            {/* 4 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Mined Tokens */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">MINED $BABAL TOKENS</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Coins className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                    {deviceHosting.minedTokens.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 ml-1.5 font-mono">$BABAL</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                  <TrendingUp className="w-3 h-3" />
                  <span>+0.035 / epoch uptime bounty</span>
                </div>
              </div>

              {/* Card 2: Allocated Storage */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">HOSTED SERVER STORAGE</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <HardDrive className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-blue-400 font-mono tracking-tight">
                    {deviceHosting.allocatedStorageMb}
                  </span>
                  <span className="text-xs text-slate-400 ml-1.5 font-mono">MB Shard</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400 font-mono">
                  Used: <strong className="text-slate-200">{deviceHosting.usedStorageMb} MB</strong> ({((deviceHosting.usedStorageMb / deviceHosting.allocatedStorageMb) * 100).toFixed(0)}%)
                </div>
              </div>

              {/* Card 3: Uptime & Hash Rate */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">NODE UPTIME</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-indigo-400 font-mono tracking-tight">
                    {formatUptime(deviceHosting.uptimeSeconds)}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-indigo-300/80 font-mono">
                  Hash Rate: {deviceHosting.nodeHashRateKhs} Kh/s
                </div>
              </div>

              {/* Card 4: Blocks Validated */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">BLOCKS VALIDATED</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
                    {deviceHosting.blocksValidated}
                  </span>
                  <span className="text-xs text-slate-400 ml-1.5 font-mono">Blocks</span>
                </div>
                <div className="mt-2 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Consensus Proof Confirmed</span>
                </div>
              </div>
            </div>

            {/* Storage Allocation Slider & Manual Block Mining Trigger */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* Storage Config Box */}
              <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                      <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                      <span>Allocate Device Server Space</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Higher storage allocation allows your node to index more shop catalogs and earn more tokens.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 font-mono text-xs font-extrabold">
                    {deviceHosting.allocatedStorageMb} MB
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-2 flex-wrap">
                  {[64, 128, 256, 512, 1024, 2048].map((mb) => (
                    <button
                      key={mb}
                      onClick={() => setAllocatedStorage(mb)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                        deviceHosting.allocatedStorageMb === mb
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 border border-blue-400'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {mb >= 1024 ? `${mb / 1024} GB` : `${mb} MB`}
                    </button>
                  ))}
                </div>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (deviceHosting.usedStorageMb / deviceHosting.allocatedStorageMb) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Cryptographic Manual Block Solver */}
              <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>On-Demand Block Proof Mining</span>
                    </h3>
                    <span className="text-[10px] text-amber-400 font-mono bg-amber-500/15 px-2 py-0.5 rounded">
                      Reward: +25 $BABAL
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Validate pending marketplace orders and escrow state transitions directly on your device CPU.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={mineNewBlock}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Mine Next Blockchain Block Now</span>
                  </button>
                  <button
                    onClick={() => setHubTab('transfer')}
                    className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 font-bold text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Pass Tokens</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Public Key Display */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-400">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Your Node Public Key:</span>
                <span className="text-slate-200 truncate max-w-xs sm:max-w-md">
                  {deviceHosting.nodePublicKey}
                </span>
              </div>
              <button
                onClick={copyNodeKey}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
              >
                {copiedKey ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
              </button>
            </div>
          </div>

          {/* Connected Peers Teaser Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-lg font-black text-white font-heading">
                  Active Connected Device Peers
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time WebRTC / Broadcast mesh synchronization across distributed user devices.
                </p>
              </div>
              <button
                onClick={() => setHubTab('peers')}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
              >
                <span>View All {p2pPeers.length} Peers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {p2pPeers.slice(0, 3).map((peer) => (
                <div
                  key={peer.id}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{peer.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{peer.location}</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>

                  <div className="space-y-1 text-[11px] font-mono text-slate-400 border-t border-slate-900 pt-2">
                    <div className="flex justify-between">
                      <span>Latency:</span>
                      <span className="text-emerald-400 font-bold">{peer.latencyMs} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hosted Shard:</span>
                      <span className="text-slate-200">{peer.storageContributedMb} MB</span>
                    </div>
                  </div>

                  <button
                    onClick={() => quickFillPeer(peer)}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>Pass Tokens to This Node</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: MOBILE BROWSER MICRO-NODE & ANDROID APK ECOSYSTEM (User Requested) */}
      {hubTab === 'mobile_node' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Banner: Mobile Micro-Node Overview */}
          <div className="bg-gradient-to-br from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    MOBILE BROWSER MICRO-NODE
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    SMALL NODE • BIG WORKING MODEL
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono">
                    Storage: ~12.8 MB
                  </span>
                </div>

                <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
                  Mobile Mining & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">Lightweight Sharded Ecosystem</span>
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Babal Market runs directly on smartphones without taking gigabytes of storage! Our proprietary micro-node takes only <strong className="text-emerald-400">12.8 MB</strong>, automatically links your mobile device upon opening, and continuously mines <strong className="text-amber-400">$BABAL tokens</strong> in a battery-saving background loop.
                </p>
              </div>

              {/* Quick Actions Strip */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
                <button
                  onClick={downloadFullAndroidApp}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-[1.02] active:scale-95 group cursor-pointer"
                >
                  <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Download Full Android APK (v2.6)</span>
                </button>

                <button
                  onClick={autoLinkMobileNode}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 font-bold text-xs transition-all cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Auto-Link Current Mobile Browser</span>
                </button>
              </div>
            </div>

            {/* 4 Live Mobile Metrics */}
            <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">STORAGE FOOTPRINT</span>
                <span className="text-emerald-400 font-extrabold text-base block mt-0.5">
                  {deviceHosting.allocatedStorageMb.toFixed(1)} MB
                </span>
                <span className="text-[10px] text-slate-500 block">Micro-Sharded SQLite</span>
              </div>

              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">AUTO-LINK STATUS</span>
                <span className="text-teal-300 font-bold text-sm flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {deviceHosting.isMobileAutoLinked ? 'LINKED & ACTIVE' : 'AUTO-LINK READY'}
                </span>
                <span className="text-[10px] text-slate-500 block">P2P Mesh Bind</span>
              </div>

              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">BATTERY ECO-MODE</span>
                <span className="text-amber-400 font-bold text-sm block mt-0.5">
                  {deviceHosting.batteryEcoMode ? 'ACTIVE (Low Power)' : 'FULL SPEED'}
                </span>
                <span className="text-[10px] text-slate-500 block">0.2% Battery/Hour</span>
              </div>

              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">MINED MOBILE TOKENS</span>
                <span className="text-amber-400 font-extrabold text-base block mt-0.5">
                  {deviceHosting.minedTokens.toFixed(2)} $BABAL
                </span>
                <span className="text-[10px] text-slate-500 block">Liquid Token Balance</span>
              </div>
            </div>
          </div>

          {/* 3 Core Ecosystem Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: 1-Click Mobile Auto-Linker */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 space-y-4 flex flex-col justify-between transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    Instant Auto-Link
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-heading">
                  Auto-Link Mobile Node
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  When you visit or click on mobile, your device automatically syncs with the nearest P2P node. It joins the validation ring and starts mining with zero configuration.
                </p>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Node Identifier:</span>
                    <span className="text-amber-400 truncate max-w-[150px]">{deviceHosting.nodeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mesh Protocol:</span>
                    <span className="text-emerald-400">WebRTC / WebSocket</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Network Latency:</span>
                    <span className="text-cyan-400">{deviceHosting.networkLatencyMs} ms</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={autoLinkMobileNode}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Re-Sync / Auto-Link Node</span>
              </button>
            </div>

            {/* Card 2: Download Full Android APK */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 space-y-4 flex flex-col justify-between transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Download className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    APK Package v2.6
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-heading">
                  Download Full Android APK
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Real standalone APK file (<code className="text-amber-400">babal-market-mobile-node-v2.6.apk</code>). Runs natively on all Android phones (v8.0+) with zero cloud dependencies.
                </p>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Package File:</span>
                    <span className="text-amber-400">babal-market-mobile-node.apk</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Storage Size:</span>
                    <span className="text-emerald-400 font-bold">12.8 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Offline Capable:</span>
                    <span className="text-teal-400">100% Autonomous</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={downloadFullAndroidApp}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download APK (12.8 MB)</span>
                </button>
                <a
                  href="/download/babal-market-mobile-node.apk"
                  download="babal-market-mobile-node-v2.6.apk"
                  className="block text-center text-[10px] font-mono text-slate-500 hover:text-amber-400 transition-colors"
                >
                  Direct HTTP Mirror: /download/babal-market-mobile-node.apk
                </a>
              </div>
            </div>

            {/* Card 3: Storage Tier & Battery Eco-Mode */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-6 space-y-4 flex flex-col justify-between transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                    Storage Controls
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-heading">
                  Small Storage & Battery
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Tailored for mobile storage constraints. Choose between micro and small tiers to guarantee your device stays light and fast.
                </p>

                {/* Storage Tier Buttons */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-slate-400 block">Select Mobile Storage Tier:</span>
                  <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setMobileStorageTier('micro_8mb')}
                      className={`py-2 px-1.5 rounded-lg border text-center transition-all ${
                        deviceHosting.mobileStorageMode === 'micro_8mb'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="text-[11px]">8.5 MB</div>
                      <div className="text-[9px] text-slate-500">Micro</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMobileStorageTier('small_16mb')}
                      className={`py-2 px-1.5 rounded-lg border text-center transition-all ${
                        (!deviceHosting.mobileStorageMode || deviceHosting.mobileStorageMode === 'small_16mb')
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="text-[11px]">12.8 MB</div>
                      <div className="text-[9px] text-slate-500">Recommended</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMobileStorageTier('standard_32mb')}
                      className={`py-2 px-1.5 rounded-lg border text-center transition-all ${
                        deviceHosting.mobileStorageMode === 'standard_32mb'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="text-[11px]">32.0 MB</div>
                      <div className="text-[9px] text-slate-500">Standard</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Battery Eco Toggle Button */}
              <button
                type="button"
                onClick={toggleBatteryEcoMode}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                  deviceHosting.batteryEcoMode
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Battery Eco-Mode: {deviceHosting.batteryEcoMode ? 'ON (Eco Mining)' : 'OFF (Max Hash)'}</span>
              </button>
            </div>
          </div>

          {/* Big Working Model Explanation */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-black text-white font-heading flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>How the "Small Node, Big Working Model" Works</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h4 className="font-bold text-white text-sm">Ultra-Compact Storage (~12.8 MB)</h4>
                <p className="text-slate-400 text-[11px]">
                  Instead of storing full multi-gigabyte blockchain ledgers, mobile nodes store micro-shards consisting of local shop inventories, cryptographic order hashes, and active escrow contracts.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h4 className="font-bold text-white text-sm">Automatic Mobile Linking</h4>
                <p className="text-slate-400 text-[11px]">
                  When opened on an Android phone or mobile browser, the app binds to the nearest P2P gossip mesh instantly. No command line, no daemon configuration, and no server port forwarding needed.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h4 className="font-bold text-white text-sm">Big Working Model Power</h4>
                <p className="text-slate-400 text-[11px]">
                  Despite taking less memory than a single music track, your mobile node participates in block validation, relays peer escrow payments, and earns authentic $BABAL token mining yields continuously.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PASS TOKENS TO PEER (User Highlighted Request) */}
      {hubTab === 'transfer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          {/* Main Form */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1 pb-4 border-b border-slate-800">
              <h2 className="text-xl font-black text-white font-heading flex items-center gap-2">
                <Send className="w-5 h-5 text-amber-400" />
                <span>Pass Tokens to Another Device</span>
              </h2>
              <p className="text-xs text-slate-400">
                Transfer your mined <strong className="text-amber-400">$BABAL tokens</strong> across the peer-to-peer network. Zero gas fees, zero centralized banks, cryptographically signed directly on your device.
              </p>
            </div>

            {transferResult && (
              <div
                className={`p-4 rounded-2xl text-xs font-mono border space-y-2 ${
                  transferResult.success
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {transferResult.success ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{transferResult.message}</span>
                </div>
                {transferResult.txHash && (
                  <div className="text-[11px] text-slate-300 break-all bg-black/40 p-2 rounded-lg">
                    Ledger TxHash: <span className="text-amber-400">{transferResult.txHash}</span>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handlePassTokens} className="space-y-5">
              {/* Destination Peer Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider block">
                  Select Connected Peer Node
                </label>
                <select
                  value={selectedTargetPeerId}
                  onChange={(e) => {
                    setSelectedTargetPeerId(e.target.value);
                    setCustomNodeKey('');
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                >
                  {p2pPeers.map((peer) => (
                    <option key={peer.id} value={peer.id}>
                      {peer.name} — {peer.location} ({peer.ipMasked})
                    </option>
                  ))}
                </select>
              </div>

              {/* Or enter custom public key */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block">
                  Or Direct Node Public Key / IP
                </label>
                <input
                  type="text"
                  placeholder="0x04b89a27c1... or custom peer identifier"
                  value={customNodeKey}
                  onChange={(e) => setCustomNodeKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                    Amount of $BABAL Tokens to Pass
                  </label>
                  <span className="text-xs text-slate-400 font-mono">
                    Available: <strong className="text-amber-400">{deviceHosting.minedTokens.toFixed(2)} $BABAL</strong>
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={deviceHosting.minedTokens}
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-amber-400 focus:outline-none focus:border-amber-500 font-mono pr-24"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setTransferAmount((deviceHosting.minedTokens * 0.5).toFixed(2))}
                      className="px-2 py-1 rounded bg-slate-800 text-[10px] font-mono text-slate-300 hover:text-white"
                    >
                      50%
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransferAmount(deviceHosting.minedTokens.toFixed(2))}
                      className="px-2 py-1 rounded bg-amber-500/20 text-[10px] font-mono text-amber-300 hover:bg-amber-500/30 font-bold"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              {/* Memo */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block">
                  Transfer Memo / Routing Contract
                </label>
                <input
                  type="text"
                  value={transferMemo}
                  onChange={(e) => setTransferMemo(e.target.value)}
                  placeholder="e.g. Storage Sharding Allocation Bounty"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isTransferring || deviceHosting.minedTokens <= 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
              >
                {isTransferring ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing Transaction on Local Device...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Cryptographically Sign & Pass {transferAmount || '0'} $BABAL Tokens</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Node Wallet & Quick Actions */}
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Node Token Vault</span>
              </h3>
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-400 font-mono block">UNSPENT MINED BALANCE</span>
                <span className="text-3xl font-black text-emerald-400 font-mono block">
                  {deviceHosting.minedTokens.toFixed(2)} <span className="text-xs text-slate-400">$BABAL</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Earned autonomously from your device hosting server space.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-400 font-mono">
                <div className="flex justify-between">
                  <span>Network Gas Fee:</span>
                  <span className="text-emerald-400 font-bold">0.00 $BABAL (FREE)</span>
                </div>
                <div className="flex justify-between">
                  <span>Confirmation Speed:</span>
                  <span className="text-slate-200 font-bold">&lt; 1 Second</span>
                </div>
                <div className="flex justify-between">
                  <span>P2P Broadcast Channel:</span>
                  <span className="text-indigo-400 font-bold">babal_p2p_mesh</span>
                </div>
              </div>
            </div>

            {/* Offline App Download reminder */}
            <div className="bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 rounded-3xl p-6 space-y-3">
              <h4 className="text-xs font-bold text-indigo-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Zero Server Required</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Want to run this complete marketplace node when your Wi-Fi is down? Export our standalone HTML bundle.
              </p>
              <button
                onClick={downloadOfflineP2PBundle}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
              >
                Export Standalone Offline App (.html)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PEER MESH NETWORK */}
      {hubTab === 'peers' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-white font-heading flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  <span>Global Peer Mesh Discovery</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Direct peer-to-peer device nodes hosting decentralized shards of the Babal Market network.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {p2pPeers.length} Active Nodes Connected
                </span>
              </div>
            </div>

            {/* Peers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Local Node Card */}
              <div className="bg-gradient-to-br from-slate-950 to-amber-950/20 border-2 border-amber-500/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      THIS DEVICE (LOCAL SERVER)
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">{deviceHosting.nodeId}</h3>
                    <p className="text-xs text-slate-400 font-mono">Localhost / Edge Validator</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                </div>

                <div className="space-y-1.5 text-xs font-mono text-slate-300 border-t border-slate-900 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hosted Space:</span>
                    <span className="text-amber-400 font-bold">{deviceHosting.allocatedStorageMb} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mined Tokens:</span>
                    <span className="text-emerald-400 font-bold">{deviceHosting.minedTokens.toFixed(2)} $BABAL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Uptime:</span>
                    <span className="text-slate-200">{formatUptime(deviceHosting.uptimeSeconds)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 block text-center font-mono">
                    Device Server Status: Active
                  </span>
                </div>
              </div>

              {/* Remote Peers */}
              {p2pPeers.map((peer) => (
                <div
                  key={peer.id}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-bold text-white">{peer.name}</h3>
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {peer.latencyMs} ms
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">{peer.location}</p>
                    <p className="text-[11px] text-slate-500 font-mono">IP: {peer.ipMasked}</p>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono text-slate-400 border-t border-slate-900 pt-3">
                    <div className="flex justify-between">
                      <span>Blocks Hosted:</span>
                      <span className="text-slate-200">#{peer.hostedBlocksCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contributed Space:</span>
                      <span className="text-blue-400 font-bold">{peer.storageContributedMb} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reputation:</span>
                      <span className="text-emerald-400 font-bold">{peer.reputationScore}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => quickFillPeer(peer)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-amber-400 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Pass Tokens to {peer.name.split(' ')[0]}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BLOCKCHAIN BLOCK EXPLORER & TX LEDGER */}
      {hubTab === 'ledger' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Recent Token Transfers Stream */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-black text-white font-heading flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <span>P2P Token Transfers History</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {tokenTransfers.length} Ledger Events
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-slate-400 border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">TX HASH</th>
                    <th className="py-2.5 px-3">FROM NODE</th>
                    <th className="py-2.5 px-3">DESTINATION</th>
                    <th className="py-2.5 px-3">AMOUNT</th>
                    <th className="py-2.5 px-3">MEMO</th>
                    <th className="py-2.5 px-3">TIMESTAMP</th>
                    <th className="py-2.5 px-3">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {tokenTransfers.map((tx) => (
                    <tr key={tx.txHash} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-3 text-amber-400 font-bold truncate max-w-[140px]">
                        {tx.txHash.substring(0, 14)}...
                      </td>
                      <td className="py-3 px-3 truncate max-w-[140px] text-slate-400">
                        {tx.fromNode}
                      </td>
                      <td className="py-3 px-3 text-slate-200 font-bold">
                        {tx.toNodeName}
                      </td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">
                        {tx.amount.toFixed(2)} $BABAL
                      </td>
                      <td className="py-3 px-3 text-slate-400 italic truncate max-w-[160px]">
                        {tx.memo || 'N/A'}
                      </td>
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        {tx.timestamp}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Blockchain Blocks List with Creator Main Blocks & Customer Primary Children Blocks */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <h2 className="text-lg font-black text-white font-heading flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span>On-Device Blockchain Ledger Blocks</span>
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="text-amber-400 font-bold">Tree Architecture:</span>
                  <span>Shop Creators = <strong>Main Blocks</strong></span>
                  <span>•</span>
                  <span>Customers = <strong>Primary Children Blocks</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full App (Web/APK)</span>
                </button>
                <button
                  onClick={mineNewBlock}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Mine Block (+25 $BABAL)</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {blockchainBlocks.map((block) => (
                <div
                  key={block.hash}
                  className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-4 hover:border-slate-700 transition-colors"
                >
                  {/* Block Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs border border-indigo-500/40">
                        Block #{block.height}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                        <Store className="w-3 h-3 text-amber-400" />
                        MAIN CREATOR BLOCK
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {block.transactionsCount} txs • {block.sizeKb} KB
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                        {block.status}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      Mined: {block.timestamp}
                    </span>
                  </div>

                  {/* Shop Creator Anchor Details */}
                  <div className="bg-slate-900/80 border border-amber-500/20 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">CREATOR STOREFRONT ANCHOR</span>
                        <strong className="text-white">
                          {block.shopCreatorName || 'Artisan Creator Shard Anchor'}
                        </strong>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-slate-400 truncate max-w-xs">
                      Anchor Hash: <span className="text-amber-400">{block.creatorStorefrontHash || block.hash.substring(0, 16)}</span>
                    </div>
                  </div>

                  {/* Cryptographic Proof Strip */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                    <div className="truncate">
                      <span className="text-slate-500">HASH: </span>
                      <span className="text-amber-400 font-bold">{block.hash}</span>
                    </div>
                    <div className="truncate">
                      <span className="text-slate-500">MERKLE: </span>
                      <span className="text-slate-300">{block.merkleRoot}</span>
                    </div>
                    <div className="truncate">
                      <span className="text-slate-500">VALIDATOR: </span>
                      <span className="text-emerald-400">{block.minerNode}</span>
                    </div>
                    <div className="truncate">
                      <span className="text-slate-500">MINING REWARD: </span>
                      <span className="text-amber-300 font-bold">+{block.minerReward} $BABAL</span>
                    </div>
                  </div>

                  {/* Primary Children Customer Blocks Hierarchy Tree */}
                  {block.childrenBlocks && block.childrenBlocks.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-900">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="font-bold text-slate-300">
                          Primary Children Blocks ({block.childrenBlocks.length} Customer State Leaves Chained)
                        </span>
                      </div>

                      <div className="ml-3 sm:ml-5 border-l-2 border-amber-500/40 pl-3 sm:pl-4 space-y-2">
                        {block.childrenBlocks.map((child) => (
                          <div
                            key={child.childId}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono hover:border-slate-700 transition-colors"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                                  PRIMARY CHILD BLOCK
                                </span>
                                <span className="text-white font-bold">{child.customerHandle}</span>
                                <span className="text-amber-400">({child.orderId})</span>
                              </div>
                              <div className="text-[11px] text-slate-400">
                                Carrier OTP State Proof: <span className="text-slate-300">{child.carrierOtpHash}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-emerald-400 font-bold font-mono">
                                ${child.amount.toFixed(2)}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  child.escrowStatus === 'Released'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                Escrow: {child.escrowStatus}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WHITEPAPER & ARCHITECTURE FAQ */}
      {hubTab === 'whitepaper' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 animate-fadeIn text-slate-300 text-sm leading-relaxed">
          <div className="space-y-2 border-b border-slate-800 pb-6">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold">
              BABAL P2P WHITE-PAPER SPEC v1.0
            </span>
            <h2 className="text-2xl font-black text-white font-heading">
              How Babal Market Operates With Zero Centralized Servers
            </h2>
            <p className="text-xs text-slate-400">
              Technical overview of device-as-a-server, local storage sharding, token passing, and offline mesh portability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-sm font-bold text-white">Device-as-a-Server</h3>
              <p className="text-xs text-slate-400">
                Traditional e-commerce rents thousands of dollars per month of AWS/GCP servers. Babal distributes catalog shards and order escrows across user devices via HTML5 IndexedDB, eliminating hosting bills entirely.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-sm font-bold text-white">Proof-of-Uptime Mining</h3>
              <p className="text-xs text-slate-400">
                Whenever your device hosts server space (even in a minimized background tab or downloaded offline app), your node automatically mines <strong className="text-emerald-400">$BABAL Node Tokens</strong>, giving you real economic incentives to support the network.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-sm font-bold text-white">Token Passing to Peers</h3>
              <p className="text-xs text-slate-400">
                Users can transfer $BABAL tokens directly to any peer node across the mesh via BroadcastChannel and WebRTC primitives. Transactions are confirmed on-chain in milliseconds with zero bank fees.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h4 className="font-bold text-white text-sm">Offline Portability Guarantee</h4>
            <p className="text-xs text-slate-400">
              When you click <strong>"Download Standalone Zero-Server App"</strong>, the entire marketplace database, catalog items, shopping cart, and node consensus engine are compiled into a single self-contained HTML file. You can save it to a USB drive or smartphone, disconnect your Wi-Fi, and shop or mine completely offline.
            </p>
            <button
              onClick={downloadOfflineP2PBundle}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Standalone Offline App Now</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
