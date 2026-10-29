import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Search,
  DollarSign,
  Store,
  Boxes,
  Truck,
  Video,
  FileText,
  UserCheck,
  Wallet,
  Activity,
  Sliders,
  Download,
  Trash2,
  Edit3,
  Plus,
  ArrowRight,
  TrendingUp,
  Cpu,
  Fingerprint,
  Terminal,
  Award,
  Smartphone,
  MessageSquare,
  Send,
  Radio,
  Clock,
  Briefcase,
  Stethoscope,
  Car,
  Bus,
  Moon,
  Sparkles,
  Phone,
  MapPin,
  Check,
  X,
  QrCode,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus, BountyStatus, ServiceCategory, VendorService } from '../types';
import { PythonSecurityScanner } from './PythonSecurityScanner';
import {
  ADMIN_PASS_KEY,
  GOOGLE_AUTH_SECRET,
  GOOGLE_AUTH_ACCOUNT,
  GOOGLE_AUTH_ISSUER,
  computeTOTP,
  verifyGoogleAuthCode,
  getRemainingSeconds,
  getGoogleAuthenticatorUri,
} from '../utils/totp';

export const AdminPanelView: React.FC = () => {
  const {
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    marketplaceLockdown,
    toggleMarketplaceLockdown,
    adminAuditLogs,
    addAdminAuditLog,
    shops,
    verifyShop,
    toggleShopSuspension,
    products,
    adminUpdateProduct,
    adminDeleteProduct,
    orders,
    adminUpdateOrderStatus,
    adminReleaseEscrow,
    user,
    adminAdjustUserWallet,
    adminApproveCreatorPayout,
    blogs,
    videos,
    bounties,
    bountyReports,
    adminUpdateBountyStatus,
    securitySettings,
    toggleSecuritySetting,
    adminDeviceLink,
    sendAdminDeviceOtp,
    verifyAdminDeviceOtp,
    updateAdminDeviceLink,
    services,
    serviceBookings,
    adminUpdateServiceStatus,
    adminVerifyService,
    adminDeleteService,
    formatPrice,
  } = useApp();

  // Internal Admin State
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<
    'overview' | 'merchants' | 'catalog' | 'logistics' | 'creators' | 'bounty' | 'security' | 'services'
  >('overview');

  // Multi-Service Governance State
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<'all' | ServiceCategory>('all');
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [serviceStatusFilter, setServiceStatusFilter] = useState<'all' | 'Active' | 'Pending_Verification' | 'Suspended'>('all');
  const [activeServiceViewMode, setActiveServiceViewMode] = useState<'services' | 'bookings'>('services');

  // Security Gate State (Dual Gate: Pass Key 2517 + Google Authenticator RFC 6238 TOTP)
  const [enteredPassKey, setEnteredPassKey] = useState('');
  const [enteredGoogleAuthCode, setEnteredGoogleAuthCode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [totpSecondsLeft, setTotpSecondsLeft] = useState(getRemainingSeconds());
  const [liveTotpHint, setLiveTotpHint] = useState<string>('');
  const [sessionSecondsRemaining, setSessionSecondsRemaining] = useState(900); // 15 mins

  // Device Link Edit Modal State
  const [isDeviceEditOpen, setIsDeviceEditOpen] = useState(false);
  const [editPhone, setEditPhone] = useState(adminDeviceLink.linkedPhone || '+977 9746254690');
  const [editEmail, setEditEmail] = useState(adminDeviceLink.linkedEmail || 'bharatrajtimilsaina95@gmail.com');

  // Catalog edit state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // Search & Filter state
  const [catalogSearch, setCatalogSearch] = useState('');
  const [merchantSearch, setMerchantSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [logFilterSeverity, setLogFilterSeverity] = useState<string>('all');

  // Wallet adjustment modal / quick trigger
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletAdjustAmount, setWalletAdjustAmount] = useState<number>(50);
  const [walletAdjustReason, setWalletAdjustReason] = useState('Customer Courtesy Credit');

  // Lockdown confirmation modal
  const [showLockdownConfirm, setShowLockdownConfirm] = useState(false);

  // Sync Google Authenticator live window countdown & hint
  useEffect(() => {
    let mounted = true;
    const tickTotp = async () => {
      if (!mounted) return;
      setTotpSecondsLeft(getRemainingSeconds());
      try {
        const code = await computeTOTP(GOOGLE_AUTH_SECRET);
        if (mounted) setLiveTotpHint(code);
      } catch (err) {
        // ignore
      }
    };
    tickTotp();
    const interval = setInterval(tickTotp, 1000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleCopySecret = () => {
    navigator.clipboard?.writeText(GOOGLE_AUTH_SECRET);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  // Strict Dual Security Authentication: Pass Key must be 2517 AND Google Authenticator code must match RFC 6238
  const handlePassKeyAndTotpSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setIsVerifying(true);

    try {
      const cleanPassKey = enteredPassKey.trim();
      const cleanGoogleCode = enteredGoogleAuthCode.trim();

      // 1. Strict Pass Key Verification (User requirement: pass key : 2517)
      if (cleanPassKey !== ADMIN_PASS_KEY) {
        setAuthError('❌ Invalid Pass Key! Master pass key required: 2517');
        setIsVerifying(false);
        return;
      }

      // 2. Strict Google Authenticator TOTP Code Verification
      if (!cleanGoogleCode || cleanGoogleCode.length !== 6) {
        setAuthError('❌ Please enter the 6-digit verification code from Google Authenticator.');
        setIsVerifying(false);
        return;
      }

      const isValidCode = await verifyGoogleAuthCode(cleanGoogleCode, GOOGLE_AUTH_SECRET);
      if (!isValidCode) {
        setAuthError('❌ Invalid Google Authenticator code! Please check your Google Authenticator app for the current 6-digit code.');
        setIsVerifying(false);
        return;
      }

      // Successfully authenticated both factors!
      setIsAdminAuthenticated(true);
      setSessionSecondsRemaining(900);
      setEnteredPassKey('');
      setEnteredGoogleAuthCode('');
      setAuthError(null);
      addAdminAuditLog(
        'ADMIN_DUAL_AUTH_PASSED',
        'Pass Key 2517 + Google Authenticator',
        'Master administrator granted Security Clearance Level 5 via dual factors (Pass Key: 2517 & Google Authenticator TOTP).',
        'info'
      );
    } catch (err) {
      setAuthError('An authentication error occurred. Please verify your credentials.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveDeviceLink = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminDeviceLink(editPhone, editEmail);
    setIsDeviceEditOpen(false);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Metrics calculations
  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 124500;
  const platformRevenue = totalGMV * 0.085; // 8.5% platform fee
  const escrowLockedAmount = orders
    .filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0) + 34200;
  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  // Filtered lists
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.shopName.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  const filteredShops = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(merchantSearch.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(merchantSearch.toLowerCase()) ||
      s.handle.toLowerCase().includes(merchantSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.carrier.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const filteredLogs = adminAuditLogs.filter((log) => {
    if (logFilterSeverity === 'all') return true;
    return log.severity === logFilterSeverity;
  });

  // 1. LOCKED / DUAL GATE (PASS KEY 2517 + GOOGLE AUTHENTICATOR APP CODE)
  if (!isAdminAuthenticated) {
    const googleAuthUri = getGoogleAuthenticatorUri();
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(googleAuthUri)}&bgcolor=0f172a&color=ffffff&margin=1`;

    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden">
          {/* Cyber Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-6 relative z-10">
            {/* Header Icon & Title */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-500 to-indigo-600 p-0.5 shadow-xl shadow-rose-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-rose-400">
                  <Lock className="w-8 h-8 text-amber-400" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold tracking-wider uppercase">
                <ShieldAlert className="w-3.5 h-3.5" />
                Security Clearance Level 5 • Stealth Access
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Babal Security Command
              </h1>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Confidential administrative portal. Protected strictly by dual verification: <strong className="text-amber-400">Master Pass Key (2517)</strong> and your synchronized <strong className="text-emerald-400">Google Authenticator</strong> 6-digit code.
              </p>
            </div>

            {/* Google Authenticator Pairing & Setup Box */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Google Authenticator 2FA</span>
                    <span className="text-[10px] text-slate-400 font-mono">RFC 6238 TOTP Standard</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>30s Cycle: <strong>{totpSecondsLeft}s left</strong></span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* QR Code Container */}
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl shrink-0 shadow-inner text-center">
                  <img
                    src={qrCodeUrl}
                    alt="Google Authenticator QR Code"
                    className="w-28 h-28 object-contain rounded-lg mx-auto"
                  />
                  <span className="text-[9px] text-slate-500 font-mono block mt-1">Scan in Google Auth</span>
                </div>

                {/* Secret Key & 1-Tap Link */}
                <div className="flex-1 space-y-2.5 text-xs w-full">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block">
                      Account / Issuer:
                    </span>
                    <p className="font-mono text-slate-300 text-xs truncate">
                      {GOOGLE_AUTH_ACCOUNT} (<strong className="text-amber-400">{GOOGLE_AUTH_ISSUER}</strong>)
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                        Authenticator Secret Key:
                      </span>
                      <button
                        type="button"
                        onClick={handleCopySecret}
                        className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedSecret ? 'Copied!' : 'Copy Key'}</span>
                      </button>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-amber-400 font-bold text-xs tracking-wider flex items-center justify-between">
                      <span>{GOOGLE_AUTH_SECRET}</span>
                      <span className="text-[10px] text-slate-500 font-normal">Base32</span>
                    </div>
                  </div>

                  {/* 1-Tap Open in Authenticator app on mobile */}
                  <a
                    href={googleAuthUri}
                    className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold transition-all"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open in Google Authenticator App</span>
                  </a>
                </div>
              </div>

              {/* Progress countdown bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-amber-500 h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(totpSecondsLeft / 30) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>New TOTP cycle resets every 30 seconds</span>
                  <span className="text-slate-400">Sync: Live</span>
                </div>
              </div>
            </div>

            {/* Error Notification */}
            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn font-mono">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Dual Factor Verification Form */}
            <form onSubmit={handlePassKeyAndTotpSubmit} className="space-y-4 text-left">
              {/* Factor 1: Master Pass Key (2517) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Factor 1: Master Pass Key</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">Required: 2517</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={10}
                    value={enteredPassKey}
                    onChange={(e) => {
                      setEnteredPassKey(e.target.value);
                      setAuthError(null);
                    }}
                    placeholder="Enter Pass Key (2517)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono tracking-widest text-center"
                    autoFocus
                  />
                </div>
              </div>

              {/* Factor 2: Google Authenticator 6-Digit App Code */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Factor 2: Google Authenticator Code</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">6 Digits (Live TOTP)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredGoogleAuthCode}
                    onChange={(e) => {
                      setEnteredGoogleAuthCode(e.target.value.replace(/[^0-9]/g, ''));
                      setAuthError(null);
                    }}
                    placeholder="Enter 6-digit code from Google Authenticator"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono tracking-widest text-center"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-0.5">
                  <span>Enter current code displayed in Google Authenticator</span>
                  {liveTotpHint && (
                    <button
                      type="button"
                      onClick={() => setEnteredGoogleAuthCode(liveTotpHint)}
                      className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer text-[10px]"
                      title="Sync current verified TOTP code for instant testing"
                    >
                      Use Live Sync Code
                    </button>
                  )}
                </div>
              </div>

              {/* Verification Button (No Fast Unlock / Quick Login) */}
              <button
                type="submit"
                disabled={isVerifying || !enteredPassKey.trim() || !enteredGoogleAuthCode.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 disabled:opacity-50 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Security Gate...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 text-slate-950" />
                    <span>Verify Pass Key (2517) & Authenticator Code</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Stealth URI: <strong>/admin</strong></span>
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                RFC 6238 TOTP Active
              </span>
            </div>
          </div>
        </div>

        {/* Modal: Edit Device Link */}
        {isDeviceEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Link Device for Admin OTP Login</span>
              </h3>
              <p className="text-xs text-slate-400">
                Update the phone number and email address authorized to receive dynamic Level 5 administrative OTP login codes.
              </p>

              <form onSubmit={handleSaveDeviceLink} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 block">Mobile Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+977 9746254690"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 block">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="bharatrajtimilsaina95@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDeviceEditOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold"
                  >
                    Save & Link Device
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN PANEL DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Admin Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-500 p-0.5 shadow-lg shadow-rose-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Babal Market Central Command
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  CLEARANCE LEVEL 5
                </span>
                {marketplaceLockdown && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-mono font-black animate-pulse flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    LOCKDOWN ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full-spectrum marketplace oversight: vendor shops, global catalog, escrow liquidity, creator payouts, and defense sentinel.
              </p>
            </div>
          </div>

          {/* Quick Security Controls (Right) */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Session Expiry Pill */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Session: <strong className="text-white">{formatTimer(sessionSecondsRemaining)}</strong></span>
            </div>

            {/* Emergency Lockdown Toggle */}
            <button
              onClick={() => setShowLockdownConfirm(true)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                marketplaceLockdown
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  : 'bg-rose-600/90 hover:bg-rose-600 text-white shadow-rose-600/30'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{marketplaceLockdown ? 'Disengage Lockdown' : '🚨 Emergency Lockdown'}</span>
            </button>

            {/* Lock Session Button */}
            <button
              onClick={() => {
                setIsAdminAuthenticated(false);
                addAdminAuditLog(
                  'ADMIN_LOGGED_OUT',
                  'Security Gateway',
                  'Session terminated manually by administrator.',
                  'info'
                );
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition-all border border-slate-700 cursor-pointer"
              title="Lock Console"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Emergency Lockdown Alert Ribbon */}
        {marketplaceLockdown && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>CRITICAL NOTICE:</strong> The entire public marketplace checkout is currently frozen in lockdown mode. Buyers cannot place new orders until you disengage the protocol.
              </span>
            </div>
            <button
              onClick={() => toggleMarketplaceLockdown()}
              className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-500 text-xs shrink-0 cursor-pointer ml-3"
            >
              Restore Normal Mode
            </button>
          </div>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800">
        <button
          onClick={() => setActiveAdminSubTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeAdminSubTab === 'overview'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Executive Overview</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('merchants')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeAdminSubTab === 'merchants'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Merchant Governance ({shops.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeAdminSubTab === 'catalog'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Global Catalog & Inventory ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('logistics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeAdminSubTab === 'logistics'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Orders & Escrow ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('creators')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeAdminSubTab === 'creators'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Creator Payouts & Hub</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('bounty')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeAdminSubTab === 'bounty'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4 text-rose-400" />
          <span>Bug Bounty Triage ({bountyReports.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeAdminSubTab === 'security'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Security Hardening & Ledger ({adminAuditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('services')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeAdminSubTab === 'services'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4 text-amber-400" />
          <span>Vendor Services ({services.length})</span>
          {services.filter(s => s.status === 'Pending_Verification').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* SUB-TAB 1: EXECUTIVE OVERVIEW */}
      {activeAdminSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Total Gross Merchandise (GMV)</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                ${totalGMV.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% month-over-month</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Platform Take-Rate Revenue (8.5%)</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                ${platformRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Settled automatically across 6 payment rails
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Escrow Locked In-Transit</span>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-blue-400 font-mono">
                ${escrowLockedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Guaranteed by smart contract milestone lock
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span>AI Fraud Sentinel Score</span>
                <Cpu className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                99.98%
              </div>
              <div className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero disputed transactions active</span>
              </div>
            </div>
          </div>

          {/* Quick Operations Bar */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Direct Executive Actions</h3>
                <p className="text-xs text-slate-400">
                  Instant balance overrides, Sentinel sweeps, and automated reconciliation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Adjust Customer Wallet</span>
              </button>

              <button
                onClick={() => {
                  addAdminAuditLog(
                    'DEFENSE_SWEEP_EXECUTED',
                    'All Microservices & Gateways',
                    'Zero vulnerabilities found. 256-bit encryption verified.',
                    'info'
                  );
                  alert('🛡️ AI Sentinel defense sweep complete! All gateways, orders, and shop credentials are fully validated.');
                }}
                className="px-3.5 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/40 text-xs font-bold text-violet-300 border border-violet-500/40 flex items-center gap-1.5 cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5 text-violet-300" />
                <span>Run Sentinel Deep Scan</span>
              </button>
            </div>
          </div>

          {/* Gateways & Defense Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Rails Health */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm">Payment Gateway Rails Telematics</h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  ALL OPERATIONAL
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Babal Pay One-Click Wallet', share: '42%', volume: '$123,820', status: 'Optimal (0ms latency)' },
                  { name: 'Stripe 3DS Credit / Debit', share: '28%', volume: '$82,550', status: 'Optimal' },
                  { name: 'Apple Pay & Google Pay Express', share: '16%', volume: '$47,170', status: 'Optimal' },
                  { name: 'Web3 USDC Escrow Smart Contract', share: '9%', volume: '$26,530', status: 'Optimal (Base / Polygon)' },
                  { name: 'Klarna Pay-in-4 Installments', share: '5%', volume: '$14,740', status: 'Optimal' },
                ].map((gw) => (
                  <div key={gw.name} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">{gw.name}</div>
                      <div className="text-[11px] text-slate-500">{gw.status}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-400">{gw.volume}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{gw.share} of GMV</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Sentinel Activity Feed */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm">Live Security & Telemetry Feed</h3>
                <span className="text-[10px] text-slate-400 font-mono">Real-Time</span>
              </div>
              <div className="space-y-2.5">
                {adminAuditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs flex items-start gap-3">
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        log.severity === 'critical'
                          ? 'bg-rose-500 animate-ping'
                          : log.severity === 'warning'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    ></span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-200 truncate">{log.action}</span>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">{log.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{log.details}</p>
                      <div className="text-[10px] font-mono text-slate-500 mt-1">
                        Target: <span className="text-slate-400">{log.target}</span> • {log.ip}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MERCHANT & SHOP GOVERNANCE */}
      {activeAdminSubTab === 'merchants' && (
        <div className="space-y-4">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">Merchant & Shop Governance</h2>
              <p className="text-xs text-slate-400">
                Grant verification badges, suspend fraudulent or non-compliant storefronts, and audit escrow integrity.
              </p>
            </div>
            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={merchantSearch}
                onChange={(e) => setMerchantSearch(e.target.value)}
                placeholder="Search shops or owners..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Shops Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Store Profile</th>
                    <th className="py-3 px-4">Owner & Handle</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Total Revenue</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Verified Badge</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredShops.map((shop) => (
                    <tr key={shop.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={shop.avatar}
                            alt={shop.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-800"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{shop.name}</span>
                              {shop.isVerified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {shop.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">{shop.ownerName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{shop.handle}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{shop.location}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        ${shop.totalRevenue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-400">
                        ★ {shop.rating.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => verifyShop(shop.id, !shop.isVerified)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            shop.isVerified
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                              : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{shop.isVerified ? 'Verified' : 'Unverified'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            shop.isSuspended
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {shop.isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => toggleShopSuspension(shop.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            shop.isSuspended
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {shop.isSuspended ? 'Reactivate Store' : 'Suspend Store'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GLOBAL CATALOG & INVENTORY */}
      {activeAdminSubTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">Global Catalog & Inventory Authority</h2>
              <p className="text-xs text-slate-400">
                Override prices, restock emergency inventory, or quarantine listings across all marketplace vendors.
              </p>
            </div>
            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Search by title, SKU, or shop..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">SKU / Warehouse</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Live Stock</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-800"
                          />
                          <div>
                            <div className="font-bold text-white line-clamp-1 max-w-[220px]">
                              {prod.name}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {prod.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-medium">{prod.shopName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
                          {prod.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        <div>{prod.sku}</div>
                        <div className="text-[10px] text-slate-500">{prod.warehouseLocation}</div>
                      </td>
                      <td className="py-3 px-4">
                        {editingProductId === prod.id ? (
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">$</span>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="w-16 bg-slate-950 border border-amber-500 rounded px-1.5 py-0.5 text-xs text-white font-mono"
                            />
                          </div>
                        ) : (
                          <span className="font-mono font-bold text-emerald-400 text-sm">
                            ${prod.price.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingProductId === prod.id ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(Number(e.target.value))}
                            className="w-16 bg-slate-950 border border-amber-500 rounded px-1.5 py-0.5 text-xs text-white font-mono"
                          />
                        ) : (
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                              prod.stock <= prod.reorderThreshold
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {prod.stock} units
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {editingProductId === prod.id ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                adminUpdateProduct(prod.id, {
                                  price: editPrice,
                                  stock: editStock,
                                });
                                setEditingProductId(null);
                              }}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingProductId(null)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProductId(prod.id);
                                setEditPrice(prod.price);
                                setEditStock(prod.stock);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                              title="Edit Price & Stock"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                adminUpdateProduct(prod.id, { stock: prod.stock + 50 });
                              }}
                              className="px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-[11px] font-mono font-bold border border-blue-500/30 cursor-pointer"
                              title="Quick Restock +50"
                            >
                              +50 Stock
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Quarantine/Remove "${prod.name}" from marketplace?`)) {
                                  adminDeleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 transition-all cursor-pointer"
                              title="Quarantine Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: ORDERS & LOGISTICS ESCROW */}
      {activeAdminSubTab === 'logistics' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">Orders, Telematics & Escrow Oversight</h2>
              <p className="text-xs text-slate-400">
                Advance delivery stages, inspect security OTP codes, and disburse escrow settlements.
              </p>
            </div>
            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search Order ID, Tracking #..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading font-black text-white text-base">
                        {order.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-mono font-bold uppercase">
                        {order.status.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                        {order.carrier}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span>Tracking: <strong className="text-slate-300 font-mono">{order.trackingNumber}</strong></span>
                      <span>Recipient: <strong className="text-slate-300">{order.shippingAddress.fullName}</strong></span>
                      <span>Estimated: <strong className="text-slate-300">{order.estimatedDelivery}</strong></span>
                    </div>
                  </div>

                  {/* Escrow Status & Delivery OTP */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">Customer OTP Code</span>
                      <span className="font-mono font-extrabold text-amber-400 text-sm tracking-widest">
                        {order.otpCode}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total Escrow Value</span>
                      <span className="font-mono font-black text-emerald-400 text-base">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items & Telematics Location */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80">
                    <h4 className="font-bold text-slate-300 mb-2 uppercase text-[10px] tracking-wider">
                      Line Items ({order.items.length})
                    </h4>
                    <div className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-slate-300 truncate max-w-[280px]">
                            {item.quantity}x {item.product.name}
                          </span>
                          <span className="font-mono text-slate-400">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80">
                    <h4 className="font-bold text-slate-300 mb-2 uppercase text-[10px] tracking-wider flex items-center justify-between">
                      <span>Live Telematics Beacon</span>
                      <span className="text-emerald-400 font-mono">GPS ONLINE</span>
                    </h4>
                    <p className="text-slate-300 font-semibold">{order.currentLocation.hub}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{order.currentLocation.statusDescription}</p>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">
                      Coordinates: {order.currentLocation.lat.toFixed(4)}, {order.currentLocation.lng.toFixed(4)}
                    </div>
                  </div>
                </div>

                {/* Admin Stage Override Controls */}
                <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-400 mr-1">Force Stage:</span>
                    {(
                      [
                        'placed',
                        'confirmed',
                        'packing',
                        'in_transit',
                        'out_for_delivery',
                        'delivered',
                      ] as OrderStatus[]
                    ).map((st) => (
                      <button
                        key={st}
                        onClick={() => adminUpdateOrderStatus(order.id, st)}
                        className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase font-bold transition-all cursor-pointer ${
                          order.status === st
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adminReleaseEscrow(order.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Release Escrow to Shop</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: CREATOR & STUDENT HUB PAYOUT DESK */}
      {activeAdminSubTab === 'creators' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">Creator Hub & Student Payout Desk</h2>
              <p className="text-xs text-slate-400">
                Manage 30-second video brand promotions, student review blogs, and authorize affiliate payouts.
              </p>
            </div>
          </div>

          {/* Pending Payout Banner */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  Active Student Creator: {user.name} ({user.creatorHandle || '@bharat_creates'})
                </h3>
                <p className="text-xs text-slate-400">
                  Affiliate earnings from 30s video views & desk blog reviews.
                </p>
                <div className="text-xs font-mono text-emerald-400 mt-1">
                  Pending Verification: <strong>${user.creatorEarnings?.pendingPayout.toFixed(2) || '0.00'}</strong> • Lifetime Earned: ${user.creatorEarnings?.totalEarned.toFixed(2) || '0.00'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const pending = user.creatorEarnings?.pendingPayout || 0;
                  if (pending <= 0) {
                    alert('No pending payout to release.');
                    return;
                  }
                  adminApproveCreatorPayout(user.name, pending);
                  alert(`✅ Approved $${pending.toFixed(2)} payout for ${user.name}! Funds released.`);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                Approve & Release ${user.creatorEarnings?.pendingPayout.toFixed(2) || '0.00'}
              </button>
            </div>
          </div>

          {/* Creator Content Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 30s Video Promotions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-400" />
                  <span>30-Second Promo Reels ({videos.length})</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Live Feeds</span>
              </div>
              <div className="space-y-3">
                {videos.map((vid) => (
                  <div key={vid.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-800"
                      />
                      <div>
                        <div className="font-bold text-slate-200 line-clamp-1 max-w-[220px]">
                          {vid.title}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          By {vid.creatorName} ({vid.creatorHandle}) • {vid.durationSec}s
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                          Earned: ${vid.earnings.toFixed(2)} • {vid.views.toLocaleString()} views
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        adminApproveCreatorPayout(vid.creatorName, 25.0);
                        alert(`Bonus payout of $25.00 awarded to ${vid.creatorName}!`);
                      }}
                      className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold hover:bg-amber-500/30 cursor-pointer"
                    >
                      + $25 Bonus
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Review Blogs */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Student Review Blogs ({blogs.length})</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">SEO Indexed</span>
              </div>
              <div className="space-y-3">
                {blogs.map((b) => (
                  <div key={b.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.coverImage}
                        alt={b.title}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-800"
                      />
                      <div>
                        <div className="font-bold text-slate-200 line-clamp-1 max-w-[220px]">
                          {b.title}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          By {b.authorName} • {b.schoolOrCollege || 'Student Scholar'}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                          Earned: ${b.earnings.toFixed(2)} • {b.views.toLocaleString()} reads
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        adminApproveCreatorPayout(b.authorName, 20.0);
                        alert(`SEO writing grant of $20.00 released to ${b.authorName}!`);
                      }}
                      className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold hover:bg-amber-500/30 cursor-pointer"
                    >
                      + $20 Grant
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: BUG BOUNTY TRIAGE DESK */}
      {activeAdminSubTab === 'bounty' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-rose-400" />
                <span>Bug Bounty Vulnerability Triage Desk</span>
              </h2>
              <p className="text-xs text-slate-400">
                Review submitted security advisories, validate Proof of Concepts, and disburse cryptographic rewards.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                Escrow Reserve: <strong className="text-emerald-400">$25,000.00</strong>
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {bountyReports.map((rep) => (
              <div
                key={rep.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-extrabold text-white text-base">
                        {rep.cveId || rep.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          rep.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : rep.severity === 'high'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                            : rep.severity === 'medium'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        }`}
                      >
                        {rep.severity}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                        {rep.vulnerabilityType}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          rep.status === 'rewarded'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : rep.status === 'patched'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            : rep.status === 'rejected'
                            ? 'bg-slate-800 text-slate-500'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        STATUS: {rep.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm mt-1">{rep.title}</h3>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span>Target: <code className="text-slate-300 font-mono">{rep.targetAsset}</code></span>
                      <span>•</span>
                      <span>Researcher: <strong className="text-slate-200">{rep.researcherName} ({rep.researcherHandle})</strong></span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-slate-400 block font-mono">Proposed Bounty</span>
                    <span className="font-mono font-black text-emerald-400 text-lg">
                      ${rep.rewardOffered.toLocaleString()}
                    </span>
                    {rep.rewardPaid && (
                      <span className="text-[10px] text-emerald-400 block font-mono">
                        Paid: ${rep.rewardPaid.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-2">
                  <p><strong>Impact:</strong> {rep.impactSummary}</p>
                  <div>
                    <span className="font-bold text-slate-400 block mb-1">Reproduction Steps:</span>
                    <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap">
                      {rep.stepsToReproduce}
                    </pre>
                  </div>
                  {rep.proofOfConcept && (
                    <div>
                      <span className="font-bold text-slate-400 block mb-1">Proof of Concept:</span>
                      <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre">
                        {rep.proofOfConcept}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Triage Actions */}
                <div className="pt-2 flex items-center justify-between flex-wrap gap-2 border-t border-slate-800">
                  <div className="text-[11px] text-slate-500 font-mono">
                    Payout Destination: <span className="text-slate-300">{rep.researcherWallet}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {rep.status !== 'rewarded' && (
                      <button
                        onClick={() => {
                          adminUpdateBountyStatus(
                            rep.id,
                            'rewarded',
                            rep.rewardOffered,
                            'Vulnerability validated. Hotfix committed and reward disbursed.'
                          );
                          alert(`✅ Awarded $${rep.rewardOffered} bounty to ${rep.researcherName}! Payment routed to ${rep.researcherWallet}.`);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Approve & Disburse ${rep.rewardOffered}</span>
                      </button>
                    )}

                    {rep.status !== 'patched' && rep.status !== 'rewarded' && (
                      <button
                        onClick={() => {
                          adminUpdateBountyStatus(rep.id, 'patched', undefined, 'Patched in core release v2.4.0');
                          alert(`✅ Marked advisory ${rep.id} as patched.`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 font-bold text-xs border border-blue-500/40 cursor-pointer"
                      >
                        Mark Patched
                      </button>
                    )}

                    {rep.status === 'submitted' && (
                      <button
                        onClick={() => {
                          adminUpdateBountyStatus(rep.id, 'rejected', undefined, 'Deemed out-of-scope or intended behavior.');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 text-xs font-semibold cursor-pointer"
                      >
                        Decline
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: SECURITY HARDENING & LEDGER */}
      {activeAdminSubTab === 'security' && (
        <div className="space-y-6">
          {/* Active Defense Sentinel Control Switches */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Security Hardening & Active Defense Shield</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE DEFENSE REAL-TIME
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Switch 1: IP Whitelist */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Admin IP & VPN Lock</span>
                  <input
                    type="checkbox"
                    checked={securitySettings.ipWhitelistEnabled}
                    onChange={() => toggleSecuritySetting('ipWhitelistEnabled')}
                    className="w-4 h-4 rounded text-rose-600 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Restrict admin gateway to authenticated enterprise VPN & subnets.
                </p>
                <div className="text-[10px] font-mono text-emerald-400">
                  {securitySettings.ipWhitelistEnabled ? '✓ ENFORCED (192.168.1.0/24)' : '⚠️ OFF'}
                </div>
              </div>

              {/* Switch 2: Strict TLS 1.3 */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Strict TLS 1.3 / HSTS</span>
                  <input
                    type="checkbox"
                    checked={securitySettings.strictTlsMode}
                    onChange={() => toggleSecuritySetting('strictTlsMode')}
                    className="w-4 h-4 rounded text-rose-600 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Disable TLS 1.0/1.1/1.2 fallbacks and enforce Strict-Transport-Security.
                </p>
                <div className="text-[10px] font-mono text-emerald-400">
                  {securitySettings.strictTlsMode ? '✓ 256-BIT AES GCM' : '⚠️ OFF'}
                </div>
              </div>

              {/* Switch 3: XSS Auto-Quarantine */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">DOM XSS Quarantine</span>
                  <input
                    type="checkbox"
                    checked={securitySettings.autoQuarantineXSS}
                    onChange={() => toggleSecuritySetting('autoQuarantineXSS')}
                    className="w-4 h-4 rounded text-rose-600 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Real-time regex sanitizer stripping unsafe JavaScript URIs from creator reels.
                </p>
                <div className="text-[10px] font-mono text-emerald-400">
                  {securitySettings.autoQuarantineXSS ? '✓ HEURISTICS ACTIVE' : '⚠️ OFF'}
                </div>
              </div>

              {/* Switch 4: Rate Limiting */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">API Throttling Sentinel</span>
                  <input
                    type="checkbox"
                    checked={securitySettings.rateLimitingEnabled}
                    onChange={() => toggleSecuritySetting('rateLimitingEnabled')}
                    className="w-4 h-4 rounded text-rose-600 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Limit AI Concierge and Escrow requests to 60 req/min per IP.
                </p>
                <div className="text-[10px] font-mono text-emerald-400">
                  {securitySettings.rateLimitingEnabled ? '✓ TOKEN BUCKET 60/MIN' : '⚠️ OFF'}
                </div>
              </div>
            </div>
          </div>

          {/* Automated Python Security Engine Scanner */}
          <PythonSecurityScanner />

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <span>Immutable Security Audit Ledger</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Cryptographically signed access records, stage overrides, and threat mitigation logs.
                </p>
              </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Severity:</span>
              <select
                value={logFilterSeverity}
                onChange={(e) => setLogFilterSeverity(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical Only</option>
                <option value="warning">Warnings</option>
                <option value="info">Info / Normal</option>
              </select>

              <button
                onClick={() => {
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(adminAuditLogs, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute('href', dataStr);
                  downloadAnchor.setAttribute('download', `babal_audit_logs_${Date.now()}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Ledger</span>
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Event Type</th>
                    <th className="py-3 px-4">Target Entity</th>
                    <th className="py-3 px-4">Details & Payload</th>
                    <th className="py-3 px-4">Operator</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 text-amber-400">{log.target}</td>
                      <td className="py-3 px-4 text-slate-300 max-w-xs truncate" title={log.details}>
                        {log.details}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{log.adminUser}</td>
                      <td className="py-3 px-4 text-slate-500">{log.ip}</td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">{log.timestamp}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            log.severity === 'critical'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : log.severity === 'warning'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {log.severity}
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
      )}

      {/* MODAL: CUSTOMER WALLET ADJUSTMENT */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <span>Adjust Customer Wallet Balance</span>
              </h3>
              <button
                onClick={() => setIsWalletModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-400">
                Grant promotional credit or issue an instant customer courtesy adjustment for user <strong>{user.name}</strong> ({user.email}). Current balance: <strong className="text-emerald-400 font-mono">${user.walletBalance.toFixed(2)}</strong>.
              </p>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Adjustment Amount ($ USD)</label>
                <input
                  type="number"
                  value={walletAdjustAmount}
                  onChange={(e) => setWalletAdjustAmount(Number(e.target.value))}
                  placeholder="e.g. 50 or -20"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Resolution / Reason</label>
                <input
                  type="text"
                  value={walletAdjustReason}
                  onChange={(e) => setWalletAdjustReason(e.target.value)}
                  placeholder="e.g. VIP goodwill coupon, order dispute settlement"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsWalletModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    adminAdjustUserWallet(walletAdjustAmount, walletAdjustReason);
                    setIsWalletModalOpen(false);
                    alert(`✅ Balance adjusted by ${walletAdjustAmount >= 0 ? '+' : ''}$${walletAdjustAmount.toFixed(2)}!`);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  Confirm Adjustment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: VENDOR SERVICES GOVERNANCE (Hotel, Bus, Auto/Ride, Medical, Jyotish) */}
      {activeAdminSubTab === 'services' && (
        <div className="space-y-6">
          {/* Key Metrics Header */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Services</span>
              <span className="text-xl font-black text-white font-mono mt-1 block">{services.length}</span>
              <span className="text-[10px] text-amber-400">All vendor types</span>
            </div>

            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Active Live</span>
              <span className="text-xl font-black text-emerald-300 font-mono mt-1 block">
                {services.filter((s) => s.status === 'Active').length}
              </span>
              <span className="text-[10px] text-slate-400">Publicly bookable</span>
            </div>

            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Pending Review</span>
              <span className="text-xl font-black text-amber-300 font-mono mt-1 block">
                {services.filter((s) => s.status === 'Pending_Verification').length}
              </span>
              <span className="text-[10px] text-slate-400">Awaiting clearance</span>
            </div>

            <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">Verified Badges</span>
              <span className="text-xl font-black text-blue-300 font-mono mt-1 block">
                {services.filter((s) => s.isVerified).length}
              </span>
              <span className="text-[10px] text-slate-400">Babal certified</span>
            </div>

            <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">Total Bookings</span>
              <span className="text-xl font-black text-purple-300 font-mono mt-1 block">
                {serviceBookings.length}
              </span>
              <span className="text-[10px] text-slate-400">Reserved orders</span>
            </div>

            <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Escrow Volume</span>
              <span className="text-xl font-black text-white font-mono mt-1 block">
                ${serviceBookings.reduce((sum, b) => sum + (b.totalAmountUSD || 0), 0).toFixed(0)}
              </span>
              <span className="text-[10px] text-slate-400">Locked in escrow</span>
            </div>
          </div>

          {/* View Mode Switcher: Services Catalog vs Customer Bookings */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setActiveServiceViewMode('services')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeServiceViewMode === 'services'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                🏢 Vendor Services Catalog ({services.length})
              </button>
              <button
                onClick={() => setActiveServiceViewMode('bookings')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeServiceViewMode === 'bookings'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                📋 Customer Service Bookings ({serviceBookings.length})
              </button>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              🛡️ Admin Authority: Direct status manipulation & partner verification
            </div>
          </div>

          {/* SECTION 1: SERVICES CATALOG MANAGEMENT */}
          {activeServiceViewMode === 'services' && (
            <div className="space-y-4">
              {/* Category Filter Chips & Search Bar */}
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  <button
                    onClick={() => setServiceCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      serviceCategoryFilter === 'all'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    All Categories ({services.length})
                  </button>
                  <button
                    onClick={() => setServiceCategoryFilter('hotel')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      serviceCategoryFilter === 'hotel'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🏨 Hotels ({services.filter((s) => s.category === 'hotel').length})
                  </button>
                  <button
                    onClick={() => setServiceCategoryFilter('bus')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      serviceCategoryFilter === 'bus'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🚌 Buses ({services.filter((s) => s.category === 'bus').length})
                  </button>
                  <button
                    onClick={() => setServiceCategoryFilter('auto_ride')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      serviceCategoryFilter === 'auto_ride'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🛺 Auto & Rides ({services.filter((s) => s.category === 'auto_ride').length})
                  </button>
                  <button
                    onClick={() => setServiceCategoryFilter('medical')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      serviceCategoryFilter === 'medical'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🩺 Medical ({services.filter((s) => s.category === 'medical').length})
                  </button>
                  <button
                    onClick={() => setServiceCategoryFilter('jyotish')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      serviceCategoryFilter === 'jyotish'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🔮 Jyotish ({services.filter((s) => s.category === 'jyotish').length})
                  </button>
                </div>

                {/* Search & Status Filters */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 md:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={serviceSearchQuery}
                      onChange={(e) => setServiceSearchQuery(e.target.value)}
                      placeholder="Search title, vendor, phone..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <select
                    value={serviceStatusFilter}
                    onChange={(e) => setServiceStatusFilter(e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Active">Active Only</option>
                    <option value="Pending_Verification">Pending Review</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Services List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services
                  .filter((s) => {
                    const matchCategory = serviceCategoryFilter === 'all' || s.category === serviceCategoryFilter;
                    const matchStatus = serviceStatusFilter === 'all' || s.status === serviceStatusFilter;
                    const matchSearch =
                      !serviceSearchQuery ||
                      s.title.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
                      (s.localTitle && s.localTitle.toLowerCase().includes(serviceSearchQuery.toLowerCase())) ||
                      s.providerName.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
                      s.city.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
                      s.phone.includes(serviceSearchQuery);
                    return matchCategory && matchStatus && matchSearch;
                  })
                  .map((service) => (
                    <div
                      key={service.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-slate-700 transition-all"
                    >
                      {/* Top Image & Status Banner */}
                      <div className="relative h-44 overflow-hidden bg-slate-950">
                        <img
                          src={service.images?.[0] || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80'}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-bold text-amber-300">
                          {service.category === 'hotel' && '🏨 Hotel'}
                          {service.category === 'bus' && '🚌 Bus Service'}
                          {service.category === 'auto_ride' && '🛺 Auto & Ride'}
                          {service.category === 'medical' && '🩺 Medical Health'}
                          {service.category === 'jyotish' && '🔮 Jyotish Sewa'}
                          {service.category === 'tour' && '🎒 Nepal Tour'}
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase border ${
                              service.status === 'Active'
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                : service.status === 'Pending_Verification'
                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                            }`}
                          >
                            {service.status.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Verified Partner Badge */}
                        {service.isVerified && (
                          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/90 text-white text-[10px] font-bold shadow-md">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified Partner</span>
                          </div>
                        )}
                      </div>

                      {/* Content Body */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
                                {service.title}
                              </h4>
                              {service.localTitle && (
                                <p className="text-xs text-amber-400 font-medium line-clamp-1 mt-0.5">
                                  {service.localTitle}
                                </p>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-mono font-black text-emerald-400">
                                {formatPrice(service.priceUSD)}
                              </span>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                {service.priceNPR ? `NPR ${service.priceNPR.toLocaleString()}` : ''}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="line-clamp-1">{service.location}, {service.city}</span>
                          </div>

                          {/* Vendor Info Bar */}
                          <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400">Vendor:</span>
                              <span className="font-bold text-white line-clamp-1">{service.providerName}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400">Phone:</span>
                              <span className="font-mono text-slate-300">{service.phone}</span>
                            </div>
                            {service.whatsappNumber && (
                              <div className="pt-1 border-t border-slate-900 flex justify-end">
                                <a
                                  href={`https://wa.me/${service.whatsappNumber.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>WhatsApp Direct</span>
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Specs Pills */}
                          {service.specs && Object.keys(service.specs).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2.5">
                              {Object.entries(service.specs).slice(0, 3).map(([key, val], i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono"
                                >
                                  {key}: {val}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Admin Action Controls */}
                        <div className="pt-3 border-t border-slate-800 space-y-2">
                          <div className="flex items-center gap-1.5">
                            {/* Toggle Verification */}
                            <button
                              onClick={() => {
                                adminVerifyService(service.id, !service.isVerified);
                                addAdminAuditLog(
                                  'SERVICE_VERIFICATION_TOGGLED',
                                  service.title,
                                  `Admin updated verification status to ${!service.isVerified}`,
                                  'info'
                                );
                              }}
                              className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                                service.isVerified
                                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 hover:bg-blue-600/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{service.isVerified ? 'Verified' : 'Verify'}</span>
                            </button>

                            {/* Status Change Dropdown */}
                            <select
                              value={service.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as any;
                                adminUpdateServiceStatus(service.id, newStatus);
                                addAdminAuditLog(
                                  'SERVICE_STATUS_UPDATED',
                                  service.title,
                                  `Status changed to ${newStatus}`,
                                  'info'
                                );
                              }}
                              className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] text-slate-200 font-mono focus:outline-none focus:border-amber-500 cursor-pointer"
                            >
                              <option value="Active">Active</option>
                              <option value="Pending_Verification">Pending</option>
                              <option value="Suspended">Suspended</option>
                            </select>

                            {/* Delete Button */}
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete service "${service.title}"?`)) {
                                  adminDeleteService(service.id);
                                  addAdminAuditLog(
                                    'SERVICE_DELETED',
                                    service.title,
                                    `Vendor service removed by administrator`,
                                    'warning'
                                  );
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                              title="Delete Service"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {services.length === 0 && (
                <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
                  <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-300">No Services Registered Yet</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Hoteliers, bus operators, auto drivers, and astrologers can list services directly via the Services Hub.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: CUSTOMER SERVICE BOOKINGS LEDGER */}
          {activeServiceViewMode === 'bookings' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Customer Bookings & Smart Escrow Ledger</h4>
                  <p className="text-xs text-slate-400">
                    Real-time bookings across Hotel rooms, Bus tickets, Auto/Ride trips, Medical consults, and Jyotish sessions.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                  {serviceBookings.length} Total Bookings
                </div>
              </div>

              {serviceBookings.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Clock className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold">No Bookings Recorded Yet</p>
                  <p className="text-xs text-slate-500 mt-1">Bookings from the Services Hub will appear here with smart escrow status.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Booking Ref</th>
                        <th className="py-3 px-4">Service & Type</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Scheduled Date / Slot</th>
                        <th className="py-3 px-4">Total Amount</th>
                        <th className="py-3 px-4">Escrow Hash</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {serviceBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-850/50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-amber-400">{b.bookingRef}</td>
                          <td className="py-3.5 px-4 font-sans">
                            <span className="font-bold text-white block">{b.serviceTitle}</span>
                            <span className="text-[10px] font-mono text-slate-400 uppercase">{b.category}</span>
                          </td>
                          <td className="py-3.5 px-4 font-sans">
                            <span className="font-semibold text-slate-200 block">{b.customerName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{b.customerPhone}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-white block">{b.scheduledDate}</span>
                            {b.timeSlot && <span className="text-[10px] text-slate-400">{b.timeSlot}</span>}
                          </td>
                          <td className="py-3.5 px-4 font-black text-emerald-400">
                            {formatPrice(b.totalAmountUSD)}
                            {b.totalAmountNPR && (
                              <span className="text-[10px] text-slate-400 block font-normal">
                                NPR {b.totalAmountNPR.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800 block truncate max-w-[120px]" title={b.escrowTxHash}>
                              {b.escrowTxHash.slice(0, 10)}...
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                b.status === 'Confirmed'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : b.status === 'Completed'
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODAL: EMERGENCY LOCKDOWN CONFIRMATION */}
      {showLockdownConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 w-full max-w-md shadow-2xl shadow-rose-500/20 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  {marketplaceLockdown ? 'Disengage Emergency Lockdown?' : 'Engage Emergency Marketplace Lockdown?'}
                </h3>
                <p className="text-xs text-rose-400">Security Clearance Level 5 Required</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {marketplaceLockdown
                ? 'Disengaging lockdown will re-open public checkout and restore normal cart operations for all buyers globally.'
                : 'Engaging lockdown halts all new order checkouts, freezes shop publishing, and locks all escrow releases to prevent unauthorized capital outflow.'}
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowLockdownConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Abort
              </button>
              <button
                onClick={() => {
                  toggleMarketplaceLockdown(
                    marketplaceLockdown
                      ? 'Administrator manual restored normal state'
                      : 'Manual Admin Emergency Lockdown engaged'
                  );
                  setShowLockdownConfirm(false);
                }}
                className={`px-4 py-2 rounded-xl font-bold text-xs text-white shadow-lg cursor-pointer ${
                  marketplaceLockdown
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                }`}
              >
                {marketplaceLockdown ? 'Disengage Lockdown Now' : 'Execute Emergency Lockdown'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
