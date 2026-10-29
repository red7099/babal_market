/**
 * Babal Market Localization & Multi-Currency Engine
 * Supports: English, Nepali (नेपाली), Hindi (हिन्दी), Tibetan (བོད་ཡིག), Chinese (中文), Japanese (日本語), German (Deutsch)
 * Currencies: NPR (रू), USD ($), INR (₹), EUR (€), GBP (£), BABAL (🪙), AUD (A$), JPY (¥), CNY (¥)
 */

export type SupportedLanguage = 'en' | 'ne' | 'hi' | 'zh' | 'ja' | 'de' | 'bo';
export type SupportedCurrency = 'NPR' | 'USD' | 'INR' | 'EUR' | 'GBP' | 'BABAL' | 'AUD' | 'JPY' | 'CNY';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export interface CurrencyOption {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  ratePerUSD: number; // Conversion rate: 1 USD = rate * Currency
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English (US)', flag: '🇺🇸' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली (Nepal)', flag: '🇳🇵' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी (India)', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (Simplified)', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'bo', name: 'Tibetan', nativeName: 'བོད་ཡིག (Himalaya)', flag: '🏔️' },
];

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'NPR', symbol: 'रू', name: 'Nepalese Rupee', ratePerUSD: 135.2 },
  { code: 'USD', symbol: '$', name: 'US Dollar', ratePerUSD: 1.0 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', ratePerUSD: 86.5 },
  { code: 'EUR', symbol: '€', name: 'Euro', ratePerUSD: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', ratePerUSD: 0.79 },
  { code: 'BABAL', symbol: '🪙', name: 'Babal Token ($BABAL)', ratePerUSD: 20.0 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', ratePerUSD: 1.55 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', ratePerUSD: 154.5 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', ratePerUSD: 7.24 },
];

/**
 * Convert USD base price to target currency and format with clean symbols
 */
export function formatCurrency(
  amountInUSD: number,
  targetCurrency: SupportedCurrency = 'NPR',
  showCode: boolean = false
): string {
  const curr = SUPPORTED_CURRENCIES.find((c) => c.code === targetCurrency) || SUPPORTED_CURRENCIES[0];
  const converted = amountInUSD * curr.ratePerUSD;

  // Formatting rules per currency
  let formattedNumber = '';
  if (curr.code === 'JPY') {
    formattedNumber = Math.round(converted).toLocaleString();
  } else if (curr.code === 'NPR' || curr.code === 'INR') {
    // South Asian numbering system (lakhs, crores) or standard locale
    formattedNumber = Math.round(converted).toLocaleString('en-IN');
  } else if (curr.code === 'BABAL') {
    formattedNumber = converted.toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    });
  } else {
    formattedNumber = converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (curr.code === 'BABAL') {
    return `${formattedNumber} $BABAL`;
  }

  return showCode ? `${curr.symbol} ${formattedNumber} ${curr.code}` : `${curr.symbol} ${formattedNumber}`;
}

/**
 * Translations Dictionary for English, Nepali, Hindi, Chinese, Japanese, German, Tibetan
 */
export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Nav
    'nav.market': 'Marketplace',
    'nav.tourism': 'Nepal Visit & Tours',
    'nav.shops': 'Shops & Creators',
    'nav.inventory': 'Global Inventory',
    'nav.wallet': '$BABAL Wallet',
    'nav.node': 'P2P Node Hub',
    'nav.orders': 'Track Orders',
    'nav.admin': 'Admin Panel',
    'nav.bounty': 'Security & Bounty',
    'nav.download': 'Download App',
    'nav.searchPlaceholder': 'Search products, hotels, treks, tourist guides...',
    'nav.languageCurrency': 'Language & Currency',
    'nav.cart': 'Cart',

    // Tourism
    'tourism.title': 'Nepal Visit & International Tourism Portal',
    'tourism.subtitle': 'Discover majestic Himalayan treks, world-class heritage hotels, and government-certified Sherpa guides with zero-commission escrow booking.',
    'tourism.tabPackages': 'Tour Packages & Flights',
    'tourism.tabHotels': 'Hotels & Resorts',
    'tourism.tabGuides': 'Certified Guides',
    'tourism.tabAddListing': 'Add / Advertise Your Hotel or Tour',
    'tourism.tabMyBookings': 'My Travel Bookings',
    'tourism.allDestinations': 'All Regions',
    'tourism.kathmandu': 'Kathmandu Valley',
    'tourism.pokhara': 'Pokhara Lakeside',
    'tourism.everest': 'Everest / Khumbu',
    'tourism.chitwan': 'Chitwan Safari',
    'tourism.lumbini': 'Lumbini (Buddha Birthplace)',
    'tourism.nagarkot': 'Nagarkot Sunrise',
    'tourism.mustang': 'Mustang & Annapurna',
    'tourism.bookNow': 'Book with Escrow',
    'tourism.perNight': 'per night',
    'tourism.perDay': 'per day',
    'tourism.duration': 'Duration',
    'tourism.days': 'days',
    'tourism.difficulty': 'Difficulty',
    'tourism.flightIncluded': 'Domestic Flight Included',
    'tourism.permitsIncluded': 'All Permits Included',
    'tourism.verifiedGuide': 'Certified Guide',
    'tourism.languages': 'Languages Spoken',
    'tourism.experience': 'Experience',
    'tourism.licenseNo': 'Govt. License',
    'tourism.viewItinerary': 'View Full Itinerary',
    'tourism.addYourHotelTitle': 'Advertise Your Hotel, Tour Package, or Guide Service',
    'tourism.addYourHotelDesc': 'List your hospitality or adventure travel business on Babal Market with P2P escrow verification and global tourist reach.',

    // Common
    'common.select': 'Select',
    'common.close': 'Close',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save Changes',
    'common.currency': 'Currency',
    'common.language': 'Language',
    'common.verified': 'Verified',
    'common.price': 'Price',
    'common.total': 'Total',
    'common.checkout': 'Proceed to Checkout',
  },
  ne: {
    // Nav
    'nav.market': 'बजार (मार्केट)',
    'nav.tourism': 'नेपाल भ्रमण र टुरहरू',
    'nav.shops': 'पसलहरू र क्रिएटरहरू',
    'nav.inventory': 'ग्लोबल सामान मौज्दात',
    'nav.wallet': '$बाबाल वालेट',
    'nav.node': 'P2P नोड हब',
    'nav.orders': 'अर्डर ट्र्याकिङ',
    'nav.admin': 'एडमिन प्यानल',
    'nav.bounty': 'सुरक्षा र बाउन्टी',
    'nav.download': 'एप डाउनलोड गर्नुहोस्',
    'nav.searchPlaceholder': 'सामान, होटल, पदयात्रा प्याकेज वा टुरिष्ट गाइड खोज्नुहोस्...',
    'nav.languageCurrency': 'भाषा र मुद्रा छनोट',
    'nav.cart': 'झोला (कार्ट)',

    // Tourism
    'tourism.title': 'नेपाल भ्रमण तथा अन्तर्राष्ट्रिय पर्यटन पोर्टल',
    'tourism.subtitle': 'सर्वोच्च सगरमाथा पदयात्रा, पाँच-तारे हेरिटेज होटलहरू, र सरकारी लाइसेन्सप्राप्त शेर्पा गाइडहरू सुरक्षित एस्क्रो भुक्तानीमा बुक गर्नुहोस्।',
    'tourism.tabPackages': 'टुर प्याकेज र हवाइ टिकट',
    'tourism.tabHotels': 'होटल तथा रिसोर्टहरू',
    'tourism.tabGuides': 'प्रमाणित टुर गाइडहरू',
    'tourism.tabAddListing': 'आफ्नो होटल वा टुर थप्नुहोस् / विज्ञापन गर्नुहोस्',
    'tourism.tabMyBookings': 'मेरो यात्रा बुकिङहरू',
    'tourism.allDestinations': 'सबै क्षेत्रहरू',
    'tourism.kathmandu': 'काठमाडौं उपत्यका',
    'tourism.pokhara': 'पोखरा लेकसाइड',
    'tourism.everest': 'सगरमाथा / खुम्बु',
    'tourism.chitwan': 'चितवन सफारी',
    'tourism.lumbini': 'लुम्बिनी (बुद्ध जन्मभूमि)',
    'tourism.nagarkot': 'नगरकोट सूर्योदय',
    'tourism.mustang': 'मुस्ताङ र अन्नपूर्ण',
    'tourism.bookNow': 'सुरक्षित एस्क्रोमा बुक गर्नुहोस्',
    'tourism.perNight': 'प्रति रात',
    'tourism.perDay': 'प्रति दिन',
    'tourism.duration': 'अवधि',
    'tourism.days': 'दिन',
    'tourism.difficulty': 'कठिनाई स्तर',
    'tourism.flightIncluded': 'आन्तरिक हवाइ टिकट समावेश',
    'tourism.permitsIncluded': 'सबै सरकारी अनुमति समावेश',
    'tourism.verifiedGuide': 'प्रमाणित गाइड',
    'tourism.languages': 'बोल्ने भाषाहरू',
    'tourism.experience': 'अनुभव',
    'tourism.licenseNo': 'सरकारी लाइसेन्स नं.',
    'tourism.viewItinerary': 'दैनिक कार्यतालिका हेर्नुहोस्',
    'tourism.addYourHotelTitle': 'आफ्नो होटल, टुर प्याकेज वा गाइड सेवा विज्ञापन गर्नुहोस्',
    'tourism.addYourHotelDesc': 'बाबाल मार्केटमा आफ्नो होटल, ट्राभल एजेन्सी वा गाइड सेवा दर्ता गरी विश्वभरका पर्यटकहरूबाट सिधै बुकिङ पाउनुहोस्।',

    // Common
    'common.select': 'छनोट गर्नुहोस्',
    'common.close': 'बन्द गर्नुहोस्',
    'common.cancel': 'रद्द गर्नुहोस्',
    'common.confirm': 'पुष्टि गर्नुहोस्',
    'common.save': 'परिवर्तन सुरक्षित गर्नुहोस्',
    'common.currency': 'मुद्रा',
    'common.language': 'भाषा',
    'common.verified': 'प्रमाणित',
    'common.price': 'मूल्य',
    'common.total': 'जम्मा',
    'common.checkout': 'भुक्तानी अघि बढाउनुहोस्',
  },
  hi: {
    // Nav
    'nav.market': 'बाज़ार (मार्केट)',
    'nav.tourism': 'नेपाल यात्रा एवं पर्यटन',
    'nav.shops': 'दुकानें एवं निर्माता',
    'nav.inventory': 'इन्वेंटरी',
    'nav.wallet': '$बाबाल वॉलेट',
    'nav.node': 'P2P नोड हब',
    'nav.orders': 'ऑर्डर ट्रैक करें',
    'nav.admin': 'एडमिन पैनल',
    'nav.bounty': 'सुरक्षा एवं बाउंटी',
    'nav.download': 'ऐप डाउनलोड करें',
    'nav.searchPlaceholder': 'उत्पाद, होटल, ट्रेक पैकेज या टूरिस्ट गाइड खोजें...',
    'nav.languageCurrency': 'भाषा एवं मुद्रा',
    'nav.cart': 'कार्ट',

    // Tourism
    'tourism.title': 'नेपाल दर्शन एवं अंतर्राष्ट्रीय पर्यटन पोर्टल',
    'tourism.subtitle': 'हिमालय ट्रेकिंग, हेरिटेज होटल और सरकारी प्रमाणित शेरपा गाइड सुरक्षित एस्क्रो बुकिंग के साथ प्राप्त करें।',
    'tourism.tabPackages': 'टूर पैकेज एवं टिकट',
    'tourism.tabHotels': 'होटल एवं रिसॉर्ट्स',
    'tourism.tabGuides': 'प्रमाणित टूरिस्ट गाइड',
    'tourism.tabAddListing': 'अपना होटल या टूर जोड़ें / विज्ञापन दें',
    'tourism.tabMyBookings': 'मेरी यात्रा बुकिंग',
    'tourism.allDestinations': 'सभी क्षेत्र',
    'tourism.kathmandu': 'काठमांडू घाटी',
    'tourism.pokhara': 'पोखरा लेकसाइड',
    'tourism.everest': 'एवरेस्ट / खुम्बु',
    'tourism.chitwan': 'चितवन सफारी',
    'tourism.lumbini': 'लुम्बिनी (बुद्ध जन्मस्थली)',
    'tourism.nagarkot': 'नगरकोट',
    'tourism.mustang': 'मुस्तांग एवं अन्नपूर्णा',
    'tourism.bookNow': 'एस्क्रो के साथ बुक करें',
    'tourism.perNight': 'प्रति रात',
    'tourism.perDay': 'प्रति दिन',
    'tourism.duration': 'अवधि',
    'tourism.days': 'दिन',
    'tourism.difficulty': 'कठिनाई',
    'tourism.flightIncluded': 'घरेलू उड़ान टिकट शामिल',
    'tourism.permitsIncluded': 'सभी परमिट शामिल',
    'tourism.verifiedGuide': 'प्रमाणित गाइड',
    'tourism.languages': 'बोली जाने वाली भाषाएं',
    'tourism.experience': 'अनुभव',
    'tourism.licenseNo': 'सरकारी लाइसेंस नं.',
    'tourism.viewItinerary': 'पूर्ण यात्रा कार्यक्रम देखें',
    'tourism.addYourHotelTitle': 'अपना होटल, टूर पैकेज या गाइड सेवा सूचीबद्ध करें',
    'tourism.addYourHotelDesc': 'बाबाल मार्केट पर अपने होटल या ट्रैवल व्यवसाय को पंजीकृत करें और शून्य मध्यस्थ कमीशन के साथ दुनिया भर से बुकिंग पाएं।',

    // Common
    'common.select': 'चुनें',
    'common.close': 'बंद करें',
    'common.cancel': 'रद्द करें',
    'common.confirm': 'पुष्टि करें',
    'common.save': 'सहेजें',
    'common.currency': 'मुद्रा',
    'common.language': 'भाषा',
    'common.verified': 'सत्यापित',
    'common.price': 'कीमत',
    'common.total': 'कुल',
    'common.checkout': 'भुगतान करें',
  },
  zh: {
    'nav.market': '市场',
    'nav.tourism': '尼泊尔旅游与探险',
    'nav.shops': '创作者商铺',
    'nav.inventory': '全球库存',
    'nav.wallet': '$BABAL 钱包',
    'nav.node': 'P2P 节点',
    'nav.orders': '订单追踪',
    'nav.admin': '管理控制台',
    'nav.bounty': '安全赏金',
    'nav.download': '下载客户端',
    'nav.searchPlaceholder': '搜索商品、尼泊尔酒店、徒步路线、向导...',
    'nav.languageCurrency': '语言和货币',
    'nav.cart': '购物车',

    'tourism.title': '尼泊尔国际旅游与酒店度假预订门户',
    'tourism.subtitle': '探索珠峰大本营大环线、传统精品酒店与尼泊尔持牌夏尔巴向导，享受区块链安全托管预订。',
    'tourism.tabPackages': '精选路线与机票',
    'tourism.tabHotels': '酒店与度假村',
    'tourism.tabGuides': '官方认证向导',
    'tourism.tabAddListing': '发布/宣传您的酒店与旅游产品',
    'tourism.tabMyBookings': '我的行程与电子票',
    'tourism.allDestinations': '所有地区',
    'tourism.kathmandu': '加德满都谷地',
    'tourism.pokhara': '博卡拉费瓦湖',
    'tourism.everest': '珠穆朗玛峰 / 昆布',
    'tourism.chitwan': '奇特旺国家公园',
    'tourism.lumbini': '蓝毗尼 (佛陀诞生地)',
    'tourism.nagarkot': '纳加阔特观景台',
    'tourism.mustang': '木斯塘与安纳普尔纳',
    'tourism.bookNow': '托管安全预订',
    'tourism.perNight': '每晚',
    'tourism.perDay': '每天',
    'tourism.duration': '行程天数',
    'tourism.days': '天',
    'tourism.difficulty': '难度等级',
    'tourism.flightIncluded': '包含尼泊尔境内机票',
    'tourism.permitsIncluded': '包含所有进山许可',
    'tourism.verifiedGuide': '官方持证向导',
    'tourism.languages': '掌握语言',
    'tourism.experience': '从业经验',
    'tourism.licenseNo': '政府执照号',
    'tourism.viewItinerary': '查看完整每日行程',
    'tourism.addYourHotelTitle': '免费入驻与发布您的酒店或旅游线路',
    'tourism.addYourHotelDesc': '在 Babal 市场上直接展示您的酒店、客栈或徒步向导服务，零中介抽佣。',

    'common.select': '选择',
    'common.close': '关闭',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.save': '保存设置',
    'common.currency': '货币',
    'common.language': '语言',
    'common.verified': '已认证',
    'common.price': '价格',
    'common.total': '总计',
    'common.checkout': '结算',
  },
  ja: {
    'nav.market': 'マーケットプレイス',
    'nav.tourism': 'ネパール旅行＆ツアー',
    'nav.shops': 'ショップ＆クリエイター',
    'nav.inventory': 'グローバル在庫',
    'nav.wallet': '$BABAL ウォレット',
    'nav.node': 'P2P ノードハブ',
    'nav.orders': '配送追跡',
    'nav.admin': '管理者パネル',
    'nav.bounty': 'セキュリティ＆バウンティ',
    'nav.download': 'アプリをダウンロード',
    'nav.searchPlaceholder': '商品、ホテル、エベレストツアー、ガイドを検索...',
    'nav.languageCurrency': '言語・通貨の変更',
    'nav.cart': 'カート',

    'tourism.title': 'ネパール訪問・国際観光ポータル',
    'tourism.subtitle': 'エベレスト街道トレッキング、伝統ヘリテージホテル、政府公認シェルパガイドをエスクロー決済で安心予約。',
    'tourism.tabPackages': 'ツアーパッケージ＆国内線航空券',
    'tourism.tabHotels': 'ホテル＆リゾート',
    'tourism.tabGuides': '公認登山・観光ガイド',
    'tourism.tabAddListing': 'ホテル・ツアーを掲載・宣伝する',
    'tourism.tabMyBookings': 'マイ旅行予約',
    'tourism.allDestinations': '全エリア',
    'tourism.kathmandu': 'カトマンズ盆地',
    'tourism.pokhara': 'ポカラ・フェワ湖畔',
    'tourism.everest': 'エベレスト / クンブ',
    'tourism.chitwan': 'チトワン国立公園',
    'tourism.lumbini': 'ルンビニ (仏陀生誕地)',
    'tourism.nagarkot': 'ナガルコット日の出',
    'tourism.mustang': 'ムスタン＆アンナプルナ',
    'tourism.bookNow': 'エスクローで予約',
    'tourism.perNight': '1泊あたり',
    'tourism.perDay': '1日あたり',
    'tourism.duration': '所要期間',
    'tourism.days': '日間',
    'tourism.difficulty': '難易度',
    'tourism.flightIncluded': '国内線フライト付き',
    'tourism.permitsIncluded': '入山許可証込み',
    'tourism.verifiedGuide': '政府公認ガイド',
    'tourism.languages': '対応言語',
    'tourism.experience': 'ガイド経験',
    'tourism.licenseNo': '政府ライセンス番号',
    'tourism.viewItinerary': '日程詳細を見る',
    'tourism.addYourHotelTitle': 'ホテルやツアー情報を掲載・宣伝',
    'tourism.addYourHotelDesc': 'Babal Marketに直接あなたの宿やトレッキングサービスを登録し、世界中の旅行者から直接予約を受け付けましょう。',

    'common.select': '選択',
    'common.close': '閉じる',
    'common.cancel': 'キャンセル',
    'common.confirm': '確定',
    'common.save': '保存',
    'common.currency': '通貨',
    'common.language': '言語',
    'common.verified': '認証済み',
    'common.price': '価格',
    'common.total': '合計',
    'common.checkout': '注文手続きへ',
  },
  de: {
    'nav.market': 'Marktplatz',
    'nav.tourism': 'Nepal Reisen & Touren',
    'nav.shops': 'Shops & Schöpfer',
    'nav.inventory': 'Globales Inventar',
    'nav.wallet': '$BABAL Wallet',
    'nav.node': 'P2P Knotenpunkt',
    'nav.orders': 'Bestellungen verfolgen',
    'nav.admin': 'Admin-Panel',
    'nav.bounty': 'Sicherheit & Bounty',
    'nav.download': 'App herunterladen',
    'nav.searchPlaceholder': 'Produkte, Nepal Hotels, Treks, Guides suchen...',
    'nav.languageCurrency': 'Sprache & Währung',
    'nav.cart': 'Warenkorb',

    'tourism.title': 'Nepal Internationales Reise- & Hotelportal',
    'tourism.subtitle': 'Entdecken Sie Mount-Everest-Treks, Boutique-Hotels und zertifizierte Sherpa-Guides mit dezentraler Treuhand-Sicherheit.',
    'tourism.tabPackages': 'Tourenpakete & Flüge',
    'tourism.tabHotels': 'Hotels & Lodges',
    'tourism.tabGuides': 'Zertifizierte Guides',
    'tourism.tabAddListing': 'Hotel oder Tour inserieren',
    'tourism.tabMyBookings': 'Meine Buchungen',
    'tourism.allDestinations': 'Alle Regionen',
    'tourism.kathmandu': 'Kathmandu-Tal',
    'tourism.pokhara': 'Pokhara Phewa-See',
    'tourism.everest': 'Everest / Khumbu',
    'tourism.chitwan': 'Chitwan Dschungel',
    'tourism.lumbini': 'Lumbini (Buddhas Geburtsort)',
    'tourism.nagarkot': 'Nagarkot Sonnenaufgang',
    'tourism.mustang': 'Mustang & Annapurna',
    'tourism.bookNow': 'Mit Treuhand buchen',
    'tourism.perNight': 'pro Nacht',
    'tourism.perDay': 'pro Tag',
    'tourism.duration': 'Dauer',
    'tourism.days': 'Tage',
    'tourism.difficulty': 'Schwierigkeit',
    'tourism.flightIncluded': 'Inlandsflug inklusive',
    'tourism.permitsIncluded': 'Alle Genehmigungen inklusive',
    'tourism.verifiedGuide': 'Zertifizierter Guide',
    'tourism.languages': 'Gesprochene Sprachen',
    'tourism.experience': 'Erfahrung',
    'tourism.licenseNo': 'Staatliche Lizenz-Nr.',
    'tourism.viewItinerary': 'Reiseplan ansehen',
    'tourism.addYourHotelTitle': 'Inserieren Sie Ihr Hotel oder Ihre Tour',
    'tourism.addYourHotelDesc': 'Veröffentlichen Sie Ihre nepalesische Lodge oder Trekking-Agentur direkt auf Babal Market.',

    'common.select': 'Auswählen',
    'common.close': 'Schließen',
    'common.cancel': 'Abbrechen',
    'common.confirm': 'Bestätigen',
    'common.save': 'Speichern',
    'common.currency': 'Währung',
    'common.language': 'Sprache',
    'common.verified': 'Verifiziert',
    'common.price': 'Preis',
    'common.total': 'Gesamt',
    'common.checkout': 'Zur Kasse',
  },
  bo: {
    'nav.market': 'ཚོང་ར།',
    'nav.tourism': 'བལ་ཡུལ་ལྟ་སྐོར།',
    'nav.shops': 'ཚོང་ཁང་།',
    'nav.inventory': 'དངོས་ཟོག',
    'nav.wallet': '$BABAL ཁུག་མ།',
    'nav.node': 'P2P དྲ་ཚིགས།',
    'nav.orders': 'དངོས་ཟོག་རྗེས་འདེད།',
    'nav.admin': 'དོ་དམ་པ།',
    'nav.bounty': 'བདེ་འཇགས།',
    'nav.download': 'མཉེན་ཆས་ཕབ་ལེན།',
    'nav.searchPlaceholder': 'དངོས་ཟོག མགྲོན་ཁང་། རི་འཛེག ལམ་སྟོན་པ...',
    'nav.languageCurrency': 'སྐད་རིགས་དང་དངུལ་ལོར།',
    'nav.cart': 'ཚོང་ཟོག་སླེ་པོ།',

    'tourism.title': 'བལ་ཡུལ་རྒྱལ་སྤྱིའི་ཡུལ་སྐོར་དང་མགྲོན་ཁང་དྲ་བ།',
    'tourism.subtitle': 'ཇོ་མོ་གླང་མའི་རི་འཛེག་དང་ཧི་མ་ལ་ཡའི་མགྲོན་ཁང་། གཞུང་འབྲེལ་ལམ་སྟོན་པ་བཅས་བདེ་འཇགས་ངང་མངགས་ཉོ།',
    'tourism.tabPackages': 'ཡུལ་སྐོར་ཐུམ་འབུའི་ལམ་ཐིག་དང་གནམ་གྲུའི་པ་སེ།',
    'tourism.tabHotels': 'མགྲོན་ཁང་དང་སྤྲོ་གསེང་གླིང་།',
    'tourism.tabGuides': 'ཆེད་ལས་ལམ་སྟོན་པ།',
    'tourism.tabAddListing': 'ཁྱེད་ཀྱི་མགྲོན་ཁང་དང་ལམ་ཐིག་གསལ་བསྒྲགས།',
    'tourism.tabMyBookings': 'ངའི་མངགས་ཉོའི་ཐོ་གཞུང་།',
    'tourism.allDestinations': 'ས་ཁུལ་ཡོངས་རྫོགས།',
    'tourism.kathmandu': 'ཀཐམན་གྲུ་ལུང་པ།',
    'tourism.pokhara': 'པོ་ཁ་ར་མཚོ་འགྲམ།',
    'tourism.everest': 'ཇོ་མོ་གླང་མ / ཁུམ་བུ།',
    'tourism.chitwan': 'ཅིཏ་ཝཱན་གླིང་ག',
    'tourism.lumbini': 'ལུམྦི་ནཱི་ (སངས་རྒྱས་འཁྲུངས་ས།)',
    'tourism.nagarkot': 'ན་གར་ཀོཊ།',
    'tourism.mustang': 'གློ་སྨོན་ཐང་དང་ཨན་ན་པུརྣ།',
    'tourism.bookNow': 'བདེ་འཇགས་ངང་མངགས་ཉོ།',
    'tourism.perNight': 'ཞག་རེར།',
    'tourism.perDay': 'ཉིན་རེར།',
    'tourism.duration': 'དུས་ཡུན།',
    'tourism.days': 'ཉིན།',
    'tourism.difficulty': 'དཀའ་ཚེགས།',
    'tourism.flightIncluded': 'ནང་ཁུལ་གནམ་གྲུའི་པ་སེ་ཚུད།',
    'tourism.permitsIncluded': 'ཆོག་མཆན་ཡོངས་རྫོགས་ཚུད།',
    'tourism.verifiedGuide': 'གཞུང་འབྲེལ་ལམ་སྟོན་པ།',
    'tourism.languages': 'ཤེས་པའི་སྐད་རིགས།',
    'tourism.experience': 'ཉམས་མྱོང་།',
    'tourism.licenseNo': 'གཞུང་འབྲེལ་ལག་ཁྱེར་ཨང་གྲངས།',
    'tourism.viewItinerary': 'ཉིན་རེའི་འཆར་གཞི་ཞིབ་ཕྲ།',
    'tourism.addYourHotelTitle': 'ཁྱེད་ཀྱི་མགྲོན་ཁང་དང་ཡུལ་སྐོར་ཞབས་ཞུ་དྲིལ་བསྒྲགས།',
    'tourism.addYourHotelDesc': 'བལ་ཡུལ་གྱི་མགྲོན་ཁང་དང་རི་འཛེག་ལམ་སྟོན་ཞབས་ཞུ་ Babal Market ཐོག་ཐད་ཀར་དྲིལ་བསྒྲགས་བྱོས།',

    'common.select': 'འདེམས་པ།',
    'common.close': 'ཁ་རྒྱག་པ།',
    'common.cancel': 'ཕྱིར་འཐེན།',
    'common.confirm': 'གཏན་འཁེལ།',
    'common.save': 'ཉར་ཚགས།',
    'common.currency': 'དངུལ་ལོར།',
    'common.language': 'སྐད་རིགས།',
    'common.verified': 'དཔང་དཔྱད་བྱས་པ།',
    'common.price': 'རིན་གོང་།',
    'common.total': 'བསྡོམས་འབོར།',
    'common.checkout': 'དངུལ་སྤྲོད་པ།',
  },
};

/**
 * Translation helper hook / getter
 */
export function getTranslation(lang: SupportedLanguage, key: string): string {
  if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
    return TRANSLATIONS[lang][key];
  }
  // Fallback to English
  if (TRANSLATIONS.en[key]) {
    return TRANSLATIONS.en[key];
  }
  return key;
}
