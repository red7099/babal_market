import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  VendorService,
  ServiceBooking,
  ServiceCategory,
  PricingUnit,
} from '../types';
import {
  Bus,
  Car,
  HeartPulse,
  Sparkles,
  BedDouble,
  Search,
  Filter,
  Phone,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Star,
  PlusCircle,
  Ticket,
  QrCode,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Send,
  Sliders,
  DollarSign,
  AlertCircle,
  Trophy,
  Mountain,
  Target,
  MessageSquare,
  Compass,
  Radio,
  Activity,
  Flame,
  Layers,
} from 'lucide-react';

export const ServicesHubView: React.FC = () => {
  const {
    services,
    serviceBookings,
    addVendorService,
    bookService,
    formatPrice,
    currency,
    t,
    setActiveTab: setGlobalAppTab,
  } = useApp();

  // Tab: 'browse' | 'register_service' | 'my_bookings'
  const [activeTab, setActiveTab] = useState<'browse' | 'register_service' | 'my_bookings'>('browse');

  // Category filter: 'all' or specific category
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Booking Modal
  const [selectedServiceToBook, setSelectedServiceToBook] = useState<VendorService | null>(null);
  const [bookingCustomerName, setBookingCustomerName] = useState('Bharat Raj Timilsaina');
  const [bookingPhone, setBookingPhone] = useState('+977 9746254690');
  const [bookingEmail, setBookingEmail] = useState('bharatrajtimilsaina95@gmail.com');
  const [bookingDate, setBookingDate] = useState('2026-11-05');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('');
  const [bookingPickup, setBookingPickup] = useState('');
  const [bookingDropoff, setBookingDropoff] = useState('');
  const [bookingQuantity, setBookingQuantity] = useState(1);
  const [bookingSpecialNotes, setBookingSpecialNotes] = useState('');
  const [confirmedBookingData, setConfirmedBookingData] = useState<ServiceBooking | null>(null);

  // Vendor Service Registration Form ("All service add by vander")
  const [formCategory, setFormCategory] = useState<ServiceCategory>('bus');
  const [formTitle, setFormTitle] = useState('');
  const [formLocalTitle, setFormLocalTitle] = useState('');
  const [formProviderName, setFormProviderName] = useState('Bharat Raj Timilsaina');
  const [formPhone, setFormPhone] = useState('+977 9746254690');
  const [formWhatsapp, setFormWhatsapp] = useState('+9779746254690');
  const [formEmail, setFormEmail] = useState('bharatrajtimilsaina95@gmail.com');
  const [formLocation, setFormLocation] = useState('');
  const [formCity, setFormCity] = useState('Kathmandu');
  const [formPricingUnit, setFormPricingUnit] = useState<PricingUnit>('per_seat');
  const [formPriceNPR, setFormPriceNPR] = useState<number>(1500);
  const [formPriceUSD, setFormPriceUSD] = useState<number>(12);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSpecKey, setFormSpecKey] = useState('Operating Hours');
  const [formSpecValue, setFormSpecValue] = useState('06:00 AM - 09:00 PM Daily');
  const [formNotice, setFormNotice] = useState<string | null>(null);

  // Filtered Services List
  const filteredServices = services.filter((srv) => {
    const matchesCat = selectedCategory === 'all' || srv.category === selectedCategory;
    const matchesCity = selectedCity === 'all' || srv.city.toLowerCase() === selectedCity.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      srv.title.toLowerCase().includes(q) ||
      (srv.localTitle && srv.localTitle.toLowerCase().includes(q)) ||
      srv.providerName.toLowerCase().includes(q) ||
      srv.location.toLowerCase().includes(q) ||
      srv.description.toLowerCase().includes(q);
    return matchesCat && matchesCity && matchesSearch;
  });

  const categories = [
    {
      id: 'all',
      label: 'All Services',
      labelNepali: 'सबै सेवाहरू',
      icon: Layers,
      gradient: 'from-amber-500 to-orange-500',
      badge: `${services.length}`,
    },
    {
      id: 'hotel',
      label: 'Hotels & Resorts',
      labelNepali: 'होटल तथा रिसोर्ट',
      icon: BedDouble,
      gradient: 'from-emerald-500 to-teal-500',
      badge: `${services.filter((s) => s.category === 'hotel').length}`,
    },
    {
      id: 'bus',
      label: 'Deluxe Buses',
      labelNepali: 'डिलक्स बस सेवा',
      icon: Bus,
      gradient: 'from-amber-500 to-yellow-500',
      badge: `${services.filter((s) => s.category === 'bus').length}`,
    },
    {
      id: 'auto_ride',
      label: 'Auto & Rides',
      labelNepali: 'अटो तथा राइड',
      icon: Car,
      gradient: 'from-blue-500 to-cyan-500',
      badge: `${services.filter((s) => s.category === 'auto_ride').length}`,
    },
    {
      id: 'medical',
      label: 'Medical Health',
      labelNepali: 'स्वास्थ्य सेवा',
      icon: HeartPulse,
      gradient: 'from-rose-500 to-red-500',
      badge: `${services.filter((s) => s.category === 'medical').length}`,
    },
    {
      id: 'jyotish',
      label: 'Vedic Jyotish',
      labelNepali: 'ज्योतिष कुण्डली',
      icon: Sparkles,
      gradient: 'from-purple-500 to-violet-500',
      badge: `${services.filter((s) => s.category === 'jyotish').length}`,
    },
    {
      id: 'scores_direct',
      label: 'NPL & IPL Scores',
      labelNepali: 'लाइभ खेल स्कोर',
      icon: Trophy,
      gradient: 'from-red-600 via-rose-600 to-amber-500',
      badge: 'LIVE 🔴',
      isNav: true,
      navTarget: 'scores',
    },
    {
      id: 'tourism_direct',
      label: 'Nepal Tours',
      labelNepali: 'भ्रमण प्याकेज',
      icon: Mountain,
      gradient: 'from-orange-500 to-amber-600',
      badge: 'TOURS',
      isNav: true,
      navTarget: 'tourism',
    },
    {
      id: 'discipline_direct',
      label: 'Discipline Dojo',
      labelNepali: 'अनुशासन खेल',
      icon: Target,
      gradient: 'from-teal-500 to-cyan-500',
      badge: 'STUDENT',
      isNav: true,
      navTarget: 'discipline_game',
    },
  ];

  const cities = ['all', 'Kathmandu', 'Pokhara', 'Chitwan', 'Lumbini', 'Butwal', 'Biratnagar', 'Dharan'];

  const handleOpenBooking = (srv: VendorService) => {
    setSelectedServiceToBook(srv);
    setBookingTimeSlot(srv.availableSlotsOrSeats ? srv.availableSlotsOrSeats[0] : 'Morning 09:00 AM');
    setConfirmedBookingData(null);
  };

  const handleConfirmServiceBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceToBook) return;

    const totalNPR = selectedServiceToBook.priceNPR * bookingQuantity;
    const totalUSD = selectedServiceToBook.priceUSD * bookingQuantity;

    const booking = bookService({
      serviceId: selectedServiceToBook.id,
      serviceTitle: selectedServiceToBook.title,
      category: selectedServiceToBook.category,
      customerName: bookingCustomerName,
      customerPhone: bookingPhone,
      customerEmail: bookingEmail,
      scheduledDate: bookingDate,
      timeSlot: bookingTimeSlot,
      pickupLocation: bookingPickup || selectedServiceToBook.location,
      dropoffLocation: bookingDropoff,
      quantityOrSeats: bookingQuantity,
      totalAmountUSD: totalUSD,
      totalAmountNPR: totalNPR,
      currency: currency === 'NPR' ? 'NPR' : 'USD',
      specialInstructions: bookingSpecialNotes,
    });

    setConfirmedBookingData(booking);
  };

  const handleRegisterVendorService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formPhone.trim()) {
      alert('Please fill in service title and contact phone.');
      return;
    }

    const defaultImages = {
      hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      bus: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      auto_ride: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
      medical: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
      jyotish: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      tour: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    };

    const result = addVendorService({
      title: formTitle.trim(),
      localTitle: formLocalTitle.trim() || formTitle.trim(),
      category: formCategory,
      providerName: formProviderName.trim(),
      phone: formPhone.trim(),
      whatsappNumber: formWhatsapp.trim() || formPhone.trim(),
      email: formEmail.trim(),
      location: formLocation.trim() || `${formCity}, Nepal`,
      city: formCity,
      pricingUnit: formPricingUnit,
      priceNPR: Number(formPriceNPR) || 1000,
      priceUSD: Number(formPriceUSD) || 8,
      images: formImageUrl.trim() ? [formImageUrl.trim()] : [defaultImages[formCategory]],
      description: formDescription.trim() || 'High quality certified service verified on Babal Market network.',
      specs: {
        [formSpecKey]: formSpecValue,
        'Booking Policy': 'Instant Confirmation with 100% Escrow Protection',
      },
    });

    setFormNotice(result.message);
    setFormTitle('');
    setFormLocalTitle('');
    setFormLocation('');
    setFormDescription('');
  };

  const getCategoryBadge = (cat: ServiceCategory) => {
    switch (cat) {
      case 'hotel':
        return { label: 'Hotel & Resort', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'bus':
        return { label: 'Tourist Bus', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' };
      case 'auto_ride':
        return { label: 'Auto & Ride', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      case 'medical':
        return { label: 'Medical & Doctor', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
      case 'jyotish':
        return { label: 'Jyotish Sewa', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
      default:
        return { label: 'Service', color: 'text-slate-400 bg-slate-800 border-slate-700' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Services Hub Super Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-neutral-950 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>NEPAL ALL-IN-ONE MULTI-SERVICE ECOSYSTEM · नेपालका सबै सेवाहरू एकै ठाउँमा</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Babal Services Hub <span className="text-amber-400 font-light">(बाबाल सेवाहरू)</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Book verified hotels, tourist buses, electric city auto-rickshaws, doctor video consultations, and certified Vedic Jyotish astrology with zero-commission P2P escrow guarantee.
          </p>

          {/* Sub Navigation Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'browse'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Browse All Services</span>
            </button>

            <button
              onClick={() => setActiveTab('register_service')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'register_service'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/50 border border-emerald-500/40'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Your Service as Vendor (भेन्डर सेवा दर्ता)</span>
            </button>

            <button
              onClick={() => setActiveTab('my_bookings')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'my_bookings'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>My Service Bookings ({serviceBookings.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW 1: BROWSE ALL SERVICES */}
      {/* ============================================================== */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Icon-Based Services Grid & Categories */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Service Category (सेवा छनोट गर्नुहोस्)</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {categories.length} Specialized Hubs
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-2.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (cat.isNav && cat.navTarget) {
                        setGlobalAppTab(cat.navTarget as any);
                      } else {
                        setSelectedCategory(cat.id);
                      }
                    }}
                    className={`p-3.5 rounded-3xl border transition-all flex flex-col items-center justify-between text-center gap-2.5 group cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-amber-500/15'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    {/* Top Round Live Icon Badge */}
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg ${
                          isSelected
                            ? `bg-gradient-to-tr ${cat.gradient} text-slate-950 font-black ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-950`
                            : `bg-slate-800 text-slate-200 border border-slate-700 group-hover:border-amber-500/50 group-hover:text-amber-400`
                        }`}
                      >
                        <Icon className="w-5 h-5 transition-transform group-hover:rotate-6" />
                      </div>

                      {/* Live pulsating dot for live categories */}
                      {(cat.badge.includes('LIVE') || isSelected) && (
                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cat.badge.includes('LIVE') ? 'bg-red-400' : 'bg-amber-400'}`}></span>
                          <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-slate-950 ${cat.badge.includes('LIVE') ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                        </span>
                      )}
                    </div>

                    {/* Labels */}
                    <div className="w-full">
                      <span className="font-bold text-xs text-white block line-clamp-1 group-hover:text-amber-400 transition-colors">
                        {cat.label}
                      </span>
                      <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-medium">
                        {cat.labelNepali}
                      </span>
                    </div>

                    {/* Count / Live Badge */}
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shadow-sm ${
                        cat.badge.includes('LIVE')
                          ? 'bg-red-600 text-white animate-pulse'
                          : isSelected
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & City Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bus routes, e-autos, tele-doctors, or astrologers..."
                className="w-full bg-slate-950 text-xs text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 whitespace-nowrap">City / शहर:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-slate-950 text-xs text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 capitalize"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Cities (नेपालभरि)' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Live Game Scorecast Ribbon (NPL, IPL, ICC) */}
          <div
            onClick={() => setGlobalAppTab('scores')}
            className="p-4 rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border border-red-500/40 hover:border-red-400 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl cursor-pointer group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400">
                    GAME LIVE SCORE SERVICE (NPL & IPL 2026)
                  </span>
                </div>
                <h4 className="font-extrabold text-white text-sm sm:text-base group-hover:text-amber-400 transition-colors">
                  Nepal Premier League & IPL Live Ball-by-Ball Match Center
                </h4>
                <p className="text-xs text-slate-300">
                  Pokhara Avengers need 21 runs in 14 balls vs Janakpur Bolts (TU Kirtipur) • CSK vs RCB Live!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/30 flex items-center gap-1.5 transition-all">
                <span>View Live Scoreboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const badge = getCategoryBadge(service.category);
              return (
                <div
                  key={service.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl group"
                >
                  <div>
                    {/* Image Header */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                      <img
                        src={service.images[0]}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border backdrop-blur-md ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>

                      {/* City Badge */}
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/20 text-[10px] text-slate-200">
                        {service.city}
                      </div>

                      <div className="absolute bottom-2 left-3 right-3">
                        {service.localTitle && (
                          <div className="text-[10px] text-amber-400 font-mono">
                            {service.localTitle}
                          </div>
                        )}
                        <h3 className="text-base font-bold text-white leading-tight">
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    {/* Details Body */}
                    <div className="p-4 space-y-3">
                      {/* Provider & Rating */}
                      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2.5">
                        <span className="font-medium text-slate-300 truncate max-w-[180px]">
                          {service.providerName}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="font-bold">{service.rating}</span>
                          <span className="text-slate-500">({service.reviewCount})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{service.location}</span>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Specs Highlights */}
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs">
                        {Object.entries(service.specs).slice(0, 2).map(([k, v]) => (
                          <div key={k} className="flex justify-between text-[11px]">
                            <span className="text-slate-500">{k}:</span>
                            <span className="font-semibold text-slate-300 truncate max-w-[160px] text-right">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Actions Footer */}
                  <div className="p-4 pt-0 space-y-2">
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                          Price ({service.pricingUnit.replace('_', ' ')})
                        </div>
                        <div className="text-base font-black text-amber-400">
                          रू {service.priceNPR.toLocaleString()}
                          <span className="text-xs text-slate-400 font-normal ml-1">
                            / {formatPrice(service.priceUSD)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* WhatsApp Vendor Contact */}
                        <a
                          href={`https://api.whatsapp.com/send?phone=${service.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
                            `Namaste! I am contacting you regarding your ${service.title} on Babal Market.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-colors"
                          title="Chat with Vendor on WhatsApp"
                        >
                          <Phone className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => handleOpenBooking(service)}
                          className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: VENDOR SERVICE REGISTRATION (ALL SERVICE ADD BY VENDOR) */}
      {/* ============================================================== */}
      {activeTab === 'register_service' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Vendor Service Registration Portal (भेन्डर सेवा दर्ता)
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  List your hotel, bus route, electric auto, clinic, or astrology services on Babal Market with P2P escrow payments.
                </p>
              </div>
            </div>

            {formNotice && (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{formNotice}</span>
              </div>
            )}

            <form onSubmit={handleRegisterVendorService} className="space-y-4">
              {/* Category Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  Service Category (सेवा वर्ग छनोट गर्नुहोस्)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'hotel', label: 'Hotel & Resort', icon: BedDouble },
                    { id: 'bus', label: 'Bus Tickets (बस सेवा)', icon: Bus },
                    { id: 'auto_ride', label: 'Auto & Ride (अटो/राइड)', icon: Car },
                    { id: 'medical', label: 'Medical & Health (स्वास्थ्य)', icon: HeartPulse },
                    { id: 'jyotish', label: 'Jyotish (ज्योतिष सेवा)', icon: Sparkles },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = formCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormCategory(cat.id as ServiceCategory)}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Local Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Service Name (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Kathmandu to Pokhara Tourist Sofa Coach"
                    className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Service Name in Nepali (नेपाली नाम)
                  </label>
                  <input
                    type="text"
                    value={formLocalTitle}
                    onChange={(e) => setFormLocalTitle(e.target.value)}
                    placeholder="उदा: काठमाडौं - पोखरा डिलक्स बस"
                    className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Provider Name, Phone, WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Provider / Vendor Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formProviderName}
                    onChange={(e) => setFormProviderName(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+977 9746254690"
                    className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    WhatsApp Contact
                  </label>
                  <input
                    type="text"
                    value={formWhatsapp}
                    onChange={(e) => setFormWhatsapp(e.target.value)}
                    placeholder="+9779746254690"
                    className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Location, City, Pricing Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    City / शहर
                  </label>
                  <select
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Chitwan">Chitwan</option>
                    <option value="Lumbini">Lumbini</option>
                    <option value="Butwal">Butwal</option>
                    <option value="Biratnagar">Biratnagar</option>
                    <option value="Dharan">Dharan</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Station / Address / Clinic
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Kantipath Bus Terminal / Online"
                    className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Pricing Basis
                  </label>
                  <select
                    value={formPricingUnit}
                    onChange={(e) => setFormPricingUnit(e.target.value as PricingUnit)}
                    className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="per_seat">Per Seat (बस सिट)</option>
                    <option value="per_ride">Per Ride (राइड/अटो)</option>
                    <option value="per_consultation">Per Consultation (डाक्टर/ज्योतिष)</option>
                    <option value="per_night">Per Night (होटल)</option>
                    <option value="fixed">Fixed Package (प्याकेज)</option>
                  </select>
                </div>
              </div>

              {/* Price in NPR and USD */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Price in NPR (रू)
                  </label>
                  <input
                    type="number"
                    required
                    min={50}
                    value={formPriceNPR}
                    onChange={(e) => {
                      const npr = Number(e.target.value);
                      setFormPriceNPR(npr);
                      setFormPriceUSD(Math.round(npr / 135));
                    }}
                    className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Equivalent in USD ($)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formPriceUSD}
                    onChange={(e) => setFormPriceUSD(Number(e.target.value))}
                    className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Image URL & Description */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Photo / Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... (or direct image link)"
                  className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Service Description & Terms
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detail your operating times, vehicle specs, medical credentials, or consultation details..."
                  className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Verify & Publish Service to Babal Market
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 3: MY SERVICE BOOKINGS */}
      {/* ============================================================== */}
      {activeTab === 'my_bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Confirmed Service Bookings & Boarding Slips
              </h2>
              <p className="text-xs text-slate-400">
                P2P cryptographic receipts, verified phone numbers, and digital boarding QR tokens.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {serviceBookings.length} Active Bookings
            </span>
          </div>

          {serviceBookings.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
              <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No active service bookings</h3>
              <p className="text-xs text-slate-400 mt-1">
                Browse buses, electric autos, doctors, or astrologers and book with escrow protection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {serviceBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between shadow-xl"
                >
                  <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-emerald-400 font-bold">
                        REF: {bk.bookingRef} · {bk.category.toUpperCase()}
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">
                        {bk.serviceTitle}
                      </h3>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                      {bk.status}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-slate-500">Customer</div>
                        <div className="font-semibold text-slate-200">{bk.customerName}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Phone</div>
                        <div className="font-semibold text-slate-200">{bk.customerPhone}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Date & Slot</div>
                        <div className="font-semibold text-slate-200">
                          {bk.scheduledDate} {bk.timeSlot ? `(${bk.timeSlot})` : ''}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Total Escrow Paid</div>
                        <div className="font-bold text-amber-400">
                          रू {bk.totalAmountNPR.toLocaleString()} (${bk.totalAmountUSD})
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                          <QrCode className="w-10 h-10 text-slate-950" />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-mono uppercase">
                            Digital QR Service Slip
                          </div>
                          <div className="text-xs font-mono font-bold text-slate-200">
                            {bk.bookingSlipQr}
                          </div>
                        </div>
                      </div>

                      <a
                        href={`https://api.whatsapp.com/send?phone=9779746254690&text=${encodeURIComponent(
                          `Namaste! Confirming my Babal Market service booking: ${bk.bookingRef} for ${bk.serviceTitle}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Concierge</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SERVICE BOOKING MODAL */}
      {/* ============================================================== */}
      {selectedServiceToBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                  P2P Escrow Booking
                </span>
                <h3 className="text-base font-bold text-white truncate max-w-sm">
                  {selectedServiceToBook.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedServiceToBook(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-xs"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              {confirmedBookingData ? (
                <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Booking Confirmed!</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Your escrow token has been deposited. Funds will release to the service provider after service fulfillment.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Booking Reference:</span>
                      <span className="font-mono font-bold text-amber-400">{confirmedBookingData.bookingRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Escrow Amount:</span>
                      <span className="font-bold text-emerald-400">
                        रू {confirmedBookingData.totalAmountNPR.toLocaleString()} (${confirmedBookingData.totalAmountUSD})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">QR Slip Token:</span>
                      <span className="font-mono text-slate-200">{confirmedBookingData.bookingSlipQr}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedServiceToBook(null);
                      setActiveTab('my_bookings');
                    }}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                  >
                    View My Bookings & Boarding Slips
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmServiceBooking} className="space-y-4">
                  {/* Slots / Seats / Schedule */}
                  {selectedServiceToBook.availableSlotsOrSeats && (
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Select Available Slot / Seat / Time
                      </label>
                      <select
                        value={bookingTimeSlot}
                        onChange={(e) => setBookingTimeSlot(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800"
                      >
                        {selectedServiceToBook.availableSlotsOrSeats.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Date & Quantity */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Service Date
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        {selectedServiceToBook.category === 'bus'
                          ? 'Seats Count'
                          : selectedServiceToBook.category === 'hotel'
                          ? 'Nights Count'
                          : 'Quantity / Persons'}
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={bookingQuantity}
                        onChange={(e) => setBookingQuantity(Number(e.target.value))}
                        className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800"
                      />
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingCustomerName}
                        onChange={(e) => setBookingCustomerName(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800"
                      />
                    </div>
                  </div>

                  {/* Pickup Location for Rides / Bus */}
                  {(selectedServiceToBook.category === 'auto_ride' || selectedServiceToBook.category === 'bus') && (
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Pickup Address / Landmark
                      </label>
                      <input
                        type="text"
                        value={bookingPickup}
                        onChange={(e) => setBookingPickup(e.target.value)}
                        placeholder="e.g. Thamel Chok / Lakeside Pokhara Gate"
                        className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800"
                      />
                    </div>
                  )}

                  {/* Birth Details for Jyotish */}
                  {selectedServiceToBook.category === 'jyotish' && (
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Birth Date, Exact Time & Birth Place (जन्म मिति, समय र स्थान)
                      </label>
                      <input
                        type="text"
                        value={bookingSpecialNotes}
                        onChange={(e) => setBookingSpecialNotes(e.target.value)}
                        placeholder="e.g. 2052-04-12, 07:45 AM, Pokhara"
                        className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800"
                      />
                    </div>
                  )}

                  {/* Escrow Total Box */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">
                        Escrow Total ({bookingQuantity} {selectedServiceToBook.pricingUnit.replace('_', ' ')})
                      </div>
                      <div className="text-lg font-black text-amber-400">
                        रू {(selectedServiceToBook.priceNPR * bookingQuantity).toLocaleString()}
                        <span className="text-xs text-slate-400 font-normal ml-1">
                          (${selectedServiceToBook.priceUSD * bookingQuantity})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Protected</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    Confirm Booking & Deposit Escrow
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
