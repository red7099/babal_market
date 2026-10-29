import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Wallet,
  Smartphone,
  Calendar,
  Lock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  QrCode,
  DollarSign,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentGateway, ShippingAddress } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    user,
    createOrder,
    setActiveTab,
    setIsTopUpOpen,
    marketplaceLockdown,
  } = useApp();

  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('babal_pay');
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountCode, setDiscountCode] = useState('BABALVIP');

  // Credit Card state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8842');
  const [cardHolder, setCardHolder] = useState(user.name);
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('321');

  if (!isCheckoutOpen) return null;

  const currentAddress: ShippingAddress = user.savedAddresses[selectedAddressIndex] || {
    fullName: user.name,
    street: 'Thamel Marg, Block 4B',
    city: 'Kathmandu',
    stateOrProvince: 'Bagmati',
    postalCode: '44600',
    country: 'Nepal',
    phone: '+977 984-1234567',
  };

  const discountAmount = discountCode === 'BABALVIP' ? cartTotal * 0.15 : 0;
  const shippingFee = cartTotal >= 100 ? 0 : 15;
  const finalTotal = Math.max(0, cartTotal + shippingFee - discountAmount);

  const handleCompletePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const order = createOrder(selectedGateway, currentAddress, discountCode);
      setIsProcessing(false);

      if (order) {
        setIsCheckoutOpen(false);
        setActiveTab('orders');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsCheckoutOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 font-black">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-black text-2xl text-white">
                Babal Secure Checkout Portal
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit Escrow
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Select your preferred integrated payment gateway. All transactions are AI-fraud verified.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Left Column: Shipping & Payment Gateway Options (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Delivery Address */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                1. Delivery Destination
              </span>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-white block text-sm">{currentAddress.fullName}</span>
                  <span className="text-slate-400 block mt-0.5">
                    {currentAddress.street}, {currentAddress.city}, {currentAddress.stateOrProvince} {currentAddress.postalCode}
                  </span>
                  <span className="text-slate-500 block text-[11px] mt-1 font-mono">
                    Phone: {currentAddress.phone} • {currentAddress.country}
                  </span>
                </div>
                <span className="px-2 py-1 rounded-lg bg-slate-800 text-emerald-400 font-semibold text-[10px]">
                  Default
                </span>
              </div>
            </div>

            {/* Step 2: Integrated Payment Gateways */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                2. Choose Integrated Payment Gateway
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Gateway 1: Babal Pay */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('babal_pay')}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    selectedGateway === 'babal_pay'
                      ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {selectedGateway === 'babal_pay' && (
                    <span className="absolute top-3 right-3 text-amber-400">
                      <CheckCircle2 className="w-4 h-4 fill-current" />
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-1.5">
                    <Wallet className="w-4 h-4 text-amber-400" />
                    <span className="font-heading font-extrabold text-sm text-white">
                      Babal Pay Wallet
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Available Balance:{' '}
                    <strong className="text-emerald-400 font-mono">
                      ${user.walletBalance.toFixed(2)}
                    </strong>
                  </span>
                  <span className="text-[10px] text-amber-400/90 font-medium block mt-1">
                    ⚡ 1-Click Instant • Zero Fees • 2x Points
                  </span>
                </button>

                {/* Gateway 2: Credit / Debit Card */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('card')}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    selectedGateway === 'card'
                      ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {selectedGateway === 'card' && (
                    <span className="absolute top-3 right-3 text-amber-400">
                      <CheckCircle2 className="w-4 h-4 fill-current" />
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-1.5">
                    <CreditCard className="w-4 h-4 text-blue-400" />
                    <span className="font-heading font-extrabold text-sm text-white">
                      Credit / Debit Card
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Stripe 3D-Secure Engine
                  </span>
                  <span className="text-[10px] text-blue-400 font-medium block mt-1">
                    Visa, Mastercard, Amex, JCB
                  </span>
                </button>

                {/* Gateway 3: Apple / Google Pay */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('apple_pay')}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    selectedGateway === 'apple_pay'
                      ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {selectedGateway === 'apple_pay' && (
                    <span className="absolute top-3 right-3 text-amber-400">
                      <CheckCircle2 className="w-4 h-4 fill-current" />
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-1.5">
                    <Smartphone className="w-4 h-4 text-slate-200" />
                    <span className="font-heading font-extrabold text-sm text-white">
                      Apple / Google Pay
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Touch ID / Face ID 1-Tap
                  </span>
                  <span className="text-[10px] text-slate-300 font-medium block mt-1">
                    Instant Device Authorization
                  </span>
                </button>

                {/* Gateway 4: Buy Now Pay Later (Klarna / Affirm) */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('klarna')}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    selectedGateway === 'klarna'
                      ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {selectedGateway === 'klarna' && (
                    <span className="absolute top-3 right-3 text-amber-400">
                      <CheckCircle2 className="w-4 h-4 fill-current" />
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-1.5">
                    <Calendar className="w-4 h-4 text-pink-400" />
                    <span className="font-heading font-extrabold text-sm text-white">
                      Pay in 4 (Klarna / Affirm)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block font-mono">
                    4 x ${(finalTotal / 4).toFixed(2)} / bi-weekly
                  </span>
                  <span className="text-[10px] text-pink-400 font-medium block mt-1">
                    0% APR Interest-Free
                  </span>
                </button>

                {/* Gateway 5: Crypto Escrow */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('crypto')}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    selectedGateway === 'crypto'
                      ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {selectedGateway === 'crypto' && (
                    <span className="absolute top-3 right-3 text-amber-400">
                      <CheckCircle2 className="w-4 h-4 fill-current" />
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-1.5">
                    <QrCode className="w-4 h-4 text-purple-400" />
                    <span className="font-heading font-extrabold text-sm text-white">
                      Crypto Web3 Escrow
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    USDC, SOL, ETH Supported
                  </span>
                  <span className="text-[10px] text-purple-400 font-medium block mt-1">
                    Smart Contract Protected
                  </span>
                </button>

                {/* Gateway 6: Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('cod')}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    selectedGateway === 'cod'
                      ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {selectedGateway === 'cod' && (
                    <span className="absolute top-3 right-3 text-amber-400">
                      <CheckCircle2 className="w-4 h-4 fill-current" />
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-1.5">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span className="font-heading font-extrabold text-sm text-white">
                      Cash on Delivery (COD)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Pay driver at doorstep
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium block mt-1">
                    Secured by 4-digit OTP
                  </span>
                </button>
              </div>
            </div>

            {/* Interactive Gateway Specific Preview Sub-panels */}
            {selectedGateway === 'card' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white block">Enter Card Details</span>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card Number"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="password"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="CVC"
                    maxLength={4}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {selectedGateway === 'babal_pay' && user.walletBalance < finalTotal && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-rose-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Wallet balance (${user.walletBalance.toFixed(2)}) is lower than total due.</span>
                </div>
                <button
                  onClick={() => setIsTopUpOpen(true)}
                  className="px-3 py-1 rounded-lg bg-rose-500 text-white font-bold text-xs"
                >
                  Top Up Now
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Pay Action (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-base text-white mb-4">
                Order Review ({cart.length} items)
              </h3>

              {/* Items summary */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1 pb-3 border-b border-slate-800">
                {cart.map((c) => (
                  <div key={c.productId} className="flex items-center gap-3 text-xs">
                    <img
                      src={c.product.images[0]}
                      alt={c.product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-white block truncate">{c.product.name}</span>
                      <span className="text-slate-400 text-[11px]">
                        Qty: {c.quantity} • ${c.product.price.toFixed(2)}
                      </span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">
                      ${(c.product.price * c.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Summary */}
              <div className="space-y-2 text-xs text-slate-400 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">${cartTotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>VIP Promo (15%)</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Air Shipping</span>
                  <span className="font-mono text-white">
                    {shippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-800 font-heading font-black text-xl text-white">
                  <span>Total Due</span>
                  <span className="text-emerald-400 font-mono">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* AI Fraud Shield Meter */}
              <div className="mt-5 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    AI Fraud Shield Risk Scan
                  </span>
                  <span className="text-emerald-400">0.02% (Ultra-Safe)</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[99%] h-full bg-emerald-500 rounded-full"></div>
                </div>
                <span className="block text-[10px] text-slate-500">
                  Full buyer protection & escrow release upon verified delivery OTP.
                </span>
              </div>
            </div>

            {/* Lockdown or Submit Action */}
            <div className="pt-6">
              {marketplaceLockdown ? (
                <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center space-y-1">
                  <p className="font-bold">🚨 Marketplace is Currently in Admin Emergency Lockdown</p>
                  <p className="text-[11px] text-slate-400">
                    Order placement and gateway authorization are temporarily paused for maintenance. Please check back shortly or contact admin.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleCompletePayment}
                  disabled={isProcessing || (selectedGateway === 'babal_pay' && user.walletBalance < finalTotal)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Authenticating Gateway & Escrow...</span>
                  ) : (
                    <>
                      <span>Pay ${finalTotal.toFixed(2)} & Track Live</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
