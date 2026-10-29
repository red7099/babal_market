import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Hotel,
  TourPackage,
  TouristGuide,
  TourismDestination,
  PartnerTourismListingForm,
  TourismBooking,
} from '../types';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Plane,
  FileCheck,
  Star,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  PlusCircle,
  QrCode,
  Tag,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BedDouble,
  Mountain,
  Award,
  Sparkles,
  Ticket,
  Search,
  Filter,
} from 'lucide-react';

export const NepalTourismView: React.FC = () => {
  const {
    hotels,
    tourPackages,
    touristGuides,
    tourismBookings,
    bookTourismItem,
    submitPartnerTourismListing,
    formatPrice,
    currency,
    t,
  } = useApp();

  // Sub-tabs: 'packages' | 'hotels' | 'guides' | 'advertise' | 'my_bookings'
  const [subTab, setSubTab] = useState<'packages' | 'hotels' | 'guides' | 'advertise' | 'my_bookings'>('packages');

  // Destination filter
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Selected details / Booking modal
  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<TouristGuide | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState<TourismBooking | null>(null);

  // Booking form state
  const [bookingGuestName, setBookingGuestName] = useState('Bharat Raj Timilsaina');
  const [bookingEmail, setBookingEmail] = useState('bharatrajtimilsaina95@gmail.com');
  const [bookingPhone, setBookingPhone] = useState('+977 9746254690');
  const [bookingNationality, setBookingNationality] = useState('Nepal / International');
  const [bookingStartDate, setBookingStartDate] = useState('2026-11-15');
  const [bookingEndDate, setBookingEndDate] = useState('2026-11-25');
  const [bookingGuestsCount, setBookingGuestsCount] = useState(2);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>('');
  const [bookingSpecialNotes, setBookingSpecialNotes] = useState('');

  // "Add / Advertise Your Hotel, Tour, or Guide" Form state
  const [adFormType, setAdFormType] = useState<'hotel' | 'tour' | 'guide'>('hotel');
  const [adTitle, setAdTitle] = useState('');
  const [adDestination, setAdDestination] = useState<TourismDestination>('Pokhara');
  const [adLocation, setAdLocation] = useState('');
  const [adContactName, setAdContactName] = useState('Bharat Raj Timilsaina');
  const [adContactPhone, setAdContactPhone] = useState('+977 9746254690');
  const [adContactEmail, setAdContactEmail] = useState('bharatrajtimilsaina95@gmail.com');
  const [adPriceUSD, setAdPriceUSD] = useState<number>(120);
  const [adDescription, setAdDescription] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adAmenities, setAdAmenities] = useState('Free Mountain View, High-Speed Wi-Fi, Organic Breakfast, Airport Shuttle');
  const [adLicenseNumber, setAdLicenseNumber] = useState('');
  const [adSpokenLanguages, setAdSpokenLanguages] = useState('English, Nepali, Hindi');
  const [adIncludesDomesticFlight, setAdIncludesDomesticFlight] = useState(false);
  const [adFlightRoute, setAdFlightRoute] = useState('Kathmandu ⇄ Pokhara Flight Ticket');
  const [adSubmitNotice, setAdSubmitNotice] = useState<string | null>(null);

  // Itinerary expand states
  const [expandedItineraryDay, setExpandedItineraryDay] = useState<number | null>(1);

  // Destination filtering list
  const destinations: { id: string; label: string }[] = [
    { id: 'all', label: t('tourism.allDestinations') },
    { id: 'Kathmandu', label: t('tourism.kathmandu') },
    { id: 'Pokhara', label: t('tourism.pokhara') },
    { id: 'Everest / Khumbu', label: t('tourism.everest') },
    { id: 'Chitwan', label: t('tourism.chitwan') },
    { id: 'Lumbini', label: t('tourism.lumbini') },
    { id: 'Nagarkot', label: t('tourism.nagarkot') },
    { id: 'Mustang', label: t('tourism.mustang') },
  ];

  // Filtered Tour Packages
  const filteredPackages = tourPackages.filter((pkg) => {
    const matchesDest = selectedDestination === 'all' || pkg.destination === selectedDestination;
    const matchesSearch =
      searchFilter === '' ||
      pkg.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchFilter.toLowerCase()) ||
      pkg.partnerAgencyName.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesDest && matchesSearch;
  });

  // Filtered Hotels
  const filteredHotels = hotels.filter((hotel) => {
    const matchesDest = selectedDestination === 'all' || hotel.destination === selectedDestination;
    const matchesSearch =
      searchFilter === '' ||
      hotel.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
      hotel.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesDest && matchesSearch;
  });

  // Filtered Guides
  const filteredGuides = touristGuides.filter((guide) => {
    const matchesDest =
      selectedDestination === 'all' ||
      guide.regions.includes(selectedDestination as TourismDestination) ||
      guide.regions.some((r) => r.includes(selectedDestination));
    const matchesSearch =
      searchFilter === '' ||
      guide.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      guide.languages.some((l) => l.toLowerCase().includes(searchFilter.toLowerCase())) ||
      guide.specialties.some((s) => s.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesDest && matchesSearch;
  });

  // Initiate Booking
  const openBookingForTour = (pkg: TourPackage) => {
    setSelectedTour(pkg);
    setSelectedHotel(null);
    setSelectedGuide(null);
    setIsBookingModalOpen(true);
    setBookingSuccessData(null);
  };

  const openBookingForHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setSelectedTour(null);
    setSelectedGuide(null);
    setSelectedRoomTypeId(hotel.roomTypes[0]?.id || '');
    setIsBookingModalOpen(true);
    setBookingSuccessData(null);
  };

  const openBookingForGuide = (guide: TouristGuide) => {
    setSelectedGuide(guide);
    setSelectedTour(null);
    setSelectedHotel(null);
    setIsBookingModalOpen(true);
    setBookingSuccessData(null);
  };

  // Confirm Booking Action
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();

    let bookingType: 'tour' | 'hotel' | 'guide' = 'tour';
    let itemId = '';
    let itemTitle = '';
    let amountUSD = 0;
    let roomTypeName: string | undefined = undefined;

    if (selectedTour) {
      bookingType = 'tour';
      itemId = selectedTour.id;
      itemTitle = selectedTour.title;
      amountUSD = selectedTour.priceUSD * bookingGuestsCount;
    } else if (selectedHotel) {
      bookingType = 'hotel';
      itemId = selectedHotel.id;
      const selectedRoom = selectedHotel.roomTypes.find((r) => r.id === selectedRoomTypeId) || selectedHotel.roomTypes[0];
      itemTitle = `${selectedHotel.name} - ${selectedRoom?.name || 'Deluxe Room'}`;
      roomTypeName = selectedRoom?.name;
      // Calculate nights (defaults to 2 if parsing fails)
      const nights = 2;
      amountUSD = (selectedRoom?.pricePerNightUSD || 150) * nights;
    } else if (selectedGuide) {
      bookingType = 'guide';
      itemId = selectedGuide.id;
      itemTitle = `Licensed Guide Service: ${selectedGuide.name} (${selectedGuide.licenseType})`;
      const days = 3;
      amountUSD = selectedGuide.dailyRateUSD * days;
    }

    const booking = bookTourismItem({
      bookingType,
      itemId,
      itemTitle,
      customerName: bookingGuestName,
      customerEmail: bookingEmail,
      customerPhone: bookingPhone,
      nationality: bookingNationality,
      startDate: bookingStartDate,
      endDate: bookingEndDate,
      guestsCount: bookingGuestsCount,
      roomTypeId: selectedRoomTypeId,
      roomTypeName,
      currency,
      totalAmount: amountUSD,
      amountUSD,
      specialRequests: bookingSpecialNotes,
    });

    setBookingSuccessData(booking);
  };

  // Submit "Add Your Hotel, Tour, or Guide"
  const handlePublishPartnerListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim() || !adContactPhone.trim()) {
      alert('Please fill in the title and contact phone number.');
      return;
    }

    const amenitiesList = adAmenities
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const languagesList = adSpokenLanguages
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const imageList = adImageUrl.trim() ? [adImageUrl.trim()] : [];

    const result = submitPartnerTourismListing({
      type: adFormType,
      title: adTitle.trim(),
      destination: adDestination,
      location: adLocation.trim() || `${adDestination}, Nepal`,
      contactName: adContactName.trim(),
      contactPhone: adContactPhone.trim(),
      contactEmail: adContactEmail.trim(),
      whatsappNumber: adContactPhone.trim(),
      priceUSD: Number(adPriceUSD) || 100,
      description: adDescription.trim() || 'Premier hospitality and guided tour services in Nepal.',
      images: imageList,
      amenitiesOrSpecialties: amenitiesList,
      licenseNumber: adLicenseNumber.trim(),
      languages: languagesList,
      domesticFlightIncluded: adIncludesDomesticFlight,
      flightRoute: adFlightRoute.trim(),
    });

    setAdSubmitNotice(result.message);
    // Reset inputs
    setAdTitle('');
    setAdLocation('');
    setAdDescription('');
    setAdImageUrl('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Himalayan Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-stone-950 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Mountain className="w-4 h-4" />
            <span>DISCOVER NEPAL · सगरमाथाको देश · VISIT NEPAL 2026/2027</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {t('tourism.title')}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t('tourism.subtitle')}
          </p>

          {/* Quick Sub-navigation Segmented Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3">
            <button
              onClick={() => setSubTab('packages')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                subTab === 'packages'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>{t('tourism.tabPackages')}</span>
            </button>

            <button
              onClick={() => setSubTab('hotels')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                subTab === 'hotels'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <BedDouble className="w-4 h-4" />
              <span>{t('tourism.tabHotels')}</span>
            </button>

            <button
              onClick={() => setSubTab('guides')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                subTab === 'guides'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{t('tourism.tabGuides')}</span>
            </button>

            <button
              onClick={() => setSubTab('advertise')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                subTab === 'advertise'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-500/40'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('tourism.tabAddListing')}</span>
            </button>

            <button
              onClick={() => setSubTab('my_bookings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                subTab === 'my_bookings'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>{t('tourism.tabMyBookings')} ({tourismBookings.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Destination Filter & Search (For Packages, Hotels, Guides) */}
      {subTab !== 'advertise' && subTab !== 'my_bookings' && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          {/* Destination Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none text-xs">
            {destinations.map((dest) => {
              const active = selectedDestination === dest.id;
              return (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDestination(dest.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                    active
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {dest.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by hotel, trek name, guide..."
              className="w-full bg-slate-950 text-xs text-white placeholder-slate-500 pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 1: TOUR PACKAGES & DOMESTIC FLIGHT TICKETS */}
      {/* ============================================================== */}
      {subTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Himalayan Expeditions & International Tour Packages
              </h2>
              <p className="text-xs text-slate-400">
                All-inclusive packages with domestic mountain flight tickets, government permits, and certified Sherpa leaders.
              </p>
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredPackages.length} packages
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5"
              >
                {/* Image & Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                  <img
                    src={pkg.images[0]}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>

                  {/* Clean unboxed metadata overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 text-xs font-semibold text-white drop-shadow">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/20">
                      {pkg.destination}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">
                      {pkg.durationDays} Days
                    </span>
                  </div>

                  {pkg.flightTicketsIncluded && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-sky-950/80 border border-sky-400/40 text-sky-300 text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-md">
                      <Plane className="w-3.5 h-3.5 text-sky-400" />
                      <span>Flight Ticket Included</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <div className="text-[11px] text-amber-400 font-mono">
                        {pkg.localTitle}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                        {pkg.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-3 text-xs text-slate-400 border-b border-slate-800/80 pb-3">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{pkg.rating}</span>
                      <span className="text-slate-400">({pkg.reviewCount})</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Difficulty: <strong className="text-slate-200">{pkg.difficulty}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Max Group: <strong className="text-slate-200">{pkg.maxGroupSize} Trekkers</strong></span>
                  </div>

                  {/* Flight & Permit notes */}
                  {pkg.domesticFlightRoute && (
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                      <Plane className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="truncate">{pkg.domesticFlightRoute}</span>
                    </div>
                  )}

                  {/* Key Inclusions bullets */}
                  <div className="space-y-1.5 text-xs text-slate-300">
                    {pkg.inclusions.slice(0, 3).map((inc, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{inc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Partner Agency & Escrow Price */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        Escrow Guaranteed Rate
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-amber-400">
                          {formatPrice(pkg.priceUSD)}
                        </span>
                        {pkg.originalPriceUSD && (
                          <span className="text-xs text-slate-500 line-through">
                            {formatPrice(pkg.originalPriceUSD)}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">/ person</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openBookingForTour(pkg)}
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Book Package</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 2: HOTELS & RESORTS ACROSS NEPAL */}
      {/* ============================================================== */}
      {subTab === 'hotels' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Authentic Nepal Hotels, Heritage Palaces & Alpine Lodges
              </h2>
              <p className="text-xs text-slate-400">
                Book verified accommodations across Kathmandu, Pokhara, Everest, Chitwan, Lumbini, and Nagarkot.
              </p>
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredHotels.length} hotels
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 overflow-hidden flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  {/* Photo */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={hotel.images[0]}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>

                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/20 text-xs text-white font-medium">
                      {hotel.destination}
                    </div>

                    {hotel.isGovernmentCertified && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1 backdrop-blur-md">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Certified</span>
                      </div>
                    )}

                    <div className="absolute bottom-2 left-3 right-3">
                      <div className="text-[10px] text-amber-400 font-mono">
                        {hotel.localName}
                      </div>
                      <h3 className="text-base font-bold text-white leading-tight">
                        {hotel.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{hotel.location}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 border-b border-slate-800/80 pb-2.5">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold">{hotel.rating}</span>
                        <span className="text-slate-500">({hotel.reviewCount})</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{hotel.starRating}-Star Heritage</span>
                      {hotel.altitudeMeters && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{hotel.altitudeMeters}m Alt.</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {hotel.description}
                    </p>

                    {/* Room types preview */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Available Room Options:
                      </div>
                      {hotel.roomTypes.map((room) => (
                        <div
                          key={room.id}
                          className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-semibold text-slate-200">{room.name}</div>
                            <div className="text-[10px] text-slate-400">{room.bedType} · Cap: {room.capacity}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-amber-400">
                              {formatPrice(room.pricePerNightUSD)}
                            </div>
                            <div className="text-[9px] text-slate-500">{t('tourism.perNight')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => openBookingForHotel(hotel)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BedDouble className="w-3.5 h-3.5" />
                    <span>Select Dates & Book Hotel</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 3: CERTIFIED TOURIST & SHERPA GUIDES */}
      {/* ============================================================== */}
      {subTab === 'guides' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Government Licensed Guides & Everest Sherpas
              </h2>
              <p className="text-xs text-slate-400">
                Hire certified mountain guides, UNESCO cultural historians, and wildlife naturalists directly via escrow.
              </p>
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredGuides.length} certified guides
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-5 flex flex-col sm:flex-row gap-5 transition-all"
              >
                {/* Photo & Badge */}
                <div className="shrink-0 flex sm:flex-col items-center gap-3">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-500/30">
                    <img
                      src={guide.photo}
                      alt={guide.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-slate-950" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-[10px] font-mono text-emerald-400 font-bold">
                      {guide.licenseNumber}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {guide.totalTreksCompleted} Treks Completed
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs text-amber-400 font-mono">
                          {guide.localName}
                        </div>
                        <h3 className="text-lg font-bold text-white">{guide.name}</h3>
                        <div className="text-xs font-semibold text-slate-300">
                          {guide.licenseType}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black text-amber-400">
                          {formatPrice(guide.dailyRateUSD)}
                        </div>
                        <div className="text-[10px] text-slate-400">{t('tourism.perDay')}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                      {guide.bio}
                    </p>

                    {/* Languages & Specialties */}
                    <div className="mt-3 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400">Languages:</span>
                        {guide.languages.map((lang, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-medium"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400">Specialties:</span>
                        {guide.specialties.map((spec, idx) => (
                          <span
                            key={idx}
                            className="text-amber-300 font-medium"
                          >
                            {spec}{idx < guide.specialties.length - 1 ? ' ·' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold">{guide.rating}</span>
                        <span className="text-slate-500">({guide.reviewCount})</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{guide.experienceYears} Years Exp</span>
                    </div>

                    <button
                      onClick={() => openBookingForGuide(guide)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                    >
                      Book This Guide
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 4: ADVERTISE / ADD YOUR HOTEL, TOUR, OR GUIDE */}
      {/* ============================================================== */}
      {subTab === 'advertise' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {t('tourism.addYourHotelTitle')}
                </h2>
                <p className="text-xs text-slate-300">
                  {t('tourism.addYourHotelDesc')}
                </p>
              </div>
            </div>

            {adSubmitNotice && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{adSubmitNotice}</span>
              </div>
            )}

            <form onSubmit={handlePublishPartnerListing} className="mt-6 space-y-4">
              {/* Category Segmented Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  What are you listing? (तपाईं के थप्दै हुनुहुन्छ?)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdFormType('hotel')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      adFormType === 'hotel'
                        ? 'bg-amber-500 border-amber-500 text-slate-950'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <BedDouble className="w-4 h-4" />
                    <span>Hotel / Resort</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdFormType('tour')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      adFormType === 'tour'
                        ? 'bg-amber-500 border-amber-500 text-slate-950'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Plane className="w-4 h-4" />
                    <span>Tour / Flight Package</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdFormType('guide')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      adFormType === 'guide'
                        ? 'bg-amber-500 border-amber-500 text-slate-950'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Tourist / Sherpa Guide</span>
                  </button>
                </div>
              </div>

              {/* Title & Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {adFormType === 'hotel'
                      ? 'Hotel / Resort Name'
                      : adFormType === 'tour'
                      ? 'Tour Package Title'
                      : 'Full Guide Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    placeholder={
                      adFormType === 'hotel'
                        ? 'e.g., Fishtail Lakeside Villa'
                        : adFormType === 'tour'
                        ? 'e.g., Annapurna Sanctuary Heli Trek 7-Day'
                        : 'e.g., Tenzing Norgay Sherpa'
                    }
                    className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Primary Region / Destination
                  </label>
                  <select
                    value={adDestination}
                    onChange={(e) => setAdDestination(e.target.value as TourismDestination)}
                    className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Kathmandu">Kathmandu Valley</option>
                    <option value="Pokhara">Pokhara Lakeside</option>
                    <option value="Everest / Khumbu">Everest / Khumbu</option>
                    <option value="Chitwan">Chitwan National Park</option>
                    <option value="Lumbini">Lumbini (Buddha Birthplace)</option>
                    <option value="Nagarkot">Nagarkot Sunrise</option>
                    <option value="Mustang">Mustang & Annapurna</option>
                  </select>
                </div>
              </div>

              {/* Location & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Street Address / Meeting Point
                  </label>
                  <input
                    type="text"
                    value={adLocation}
                    onChange={(e) => setAdLocation(e.target.value)}
                    placeholder="e.g., Lakeside Street 6, Pokhara"
                    className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {adFormType === 'hotel'
                      ? 'Room Rate Per Night (USD base)'
                      : adFormType === 'tour'
                      ? 'Package Price Per Person (USD base)'
                      : 'Guide Daily Rate (USD base)'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={10}
                      value={adPriceUSD}
                      onChange={(e) => setAdPriceUSD(Number(e.target.value))}
                      className="w-full bg-slate-950 text-xs text-white p-3 pr-24 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-emerald-400">
                      ≈ {formatPrice(adPriceUSD || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Contact / Operator Name
                  </label>
                  <input
                    type="text"
                    required
                    value={adContactName}
                    onChange={(e) => setAdContactName(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    value={adContactPhone}
                    onChange={(e) => setAdContactPhone(e.target.value)}
                    placeholder="+977 9746254690"
                    className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={adContactEmail}
                    onChange={(e) => setAdContactEmail(e.target.value)}
                    placeholder="bharatrajtimilsaina95@gmail.com"
                    className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Photo Image URL */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  High-Resolution Photo Image URL
                </label>
                <input
                  type="url"
                  value={adImageUrl}
                  onChange={(e) => setAdImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... (or your direct image link)"
                  className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Amenities / Specialties / Languages */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {adFormType === 'hotel'
                    ? 'Hotel Amenities (comma separated)'
                    : adFormType === 'tour'
                    ? 'Inclusions & Highlights (comma separated)'
                    : 'Specialties & Strengths (comma separated)'}
                </label>
                <input
                  type="text"
                  value={adAmenities}
                  onChange={(e) => setAdAmenities(e.target.value)}
                  className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              {adFormType === 'guide' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Government License Number
                    </label>
                    <input
                      type="text"
                      value={adLicenseNumber}
                      onChange={(e) => setAdLicenseNumber(e.target.value)}
                      placeholder="e.g. NATHM/LIC-9841"
                      className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Languages Spoken
                    </label>
                    <input
                      type="text"
                      value={adSpokenLanguages}
                      onChange={(e) => setAdSpokenLanguages(e.target.value)}
                      placeholder="English, Nepali, Hindi, Japanese"
                      className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {adFormType === 'tour' && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
                    <input
                      type="checkbox"
                      checked={adIncludesDomesticFlight}
                      onChange={(e) => setAdIncludesDomesticFlight(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                    />
                    <span>Includes Domestic Flight Tickets (e.g. Lukla, Pokhara, Chitwan)</span>
                  </label>
                  {adIncludesDomesticFlight && (
                    <input
                      type="text"
                      value={adFlightRoute}
                      onChange={(e) => setAdFlightRoute(e.target.value)}
                      placeholder="Flight Route & Airline Details"
                      className="w-full bg-slate-900 text-xs text-white p-2.5 rounded-lg border border-slate-700"
                    />
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Full Service Description
                </label>
                <textarea
                  rows={3}
                  value={adDescription}
                  onChange={(e) => setAdDescription(e.target.value)}
                  placeholder="Describe your hospitality, mountain views, trekking routes, and unique experiences..."
                  className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Verify & Publish Listing on Babal Market</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 5: MY TRAVEL BOOKINGS & TICKETS */}
      {/* ============================================================== */}
      {subTab === 'my_bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Confirmed Travel Vouchers & Boarding Passes
              </h2>
              <p className="text-xs text-slate-400">
                P2P cryptographic escrow receipts, flight boarding verification QR tokens, and concierge WhatsApp contacts.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              {tourismBookings.length} Active Bookings
            </span>
          </div>

          {tourismBookings.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
              <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No travel bookings yet</h3>
              <p className="text-xs text-slate-400 mt-1">
                Explore Himalayan tour packages or heritage hotels and book with escrow protection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tourismBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between shadow-xl"
                >
                  {/* Voucher Header */}
                  <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 font-bold">
                        <span>BOOKING ID: {bk.id}</span>
                        <span aria-hidden="true">·</span>
                        <span className="uppercase text-amber-400">{bk.bookingType}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">
                        {bk.itemTitle}
                      </h3>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{bk.status}</span>
                    </div>
                  </div>

                  {/* Voucher Body */}
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-slate-500">Guest Name</div>
                        <div className="font-semibold text-slate-200">{bk.customerName}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Contact Phone</div>
                        <div className="font-semibold text-slate-200">{bk.customerPhone}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Travel Dates</div>
                        <div className="font-semibold text-slate-200">
                          {bk.startDate} {bk.endDate ? `to ${bk.endDate}` : ''}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Total Escrow Paid</div>
                        <div className="font-bold text-amber-400">
                          {formatPrice(bk.amountUSD)}
                        </div>
                      </div>
                    </div>

                    {/* QR Code and Verification Token */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-white p-1 flex items-center justify-center">
                          <QrCode className="w-10 h-10 text-slate-950" />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-mono">
                            Digital Boarding Pass QR
                          </div>
                          <div className="text-xs font-mono font-bold text-slate-200">
                            {bk.boardingPassQr}
                          </div>
                        </div>
                      </div>

                      <a
                        href={`https://api.whatsapp.com/send?phone=9779746254690&text=${encodeURIComponent(
                          `Hello, I would like concierge assistance for my Babal Market booking: ${bk.id} (${bk.itemTitle})`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                        title="Chat with Nepal Concierge on WhatsApp"
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
      {/* BOOKING MODAL */}
      {/* ============================================================== */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                  P2P Escrow Protected Booking
                </div>
                <h3 className="text-base font-bold text-white truncate max-w-md">
                  {selectedTour?.title || selectedHotel?.name || selectedGuide?.name}
                </h3>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1.5 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              {bookingSuccessData ? (
                /* Success View */
                <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Booking Confirmed with Escrow!</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Your booking voucher and digital ticket have been published to your wallet and the decentralized ledger.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Booking Reference:</span>
                      <span className="font-mono font-bold text-amber-400">{bookingSuccessData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Escrow Deposited:</span>
                      <span className="font-bold text-emerald-400">{formatPrice(bookingSuccessData.amountUSD)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ticket Boarding Token:</span>
                      <span className="font-mono text-slate-200">{bookingSuccessData.boardingPassQr}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`https://api.whatsapp.com/send?phone=9779746254690&text=${encodeURIComponent(
                        `Namaste! I just booked ${bookingSuccessData.itemTitle} on Babal Market. Booking ID: ${bookingSuccessData.id}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>WhatsApp Confirmation</span>
                    </a>
                    <button
                      onClick={() => {
                        setIsBookingModalOpen(false);
                        setSubTab('my_bookings');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                    >
                      View Bookings
                    </button>
                  </div>
                </div>
              ) : (
                /* Booking Form */
                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  {/* Hotel Room Selection if hotel */}
                  {selectedHotel && (
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Select Room Type
                      </label>
                      <select
                        value={selectedRoomTypeId}
                        onChange={(e) => setSelectedRoomTypeId(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800"
                      >
                        {selectedHotel.roomTypes.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.name} — {formatPrice(room.pricePerNightUSD)} / night
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Dates & Guests */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Start / Check-in
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingStartDate}
                        onChange={(e) => setBookingStartDate(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        End / Check-out
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingEndDate}
                        onChange={(e) => setBookingEndDate(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Guests
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={bookingGuestsCount}
                        onChange={(e) => setBookingGuestsCount(Number(e.target.value))}
                        className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800"
                      />
                    </div>
                  </div>

                  {/* Guest Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Lead Guest Name
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingGuestName}
                        onChange={(e) => setBookingGuestName(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Phone / WhatsApp
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

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Email for Boarding Voucher
                    </label>
                    <input
                      type="email"
                      required
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Special Dietary / Flight / Oxygen Requests (Optional)
                    </label>
                    <input
                      type="text"
                      value={bookingSpecialNotes}
                      onChange={(e) => setBookingSpecialNotes(e.target.value)}
                      placeholder="e.g. Vegetarian food, Lukla flight window seat, airport pickup"
                      className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800"
                    />
                  </div>

                  {/* Escrow Guarantee Notice */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>Zero-Commission Escrow: Funds released upon check-in.</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    Confirm Booking & Generate Escrow Ticket
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
