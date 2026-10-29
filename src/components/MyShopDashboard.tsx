import React, { useState, useRef } from 'react';
import {
  Store,
  Plus,
  Sparkles,
  Boxes,
  DollarSign,
  TrendingUp,
  Package,
  Layers,
  Check,
  Loader2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Camera,
  Smartphone,
  Cpu,
  CheckCircle2,
  X,
  Sliders,
  PlusCircle,
  Tag,
  Radio,
  Eye,
  Star,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, ProductOption, PhoneSpecs } from '../types';

export const MyShopDashboard: React.FC = () => {
  const {
    shops,
    products,
    user,
    addProductToShop,
    updateProductStock,
    updateProductPrice,
    setSelectedShopId,
    setActiveTab,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find user's shop
  const myShop = shops.find((s) => s.id === user.userShopId);

  // Filter products belonging to this shop
  const myProducts = products.filter((p) => p.shopId === myShop?.id);

  // Total sales/stock stats
  const totalStock = myProducts.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = myProducts.reduce((sum, p) => sum + p.price * p.stock, 0);

  // AI Product Generator form states
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generated product state
  const [productName, setProductName] = useState('');
  const [productTagline, setProductTagline] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState('49.99');
  const [productCategory, setProductCategory] = useState('Phones & Mobile Devices');
  const [productStock, setProductStock] = useState('25');
  const [productSku, setProductSku] = useState(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [warehouseLocation, setWarehouseLocation] = useState('Kathmandu Central Depot - Secure Vault');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
  );
  const [productSpecs, setProductSpecs] = useState<{ label: string; value: string }[]>([
    { label: 'Craftsmanship', value: 'Original Certified' },
    { label: 'Warranty', value: '1 Year Babal Care' },
  ]);

  // Multi-Photo Gallery Upload State
  const [galleryImages, setGalleryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
  ]);
  const [urlInput, setUrlInput] = useState('');

  // Product Options State (Vendor Customization)
  const [selectedColors, setSelectedColors] = useState<string[]>([
    'Desert Titanium',
    'Natural Titanium',
    'Black Titanium',
  ]);
  const [colorInput, setColorInput] = useState('');
  const [selectedStorages, setSelectedStorages] = useState<string[]>(['128GB', '256GB', '512GB']);
  const [selectedRams, setSelectedRams] = useState<string[]>(['8GB', '12GB']);
  const [customOptions, setCustomOptions] = useState<{ name: string; values: string[] }[]>([]);
  const [customOptName, setCustomOptName] = useState('');
  const [customOptValues, setCustomOptValues] = useState('');

  // Phone Category Specifics State
  const [phoneBrand, setPhoneBrand] = useState('Apple');
  const [phoneModel, setPhoneModel] = useState('iPhone 16 Pro Max');
  const [phoneCondition, setPhoneCondition] = useState<
    'Brand New' | 'Like New (Unboxed)' | 'Refurbished' | 'Fair Condition'
  >('Brand New');
  const [phoneBatteryHealth, setPhoneBatteryHealth] = useState('100% (High Endurance)');
  const [phoneSimType, setPhoneSimType] = useState('Dual SIM (Physical nano-SIM + eSIM)');
  const [phoneCamera, setPhoneCamera] = useState('48MP Fusion + 48MP Ultra-Wide + 5x Optical Zoom');
  const [phoneWarrantyMonths, setPhoneWarrantyMonths] = useState(12);
  const [phoneNtaApproved, setPhoneNtaApproved] = useState(true);

  // File Upload Handler (phone/computer gallery)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setGalleryImages((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    setGalleryImages((prev) => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetCoverImage = (index: number) => {
    setGalleryImages((prev) => {
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [target, ...rest];
    });
  };

  const handleAddColor = () => {
    if (!colorInput.trim()) return;
    if (!selectedColors.includes(colorInput.trim())) {
      setSelectedColors((prev) => [...prev, colorInput.trim()]);
    }
    setColorInput('');
  };

  const handleRemoveColor = (col: string) => {
    setSelectedColors((prev) => prev.filter((c) => c !== col));
  };

  const toggleStorage = (size: string) => {
    setSelectedStorages((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleRam = (size: string) => {
    setSelectedRams((prev) =>
      prev.includes(size) ? prev.filter((r) => r !== size) : [...prev, size]
    );
  };

  const handleAddCustomOption = () => {
    if (!customOptName.trim() || !customOptValues.trim()) return;
    const values = customOptValues
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    if (values.length === 0) return;

    setCustomOptions((prev) => [...prev, { name: customOptName.trim(), values }]);
    setCustomOptName('');
    setCustomOptValues('');
  };

  const handleRemoveCustomOption = (index: number) => {
    setCustomOptions((prev) => prev.filter((_, i) => i !== index));
  };

  if (!myShop) return null;

  // Call Server-side Gemini AI for product generation
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai-product-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          category: productCategory,
          targetPrice: productPrice,
        }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();

      if (data.data) {
        setProductName(data.data.name || productName);
        setProductTagline(data.data.tagline || productTagline);
        setProductDesc(data.data.description || productDesc);
        if (data.data.suggestedPrice) {
          setProductPrice(data.data.suggestedPrice.toString());
        }
        if (data.data.category) {
          setProductCategory(data.data.category);
        }
        if (data.data.specs && Array.isArray(data.data.specs)) {
          setProductSpecs(data.data.specs);
        }
      }
    } catch (err) {
      console.error('Error generating product with AI:', err);
      // Fallback
      setProductName(`Handcrafted ${aiPrompt}`);
      setProductTagline('Ethically sourced and meticulously crafted for supreme elegance.');
      setProductDesc(
        `Discover our premium ${aiPrompt}. Every single piece undergoes extensive artisanal scrutiny and is hand-finished to ensure lasting satisfaction for buyers around the globe.`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !productPrice) return;

    // Construct options
    const optionsToSave: ProductOption[] = [];
    if (selectedColors.length > 0) {
      optionsToSave.push({ name: 'Color', values: selectedColors });
    }
    if (selectedStorages.length > 0) {
      optionsToSave.push({ name: 'Storage', values: selectedStorages });
    }
    if (selectedRams.length > 0) {
      optionsToSave.push({ name: 'RAM', values: selectedRams });
    }
    customOptions.forEach((co) => {
      optionsToSave.push(co);
    });

    // Construct phoneSpecs if category is Phones & Mobile Devices
    let phoneSpecsToSave: PhoneSpecs | undefined = undefined;
    if (productCategory === 'Phones & Mobile Devices') {
      phoneSpecsToSave = {
        brand: phoneBrand,
        model: phoneModel.trim() || productName.trim(),
        storage: selectedStorages[0] || '256GB',
        ram: selectedRams[0] || '8GB',
        condition: phoneCondition,
        batteryHealth: phoneBatteryHealth,
        simType: phoneSimType,
        camera: phoneCamera,
        warrantyMonths: phoneWarrantyMonths,
        network: '5G Global VoLTE',
        nepalNTAApproved: phoneNtaApproved,
        imeiStatus: phoneNtaApproved ? 'Registered on NTA MDMS' : 'Pending Verification',
        colorVariants: selectedColors,
      };
    }

    const imagesToSave = galleryImages.length > 0 ? galleryImages : [imageUrl];

    addProductToShop({
      name: productName.trim(),
      tagline: productTagline.trim() || 'Verified quality listing on Babal Market',
      description: productDesc.trim() || 'High quality item from our Babal verified store.',
      price: parseFloat(productPrice) || 29.99,
      category: productCategory,
      subCategory: productCategory === 'Phones & Mobile Devices' ? 'Flagship 5G' : 'All',
      images: imagesToSave,
      shopId: myShop.id,
      shopName: myShop.name,
      shopLogo: myShop.avatar,
      shopVerified: myShop.isVerified,
      stock: parseInt(productStock, 10) || 10,
      sku: productSku || `SKU-${Date.now().toString().slice(-4)}`,
      warehouseLocation,
      reorderThreshold: 5,
      supplier: myShop.name,
      tags:
        productCategory === 'Phones & Mobile Devices'
          ? ['Smartphone', phoneBrand, '5G', phoneNtaApproved ? 'NTA_Approved' : 'Verified']
          : ['NewArrival', 'ArtisanChoice'],
      specs: productSpecs,
      options: optionsToSave.length > 0 ? optionsToSave : undefined,
      phoneSpecs: phoneSpecsToSave,
      approvalStatus: 'approved',
      vendorVerified: true,
      featured: true,
    });

    // Reset form
    setAiPrompt('');
    setProductName('');
    setProductTagline('');
    setProductDesc('');
    setIsAddingProduct(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Studio Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-6 sm:p-8 mb-8">
        <div className="absolute inset-0 opacity-20">
          <img src={myShop.banner} alt="Banner" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-950 shadow-xl">
              <img src={myShop.avatar} alt={myShop.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-2xl text-white">
                  {myShop.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Studio
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="font-mono text-amber-400">{myShop.handle}</span>
                <span>•</span>
                <span>{myShop.location}</span>
                <span>•</span>
                <span>{myProducts.length} Active Listings</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setSelectedShopId(myShop.id);
                setActiveTab('shops');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Public Storefront
            </button>

            <button
              onClick={() => setIsAddingProduct(!isAddingProduct)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingProduct ? 'Close Creator' : 'Add Product with AI'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Store Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-heading font-black text-2xl text-white">
            ${myShop.totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Zero transaction fees on Babal Pay
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Orders Fulfilled</span>
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-heading font-black text-2xl text-white">
            {myShop.totalSales}
          </div>
          <span className="text-[11px] text-blue-400 mt-1 block">
            100% on-time dispatch rate
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Inventory in Stock</span>
            <Boxes className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-heading font-black text-2xl text-white">
            {totalStock} units
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Value: ${totalValue.toFixed(2)}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Shop Rating</span>
            <Store className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-heading font-black text-2xl text-amber-400">
            {myShop.rating.toFixed(1)} ★
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {myShop.followerCount} loyal followers
          </span>
        </div>
      </div>

      {/* AI Product Creator Section (Expanded) */}
      {isAddingProduct && (
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-amber-500/50 shadow-2xl relative">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <h2 className="font-heading font-extrabold text-xl text-white">
                AI Product Listing Generator
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Powered by Google Gemini 3.8 Flash
            </span>
          </div>

          {/* AI Generator Input Bar */}
          <div className="p-4 rounded-2xl bg-violet-950/20 border border-violet-800/40 mb-6">
            <label className="block text-xs font-bold text-violet-300 mb-2">
              Describe your product in simple words:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Handmade copper water carafe with hand-hammered mandala engravings"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={isGenerating || !aiPrompt.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-violet-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Writing Copy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Generate Listing with AI</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-violet-400">
              <span>Quick ideas:</span>
              <button
                type="button"
                onClick={() => setAiPrompt('Pure Pashmina Shawl with natural botanical dye')}
                className="underline hover:text-white"
              >
                Pashmina Shawl
              </button>
              •
              <button
                type="button"
                onClick={() => setAiPrompt('Ergonomic Walnut Wood Monitor Stand with wireless charger')}
                className="underline hover:text-white"
              >
                Walnut Monitor Stand
              </button>
              •
              <button
                type="button"
                onClick={() => setAiPrompt('Single-Origin Himalayan Arabica Coffee Beans dark roast')}
                className="underline hover:text-white"
              >
                Himalayan Coffee
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handlePublishProduct} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Catchy product title"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Tagline / Punchline
                </label>
                <input
                  type="text"
                  value={productTagline}
                  onChange={(e) => setProductTagline(e.target.value)}
                  placeholder="Brief one-line sales punch"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Product Sales Copy & Craft Story
              </label>
              <textarea
                rows={3}
                value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
                placeholder="High-converting product description..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-mono text-emerald-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="Phones & Mobile Devices">📱 Phones & Mobile Devices (स्मार्टफोन)</option>
                  <option value="Tech & Gadgets">💻 Tech & Gadgets</option>
                  <option value="Artisan & Handmade">🎨 Artisan & Handmade</option>
                  <option value="Fashion & Apparel">👕 Fashion & Apparel</option>
                  <option value="Organic & Wellness">🌿 Organic & Wellness</option>
                  <option value="Home & Living">🏠 Home & Living</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Initial Stock
                </label>
                <input
                  type="number"
                  value={productStock}
                  onChange={(e) => setProductStock(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Warehouse Depot
                </label>
                <input
                  type="text"
                  value={warehouseLocation}
                  onChange={(e) => setWarehouseLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* DEDICATED PHONE CATEGORY SPECIFICATIONS BUILDER */}
            {productCategory === 'Phones & Mobile Devices' && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/40 border-2 border-cyan-500/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-cyan-800/40 pb-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h3 className="font-heading font-extrabold text-sm text-white flex items-center gap-1.5">
                        <span>Smartphone Specifications & NTA MDMS Registry</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                          Nepal Telecom Compliant
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Official hardware details for verified buyer trust and IMEI registration.
                      </p>
                    </div>
                  </div>
                  <span className="text-xl">🇳🇵</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Brand</label>
                    <select
                      value={phoneBrand}
                      onChange={(e) => setPhoneBrand(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Apple">Apple iPhone</option>
                      <option value="Samsung">Samsung Galaxy</option>
                      <option value="Xiaomi">Xiaomi / Redmi</option>
                      <option value="OnePlus">OnePlus</option>
                      <option value="Google Pixel">Google Pixel</option>
                      <option value="Nothing">Nothing Phone</option>
                      <option value="Vivo">Vivo</option>
                      <option value="Realme">Realme</option>
                      <option value="Other">Other Brand</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Model Name</label>
                    <input
                      type="text"
                      value={phoneModel}
                      onChange={(e) => setPhoneModel(e.target.value)}
                      placeholder="e.g. iPhone 16 Pro Max / Galaxy S25"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Condition</label>
                    <select
                      value={phoneCondition}
                      onChange={(e: any) => setPhoneCondition(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Brand New">Brand New (Factory Sealed)</option>
                      <option value="Like New (Unboxed)">Like New (Unboxed / Demo)</option>
                      <option value="Refurbished">Refurbished Grade A (Tested 100%)</option>
                      <option value="Fair Condition">Fair Condition (Pre-owned)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Battery Health / Capacity
                    </label>
                    <input
                      type="text"
                      value={phoneBatteryHealth}
                      onChange={(e) => setPhoneBatteryHealth(e.target.value)}
                      placeholder="e.g. 100% or 5,000 mAh"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">SIM Configuration</label>
                    <select
                      value={phoneSimType}
                      onChange={(e) => setPhoneSimType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Dual SIM (Physical nano-SIM + eSIM)">Dual SIM (nano-SIM + eSIM)</option>
                      <option value="Physical Dual SIM">Physical Dual SIM</option>
                      <option value="eSIM Only">Dual eSIM Only</option>
                      <option value="Single SIM">Single SIM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Official Warranty (Months)
                    </label>
                    <input
                      type="number"
                      value={phoneWarrantyMonths}
                      onChange={(e) => setPhoneWarrantyMonths(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                {/* Nepal NTA MDMS Verification Checkbox */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-800/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="ntaApprovedCheck"
                      checked={phoneNtaApproved}
                      onChange={(e) => setPhoneNtaApproved(e.target.checked)}
                      className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-slate-700 cursor-pointer"
                    />
                    <label htmlFor="ntaApprovedCheck" className="cursor-pointer">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Nepal Telecommunications Authority (NTA MDMS) Verified</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Device IMEI is registered on NTA MDMS system for uninterrupted NTC / Ncell / SmartCell SIM operations.
                      </div>
                    </label>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                    {phoneNtaApproved ? 'Verified NTA MDMS' : 'Unregistered'}
                  </span>
                </div>
              </div>
            )}

            {/* PRODUCT OPTIONS & VARIANTS BUILDER */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <h3 className="font-heading font-extrabold text-sm text-white">
                    Product Options & Customer Variants (रंग, स्टोरेज, भेरियन्ट)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  Customers can select these options on product detail
                </span>
              </div>

              {/* Color Options */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Color Variants (रंगहरू):
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {selectedColors.map((color) => (
                    <span
                      key={color}
                      className="px-2.5 py-1 rounded-full bg-slate-900 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                      <span>{color}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        className="text-slate-400 hover:text-rose-400 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    placeholder="Add color variant (e.g. Titanium Blue, Natural Silver)"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddColor();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 cursor-pointer"
                  >
                    + Add Color
                  </button>
                </div>
              </div>

              {/* Storage Capacities */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Storage Capacities (स्टोरेज क्षमता):
                </label>
                <div className="flex flex-wrap gap-2">
                  {['128GB', '256GB', '512GB', '1TB'].map((cap) => {
                    const isChecked = selectedStorages.includes(cap);
                    return (
                      <button
                        type="button"
                        key={cap}
                        onClick={() => toggleStorage(cap)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition-all border cursor-pointer ${
                          isChecked
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm shadow-amber-500/20'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {isChecked ? `✓ ${cap}` : `+ ${cap}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RAM Capacities */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  RAM Memory Variants (र्‍याम):
                </label>
                <div className="flex flex-wrap gap-2">
                  {['6GB', '8GB', '12GB', '16GB', '24GB'].map((ram) => {
                    const isChecked = selectedRams.includes(ram);
                    return (
                      <button
                        type="button"
                        key={ram}
                        onClick={() => toggleRam(ram)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition-all border cursor-pointer ${
                          isChecked
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm shadow-cyan-500/20'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {isChecked ? `✓ ${ram}` : `+ ${ram}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Options List */}
              {customOptions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-300">Custom Options:</span>
                  {customOptions.map((co, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-amber-300">{co.name}: </span>
                        <span className="text-slate-300">{co.values.join(', ')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomOption(idx)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Custom Option Row */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <input
                  type="text"
                  value={customOptName}
                  onChange={(e) => setCustomOptName(e.target.value)}
                  placeholder="Option Name (e.g. Size or Edition)"
                  className="w-full sm:w-1/3 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  value={customOptValues}
                  onChange={(e) => setCustomOptValues(e.target.value)}
                  placeholder="Comma-separated values (e.g. Standard, Pro, Special Edition)"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomOption}
                  className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer"
                >
                  + Add Custom Option
                </button>
              </div>
            </div>

            {/* IMPROVED PRODUCT PHOTO GALLERY UPLOAD */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-heading font-extrabold text-sm text-white">
                    Multi-Photo Gallery & Phone Upload (तस्बिर ग्यालेरी)
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {/* Real File Input (triggers phone or computer file/camera picker) */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Phone Gallery</span>
                  </button>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-slate-800 bg-slate-900"
                  >
                    <img src={img} alt="Product" className="w-full h-full object-cover" />

                    {/* Cover Photo Badge */}
                    {idx === 0 ? (
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow">
                        Cover Photo
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetCoverImage(idx)}
                        className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-slate-950/80 text-amber-300 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Set Cover
                      </button>
                    )}

                    {/* Remove Photo */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-950/80 text-rose-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Upload Tile Placeholder */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-800 hover:border-emerald-500/60 bg-slate-900/40 hover:bg-slate-900 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-[10px] font-bold">+ Add Photo</span>
                </button>
              </div>

              {/* Curated Presets Bar & Direct URL Add */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">Presets:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setGalleryImages([
                        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
                      ])
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 text-[10px] font-mono border border-slate-800 whitespace-nowrap"
                  >
                    iPhone 16 Pro Pack
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setGalleryImages([
                        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
                      ])
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 text-[10px] font-mono border border-slate-800 whitespace-nowrap"
                  >
                    Galaxy Ultra Pack
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setGalleryImages([
                        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80',
                      ])
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 text-[10px] font-mono border border-slate-800 whitespace-nowrap"
                  >
                    Redmi Note Pack
                  </button>
                </div>

                {/* Direct URL input */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Or paste image URL"
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 w-48"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrlImage}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer"
                  >
                    + Add URL
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddingProduct(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Publish to Babal Market
              </button>
            </div>
            </div>
          </form>
        </div>
      )}

      {/* Product List in User's Shop */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-white">
              Shop Inventory & Listings ({myProducts.length})
            </h3>
            <p className="text-xs text-slate-400">
              Manage live stock, pricing, and fulfillment routing
            </p>
          </div>
        </div>

        {myProducts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <Package className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-300">You haven&apos;t added any products yet.</p>
            <p className="mt-1">Click &ldquo;Add Product with AI&rdquo; above to publish your first item in 30 seconds!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                <tr>
                  <th className="pb-3 pl-2">Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Stock Units</th>
                  <th className="pb-3">Warehouse</th>
                  <th className="pb-3 text-right pr-2">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {myProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                        />
                        <div>
                          <span className="font-bold text-white block truncate max-w-xs">
                            {p.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            SKU: {p.sku}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-300">{p.category}</td>
                    <td className="py-3.5 font-mono text-emerald-400 font-bold">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold ${
                            p.stock <= 5 ? 'text-rose-400' : 'text-slate-200'
                          }`}
                        >
                          {p.stock}
                        </span>
                        {p.stock <= 5 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                            Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-400">{p.warehouseLocation}</td>
                    <td className="py-3.5 text-right pr-2">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => updateProductStock(p.id, p.stock + 10)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold"
                          title="Restock +10 units"
                        >
                          +10 Stock
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
