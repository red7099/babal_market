import React, { useState } from 'react';
import {
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Package,
  FileText,
  Navigation,
  Compass,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrderTrackingView: React.FC = () => {
  const {
    orders,
    selectedOrderId,
    setSelectedOrderId,
    advanceOrderStatus,
    setActiveTab,
  } = useApp();

  const [searchTrackingInput, setSearchTrackingInput] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Active or selected order
  const currentOrder =
    orders.find((o) => o.id === selectedOrderId || o.trackingNumber === selectedOrderId) ||
    orders[0];

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTrackingInput.trim().toUpperCase();
    if (!query) return;

    const found = orders.find(
      (o) => o.id.toUpperCase() === query || o.trackingNumber.toUpperCase().includes(query)
    );

    if (found) {
      setSelectedOrderId(found.id);
    } else {
      alert(`No order found matching "${query}". Try searching ${orders[0]?.id || 'BBL-9842-NP'}`);
    }
  };

  if (!currentOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fade-in">
        <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h2 className="font-heading font-black text-2xl text-white">No active orders yet</h2>
        <p className="text-xs text-slate-400 mt-2 mb-6">
          Place your first order in the marketplace to experience real-time GPS tracking.
        </p>
        <button
          onClick={() => setActiveTab('market')}
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Browse Marketplace
        </button>
      </div>
    );
  }

  const stagesList = [
    { key: 'placed', label: 'Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'packing', label: 'Packaging' },
    { key: 'in_transit', label: 'In Transit' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const currentStageIndex = stagesList.findIndex((s) => s.key === currentOrder.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header & Order Lookup */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Real-Time GPS Telematics Active</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            Live Order Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track multi-shop shipments from dispatch warehouse to doorstep with live satellite telemetry.
          </p>
        </div>

        {/* Tracking Input Search */}
        <form onSubmit={handleSearchOrder} className="flex items-center gap-2 max-w-md w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTrackingInput}
              onChange={(e) => setSearchTrackingInput(e.target.value)}
              placeholder="Search Order ID (e.g. BBL-9842-NP)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            Locate
          </button>
        </form>
      </div>

      {/* Order Tabs (if multiple orders exist) */}
      {orders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          <span className="text-xs text-slate-400 font-semibold flex-shrink-0">My Orders:</span>
          {orders.map((ord) => (
            <button
              key={ord.id}
              onClick={() => setSelectedOrderId(ord.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                ord.id === currentOrder.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {ord.id} • {ord.status.toUpperCase().replace('_', ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Main Order Status Summary Card */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-heading font-black text-2xl text-white">
                Order #{currentOrder.id}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase">
                {currentOrder.status.replace('_', ' ')}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Escrow Paid
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
              <span>Carrier: <strong className="text-slate-200">{currentOrder.carrier}</strong></span>
              <span>•</span>
              <span>Tracking Code: <strong className="font-mono text-amber-400">{currentOrder.trackingNumber}</strong></span>
              <span>•</span>
              <span>ETA: <strong className="text-emerald-400">{currentOrder.estimatedDelivery}</strong></span>
            </div>
          </div>

          {/* Action Simulator & Invoice Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>View Invoice</span>
            </button>

            {/* Stage Advance Simulator */}
            <button
              onClick={() => advanceOrderStatus(currentOrder.id)}
              disabled={currentOrder.status === 'delivered'}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50 transition-all"
              title="Simulate advance to next shipping stage"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {currentOrder.status === 'delivered' ? 'Order Completed' : 'Simulate Next Stage →'}
              </span>
            </button>
          </div>
        </div>

        {/* Visual Progress Stepper Bar */}
        <div className="py-8">
          <div className="relative">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0"></div>
            {/* Active Line */}
            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-amber-500 to-emerald-400 -translate-y-1/2 z-0 transition-all duration-700"
              style={{
                width: `${(Math.max(0, currentStageIndex) / (stagesList.length - 1)) * 100}%`,
              }}
            ></div>

            {/* Stepper Nodes */}
            <div className="relative z-10 flex items-center justify-between">
              {stagesList.map((stage, idx) => {
                const isCompleted = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={stage.key} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all duration-500 ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 scale-110 shadow-lg shadow-amber-500/30'
                          : isCompleted
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium hidden sm:block ${
                        isCurrent ? 'text-amber-400 font-bold' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Delivery OTP Security Badge */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white block">
                Secure Delivery Handshake (OTP)
              </span>
              <span className="text-slate-400">
                Share this 4-digit security code with the driver only when the parcel arrives at your door.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono">OTP:</span>
            <span className="font-mono font-black text-lg tracking-widest text-amber-400">
              {currentOrder.otpCode}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Live GPS Radar Map (Left) + Detailed Timeline & Line Items (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Simulated GPS Map Canvas */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h3 className="font-heading font-extrabold text-base text-white">
                Live Route & Vehicle Telematics
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              LAT {currentOrder.currentLocation.lat.toFixed(4)} • LNG {currentOrder.currentLocation.lng.toFixed(4)}
            </span>
          </div>

          {/* Map Simulation Container */}
          <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>

            {/* Curved Route Visual */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 300" fill="none">
              <path
                d="M 60 220 Q 200 80 440 120"
                stroke="#334155"
                strokeWidth="4"
                strokeDasharray="6 6"
              />
              <path
                d="M 60 220 Q 200 80 440 120"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray="200"
                strokeDashoffset={
                  currentOrder.status === 'delivered'
                    ? '0'
                    : currentOrder.status === 'out_for_delivery'
                    ? '50'
                    : currentOrder.status === 'in_transit'
                    ? '100'
                    : '180'
                }
                className="transition-all duration-1000"
              />
            </svg>

            {/* Origin Pin (Warehouse) */}
            <div className="absolute left-[50px] top-[205px] flex flex-col items-center">
              <div className="w-8 h-8 rounded-xl bg-blue-500/30 text-blue-400 border border-blue-500 flex items-center justify-center shadow-lg">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1">Origin Depot</span>
            </div>

            {/* Carrier Vehicle Pin */}
            <div
              className="absolute transition-all duration-1000 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
              style={{
                left:
                  currentOrder.status === 'delivered'
                    ? '440px'
                    : currentOrder.status === 'out_for_delivery'
                    ? '350px'
                    : currentOrder.status === 'in_transit'
                    ? '220px'
                    : '80px',
                top:
                  currentOrder.status === 'delivered'
                    ? '120px'
                    : currentOrder.status === 'out_for_delivery'
                    ? '95px'
                    : currentOrder.status === 'in_transit'
                    ? '130px'
                    : '210px',
              }}
            >
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/40">
                  <Truck className="w-6 h-6 animate-bounce" />
                </div>
                <div className="absolute -inset-1 rounded-2xl bg-amber-400/40 animate-ping pointer-events-none"></div>
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-slate-950/90 px-2 py-0.5 rounded-full mt-1 border border-amber-500/40 whitespace-nowrap shadow">
                Van #09 Active
              </span>
            </div>

            {/* Destination Pin (Customer) */}
            <div className="absolute right-[50px] top-[105px] flex flex-col items-center">
              <div className="w-8 h-8 rounded-xl bg-rose-500/30 text-rose-400 border border-rose-500 flex items-center justify-center shadow-lg">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1">Your Doorstep</span>
            </div>
          </div>

          {/* Live Telematics Readout */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Speed</span>
              <span className="font-mono font-bold text-white">68 km/h</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Cargo Temp</span>
              <span className="font-mono font-bold text-emerald-400">20.8°C Safe</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Current Waypoint</span>
              <span className="font-bold text-white truncate block">
                {currentOrder.currentLocation.city}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Fulfillment Hub</span>
              <span className="font-bold text-amber-400 truncate block">
                {currentOrder.currentLocation.hub}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Detailed Tracking Timeline & Order Line Items */}
        <div className="lg:col-span-5 space-y-6">
          {/* Timeline Feed */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
            <h3 className="font-heading font-extrabold text-base text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Milestone Audit Trail
            </h3>

            <div className="space-y-4">
              {currentOrder.timeline.map((step, idx) => (
                <div key={idx} className="flex gap-3 relative">
                  {/* Vertical line connecting steps */}
                  {idx < currentOrder.timeline.length - 1 && (
                    <div
                      className={`absolute left-3 top-6 bottom-0 w-0.5 ${
                        step.completed ? 'bg-emerald-500/50' : 'bg-slate-800'
                      }`}
                    ></div>
                  )}

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-xs ${
                      step.completed
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>

                  <div className="flex-1 pb-1">
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`font-bold ${
                          step.completed ? 'text-white' : 'text-slate-500'
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items in this Order */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
            <h3 className="font-heading font-extrabold text-base text-white mb-4">
              Order Items ({currentOrder.items.length})
            </h3>

            <div className="space-y-3">
              {currentOrder.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-800 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {item.product.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Sold by: {item.product.shopName}
                    </span>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300 mt-0.5">
                      <span>Qty: {item.quantity}</span>
                      <span className="text-emerald-400 font-bold">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 text-xs space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white">${currentOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono text-emerald-400">
                  {currentOrder.shippingFee === 0 ? 'FREE' : `$${currentOrder.shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800/80 font-bold text-sm text-white">
                <span>Total Paid</span>
                <span className="font-mono text-emerald-400">${currentOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="font-heading font-black text-xl text-white">
                  Babal Market Official Receipt
                </span>
                <span className="text-xs text-slate-400 block font-mono">Invoice #{currentOrder.id}</span>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Date:</span>
                <span className="text-white font-mono">{new Date(currentOrder.orderDate).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Method:</span>
                <span className="text-emerald-400 font-bold uppercase font-mono">
                  {currentOrder.paymentMethod.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping Recipient:</span>
                <span className="text-white">{currentOrder.shippingAddress.fullName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Destination Address:</span>
                <span className="text-white text-right">
                  {currentOrder.shippingAddress.street}, {currentOrder.shippingAddress.city}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 block">Items Purchased:</span>
                {currentOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300 text-xs">
                    <span className="truncate max-w-[250px]">{it.product.name} (x{it.quantity})</span>
                    <span className="font-mono">${(it.unitPrice * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between font-heading font-extrabold text-base text-white">
                <span>Total Amount Paid</span>
                <span className="text-emerald-400 font-mono">${currentOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                window.print();
              }}
              className="w-full mt-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Print / Save Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
