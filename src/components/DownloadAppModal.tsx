import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Globe,
  X,
  CheckCircle2,
  ShieldCheck,
  Server,
  Zap,
  ArrowRight,
  HardDrive,
  QrCode,
  FileCode,
  Cpu,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DownloadAppModal: React.FC = () => {
  const {
    isDownloadModalOpen,
    setIsDownloadModalOpen,
    downloadFullWebAppBundle,
    downloadFullAndroidApp,
    deviceHosting,
    adminDeviceLink,
  } = useApp();

  const [activeDownloadPlatform, setActiveDownloadPlatform] = useState<'both' | 'android' | 'web'>('both');
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  if (!isDownloadModalOpen) return null;

  const handleDownloadWeb = () => {
    downloadFullWebAppBundle();
    setDownloadSuccessMessage('✅ Standalone Web App exported! You can open it in any browser with zero server required.');
    setTimeout(() => setDownloadSuccessMessage(null), 4000);
  };

  const handleDownloadAndroid = () => {
    downloadFullAndroidApp();
    setDownloadSuccessMessage('✅ Android APK Package (v2.6) downloaded! Low storage footprint (12.8 MB) with auto-linked P2P mobile mining.');
    setTimeout(() => setDownloadSuccessMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={() => setIsDownloadModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                MOBILE NODE ECOSYSTEM
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                Small Storage (12.8 MB)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono">
                Auto-Link Active
              </span>
            </div>
            <h2 className="text-2xl font-black text-white font-heading tracking-tight">
              Babal Mobile Micro-Node & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Android APK</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Fully decentralized mobile mining and small-node big-working ecosystem! Takes minimal device storage (~12.8 MB), auto-links upon opening on mobile, and mines $BABAL tokens with low battery consumption.
            </p>
          </div>

          {downloadSuccessMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{downloadSuccessMessage}</span>
            </div>
          )}

          {/* Platform Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Android App Download Card */}
            <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all shadow-lg shadow-emerald-500/5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    APK v2.6 • 12.8 MB
                  </span>
                </div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Full Downloadable Android APK</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real standalone APK installer. Small storage micro-node model that auto-links with low battery consumption and mines tokens continuously.
                </p>
                <div className="text-[11px] font-mono text-slate-400 space-y-1 pt-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-emerald-400 font-bold">✓ Small Storage: 12.8 MB</div>
                  <div>✓ Auto-Link on Mobile Click</div>
                  <div>✓ Battery Eco-Mode (Low Power)</div>
                </div>
              </div>

              <button
                onClick={handleDownloadAndroid}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Android APK (v2.6)</span>
              </button>
            </div>

            {/* 2. Standalone Web App Download Card */}
            <div className="bg-slate-950 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    HTML5 / Portable Web
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Full Web App (.html)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Single self-contained file with inlined catalog, wallet, CPU mining loop, and offline escrow state. Works in any browser without Internet.
                </p>
                <div className="text-[11px] font-mono text-slate-500 space-y-1 pt-1">
                  <div>Compatibility: Chrome, Edge, Safari, Firefox</div>
                  <div>Protocol: file:/// (Zero Web Server Needed)</div>
                </div>
              </div>

              <button
                onClick={handleDownloadWeb}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-black text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Standalone Web App</span>
              </button>
            </div>
          </div>

          {/* Quick Dual Action */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs font-bold text-white">Need both Web & Android?</span>
              <p className="text-[11px] text-slate-400">Download the full suite to host synchronized nodes on both mobile and laptop.</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  handleDownloadAndroid();
                  handleDownloadWeb();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Both (Web + Android)</span>
              </button>
            </div>
          </div>

          {/* Android Installation Guide */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
            <h4 className="font-bold text-slate-300 font-mono uppercase tracking-wider">
              Android Quick Installation Steps:
            </h4>
            <ol className="space-y-1.5 text-slate-400 text-[11px] list-decimal list-inside leading-relaxed">
              <li>Tap <strong>Download Android APK Package</strong> above to save to your Android phone.</li>
              <li>Open your phone's <strong>Downloads</strong> folder and tap the <code className="text-amber-400">babal-market-android-v2.5.apk</code> file.</li>
              <li>Allow "Install from unknown sources" if prompted by Android Security.</li>
              <li>Tap <strong>Install</strong> and launch Babal Market — your phone will immediately host local marketplace shards and mine tokens!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
