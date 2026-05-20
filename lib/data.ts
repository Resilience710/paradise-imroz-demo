export type Room = {
  slug: string;
  name: { tr: string; en: string };
  tagline: { tr: string; en: string };
  capacity: number;
  bed: { tr: string; en: string };
  pricePerNight: number;
  size: number;
  view: 'garden' | 'city' | 'sea';
  amenities: string[];
  images: string[];
  description: { tr: string; en: string };
};

export const rooms: Room[] = [
  {
    slug: 'zeytin',
    name: { tr: 'Zeytin', en: 'Olive' },
    tagline: { tr: 'Bahçeye açılan ilk oda', en: 'The first room into the garden' },
    capacity: 2,
    bed: { tr: 'King yatak', en: 'King bed' },
    pricePerNight: 3400,
    size: 22,
    view: 'garden',
    amenities: ['ac', 'balcony', 'bath', 'fridge', 'wifi', 'view-garden'],
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=85&auto=format&fit=crop',
    ],
    description: {
      tr: "Bahçenin tam yanında, zeytin ağaçlarının arasından sabah ışığı sızar. Küçük bir balkon, iki sandalye, sabah kahvesi için yeterli.",
      en: 'Right next to the garden, morning light filters through the olive trees. A small balcony, two chairs, enough for morning coffee.',
    },
  },
  {
    slug: 'mersin',
    name: { tr: 'Mersin', en: 'Myrtle' },
    tagline: { tr: 'Üst kat, bahçe manzarası', en: 'Upper floor, garden view' },
    capacity: 2,
    bed: { tr: 'Queen yatak', en: 'Queen bed' },
    pricePerNight: 3200,
    size: 20,
    view: 'garden',
    amenities: ['ac', 'balcony', 'bath', 'fridge', 'wifi', 'view-garden'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1600&q=85&auto=format&fit=crop',
    ],
    description: {
      tr: 'Üst katın köşesinde, iki yöne pencereli. Bahçeyi bütün açılarıyla görür, rüzgarı dinler.',
      en: 'In the corner of the upper floor, windows on two sides. Sees the garden from all angles, listens to the wind.',
    },
  },
  {
    slug: 'lavanta',
    name: { tr: 'Lavanta', en: 'Lavender' },
    tagline: { tr: 'Çift kişilik, sokak tarafı', en: 'Double, street side' },
    capacity: 2,
    bed: { tr: 'King yatak', en: 'King bed' },
    pricePerNight: 3300,
    size: 21,
    view: 'city',
    amenities: ['ac', 'balcony', 'bath', 'fridge', 'wifi'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=85&auto=format&fit=crop',
    ],
    description: {
      tr: 'Sokağa bakan oda. Sabah çarşı sesleri, akşam sessizlik. Şehrin nabzını uzaktan duyabilir.',
      en: 'A room facing the street. Bazaar sounds in the morning, silence in the evening. The pulse of the town, from a distance.',
    },
  },
  {
    slug: 'defne',
    name: { tr: 'Defne', en: 'Laurel' },
    tagline: { tr: 'Aile odası, üç kişilik', en: 'Family room, three people' },
    capacity: 3,
    bed: { tr: 'King + tek yatak', en: 'King + single bed' },
    pricePerNight: 4100,
    size: 28,
    view: 'garden',
    amenities: ['ac', 'balcony', 'bath', 'fridge', 'wifi', 'family', 'view-garden'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=85&auto=format&fit=crop',
    ],
    description: {
      tr: 'Üç kişilik aile odası. Geniş, bahçeye balkonlu, sade. Çocuklu aileler için planlandı.',
      en: 'A family room for three. Spacious, balcony to the garden, simple. Designed for families.',
    },
  },
  {
    slug: 'adacayi',
    name: { tr: 'Adaçayı', en: 'Sage' },
    tagline: { tr: 'Sessizliğin köşesi', en: "Silence's corner" },
    capacity: 2,
    bed: { tr: 'Queen yatak', en: 'Queen bed' },
    pricePerNight: 3100,
    size: 19,
    view: 'garden',
    amenities: ['ac', 'bath', 'fridge', 'wifi', 'view-garden'],
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=85&auto=format&fit=crop',
    ],
    description: {
      tr: 'Bahçenin en sessiz köşesi. Balkonsuz ama pencereden bahçenin tamamı görünür. Yazmak ya da bir şey okumak için.',
      en: "The garden's quietest corner. No balcony but the whole garden is visible from the window. For writing or reading.",
    },
  },
  {
    slug: 'cam',
    name: { tr: 'Çam', en: 'Pine' },
    tagline: { tr: 'En büyük oda', en: 'The largest room' },
    capacity: 2,
    bed: { tr: 'King yatak', en: 'King bed' },
    pricePerNight: 3800,
    size: 26,
    view: 'garden',
    amenities: ['ac', 'balcony', 'bath', 'fridge', 'wifi', 'view-garden'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=85&auto=format&fit=crop',
    ],
    description: {
      tr: 'En büyük oda, oturma köşesiyle. Çam ağaçlarına bakar, akşamları gün batımı pencereye sığar.',
      en: 'The largest room with a sitting nook. Faces the pine trees, the sunset fits into the window in the evening.',
    },
  },
  {
    slug: 'funda',
    name: { tr: 'Funda', en: 'Heather' },
    tagline: { tr: 'Ekonomik tek kişilik', en: 'Compact single' },
    capacity: 1,
    bed: { tr: 'Tek yatak', en: 'Single bed' },
    pricePerNight: 2400,
    size: 14,
    view: 'city',
    amenities: ['ac', 'bath', 'fridge', 'wifi'],
    images: [
      'https://images.unsplash.com/photo-1551776235-dde6d4829808?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1600&q=85&auto=format&fit=crop',
    ],
    description: {
      tr: 'Tek kişilik, küçük ama tam. Yalnız gezenler için yapıldı. Az ama yeterli.',
      en: 'Single occupancy, small but complete. Made for solo travelers. Less, but enough.',
    },
  },
  {
    slug: 'mavi',
    name: { tr: 'Mavi', en: 'Blue' },
    tagline: { tr: 'Çatı katı, ada manzaralı', en: 'Attic, island view' },
    capacity: 2,
    bed: { tr: 'King yatak', en: 'King bed' },
    pricePerNight: 4200,
    size: 24,
    view: 'sea',
    amenities: ['ac', 'balcony', 'bath', 'fridge', 'wifi', 'view-sea'],
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=85&auto=format&fit=crop',
    ],
    description: {
      tr: 'Çatı katı odası. Eğimli tavan, küçük teras, uzaktan denizin mavisi görünür. En sevdiğimiz oda.',
      en: 'The attic room. Sloped ceiling, small terrace, blue sea visible in the distance. Our favorite.',
    },
  },
];

export type AmenityKey = string;
export const amenityLabels: Record<string, { tr: string; en: string }> = {
  ac: { tr: 'Klima', en: 'Air conditioning' },
  balcony: { tr: 'Balkon', en: 'Balcony' },
  bath: { tr: 'Özel banyo', en: 'Private bath' },
  fridge: { tr: 'Mini buzdolabı', en: 'Mini fridge' },
  wifi: { tr: 'Ücretsiz Wi-Fi', en: 'Free Wi-Fi' },
  'view-garden': { tr: 'Bahçe manzarası', en: 'Garden view' },
  'view-sea': { tr: 'Deniz manzarası', en: 'Sea view' },
  family: { tr: 'Aile odası', en: 'Family room' },
  bike: { tr: 'Bisiklet kiralama', en: 'Bicycle rental' },
  parking: { tr: 'Ücretsiz otopark', en: 'Free parking' },
  backgammon: { tr: 'Tavla (ücretsiz)', en: 'Backgammon (free)' },
  breakfast: { tr: 'Doğal kahvaltı', en: 'Local breakfast' },
};

export const hotelAmenities = [
  'ac',
  'balcony',
  'bath',
  'fridge',
  'wifi',
  'view-garden',
  'bike',
  'family',
  'parking',
  'backgammon',
  'breakfast',
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
    title: { tr: 'Sörf', en: 'Surfing' },
    short: {
      tr: 'Adanın kuzey rüzgarı Avrupa rüzgar sörfü haritasında işaretli. Mayıs–ekim arası neredeyse hep esiyor.',
      en: "The island's northern wind is marked on Europe's surf map. It blows almost constantly from May to October.",
    },
    long: {
      tr: 'Gökçeada Aydıncık plajı dünya rüzgar sörfü etaplarında. Stabil 4-7 bofor rüzgar, sığ deniz, geniş kumsal. Tahta ve ders kiralayabileceğin iki okul var; biri sabit eğitim verir, diğeri sadece tahta kiralar.',
      en: "Aydıncık beach is on world windsurfing stages. Stable 4-7 beaufort wind, shallow sea, wide sand. Two schools rent boards and offer lessons — one with structured training, one just rentals.",
    },
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1600&q=85&auto=format&fit=crop',
  },
  {
    slug: 'bisiklet',
    num: '03',
    title: { tr: 'Bisiklet', en: 'Cycling' },
    short: {
      tr: 'Resepsiyondan kirala. Zeytinli, Tepeköy, Kaleköy — Rum köyleri kendiliğinden bulunur.',
      en: "Rent at reception. Zeytinli, Tepeköy, Kaleköy — the old Greek villages find themselves.",
    },
    long: {
      tr: 'Otelde 6 bisiklet bulunur, ücretsizdir. Köyler arası yollar genelde sakindir, az trafikli. Önerilen rota: Zeytinli — Tepeköy — Dereköy. Tam günlük tur. Yanına su, bir kavun.',
      en: 'The hotel has 6 bicycles, free of charge. Roads between villages are usually quiet, low-traffic. Suggested route: Zeytinli — Tepeköy — Dereköy. A full day ride. Bring water, half a melon.',
    },
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1600&q=85&auto=format&fit=crop',
  },
  {
    slug: 'balikcilik',
    num: '04',
    title: { tr: 'Balıkçılık', en: 'Fishing' },
    short: {
      tr: 'Yerel tekneler güneş doğmadan kalkıyor. İsterseniz biz ayarlarız, akşamı balıkla kapatırız.',
      en: 'Local boats leave before sunrise. We can arrange it. Dinner closes with whatever was caught.',
    },
    long: {
      tr: "Kaleköy limanından çıkış. Çıpa-rota balıkçı tekneleri, biri 6-8 kişilik, diğeri özel. Erken kalkmak şart — 04:30. Dönüşte yakaladığınız balığı limanda temizletip otelde yaptırabilirsiniz.",
      en: 'Departure from Kaleköy harbour. Anchored fishing boats, one for 6-8 people, one private. Early rise is mandatory — 04:30. Back at port the catch can be cleaned and cooked at the hotel.',
    },
    image: 'https://images.unsplash.com/photo-1546872478-bc5d8a8d9e8a?w=1600&q=85&auto=format&fit=crop',
  },
];

export type Distance = {
  name: { tr: string; en: string };
  value: { tr: string; en: string };
};

export const distances: Distance[] = [
  { name: { tr: 'Şehir merkezi', en: 'Town center' }, value: { tr: '5 dk yürüyüş', en: '5 min walk' } },
  { name: { tr: 'Kaleköy Limanı', en: 'Kaleköy Harbour' }, value: { tr: '10 dk araç', en: '10 min drive' } },
  { name: { tr: 'Aydıncık Plajı', en: 'Aydıncık Beach' }, value: { tr: '4 km', en: '4 km' } },
  { name: { tr: 'Kent Müzesi', en: 'Town Museum' }, value: { tr: '15 dk yürüyüş', en: '15 min walk' } },
  { name: { tr: 'Tepeköy', en: 'Tepeköy village' }, value: { tr: '12 km', en: '12 km' } },
  { name: { tr: 'Çanakkale Havalimanı', en: 'Çanakkale Airport' }, value: { tr: '46 km', en: '46 km' } },
];

export const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Bahçe', en: 'Garden' } },
  { src: 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Otel girişi', en: 'Hotel entrance' } },
  { src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Oda', en: 'Room' } },
  { src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Kahvaltı', en: 'Breakfast' } },
  { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'İç mekan', en: 'Interior' } },
  { src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Ada', en: 'Island' } },
  { src: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Manzara', en: 'View' } },
  { src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Yatak odası', en: 'Bedroom' } },
  { src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Banyo', en: 'Bathroom' } },
  { src: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Bisiklet', en: 'Cycling' } },
  { src: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Sörf', en: 'Surfing' } },
  { src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=85&auto=format&fit=crop', alt: { tr: 'Deniz', en: 'Sea' } },
];

export const hotelInfo = {
  phone: '+90 5XX XXX XX XX',
  whatsapp: '905555555555',
  email: 'info@paradiseimroz.com',
  address: {
    tr: 'Fatih Mh. Yaşar Doğu Sk. No:7, Gökçeada · Çanakkale',
    en: 'Fatih Mh. Yaşar Doğu Sk. No:7, Gökçeada · Çanakkale',
  },
  coords: { lat: 40.193, lng: 25.886 },
};
