import React, { useState, useMemo } from 'react';
import {
  Boxes,
  AlertTriangle,
  Download,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  RefreshCw,
  Building2,
  DollarSign,
  PackageCheck,
  CheckCircle2,
  Sliders,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GlobalInventoryView: React.FC = () => {
  const { products, batchRestock, updateProductPrice, updateProductStock } = useApp();

  const [search, setSearch] = useState('');
  const [selectedHub, setSelectedHub] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [recentActionMessage, setRecentActionMessage] = useState<string | null>(null);

  // Derived KPI metrics
  const totalSkus = products.length;
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValuation = products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.reorderThreshold).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  // Extract unique warehouses
  const warehouses = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.warehouseLocation)));
    return ['All', ...list];
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedHub !== 'All' && p.warehouseLocation !== selectedHub) return false;
      if (stockFilter === 'low' && (p.stock > p.reorderThreshold || p.stock === 0)) return false;
      if (stockFilter === 'out' && p.stock > 0) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.shopName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, selectedHub, stockFilter, search]);

  const notify = (msg: string) => {
    setRecentActionMessage(msg);
    setTimeout(() => setRecentActionMessage(null), 3500);
  };

  // Restock handler
  const handleRestock = (productId: string, productName: string, amount: number) => {
    batchRestock(productId, amount);
    notify(`✅ Restocked +${amount} units for "${productName}"`);
  };

  // Bulk Auto-Reorder simulation for all low items
  const handleAutoReorderAll = () => {
    let count = 0;
    products.forEach((p) => {
      if (p.stock <= p.reorderThreshold) {
        batchRestock(p.id, 25);
        count++;
      }
    });
    notify(`⚡ Auto-replenished 25 units each to ${count} low-stock SKUs`);
  };

  // Bulk discount or adjustment
  const handleBulkPriceAdjustment = (multiplier: number, label: string) => {
    products.forEach((p) => {
      const newPrice = Math.round(p.price * multiplier * 100) / 100;
      updateProductPrice(p.id, newPrice);
    });
    notify(`⚡ Applied ${label} across all ${products.length} products`);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['SKU', 'Product Name', 'Shop', 'Category', 'Price ($)', 'Current Stock', 'Reorder Threshold', 'Warehouse Hub', 'Supplier'];
    const rows = products.map((p) => [
      `"${p.sku}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.shopName}"`,
      `"${p.category}"`,
      p.price.toFixed(2),
      p.stock,
      p.reorderThreshold,
      `"${p.warehouseLocation}"`,
      `"${p.supplier}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `babal_inventory_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('📥 Exported inventory audit CSV successfully');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Global Inventory Tab Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold mb-2">
            <Boxes className="w-3.5 h-3.5" /> Babal Global Inventory Command Center
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            Multi-Warehouse Inventory Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time multi-depot stock monitoring, automated reordering thresholds, and SKU telemetry.
          </p>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleAutoReorderAll}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Auto-Replenish Low SKUs</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Audit</span>
          </button>
        </div>
      </div>

      {/* Floating Action Feedback Pill */}
      {recentActionMessage && (
        <div className="mb-6 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{recentActionMessage}</span>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 text-xs block mb-1">Tracked SKUs</span>
          <div className="font-heading font-black text-2xl text-white">{totalSkus}</div>
          <span className="text-[11px] text-blue-400">Cross-merchant items</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 text-xs block mb-1">Total Stock Units</span>
          <div className="font-heading font-black text-2xl text-white">
            {totalUnits.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-400">Available to dispatch</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 text-xs block mb-1">Global Valuation</span>
          <div className="font-heading font-black text-2xl text-emerald-400 font-mono">
            ${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500">Wholesale & retail pool</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 text-xs block mb-1">Low Stock Alerts</span>
          <div className={`font-heading font-black text-2xl ${lowStockCount > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
            {lowStockCount}
          </div>
          <span className="text-[11px] text-amber-400/80">Threshold triggered</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 col-span-2 lg:col-span-1">
          <span className="text-slate-400 text-xs block mb-1">Out of Stock</span>
          <div className={`font-heading font-black text-2xl ${outOfStockCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {outOfStockCount}
          </div>
          <span className="text-[11px] text-slate-500">Requires restocking</span>
        </div>
      </div>

      {/* Filter and Command Toolbar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU code, product, shop, or supplier..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Warehouse Dropdown & Stock status filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Warehouse Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={selectedHub}
              onChange={(e) => setSelectedHub(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              {warehouses.map((wh) => (
                <option key={wh} value={wh} className="bg-slate-900 text-slate-200">
                  {wh}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter Pills */}
          <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setStockFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                stockFilter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setStockFilter('low')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                stockFilter === 'low' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Low Stock ({lowStockCount})
            </button>
            <button
              onClick={() => setStockFilter('out')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                stockFilter === 'out' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Depleted ({outOfStockCount})
            </button>
          </div>

          {/* Bulk Price Modifiers */}
          <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-slate-800">
            <button
              onClick={() => handleBulkPriceAdjustment(0.9, '-10% Flash Promo')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono font-bold flex items-center gap-1"
              title="Apply -10% promo to all items"
            >
              <TrendingDown className="w-3 h-3 text-rose-400" /> -10% Promo
            </button>
            <button
              onClick={() => handleBulkPriceAdjustment(1.05, '+5% Price Adjustment')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono font-bold flex items-center gap-1"
              title="Apply +5% inflation adjustment"
            >
              <TrendingUp className="w-3 h-3 text-emerald-400" /> +5% Adj
            </button>
          </div>
        </div>
      </div>

      {/* Main Inventory Telematics Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-4 pl-6">Item / SKU</th>
                <th className="py-4">Merchant Shop</th>
                <th className="py-4">Warehouse Hub</th>
                <th className="py-4">Unit Price</th>
                <th className="py-4">Live Stock</th>
                <th className="py-4">Threshold</th>
                <th className="py-4">Stock Status</th>
                <th className="py-4 pr-6 text-right">Quick Restock Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((p) => {
                const isCritical = p.stock <= p.reorderThreshold && p.stock > 0;
                const isDepleted = p.stock === 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-850/60 transition-colors">
                    {/* Item & SKU */}
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-11 h-11 rounded-xl object-cover bg-slate-800 border border-slate-800 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-white block truncate max-w-xs sm:max-w-sm">
                            {p.name}
                          </span>
                          <span className="font-mono text-[11px] text-amber-400">
                            {p.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Merchant Shop */}
                    <td className="py-4 text-slate-300 font-medium">
                      {p.shopName}
                    </td>

                    {/* Warehouse Hub */}
                    <td className="py-4 text-slate-400">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                        <Building2 className="w-3 h-3 text-blue-400" />
                        {p.warehouseLocation}
                      </span>
                    </td>

                    {/* Unit Price */}
                    <td className="py-4 font-mono font-bold text-emerald-400">
                      ${p.price.toFixed(2)}
                    </td>

                    {/* Live Stock Units */}
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-sm font-extrabold ${
                          isDepleted ? 'text-rose-400' : isCritical ? 'text-amber-400' : 'text-white'
                        }`}>
                          {p.stock} units
                        </span>
                      </div>
                    </td>

                    {/* Reorder Threshold */}
                    <td className="py-4 font-mono text-slate-400 text-[11px]">
                      Min: {p.reorderThreshold}
                    </td>

                    {/* Stock Status Pill */}
                    <td className="py-4">
                      {isDepleted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
                          <AlertTriangle className="w-3 h-3" /> Out of Stock
                        </span>
                      ) : isCritical ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Optimal
                        </span>
                      )}
                    </td>

                    {/* Quick Restock Buttons */}
                    <td className="py-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleRestock(p.id, p.name, 10)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-[11px] border border-slate-700 transition-colors"
                          title="Restock 10 units"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleRestock(p.id, p.name, 50)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-[11px] border border-slate-700 transition-colors"
                          title="Restock 50 units"
                        >
                          +50
                        </button>
                        <button
                          onClick={() => handleRestock(p.id, p.name, 100)}
                          className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 font-mono font-bold text-[11px] border border-blue-500/40 transition-colors"
                          title="Batch Restock 100 units"
                        >
                          +100
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
