export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductOption {
  name: string; // e.g. "Color", "Storage", "RAM", "Condition", "Size"
  values: string[]; // e.g. ["Desert Titanium", "Black Titanium"]
}

export interface PhoneSpecs {
  brand: string; // e.g. "Apple", "Samsung", "Xiaomi", "OnePlus", "Google Pixel"
  model: string; // e.g. "iPhone 16 Pro Max", "Galaxy S25 Ultra"
  storage?: string; // e.g. "256GB"
  ram?: string; // e.g. "12GB"
  batteryHealth?: string; // e.g. "100% (5000 mAh)"
  condition?: 'Brand New' | 'Like New (Unboxed)' | 'Refurbished' | 'Fair Condition';
  screenSize?: string; // e.g. "6.9 inch Super Retina XDR OLED"
  simType?: string; // e.g. "Dual SIM (nano + eSIM)"
  camera?: string; // e.g. "48MP Fusion + 5x Telephoto + 48MP Ultra Wide"
  warrantyMonths?: number; // e.g. 12
  network?: string; // e.g. "5G VoLTE Global"
  nepalNTAApproved: boolean; // Nepal Telecommunications Authority MDMS Registered
  imeiStatus?: 'Registered on NTA MDMS' | 'Pending Verification' | 'International Dual-SIM';
  colorVariants?: string[];
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  images: string[];
  rating: number;
  reviewCount: number;
  shopId: string;
  shopName: string;
  shopLogo: string;
  shopVerified: boolean;
  stock: number;
  sku: string;
  warehouseLocation: string;
  reorderThreshold: number;
  supplier: string;
  tags: string[];
  specs: ProductSpec[];
  options?: ProductOption[];
  phoneSpecs?: PhoneSpecs;
  approvalStatus?: 'approved' | 'pending' | 'review_required';
  vendorVerified?: boolean;
  featured?: boolean;
  createdAt: string;
}

export interface Shop {
  id: string;
  name: string;
  handle: string;
  ownerName: string;
  ownerEmail: string;
  bio: string;
  avatar: string;
  banner: string;
  isVerified: boolean;
  rating: number;
  totalSales: number;
  totalRevenue: number;
  joinedDate: string;
  badges: string[];
  location: string;
  shippingPolicy: string;
  returnPolicy: string;
  followerCount: number;
  isSuspended?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedSpecs?: Record<string, string>;
  selectedOptions?: Record<string, string>;
}

export type PaymentGateway =
  | 'babal_pay'
  | 'card'
  | 'apple_pay'
  | 'google_pay'
  | 'klarna'
  | 'crypto'
  | 'cod';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packing'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderLocation {
  city: string;
  hub: string;
  lat: number;
  lng: number;
  statusDescription: string;
  timestamp: string;
}

export interface OrderTimelineItem {
  stage: OrderStatus;
  title: string;
  detail: string;
  timestamp: string;
  completed: boolean;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  items: {
    product: Product;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  paymentMethod: PaymentGateway;
  paymentStatus: 'paid' | 'pending' | 'processing';
  status: OrderStatus;
  orderDate: string;
  estimatedDelivery: string;
  trackingNumber: string;
  carrier: string;
  currentLocation: OrderLocation;
  timeline: OrderTimelineItem[];
  shippingAddress: ShippingAddress;
  otpCode: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedProductIds?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  walletBalance: number;
  babalPoints: number;
  userShopId?: string;
  wishlistIds: string[];
  savedAddresses: ShippingAddress[];
  isCreator?: boolean;
  isStudent?: boolean;
  schoolOrCollege?: string;
  creatorHandle?: string;
  creatorBio?: string;
  completedCourseIds?: string[];
  creatorEarnings?: {
    totalEarned: number;
    pendingPayout: number;
    lifetimeViews: number;
    referralSalesCount: number;
    bountiesCompleted: number;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  isStudent: boolean;
  schoolOrCollege?: string;
  attachedProductId: string;
  likes: number;
  views: number;
  earnings: number;
  readTime: string;
  tags: string[];
  createdAt: string;
}

export interface PromoVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  durationSec: number; // 30 seconds
  creatorName: string;
  creatorAvatar: string;
  creatorHandle: string;
  isStudent: boolean;
  schoolOrCollege?: string;
  attachedProductId: string;
  brandName: string;
  likes: number;
  views: number;
  shares: number;
  commissionRate: number; // in percentage e.g. 10
  earnings: number;
  tags: string[];
  createdAt: string;
}

export interface BrandBounty {
  id: string;
  shopId: string;
  shopName: string;
  shopLogo: string;
  title: string;
  type: '30s_video' | 'blog_review' | 'student_special';
  rewardCash: number;
  commissionPercent: number;
  productId: string;
  productName: string;
  slotsAvailable: number;
  slotsFilled: number;
  guidelines: string[];
  deadline: string;
  status: 'open' | 'claimed' | 'completed';
}

export interface CourseLesson {
  title: string;
  content: string;
  keyTips: string[];
}

export interface CourseQuiz {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface StudentCourse {
  id: string;
  title: string;
  category: 'Video Creation' | 'Digital Marketing' | 'Product Blogging' | 'Financial Literacy';
  duration: string;
  level: 'Beginner' | 'Intermediate';
  rewardBonus: number;
  badge: string;
  description: string;
  lessons: CourseLesson[];
  quiz: CourseQuiz[];
}

export interface AdminAuditLog {
  id: string;
  adminUser: string;
  action: string;
  target: string;
  details: string;
  ip: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface AdminSecurityStatus {
  clearanceLevel: string;
  tlsEncryption: string;
  threatLevel: 'LOW' | 'ELEVATED' | 'CRITICAL';
  lockdownMode: boolean;
  escrowIntegrity: string;
  activeSessions: number;
}

export type VulnerabilitySeverity = 'critical' | 'high' | 'medium' | 'low';
export type VulnerabilityType =
  | 'RCE'
  | 'SQLi_XSS'
  | 'IDOR'
  | 'CSRF'
  | 'AuthBypass'
  | 'EscrowDrain'
  | 'BusinessLogic'
  | 'InfoDisclosure';

export type BountyStatus =
  | 'submitted'
  | 'triaged'
  | 'validated'
  | 'rewarded'
  | 'rejected'
  | 'patched';

export interface BugBountyReport {
  id: string;
  title: string;
  targetAsset: string;
  vulnerabilityType: VulnerabilityType;
  severity: VulnerabilitySeverity;
  rewardOffered: number;
  rewardPaid?: number;
  researcherName: string;
  researcherHandle: string;
  researcherEmail: string;
  researcherWallet: string;
  status: BountyStatus;
  proofOfConcept: string;
  impactSummary: string;
  stepsToReproduce: string;
  submittedAt: string;
  triagedAt?: string;
  patchNotes?: string;
  cveId?: string;
  pgpEncrypted?: boolean;
}

export interface SecurityResearcher {
  id: string;
  rank: number;
  name: string;
  handle: string;
  avatar: string;
  country: string;
  points: number;
  bountiesEarned: number;
  criticalBugsReported: number;
  specialization: string;
  badge: string;
  verifiedResearcher: boolean;
}

export interface OpenSourceModule {
  id: string;
  name: string;
  file: string;
  description: string;
  lines: number;
  language: string;
  status: 'Production' | 'Audited' | 'Open Spec';
  codeSnippet: string;
}

export interface GitCommit {
  hash: string;
  shortHash: string;
  author: string;
  avatar: string;
  message: string;
  timestamp: string;
  verified: boolean;
  additions: number;
  deletions: number;
}

export type BlockCategory = 'MAIN_CREATOR_BLOCK' | 'PRIMARY_CHILD_CUSTOMER_BLOCK';

export interface CustomerChildBlock {
  childId: string;
  orderId: string;
  customerHandle: string;
  customerNodeKey: string;
  amount: number;
  escrowStatus: 'Locked' | 'Released' | 'Disputed';
  carrierOtpHash: string;
  timestamp: string;
}

export interface BlockchainBlock {
  height: number;
  hash: string;
  previousHash: string;
  merkleRoot: string;
  timestamp: string;
  transactionsCount: number;
  minerNode: string;
  minerReward: number;
  difficulty: string;
  nonce: number;
  sizeKb: number;
  status: 'Confirmed' | 'Validating';
  blockCategory?: BlockCategory;
  shopCreatorId?: string;
  shopCreatorName?: string;
  creatorStorefrontHash?: string;
  parentBlockHeight?: number;
  childrenBlocks?: CustomerChildBlock[];
}

export interface P2PPeerNode {
  id: string;
  name: string;
  location: string;
  ipMasked: string;
  publicKey: string;
  status: 'Online' | 'Synchronizing' | 'Standby';
  latencyMs: number;
  hostedBlocksCount: number;
  storageContributedMb: number;
  reputationScore: number;
  lastSeen: string;
}

export interface P2PTokenTransfer {
  txHash: string;
  fromNode: string;
  toNode: string;
  toNodeName: string;
  amount: number;
  timestamp: string;
  fee: number;
  status: 'Confirmed' | 'Pending';
  memo?: string;
}

export interface DeviceHostingMetrics {
  isHostingActive: boolean;
  allocatedStorageMb: number;
  usedStorageMb: number;
  uptimeSeconds: number;
  minedTokens: number;
  nodeHashRateKhs: number;
  blocksValidated: number;
  nodeId: string;
  nodePublicKey: string;
  networkLatencyMs: number;
  peersConnectedCount: number;
  // Mobile Browser Micro-Node Ecosystem
  isMobileNode?: boolean;
  isMobileAutoLinked?: boolean;
  mobileStorageMode?: 'micro_8mb' | 'small_16mb' | 'standard_32mb';
  batteryEcoMode?: boolean;
  autoMiningActive?: boolean;
  mobileDownloadUrl?: string;
}

export interface StakingPosition {
  id: string;
  amountStaked: number;
  stakedAt: string;
  lockPeriodDays: number;
  apyPercent: number;
  accruedRewards: number;
  status: 'Active' | 'Unstaked';
}

export interface WalletTransaction {
  id: string;
  type: 'MINING_REWARD' | 'STAKING_YIELD' | 'STAKED_PRINCIPAL' | 'UNSTAKED_PRINCIPAL' | 'P2P_TRANSFER_OUT' | 'P2P_TRANSFER_IN' | 'ESCROW_PURCHASE' | 'CREATOR_COMMISSION';
  title: string;
  tokenAmount: number;
  fiatValue: number;
  timestamp: string;
  status: 'Completed' | 'Pending';
  txHash: string;
  counterparty?: string;
}

export interface AdminDeviceLink {
  deviceId: string;
  deviceName: string;
  deviceType: 'Android' | 'Desktop' | 'iOS';
  linkedEmail: string;
  linkedPhone?: string;
  isVerified: boolean;
  linkedAt: string;
  lastOtpSentAt?: string;
  lastOtpCode?: string;
  preferredChannel?: 'whatsapp' | 'sms' | 'email';
}

// ==================== NEPAL TOURISM & HOSPITALITY TYPES ====================

export type TourismDestination = 
  | 'Kathmandu' 
  | 'Pokhara' 
  | 'Everest / Khumbu' 
  | 'Chitwan' 
  | 'Lumbini' 
  | 'Nagarkot' 
  | 'Mustang';

export interface HotelRoomType {
  id: string;
  name: string;
  pricePerNightUSD: number;
  capacity: number;
  bedType: string;
  amenities: string[];
  availableRooms: number;
  featuredImage?: string;
}

export interface Hotel {
  id: string;
  name: string;
  localName?: string;
  location: string;
  destination: TourismDestination;
  starRating: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  roomTypes: HotelRoomType[];
  phone: string;
  email: string;
  description: string;
  altitudeMeters?: number;
  distanceToLandmark?: string;
  partnerShopId?: string;
  isGovernmentCertified?: boolean;
}

export interface TourItineraryDay {
  day: number;
  title: string;
  description: string;
  altitudeMeters?: number;
  mealsIncluded: string;
  accommodation: string;
}

export interface TourPackage {
  id: string;
  title: string;
  localTitle?: string;
  destination: TourismDestination;
  durationDays: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Strenuous';
  priceUSD: number;
  originalPriceUSD?: number;
  images: string[];
  itinerary: TourItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  permitsIncluded: string[];
  flightTicketsIncluded: boolean;
  domesticFlightRoute?: string;
  nextDepartureDates: string[];
  maxGroupSize: number;
  rating: number;
  reviewCount: number;
  partnerAgencyName: string;
  partnerContactPhone: string;
  isFeatured?: boolean;
}

export interface TouristGuide {
  id: string;
  name: string;
  localName?: string;
  photo: string;
  licenseNumber: string;
  licenseType: 'NATHM Licensed Tour Guide' | 'TAAN Certified Trekking Guide' | 'IFMGA Mountain Guide' | 'Wildlife Safari Naturalist';
  experienceYears: number;
  languages: string[];
  specialties: string[];
  regions: string[];
  dailyRateUSD: number;
  rating: number;
  reviewCount: number;
  bio: string;
  contactPhone: string;
  contactEmail: string;
  whatsappNumber: string;
  isVerified: boolean;
  totalTreksCompleted: number;
}

export interface TourismBooking {
  id: string;
  bookingType: 'hotel' | 'tour' | 'guide';
  itemId: string;
  itemTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  passportOrId?: string;
  nationality?: string;
  startDate: string;
  endDate?: string;
  guestsCount: number;
  roomTypeId?: string;
  roomTypeName?: string;
  currency: string;
  totalAmount: number;
  amountUSD: number;
  escrowTxHash: string;
  status: 'Confirmed' | 'Pending_Verification' | 'Completed' | 'Cancelled';
  bookingDate: string;
  specialRequests?: string;
  boardingPassQr?: string;
}

export interface PartnerTourismListingForm {
  type: 'hotel' | 'tour' | 'guide';
  title: string;
  destination: TourismDestination;
  location: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  whatsappNumber: string;
  priceUSD: number;
  description: string;
  images: string[];
  amenitiesOrSpecialties: string[];
  roomTypes?: HotelRoomType[];
  itineraryDays?: TourItineraryDay[];
  licenseNumber?: string;
  languages?: string[];
  domesticFlightIncluded?: boolean;
  flightRoute?: string;
  status?: 'Pending_Approval' | 'Live';
}

// ==================== MULTI-SERVICE ECOSYSTEM (NEPAL SUPER-APP) ====================

export type ServiceCategory =
  | 'hotel'        // Hotels, Resorts, Homestays
  | 'bus'          // Deluxe Intercity & Night Tourist Buses
  | 'auto_ride'    // E-Auto, Safa Tempo, Bike Taxi, Car Rental
  | 'medical'      // Tele-doctor, Pharmacy, Home Lab Tests, Ambulance
  | 'jyotish'      // Vedic Astrologers, Kundali Matching, Muhurta
  | 'tour';        // Guides, Trekking, Sightseeing

export type PricingUnit =
  | 'per_night'
  | 'per_seat'
  | 'per_ride'
  | 'per_km'
  | 'per_consultation'
  | 'fixed';

export interface VendorService {
  id: string;
  title: string;
  localTitle?: string;
  category: ServiceCategory;
  providerName: string;
  providerShopId?: string;
  phone: string;
  whatsappNumber?: string;
  email: string;
  location: string;
  city: string;
  pricingUnit: PricingUnit;
  priceUSD: number;
  priceNPR: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  status: 'Active' | 'Pending_Verification' | 'Suspended';
  isVerified: boolean;
  isFeatured?: boolean;
  specs: Record<string, string>;
  availableSlotsOrSeats?: string[];
  createdAt: string;
}

export interface ServiceBooking {
  id: string;
  bookingRef: string;
  serviceId: string;
  serviceTitle: string;
  category: ServiceCategory;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  scheduledDate: string;
  timeSlot?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  quantityOrSeats: number;
  totalAmountUSD: number;
  totalAmountNPR: number;
  currency: string;
  status: 'Confirmed' | 'In_Progress' | 'Completed' | 'Cancelled';
  escrowTxHash: string;
  bookingSlipQr: string;
  createdAt: string;
  specialInstructions?: string;
}

export interface VendorServiceForm {
  title: string;
  localTitle?: string;
  category: ServiceCategory;
  providerName: string;
  phone: string;
  whatsappNumber?: string;
  email: string;
  location: string;
  city: string;
  pricingUnit: PricingUnit;
  priceUSD: number;
  priceNPR: number;
  images: string[];
  description: string;
  specs: Record<string, string>;
}

// ==================== GAME LIVE SCORES SERVICE (NPL, IPL, OTHERS) ====================

export type SportsLeague =
  | 'NPL'           // Nepal Premier League
  | 'IPL'           // Indian Premier League
  | 'ICC_T20'       // ICC T20 / Nepal National Team
  | 'FOOTBALL_NSL'  // Nepal Super League
  | 'FOOTBALL_EPL'; // English Premier League

export type MatchStatus = 'Live' | 'Upcoming' | 'Completed';

export interface SportsTeam {
  id: string;
  name: string;
  shortName: string;
  nameNepali?: string;
  logo: string;
  primaryColor: string;
  captain?: string;
  city?: string;
}

export interface InningsScore {
  runs: number;
  wickets: number;
  overs: number;
  balls: number; // 0 to 5
}

export interface BatsmanScore {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isStriker: boolean;
  dismissal?: string;
}

export interface BowlerScore {
  id: string;
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  isCurrentBowler: boolean;
}

export interface BallCommentary {
  id: string;
  over: number;
  ball: number;
  event: 'dot' | '1' | '2' | '3' | '4' | '6' | 'wicket' | 'wide' | 'noball';
  runs: number;
  description: string;
  descriptionNepali?: string;
  timestamp: string;
}

export interface LiveMatch {
  id: string;
  league: SportsLeague;
  sport: 'cricket' | 'football';
  tournamentName: string;
  matchNumber: string;
  venue: string;
  venueCity: string;
  dateFormatted: string;
  startTime: string;
  status: MatchStatus;
  statusText: string;
  statusTextNepali?: string;
  teamA: SportsTeam;
  teamB: SportsTeam;
  scoreA?: InningsScore;
  scoreB?: InningsScore;
  tossResult?: string;
  currentBatsmen?: BatsmanScore[];
  currentBowler?: BowlerScore;
  recentBalls?: string[];
  commentary?: BallCommentary[];
  requiredRunRate?: number;
  currentRunRate?: number;
  targetRuns?: number;
  poll?: {
    teamAVotes: number;
    teamBVotes: number;
    userVotedTeamId?: string;
  };
  footballData?: {
    homeScore: number;
    awayScore: number;
    minute: number;
    half: '1H' | '2H' | 'HT' | 'FT';
    scorers?: { player: string; minute: number; team: string }[];
  };
}

export interface LeaguePointsEntry {
  teamId: string;
  teamName: string;
  teamShort: string;
  logo: string;
  league: SportsLeague;
  played: number;
  won: number;
  lost: number;
  tiedOrNR: number;
  netRunRate: number;
  points: number;
  form: ('W' | 'L' | 'NR')[];
}




