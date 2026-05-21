export type Room = {
  slug: string;
  name: { tr: string; en: string };
  tagline: { tr: string; en: string };
  capacity: number;
  bed: { tr: string; en: string };
  pricePerNight: number;
  size: number;
  view: 'garden' | 'city' | 'sea';
  block: 'A' | 'B';
  floor: number;
  amenities: string[];
  images: string[];
  description: { tr: string; en: string };
};

// Tüm odalar 40m² süittir — 2 blok × 4 oda = 8 oda
// İsimler ada bitkilerinden alınmıştır
export const rooms: Room[] = [
  {
    slug: 'zeytin',
    name: { tr: 'Zeytin', en: 'Olive' },
    tagline: { tr: 'A Blok · Zemin kat · Bahçeye açılan süit', en: 'Block A · Ground floor · Garden suite' },
    capacity: 3,
    bed: { tr: 'King yatak + tek yatak', en: 'King bed + single bed' },
    pricePerNight: 3200,
    size: 40,
    view: 'garden',
    block: 'A',
    floor: 0,
    amenities: ['ac', 'balcony', 'bath', 'minibar', 'smart-tv', 'wifi', 'view-garden', 'entry'],
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=85&auto=format&fit=crop',
    ],
    description: {
      tr: "A Blok'un zemin katında, ahşap balkonu doğrudan yeşil bahçeye açılan müstakil girişli süit. 40 m²'lik geniş alanda oturma köşesi, Smart TV ve minibar. Sabah ışığı zeytin ağaçlarının arasından sızar.",
      en: "Ground-floor suite in Block A with a wooden balcony opening directly onto the green garden, with a private entrance. 40 m² with a sitting nook, Smart TV and minibar. Morning light filters through the olive trees.",
    },
  },
  {
    slug: 'mersin',
    name: { tr: 'Mersin', en: 'Myrtle' },
    tagline: { tr: 'A Blok · Üst kat · İki yön pencereli', en: 'Block A · Upper floor · Dual-aspect windows' },
    capacity: 3,
    bed: { tr: 'King yatak + tek yatak', en: 'King bed + single bed' },
    pricePerNight: 3400,
    size: 40,
    view: 'garden',
    block: 'A',
    floor: 1,
    amenities: ['ac', 'balcony', 'bath', 'minibar', 'smart-tv', 'wifi', 'view-garden', 'entry'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1600&q=85&auto=format&fit=crop',
    ],
    description: {
      tr: "A Blok'un üst katında, iki yöne açılan pencereleriyle aydınlık bir süit. Ahşap balkonundan bahçenin tamamını görür, sabah kahvenizi rüzgâr eşliğinde içersiniz. 40 m², Smart TV, minibar.",
      en: 'Upper-floor suite in Block A with dual-aspect windows letting light in from two sides. The wooden balcony oversees the entire garden — morning coffee with a breeze. 40 m², Smart TV, minibar.',
    },
  },
  {
    slug: 'lavanta',
    name: { tr: 'Lavanta', en: 'Lavender' },
    tagline: { tr: 'A Blok · Zemin kat · Sokak tarafı', en: 'Block A · Ground floor · Street side' },
    capacity: 2,
    bed: { tr: 'King yatak', en: 'King bed' },
    pricePerNight: 3100,
    size: 40,
    view: 'city',
    block: 'A',
    floor: 0,
    amenities: ['ac', 'balcony', 'bath', 'minibar', 'smart-tv', 'wifi', 'entry'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=85&auto=format&fit=crop',
    ],
    description: {
      tr: "Sokağa bakan A Blok süitinde sabah çarşı sesleri uzaktan duyulur, akşam derin bir sessizlik kaplar. 40 m², ahşap detaylar, Smart TV, minibar. Müstakil girişli.",
      en: 'A street-facing Block A suite — bazaar sounds in the morning from afar, deep silence at night. 40 m², wooden details, Smart TV, minibar. Private entrance.',
    },
  },
  {
    slug: 'defne',
    name: { tr: 'Defne', en: 'Laurel' },
    tagline: { tr: 'A Blok · Üst kat · Aile süiti', en: 'Block A · Upper floor · Family suite' },
    capacity: 4,
    bed: { tr: 'King yatak + 2 tek yatak', en: 'King bed + 2 single beds' },
    pricePerNight: 3700,
    size: 40,
    view: 'garden',
    block: 'A',
    floor: 1,
    amenities: ['ac', 'balcony', 'bath', 'minibar', 'smart-tv', 'wifi', 'view-garden', 'family', 'entry'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=85&auto=format&fit=crop',
    ],
    description: {
      tr: 'Aileler için tasarlanmış 40 m² süit. King yatak + iki tek yatak, üst kat ahşap balkonu, geniş oturma alanı. Bahçeye bakar, Smart TV ve minibar. Çocuklu konuklar için ideal.',
      en: 'A 40 m² family suite. King + two singles, upper-floor wooden balcony, generous sitting area. Garden view, Smart TV and minibar. Ideal for families with kids.',
    },
  },
  {
    slug: 'adacayi',
    name: { tr: 'Adaçayı', en: 'Sage' },
    tagline: { tr: 'B Blok · Zemin kat · Sessiz köşe', en: 'Block B · Ground floor · Quiet corner' },
    capacity: 2,
    bed: { tr: 'King yatak', en: 'King bed' },
    pricePerNight: 3000,
    size: 40,
    view: 'garden',
    block: 'B',
    floor: 0,
    amenities: ['ac', 'balcony', 'bath', 'minibar', 'smart-tv', 'wifi', 'view-garden', 'entry'],
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=85&auto=format&fit=crop',
    ],
    description: {
      tr: "B Blok'un en sessiz köşesi. Bahçeye bakan ahşap balkon, kalın taş duvarlar sayesinde derin sessizlik. 40 m², Smart TV, minibar. Yazmak, okumak, dinlenmek için.",
      en: "Block B's quietest corner. Wooden balcony over the garden, deep silence thanks to thick stone walls. 40 m², Smart TV, minibar. For writing, reading, resting.",
    },
  },
  {
    slug: 'cam',
    name: { tr: 'Çam', en: 'Pine' },
    tagline: { tr: 'B Blok · Üst kat · Oturma köşeli', en: 'Block B · Upper floor · With seating area' },
    capacity: 3,
    bed: { tr: 'King yatak + tek yatak', en: 'King bed + single bed' },
    pricePerNight: 3500,
    size: 40,
    view: 'garden',
    block: 'B',
    floor: 1,
    amenities: ['ac', 'balcony', 'bath', 'minibar', 'smart-tv', 'wifi', 'view-garden', 'entry'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=85&auto=format&fit=crop',
    ],
    description: {
      tr: 'Geniş oturma köşesi olan üst kat süiti. Akşamları balkondan günbatımı, pencerelerden çam ağaçlarının kokusu. 40 m², Smart TV, minibar. Müstakil girişli.',
      en: 'Upper suite with a generous sitting nook. Sunset from the balcony at dusk, pine scent through the windows. 40 m², Smart TV, minibar. Private entrance.',
    },
  },
  {
    slug: 'funda',
    name: { tr: 'Funda', en: 'Heather' },
    tagline: { tr: 'B Blok · Zemin kat · Sokak tarafı', en: 'Block B · Ground floor · Street side' },
    capacity: 2,
    bed: { tr: 'King yatak', en: 'King bed' },
    pricePerNight: 3000,
    size: 40,
    view: 'city',
    block: 'B',
    floor: 0,
    amenities: ['ac', 'balcony', 'bath', 'minibar', 'smart-tv', 'wifi', 'entry'],
    images: [
      'https://images.unsplash.com/photo-1551776235-dde6d4829808?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1600&q=85&auto=format&fit=crop',
    ],
    description: {
      tr: 'Sokağa bakan B Blok süiti. Sabahları çarşı, akşamları sessizlik. Ahşap balkon, taş cephe. 40 m², Smart TV, minibar. Müstakil girişli.',
      en: 'Street-side Block B suite. Bazaar by morning, silence by night. Wooden balcony, stone facade. 40 m², Smart TV, minibar. Private entrance.',
    },
  },
  {
    slug: 'mavi',
    name: { tr: 'Mavi', en: 'Blue' },
    tagline: { tr: 'B Blok · Üst kat · Geniş süit', en: 'Block B · Upper floor · Spacious suite' },
    capacity: 3,
    bed: { tr: 'King yatak + tek yatak', en: 'King bed + single bed' },
    pricePerNight: 3900,
    size: 40,
    view: 'garden',
    block: 'B',
    floor: 1,
    amenities: ['ac', 'balcony', 'bath', 'minibar', 'smart-tv', 'wifi', 'view-garden', 'entry'],
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=85&auto=format&fit=crop',
    ],
    description: {
      tr: "B Blok'un en büyük süiti. Geniş ahşap balkondan adanın ufkunda mavi bir şerit görünür. 40 m², oturma alanı, Smart TV, minibar. Sevdiğimiz oda.",
      en: "Block B's most generous suite. A blue strip of horizon visible from the wide wooden balcony. 40 m², sitting area, Smart TV, minibar. Our favorite.",
    },
  },
];

export const amenityLabels: Record<string, { tr: string; en: string }> = {
  ac: { tr: 'Klima', en: 'Air conditioning' },
  balcony: { tr: 'Ahşap balkon', en: 'Wooden balcony' },
  bath: { tr: 'Özel banyo', en: 'Private bath' },
  minibar: { tr: 'Minibar', en: 'Minibar' },
  'smart-tv': { tr: 'Smart TV', en: 'Smart TV' },
  wifi: { tr: 'Ücretsiz Wi-Fi', en: 'Free Wi-Fi' },
  'view-garden': { tr: 'Bahçe manzarası', en: 'Garden view' },
  'view-sea': { tr: 'Deniz manzarası', en: 'Sea view' },
  family: { tr: 'Aile süiti', en: 'Family suite' },
  entry: { tr: 'Müstakil giriş', en: 'Private entrance' },
  bike: { tr: 'Bisiklet kiralama', en: 'Bicycle rental' },
  parking: { tr: 'Ücretsiz otopark', en: 'Free parking' },
  backgammon: { tr: 'Tavla (ücretsiz)', en: 'Backgammon (free)' },
  breakfast: { tr: 'Esnek kahvaltı', en: 'Flexible breakfast' },
  carrent: { tr: 'Araç kiralama', en: 'Car rental' },
  garden: { tr: 'Yeşil bahçe', en: 'Green garden' },
};

export const hotelAmenities = [
  'breakfast',
  'wifi',
  'parking',
  'ac',
  'balcony',
  'minibar',
  'smart-tv',
  'entry',
  'garden',
  'bike',
  'carrent',
  'family',
];

export type Activity = {
  slug: string;
  num: string;
  title: { tr: string; en: string };
  short: { tr: string; en: string };
  long: { tr: string; en: string };
  image: string;
};

export const activities: Activity[] = [
  {
    slug: 'dalis',
    num: '01',
    title: { tr: 'Dalış', en: 'Diving' },
    short: {
      tr: "Sualtı Milli Parkı'nda mavinin tonlarını saymak için saatler yetmez. Yerel kulüplerle anlaşmamız var.",
      en: "Hours aren't enough to count the shades of blue at the underwater park. We work with local dive clubs.",
    },
    long: {
      tr: "Gökçeada Sualtı Milli Parkı, Türkiye'nin ilk ve tek deniz milli parkı. Şeffaf su, dikey kayalıklar, antik amfora kalıntıları. Tecrübeli ya da yeni başlayan, otelde önerdiğimiz iki kulüp de eğitim verir. Sabah çıkışları 09:00, dönüş öğlene yetişir.",
      en: "Gökçeada Underwater National Park is Turkey's first and only marine national park. Clear water, vertical cliffs, ancient amphora remains. Experienced or beginner — both clubs we recommend offer training. Morning departures at 9:00, back by noon.",
    },
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=85&auto=format&fit=crop',
  },
  {
    slug: 'sorf',
    num: '02',
    title: { tr: 'Rüzgâr Sörfü', en: 'Windsurfing' },
    short: {
      tr: 'Adanın kuzey rüzgârı Avrupa rüzgâr sörfü haritasında işaretli. Mayıs–ekim arası neredeyse hep esiyor.',
      en: "The island's northern wind is marked on Europe's surf map. It blows almost constantly from May to October.",
    },
    long: {
      tr: "Gökçeada Aydıncık plajı dünya rüzgâr sörfü etaplarında. Stabil 4-7 bofor rüzgâr, sığ deniz, geniş kumsal. Otelde tahta ve ders ayarlayabileceğin iki okulla anlaşmamız var.",
      en: 'Aydıncık beach is on world windsurfing stages. Stable 4-7 beaufort wind, shallow sea, wide sand. We work with two schools for board rental and lessons.',
    },
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1600&q=85&auto=format&fit=crop',
  },
  {
    slug: 'bisiklet',
    num: '03',
    title: { tr: 'Bisiklet', en: 'Cycling' },
    short: {
      tr: 'Resepsiyondan kirala. Zeytinli, Tepeköy, Kaleköy — Rum köyleri kendiliğinden bulunur.',
      en: 'Rent at reception. Zeytinli, Tepeköy, Kaleköy — the old Greek villages find themselves.',
    },
    long: {
      tr: 'Otelde 6 bisiklet bulunur, ücretsizdir. Köyler arası yollar genelde sakindir, az trafikli. Önerilen rota: Zeytinli — Tepeköy — Dereköy. Tam günlük tur.',
      en: 'The hotel has 6 bicycles, free of charge. Roads between villages are usually quiet. Suggested route: Zeytinli — Tepeköy — Dereköy. A full day ride.',
    },
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1600&q=85&auto=format&fit=crop',
  },
  {
    slug: 'snorkel',
    num: '04',
    title: { tr: 'Şnorkel', en: 'Snorkelling' },
    short: {
      tr: 'Berrak koylarda şnorkel için ekipman otelde. Yağlıca, Marmaros, Lazkoyu — her birinin ayrı dibi var.',
      en: 'Snorkel gear is at the hotel for our clear bays. Yağlıca, Marmaros, Lazkoyu — each has its own seabed.',
    },
    long: {
      tr: 'Ada kıyısı korunaklı koylarla dolu. Ekipmanı resepsiyondan alın, harita önerelim. En berrak su Marmaros koyunda. Otelden 15-20 dk araçla.',
      en: 'The shoreline is full of sheltered coves. Pick up gear at reception, we suggest a route. The clearest water is at Marmaros cove — 15-20 min by car.',
    },
    image: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=1600&q=85&auto=format&fit=crop',
  },
];

export type Distance = {
  name: { tr: string; en: string };
  value: { tr: string; en: string };
  category?: 'town' | 'beach' | 'transport' | 'culture';
};

export const distances: Distance[] = [
  { name: { tr: 'Gökçeada Çarşı', en: 'Gökçeada Bazaar' }, value: { tr: '5 dk yürüyüş', en: '5 min walk' }, category: 'town' },
  { name: { tr: 'Gökçeada Kent Müzesi', en: 'Gökçeada Town Museum' }, value: { tr: '3 dk yürüyüş', en: '3 min walk' }, category: 'culture' },
  { name: { tr: 'Ada Rüzgârı (yöresel ürün)', en: 'Ada Rüzgârı (local goods)' }, value: { tr: '4 dk yürüyüş', en: '4 min walk' }, category: 'town' },
  { name: { tr: 'Aydıncık Plajı', en: 'Aydıncık Beach' }, value: { tr: '7 km', en: '7 km' }, category: 'beach' },
  { name: { tr: 'Kaleköy Limanı', en: 'Kaleköy Harbour' }, value: { tr: '4 km', en: '4 km' }, category: 'transport' },
  { name: { tr: 'Kuzu Limanı (feribot)', en: 'Kuzu Harbour (ferry)' }, value: { tr: '6 km', en: '6 km' }, category: 'transport' },
  { name: { tr: 'Çanakkale Havalimanı', en: 'Çanakkale Airport' }, value: { tr: '43 km', en: '43 km' }, category: 'transport' },
];

// Yakın restoran ve mekânlar (TripAdvisor verisi)
export type NearbyPlace = {
  name: string;
  category: { tr: string; en: string };
  rating?: number;
  walkMin?: number;
  note?: { tr: string; en: string };
};

export const nearbyPlaces: NearbyPlace[] = [
  {
    name: 'Katalpa Kafe',
    category: { tr: 'Akdeniz mutfağı · kafe', en: 'Mediterranean · café' },
    rating: 5.0,
    walkMin: 4,
    note: { tr: 'Adanın en yüksek puanlı kafelerinden. Brunch için ideal.', en: 'One of the island\'s top-rated cafés. Ideal for brunch.' },
  },
  {
    name: 'Biyer Kafe Dükkân',
    category: { tr: 'Akdeniz · kafe + butik', en: 'Mediterranean · café + boutique' },
    rating: 4.5,
    walkMin: 3,
    note: { tr: 'Kahve + el yapımı ürünler. Sokakta küçük bir keşif.', en: 'Coffee + handmade goods. A small discovery on the street.' },
  },
  {
    name: 'Kokina Restaurant',
    category: { tr: 'Fransız · akşam yemeği', en: 'French · dinner' },
    rating: 4.5,
    walkMin: 6,
    note: { tr: 'Adada Fransız mutfağı — özel akşamlar için rezervasyon önerilir.', en: 'French cuisine on the island — booking recommended for special evenings.' },
  },
  {
    name: 'Ada Rüzgârı',
    category: { tr: 'Yöresel ürün · dükkân', en: 'Local goods · shop' },
    rating: 4.5,
    walkMin: 4,
    note: { tr: 'Adanın peyniri, zeytini, reçeli. Hediyelik için en doğru durak.', en: "The island's cheese, olives, jams. Best stop for souvenirs." },
  },
];

// Galeri görselleri — sitede her yerde kullanılır
export const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Otel cephesi · taş + ahşap', en: 'Hotel facade · stone + wood' } },
  { src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Süit · iç mekân', en: 'Suite · interior' } },
  { src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Süit · oturma köşesi', en: 'Suite · seating area' } },
  { src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Esnek kahvaltı', en: 'Flexible breakfast' } },
  { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Süit · ahşap detay', en: 'Suite · wooden detail' } },
  { src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Gökçeada · ada manzarası', en: 'Gökçeada · island view' } },
  { src: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Köy yolları', en: 'Village paths' } },
  { src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Yatak odası · gün ışığı', en: 'Bedroom · daylight' } },
  { src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Banyo · taş duvar', en: 'Bathroom · stone wall' } },
  { src: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Bisikletle ada', en: 'Cycling the island' } },
  { src: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Aydıncık · rüzgâr sörfü', en: 'Aydıncık · windsurfing' } },
  { src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Sualtı milli parkı', en: 'Underwater national park' } },
  { src: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Aile süiti', en: 'Family suite' } },
  { src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Yatak başı · ahşap', en: 'Headboard · wood' } },
  { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Bahçe · sabah ışığı', en: 'Garden · morning light' } },
  { src: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Türk kahvaltısı', en: 'Turkish breakfast' } },
  { src: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Taş duvar · pencere', en: 'Stone wall · window' } },
  { src: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Marmaros koyu', en: 'Marmaros cove' } },
  { src: 'https://images.unsplash.com/photo-1551776235-dde6d4829808?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Süit detay', en: 'Suite detail' } },
  { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Süit · sade', en: 'Suite · spare' } },
  { src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Ahşap balkon', en: 'Wooden balcony' } },
  { src: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Akdeniz otel cephe', en: 'Mediterranean facade' } },
];

export const hotelInfo = {
  fullName: 'Paradise İmroz Butik Otel',
  phone: '+90 543 399 00 32',
  phoneDisplay: '0543 399 00 32',
  whatsapp: '905433990032',
  email: 'info@paradiseimroz.com',
  address: {
    tr: 'Yaşar Doğu Sk. No:7, Fatih Mh., Gökçeada · Çanakkale',
    en: 'Yaşar Doğu Sk. No:7, Fatih Mh., Gökçeada · Çanakkale',
  },
  coords: { lat: 40.193, lng: 25.886 },
  opened: 2023,
  rooms: 8,
  blocks: 2,
  roomSize: 40,
  rating: 4.9,
  ratingScale: 5,
  bookingRating: 10,
  awards: [
    { tr: 'TripAdvisor Travelers\' Choice', en: "Tripadvisor Travelers' Choice" },
    { tr: 'Booking.com son misafir puanı 10/10', en: 'Booking.com latest guest rating 10/10' },
  ],
  season: { tr: 'Mayıs · Ekim arası', en: 'May · October season' },
  checkIn: '14:00',
  checkOut: '11:00',
};
