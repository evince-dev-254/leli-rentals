// ============================================================
// lib/calculator-data.ts
// Earning Calculator data — item rates, popular items,
// currency config for the /earn/[category] pages
// leli.rentals — GuruCrafts
// ============================================================

export interface CurrencyConfig {
  code: string
  symbol: string
  name: string
  flag: string
}

export interface ItemRate {
  name: string
  dailyRate: number // in USD
  avgDaysPerMonth: number
  keywords: string[] // for fuzzy matching user input
}

export interface CategoryCalculatorData {
  id: string
  name: string
  slug: string
  headline: string
  subheadline: string
  placeholder: string
  popularItems: string[]
  rates: ItemRate[]
  defaultRate: ItemRate
  trendingTicker: string[]
  outlinks: { anchor: string; url: string }[]
  seoKeywords: string[]
  image: string
}

// ─── SUPPORTED CURRENCIES ────────────────────────────────────────────────────
export const CURRENCIES: CurrencyConfig[] = [
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling", flag: "🇰🇪" },
  { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "AED", symbol: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", flag: "🇳🇬" },
  { code: "ZAR", symbol: "R", name: "South African Rand", flag: "🇿🇦" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦" },
]

// ─── SUPABASE IMAGE BASE URL ──────────────────────────────────────────────────
const IMG = "https://tdtjevpnqrwqcjnuywrn.supabase.co/storage/v1/object/public/seo-images"

// ─── CATEGORY CALCULATOR DATA ─────────────────────────────────────────────────
export const calculatorCategories: CategoryCalculatorData[] = [
  // ── VEHICLES ──────────────────────────────────────────────────────────────
  {
    id: "vehicles",
    name: "Vehicles",
    slug: "vehicles",
    headline: "How Much Can You Earn Renting Your Vehicle?",
    subheadline: "Find out exactly how much your car, van, truck, or motorcycle could earn you per month on Leli Rentals.",
    placeholder: "e.g. Toyota Camry, Tesla Model 3, Ford F-150...",
    popularItems: ["Toyota Camry", "Tesla Model 3", "Ford F-150", "Honda CR-V", "BMW X5", "Mercedes C-Class", "Toyota Hilux", "Ford Transit Van", "Harley Davidson", "Toyota Land Cruiser"],
    rates: [
      { name: "Tesla", dailyRate: 120, avgDaysPerMonth: 12, keywords: ["tesla", "electric", "ev", "model 3", "model s", "model x", "model y"] },
      { name: "BMW", dailyRate: 110, avgDaysPerMonth: 10, keywords: ["bmw", "beamer", "bimmer"] },
      { name: "Mercedes", dailyRate: 115, avgDaysPerMonth: 10, keywords: ["mercedes", "benz", "amg", "glc", "gle", "c class", "e class"] },
      { name: "Land Rover", dailyRate: 130, avgDaysPerMonth: 8, keywords: ["land rover", "range rover", "defender", "discovery"] },
      { name: "Porsche", dailyRate: 180, avgDaysPerMonth: 6, keywords: ["porsche", "cayenne", "macan", "911"] },
      { name: "Toyota SUV", dailyRate: 90, avgDaysPerMonth: 12, keywords: ["toyota", "land cruiser", "prado", "rav4", "fortuner", "hilux"] },
      { name: "Honda", dailyRate: 75, avgDaysPerMonth: 12, keywords: ["honda", "cr-v", "civic", "accord", "hrv", "pilot"] },
      { name: "Ford Pickup", dailyRate: 100, avgDaysPerMonth: 10, keywords: ["ford", "f-150", "f150", "ranger", "raptor", "pickup"] },
      { name: "Van", dailyRate: 85, avgDaysPerMonth: 14, keywords: ["van", "transit", "sprinter", "hiace", "minivan", "caravan"] },
      { name: "Motorcycle", dailyRate: 50, avgDaysPerMonth: 14, keywords: ["motorcycle", "bike", "motorbike", "harley", "ducati", "kawasaki", "yamaha"] },
      { name: "Sedan", dailyRate: 70, avgDaysPerMonth: 12, keywords: ["sedan", "saloon", "camry", "corolla", "passat", "altima"] },
    ],
    defaultRate: { name: "Average Vehicle", dailyRate: 85, avgDaysPerMonth: 11, keywords: [] },
    trendingTicker: [
      "A user in Dubai listed a Toyota Land Cruiser and earned their first $340.",
      "A user in London listed a BMW X5 and received 3 booking requests today.",
      "A user in Nairobi listed a Toyota Hilux and earned $280 this week.",
      "A user in New York listed a Tesla Model 3 and earned $1,440 last month.",
      "A user in Sydney listed a Ford Transit Van and earned $1,190 this month.",
    ],
    outlinks: [
      { anchor: "Vehicle safety and driving tips from RAC", url: "https://www.rac.co.uk/drive/advice/" },
      { anchor: "How to value your vehicle for rental from Edmunds", url: "https://www.edmunds.com/car-reviews/" },
      { anchor: "Peer-to-peer vehicle rental trends from Forbes", url: "https://www.forbes.com/advisor/personal-finance/" },
    ],
    seoKeywords: ["car rental income calculator", "how much can I earn renting my car", "passive income from my vehicle", "rent out my car", "vehicle rental income estimator 2026"],
    image: `${IMG}/vehicles-owner.jpg`,
  },

  // ── LIVING SPACES ──────────────────────────────────────────────────────────
  {
    id: "living",
    name: "Living Spaces",
    slug: "living-spaces",
    headline: "How Much Can You Earn Renting Your Property?",
    subheadline: "Calculate your potential rental income from your apartment, house, villa, or spare room on Leli Rentals.",
    placeholder: "e.g. Studio Apartment, 2 Bedroom House, Beach Villa...",
    popularItems: ["Studio Apartment", "1 Bedroom Apartment", "2 Bedroom House", "3 Bedroom House", "Beach Villa", "Penthouse", "Furnished Studio", "Holiday Cottage", "Serviced Apartment", "Luxury Villa"],
    rates: [
      { name: "Luxury Villa", dailyRate: 350, avgDaysPerMonth: 12, keywords: ["villa", "luxury villa", "pool villa", "estate"] },
      { name: "Penthouse", dailyRate: 280, avgDaysPerMonth: 10, keywords: ["penthouse", "top floor", "rooftop"] },
      { name: "Beach House", dailyRate: 220, avgDaysPerMonth: 14, keywords: ["beach", "ocean", "sea view", "coastal", "waterfront"] },
      { name: "3 Bedroom House", dailyRate: 150, avgDaysPerMonth: 14, keywords: ["3 bedroom", "three bedroom", "3 bed", "family home"] },
      { name: "2 Bedroom Apartment", dailyRate: 110, avgDaysPerMonth: 16, keywords: ["2 bedroom", "two bedroom", "2 bed", "2br"] },
      { name: "1 Bedroom Apartment", dailyRate: 80, avgDaysPerMonth: 18, keywords: ["1 bedroom", "one bedroom", "1 bed", "1br"] },
      { name: "Studio Apartment", dailyRate: 60, avgDaysPerMonth: 18, keywords: ["studio", "bedsit", "bachelor", "single room"] },
      { name: "Furnished Apartment", dailyRate: 90, avgDaysPerMonth: 16, keywords: ["furnished", "serviced", "corporate housing"] },
      { name: "Cottage", dailyRate: 120, avgDaysPerMonth: 12, keywords: ["cottage", "cabin", "chalet", "bungalow"] },
    ],
    defaultRate: { name: "Average Property", dailyRate: 100, avgDaysPerMonth: 14, keywords: [] },
    trendingTicker: [
      "A host in Paris listed a 2-bedroom apartment and earned their first $1,200.",
      "A host in Dubai listed a furnished studio and received 5 inquiries today.",
      "A host in Nairobi listed a 3-bedroom house and earned $1,400 this month.",
      "A host in London listed a serviced apartment and earned $2,400 last month.",
      "A host in Cape Town listed a beach cottage and earned $1,540 this month.",
    ],
    outlinks: [
      { anchor: "Short-term rental income guide from Investopedia", url: "https://www.investopedia.com/articles/investing/090815/buying-your-first-investment-property-top-10-tips.asp" },
      { anchor: "Global housing rental trends from UN-Habitat", url: "https://unhabitat.org/topic/housing" },
      { anchor: "Property rental market insights from Forbes", url: "https://www.forbes.com/real-estate/" },
    ],
    seoKeywords: ["property rental income calculator", "how much can I earn renting my house", "short term rental income estimator", "airbnb alternative income calculator", "passive income from property 2026"],
    image: `${IMG}/living-spaces-owner.jpg`,
  },

  // ── EQUIPMENT & TOOLS ──────────────────────────────────────────────────────
  {
    id: "equipment",
    name: "Equipment & Tools",
    slug: "equipment-tools",
    headline: "How Much Can You Earn Renting Your Tools & Equipment?",
    subheadline: "Find out how much your power tools, construction equipment, or machinery could earn you per month on Leli Rentals.",
    placeholder: "e.g. Pressure Washer, Excavator, Generator, Concrete Mixer...",
    popularItems: ["Pressure Washer", "Generator", "Concrete Mixer", "Excavator", "Scaffold Tower", "Skid Steer", "Chainsaw", "Jackhammer", "Lawn Mower", "Welding Machine"],
    rates: [
      { name: "Excavator", dailyRate: 400, avgDaysPerMonth: 8, keywords: ["excavator", "digger", "earth mover", "jcb"] },
      { name: "Skid Steer", dailyRate: 300, avgDaysPerMonth: 8, keywords: ["skid steer", "bobcat", "loader"] },
      { name: "Scaffold Tower", dailyRate: 80, avgDaysPerMonth: 14, keywords: ["scaffold", "scaffolding", "tower", "platform"] },
      { name: "Concrete Mixer", dailyRate: 60, avgDaysPerMonth: 12, keywords: ["concrete mixer", "cement mixer", "concrete"] },
      { name: "Generator", dailyRate: 80, avgDaysPerMonth: 12, keywords: ["generator", "genset", "power generator"] },
      { name: "Pressure Washer", dailyRate: 40, avgDaysPerMonth: 10, keywords: ["pressure washer", "power washer", "jet wash"] },
      { name: "Chainsaw", dailyRate: 35, avgDaysPerMonth: 8, keywords: ["chainsaw", "chain saw"] },
      { name: "Jackhammer", dailyRate: 45, avgDaysPerMonth: 8, keywords: ["jackhammer", "jack hammer", "breaker", "demolition"] },
      { name: "Lawn Mower", dailyRate: 30, avgDaysPerMonth: 10, keywords: ["lawn mower", "mower", "grass cutter"] },
      { name: "Welding Machine", dailyRate: 50, avgDaysPerMonth: 10, keywords: ["welder", "welding", "mig", "tig", "arc"] },
      { name: "Power Tools", dailyRate: 55, avgDaysPerMonth: 10, keywords: ["drill", "power tools", "tool set", "sander", "grinder"] },
    ],
    defaultRate: { name: "Average Equipment", dailyRate: 75, avgDaysPerMonth: 10, keywords: [] },
    trendingTicker: [
      "A user in Houston listed a pressure washer and earned their first $320.",
      "A user in Lagos listed a generator and received 6 booking requests this week.",
      "A user in London listed a scaffold tower and earned $840 this month.",
      "A user in Dubai listed an excavator and earned $3,200 last month.",
      "A user in Sydney listed a concrete mixer and earned $720 this month.",
    ],
    outlinks: [
      { anchor: "Equipment safety standards from OSHA", url: "https://www.osha.gov/tools-equipment" },
      { anchor: "Professional tool reviews on Popular Mechanics", url: "https://www.popularmechanics.com/home/tools/" },
      { anchor: "Construction industry insights from Construction Dive", url: "https://www.constructiondive.com/" },
    ],
    seoKeywords: ["equipment rental income calculator", "how much can I earn renting my tools", "passive income from construction equipment", "tool rental income estimator 2026", "rent out my generator"],
    image: `${IMG}/equipment-tools-owner.jpg`,
  },

  // ── ELECTRONICS ────────────────────────────────────────────────────────────
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    headline: "How Much Can You Earn Renting Your Electronics & Gadgets?",
    subheadline: "Calculate how much your laptop, drone, gaming PC, projector, or sound system could earn you per month on Leli Rentals.",
    placeholder: "e.g. MacBook Pro, DJI Mavic, PlayStation 5, Projector...",
    popularItems: ["MacBook Pro", "DJI Mavic 3", "PlayStation 5", "4K Projector", "Gaming PC", "iPad Pro", "VR Headset", "Sound System", "DJ Controller", "4K Monitor"],
    rates: [
      { name: "Gaming PC", dailyRate: 60, avgDaysPerMonth: 10, keywords: ["gaming pc", "gaming computer", "desktop", "rtx", "nvidia"] },
      { name: "MacBook Pro", dailyRate: 65, avgDaysPerMonth: 8, keywords: ["macbook", "mac book", "apple laptop", "macbook pro", "macbook air"] },
      { name: "DJI Drone", dailyRate: 80, avgDaysPerMonth: 8, keywords: ["dji", "drone", "mavic", "phantom", "air 2", "mini"] },
      { name: "VR Headset", dailyRate: 45, avgDaysPerMonth: 8, keywords: ["vr", "virtual reality", "oculus", "meta quest", "psvr", "headset"] },
      { name: "Projector", dailyRate: 50, avgDaysPerMonth: 10, keywords: ["projector", "beamer", "4k projector", "laser projector"] },
      { name: "Sound System", dailyRate: 70, avgDaysPerMonth: 8, keywords: ["sound system", "speakers", "pa system", "audio", "subwoofer"] },
      { name: "DJ Controller", dailyRate: 55, avgDaysPerMonth: 8, keywords: ["dj", "controller", "mixer", "decks", "turntable", "cdj"] },
      { name: "iPad Pro", dailyRate: 35, avgDaysPerMonth: 10, keywords: ["ipad", "tablet", "apple tablet", "ipad pro", "ipad air"] },
      { name: "Gaming Console", dailyRate: 30, avgDaysPerMonth: 12, keywords: ["playstation", "ps5", "xbox", "nintendo", "switch", "console"] },
      { name: "4K Monitor", dailyRate: 25, avgDaysPerMonth: 10, keywords: ["monitor", "display", "screen", "4k monitor", "ultrawide"] },
      { name: "Laptop", dailyRate: 40, avgDaysPerMonth: 10, keywords: ["laptop", "notebook", "computer", "dell", "hp", "lenovo", "asus"] },
    ],
    defaultRate: { name: "Average Electronics", dailyRate: 45, avgDaysPerMonth: 9, keywords: [] },
    trendingTicker: [
      "A user in San Francisco listed a MacBook Pro and earned their first $520.",
      "A user in Dubai listed a DJI Mavic 3 and received 4 booking requests today.",
      "A user in Nairobi listed a sound system and earned $560 this month.",
      "A user in London listed a gaming PC and earned $480 last month.",
      "A user in Singapore listed a projector and earned $400 this month.",
    ],
    outlinks: [
      { anchor: "In-depth electronics reviews on CNET", url: "https://www.cnet.com/reviews/" },
      { anchor: "Latest technology news from The Verge", url: "https://www.theverge.com/" },
      { anchor: "Expert gadget recommendations from Wirecutter", url: "https://www.nytimes.com/wirecutter/electronics/" },
    ],
    seoKeywords: ["electronics rental income calculator", "how much can I earn renting my laptop", "passive income from gadgets", "drone rental income estimator 2026", "rent out my gaming pc"],
    image: `${IMG}/electronics-owner.jpg`,
  },

  // ── FASHION & ACCESSORIES ──────────────────────────────────────────────────
  {
    id: "fashion",
    name: "Fashion & Accessories",
    slug: "fashion-accessories",
    headline: "How Much Can You Earn Renting Your Designer Fashion?",
    subheadline: "Find out how much your designer dresses, handbags, suits, jewellery, or accessories could earn you per month on Leli Rentals.",
    placeholder: "e.g. Gucci Handbag, Evening Gown, Tuxedo, Diamond Necklace...",
    popularItems: ["Designer Handbag", "Evening Gown", "Tuxedo", "Wedding Dress", "Diamond Jewellery", "Designer Suit", "Luxury Watch", "Prom Dress", "Gala Dress", "Designer Shoes"],
    rates: [
      { name: "Designer Handbag", dailyRate: 80, avgDaysPerMonth: 8, keywords: ["handbag", "bag", "purse", "gucci", "louis vuitton", "chanel", "prada", "hermes", "lv"] },
      { name: "Luxury Watch", dailyRate: 100, avgDaysPerMonth: 6, keywords: ["watch", "rolex", "omega", "cartier", "tag heuer", "luxury watch"] },
      { name: "Diamond Jewellery", dailyRate: 120, avgDaysPerMonth: 6, keywords: ["jewellery", "jewelry", "diamond", "necklace", "bracelet", "earrings", "ring"] },
      { name: "Wedding Dress", dailyRate: 150, avgDaysPerMonth: 4, keywords: ["wedding dress", "wedding gown", "bridal", "bride"] },
      { name: "Evening Gown", dailyRate: 90, avgDaysPerMonth: 6, keywords: ["evening gown", "gown", "ball gown", "formal dress"] },
      { name: "Tuxedo", dailyRate: 70, avgDaysPerMonth: 6, keywords: ["tuxedo", "tux", "dinner jacket", "black tie"] },
      { name: "Designer Suit", dailyRate: 80, avgDaysPerMonth: 6, keywords: ["suit", "designer suit", "armani", "hugo boss", "tom ford"] },
      { name: "Prom Dress", dailyRate: 60, avgDaysPerMonth: 5, keywords: ["prom", "prom dress", "formal", "cocktail dress"] },
      { name: "Designer Shoes", dailyRate: 40, avgDaysPerMonth: 6, keywords: ["shoes", "heels", "louboutin", "jimmy choo", "designer shoes"] },
      { name: "Costume", dailyRate: 30, avgDaysPerMonth: 6, keywords: ["costume", "halloween", "fancy dress", "themed"] },
    ],
    defaultRate: { name: "Average Fashion Item", dailyRate: 60, avgDaysPerMonth: 6, keywords: [] },
    trendingTicker: [
      "A user in Milan listed a designer handbag and earned their first $640.",
      "A user in Dubai listed a luxury watch and earned $600 this month.",
      "A user in Nairobi listed a wedding dress and earned $600 this season.",
      "A user in London listed an evening gown and received 5 hire requests today.",
      "A user in New York listed a tuxedo and earned $420 last month.",
    ],
    outlinks: [
      { anchor: "Global fashion trends and style guides on Vogue", url: "https://www.vogue.com/fashion" },
      { anchor: "Fashion industry insights from Business of Fashion", url: "https://www.businessoffashion.com/" },
      { anchor: "Sustainable fashion and circular economy report from ThredUp", url: "https://www.thredup.com/resale/" },
    ],
    seoKeywords: ["fashion rental income calculator", "how much can I earn renting my designer clothes", "passive income from wardrobe", "handbag rental income estimator 2026", "rent out my designer dress"],
    image: `${IMG}/fashion-accessories-owner.jpg`,
  },

  // ── ENTERTAINMENT ──────────────────────────────────────────────────────────
  {
    id: "entertainment",
    name: "Entertainment",
    slug: "entertainment",
    headline: "How Much Can You Earn Renting Your Party & Entertainment Equipment?",
    subheadline: "Calculate how much your DJ equipment, photo booth, bouncy castle, sound system, or event gear could earn you per month on Leli Rentals.",
    placeholder: "e.g. DJ Equipment, Photo Booth, Bouncy Castle, PA System...",
    popularItems: ["DJ Equipment", "Photo Booth", "Bouncy Castle", "PA System", "Stage Lighting", "Karaoke Machine", "Outdoor Cinema", "Party Tent", "Arcade Games", "Cocktail Bar"],
    rates: [
      { name: "Photo Booth", dailyRate: 150, avgDaysPerMonth: 8, keywords: ["photo booth", "photobooth", "selfie booth", "mirror booth"] },
      { name: "DJ Equipment", dailyRate: 120, avgDaysPerMonth: 8, keywords: ["dj equipment", "dj set", "decks", "mixer", "dj gear"] },
      { name: "Bouncy Castle", dailyRate: 100, avgDaysPerMonth: 8, keywords: ["bouncy castle", "bounce house", "inflatable", "jumping castle"] },
      { name: "Outdoor Cinema", dailyRate: 130, avgDaysPerMonth: 6, keywords: ["outdoor cinema", "movie screen", "projector screen", "inflatable screen"] },
      { name: "PA System", dailyRate: 90, avgDaysPerMonth: 8, keywords: ["pa system", "pa", "sound system", "speakers", "public address"] },
      { name: "Stage Lighting", dailyRate: 80, avgDaysPerMonth: 8, keywords: ["stage lighting", "lights", "disco lights", "led lights", "uplighting"] },
      { name: "Party Tent", dailyRate: 100, avgDaysPerMonth: 6, keywords: ["tent", "marquee", "canopy", "party tent", "gazebo"] },
      { name: "Karaoke Machine", dailyRate: 60, avgDaysPerMonth: 8, keywords: ["karaoke", "karaoke machine", "karaoke system"] },
      { name: "Arcade Games", dailyRate: 80, avgDaysPerMonth: 6, keywords: ["arcade", "arcade games", "pinball", "retro games", "arcade machine"] },
      { name: "Cocktail Bar", dailyRate: 70, avgDaysPerMonth: 6, keywords: ["bar", "cocktail bar", "mobile bar", "bar cart"] },
    ],
    defaultRate: { name: "Average Entertainment Equipment", dailyRate: 90, avgDaysPerMonth: 7, keywords: [] },
    trendingTicker: [
      "A user in Las Vegas listed a photo booth and earned their first $1,200.",
      "A user in London listed a bouncy castle and received 7 booking requests this week.",
      "A user in Lagos listed a PA system and earned $720 this month.",
      "A user in Dubai listed DJ equipment and earned $960 last month.",
      "A user in Sydney listed outdoor cinema equipment and earned $780 this month.",
    ],
    outlinks: [
      { anchor: "Event planning tips and guides from Eventbrite", url: "https://www.eventbrite.com/blog/" },
      { anchor: "Entertainment industry news from Billboard", url: "https://www.billboard.com/" },
      { anchor: "Wedding planning and entertainment ideas from The Knot", url: "https://www.theknot.com/" },
    ],
    seoKeywords: ["entertainment equipment rental income calculator", "how much can I earn renting my photo booth", "passive income from party equipment", "bouncy castle rental income estimator 2026", "rent out my dj equipment"],
    image: `${IMG}/entertainment-owner.jpg`,
  },

  // ── UTILITY SPACES ─────────────────────────────────────────────────────────
  {
    id: "utility",
    name: "Utility Spaces",
    slug: "utility-spaces",
    headline: "How Much Can You Earn Renting Your Spare Space?",
    subheadline: "Find out how much your garage, parking space, storage room, workshop, or driveway could earn you per month on Leli Rentals.",
    placeholder: "e.g. Garage, Parking Space, Storage Room, Workshop...",
    popularItems: ["Garage", "Parking Space", "Storage Room", "Workshop", "Driveway", "Warehouse", "Garden Storage", "Loading Bay", "Cold Storage", "Studio Space"],
    rates: [
      { name: "Warehouse", dailyRate: 80, avgDaysPerMonth: 22, keywords: ["warehouse", "industrial unit", "storage unit", "large storage"] },
      { name: "Workshop", dailyRate: 50, avgDaysPerMonth: 16, keywords: ["workshop", "studio", "maker space", "work space"] },
      { name: "Garage", dailyRate: 25, avgDaysPerMonth: 28, keywords: ["garage", "car garage", "double garage"] },
      { name: "Parking Space", dailyRate: 15, avgDaysPerMonth: 28, keywords: ["parking", "parking space", "car park", "parking spot"] },
      { name: "Storage Room", dailyRate: 20, avgDaysPerMonth: 28, keywords: ["storage", "storage room", "storage space", "spare room"] },
      { name: "Driveway", dailyRate: 12, avgDaysPerMonth: 28, keywords: ["driveway", "drive", "private drive"] },
      { name: "Cold Storage", dailyRate: 60, avgDaysPerMonth: 20, keywords: ["cold storage", "freezer", "refrigerated", "cold room"] },
      { name: "Loading Bay", dailyRate: 40, avgDaysPerMonth: 18, keywords: ["loading bay", "loading dock", "delivery bay"] },
    ],
    defaultRate: { name: "Average Space", dailyRate: 25, avgDaysPerMonth: 24, keywords: [] },
    trendingTicker: [
      "A user in London listed a parking space and earned their first $420.",
      "A user in New York listed a storage room and received 4 inquiries today.",
      "A user in Nairobi listed a garage and earned $700 this month.",
      "A user in Dubai listed a workshop and earned $1,100 last month.",
      "A user in Sydney listed a driveway and earned $336 this month.",
    ],
    outlinks: [
      { anchor: "Safe storage guidelines from the EPA", url: "https://www.epa.gov/" },
      { anchor: "Urban real estate and space trends from ULI", url: "https://americas.uli.org/" },
      { anchor: "How to earn passive income from your space from Investopedia", url: "https://www.investopedia.com/passive-income-5069396" },
    ],
    seoKeywords: ["storage space rental income calculator", "how much can I earn renting my garage", "passive income from parking space", "utility space rental income estimator 2026", "rent out my driveway"],
    image: `${IMG}/utility-spaces-owner.jpg`,
  },

  // ── BUSINESS SPACES ────────────────────────────────────────────────────────
  {
    id: "business",
    name: "Business Spaces",
    slug: "business-spaces",
    headline: "How Much Can You Earn Renting Your Office or Business Space?",
    subheadline: "Calculate how much your meeting room, private office, conference room, podcast studio, or coworking desk could earn you per month on Leli Rentals.",
    placeholder: "e.g. Meeting Room, Private Office, Conference Room, Podcast Studio...",
    popularItems: ["Meeting Room", "Private Office", "Conference Room", "Coworking Desk", "Podcast Studio", "Boardroom", "Training Room", "Hot Desk", "Photoshoot Studio", "Event Space"],
    rates: [
      { name: "Conference Room", dailyRate: 200, avgDaysPerMonth: 12, keywords: ["conference room", "conference", "large meeting room"] },
      { name: "Event Space", dailyRate: 300, avgDaysPerMonth: 8, keywords: ["event space", "event venue", "hall", "function room"] },
      { name: "Boardroom", dailyRate: 180, avgDaysPerMonth: 12, keywords: ["boardroom", "board room", "executive meeting"] },
      { name: "Photoshoot Studio", dailyRate: 150, avgDaysPerMonth: 10, keywords: ["photo studio", "photography studio", "photoshoot", "creative studio"] },
      { name: "Podcast Studio", dailyRate: 80, avgDaysPerMonth: 12, keywords: ["podcast studio", "recording studio", "audio studio", "podcast"] },
      { name: "Private Office", dailyRate: 100, avgDaysPerMonth: 16, keywords: ["private office", "office", "enclosed office"] },
      { name: "Meeting Room", dailyRate: 80, avgDaysPerMonth: 14, keywords: ["meeting room", "meeting space", "small meeting"] },
      { name: "Training Room", dailyRate: 120, avgDaysPerMonth: 10, keywords: ["training room", "training space", "seminar room", "classroom"] },
      { name: "Coworking Desk", dailyRate: 30, avgDaysPerMonth: 20, keywords: ["coworking", "hot desk", "shared desk", "flex desk"] },
    ],
    defaultRate: { name: "Average Business Space", dailyRate: 100, avgDaysPerMonth: 12, keywords: [] },
    trendingTicker: [
      "A user in Singapore listed a meeting room and earned their first $1,120.",
      "A user in London listed a podcast studio and received 6 bookings this week.",
      "A user in Nairobi listed a training room and earned $1,200 this month.",
      "A user in Dubai listed a conference room and earned $2,400 last month.",
      "A user in New York listed a photoshoot studio and earned $1,500 this month.",
    ],
    outlinks: [
      { anchor: "The future of flexible workspaces from Forbes", url: "https://www.forbes.com/future-of-work/" },
      { anchor: "Remote work and flexible office insights from HBR", url: "https://hbr.org/topic/remote-work" },
      { anchor: "Commercial real estate market trends from CBRE", url: "https://www.cbre.com/insights/" },
    ],
    seoKeywords: ["business space rental income calculator", "how much can I earn renting my office", "passive income from meeting room", "coworking space rental income estimator 2026", "rent out my conference room"],
    image: `${IMG}/business-spaces-owner.jpg`,
  },

  // ── PHOTOGRAPHY ────────────────────────────────────────────────────────────
  {
    id: "photography",
    name: "Photography",
    slug: "photography",
    headline: "How Much Can You Earn Renting Your Camera & Photography Gear?",
    subheadline: "Find out exactly how much your camera, lenses, lighting, gimbal, or cinema gear could earn you per month on Leli Rentals.",
    placeholder: "e.g. Sony A7III, Canon R5, DJI Ronin, Aputure 600D...",
    popularItems: ["Sony A7III", "Canon R5", "DJI Mavic 3", "DJI Ronin Gimbal", "Aputure 600D", "Canon 70-200mm Lens", "Blackmagic Cinema Camera", "Sony FX3", "GoPro Hero", "Nikon Z6"],
    rates: [
      { name: "Cinema Camera", dailyRate: 200, avgDaysPerMonth: 6, keywords: ["cinema camera", "blackmagic", "red camera", "arri", "cinema"] },
      { name: "Sony FX3", dailyRate: 150, avgDaysPerMonth: 6, keywords: ["sony fx3", "fx3", "fx6", "fx9"] },
      { name: "Canon R5", dailyRate: 120, avgDaysPerMonth: 6, keywords: ["canon r5", "r5", "canon r6", "canon eos r"] },
      { name: "Sony A7 Series", dailyRate: 100, avgDaysPerMonth: 6, keywords: ["sony a7", "a7iii", "a7iv", "a7s", "sony alpha"] },
      { name: "Aputure Light", dailyRate: 80, avgDaysPerMonth: 8, keywords: ["aputure", "600d", "300d", "lighting", "studio light"] },
      { name: "DJI Ronin Gimbal", dailyRate: 60, avgDaysPerMonth: 8, keywords: ["ronin", "gimbal", "stabilizer", "steadicam", "dji ronin"] },
      { name: "Telephoto Lens", dailyRate: 70, avgDaysPerMonth: 6, keywords: ["70-200", "telephoto", "zoom lens", "canon 70-200", "nikon 70-200"] },
      { name: "Wide Angle Lens", dailyRate: 50, avgDaysPerMonth: 6, keywords: ["wide angle", "14mm", "16mm", "24mm", "wide lens"] },
      { name: "DSLR Camera", dailyRate: 60, avgDaysPerMonth: 6, keywords: ["dslr", "canon 5d", "nikon d", "canon 7d"] },
      { name: "GoPro", dailyRate: 25, avgDaysPerMonth: 8, keywords: ["gopro", "action camera", "go pro", "hero"] },
      { name: "Studio Flash", dailyRate: 40, avgDaysPerMonth: 6, keywords: ["flash", "strobe", "studio flash", "speedlight", "profoto"] },
    ],
    defaultRate: { name: "Average Camera Gear", dailyRate: 70, avgDaysPerMonth: 6, keywords: [] },
    trendingTicker: [
      "A photographer in Los Angeles listed a Sony A7III and earned their first $480.",
      "A filmmaker in London listed a DJI Ronin and received 5 booking requests today.",
      "A photographer in Nairobi listed an Aputure 600D and earned $640 this month.",
      "A videographer in Dubai listed a Sony FX3 and earned $900 last month.",
      "A photographer in New York listed a Canon 70-200mm lens and earned $420 this month.",
    ],
    outlinks: [
      { anchor: "Professional photography tutorials and resources from Adobe", url: "https://www.adobe.com/creativecloud/photography.html" },
      { anchor: "In-depth camera and lens reviews on DPReview", url: "https://www.dpreview.com/" },
      { anchor: "Photography inspiration from National Geographic", url: "https://www.nationalgeographic.com/photography/" },
    ],
    seoKeywords: ["camera rental income calculator", "how much can I earn renting my Sony A7", "passive income from camera gear", "photography equipment rental income estimator 2026", "rent out my canon r5"],
    image: `${IMG}/photography-owner.jpg`,
  },

  // ── FITNESS & SPORTS ───────────────────────────────────────────────────────
  {
    id: "fitness",
    name: "Fitness & Sports",
    slug: "fitness-sports",
    headline: "How Much Can You Earn Renting Your Sports & Fitness Equipment?",
    subheadline: "Find out how much your bicycle, kayak, surfboard, ski gear, golf clubs, or gym equipment could earn you per month on Leli Rentals.",
    placeholder: "e.g. Mountain Bike, Kayak, Surfboard, Ski Equipment, Golf Clubs...",
    popularItems: ["Mountain Bike", "Kayak", "Surfboard", "Ski Equipment", "Golf Clubs", "Stand Up Paddleboard", "Treadmill", "Camping Gear", "Rock Climbing Gear", "Tennis Equipment"],
    rates: [
      { name: "E-Bike", dailyRate: 60, avgDaysPerMonth: 14, keywords: ["e-bike", "electric bike", "ebike", "electric bicycle"] },
      { name: "Mountain Bike", dailyRate: 40, avgDaysPerMonth: 12, keywords: ["mountain bike", "mtb", "bicycle", "bike"] },
      { name: "Kayak", dailyRate: 50, avgDaysPerMonth: 10, keywords: ["kayak", "kayaking", "canoe", "paddle"] },
      { name: "Surfboard", dailyRate: 35, avgDaysPerMonth: 12, keywords: ["surfboard", "surf", "shortboard", "longboard"] },
      { name: "Ski Equipment", dailyRate: 60, avgDaysPerMonth: 10, keywords: ["ski", "skiing", "snowboard", "ski equipment", "ski gear"] },
      { name: "Stand Up Paddleboard", dailyRate: 45, avgDaysPerMonth: 10, keywords: ["paddleboard", "sup", "stand up paddleboard", "paddle board"] },
      { name: "Golf Clubs", dailyRate: 40, avgDaysPerMonth: 8, keywords: ["golf", "golf clubs", "golf bag", "iron set"] },
      { name: "Camping Gear Set", dailyRate: 50, avgDaysPerMonth: 8, keywords: ["camping", "tent", "camping gear", "outdoor gear", "hiking"] },
      { name: "Treadmill", dailyRate: 20, avgDaysPerMonth: 20, keywords: ["treadmill", "running machine", "gym equipment"] },
      { name: "Rock Climbing Gear", dailyRate: 30, avgDaysPerMonth: 8, keywords: ["climbing", "rock climbing", "bouldering", "harness", "ropes"] },
      { name: "Tennis Equipment", dailyRate: 15, avgDaysPerMonth: 10, keywords: ["tennis", "racket", "tennis gear"] },
    ],
    defaultRate: { name: "Average Sports Equipment", dailyRate: 40, avgDaysPerMonth: 10, keywords: [] },
    trendingTicker: [
      "A user in Denver listed a mountain bike and earned their first $480.",
      "A user in Sydney listed a surfboard and received 8 booking requests this week.",
      "A user in Cape Town listed kayaks and earned $500 this month.",
      "A user in Queenstown listed ski equipment and earned $600 last month.",
      "A user in Amsterdam listed an e-bike and earned $840 this month.",
    ],
    outlinks: [
      { anchor: "Physical activity and fitness guidelines from the WHO", url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity" },
      { anchor: "Outdoor adventure and sports equipment guides from REI", url: "https://www.rei.com/learn/expert-advice.html" },
      { anchor: "Adventure sports and outdoor lifestyle from Outside Magazine", url: "https://www.outsideonline.com/" },
    ],
    seoKeywords: ["sports equipment rental income calculator", "how much can I earn renting my bicycle", "passive income from fitness equipment", "kayak rental income estimator 2026", "rent out my ski equipment"],
    image: `${IMG}/fitness-sports-owner.jpg`,
  },

  // ── BABY & KIDS ────────────────────────────────────────────────────────────
  {
    id: "baby",
    name: "Baby & Kids",
    slug: "baby-kids",
    headline: "How Much Can You Earn Renting Your Baby & Kids Equipment?",
    subheadline: "Find out how much your pram, car seat, crib, stroller, high chair, or kids gear could earn you per month on Leli Rentals.",
    placeholder: "e.g. Pram, Car Seat, Crib, Stroller, High Chair...",
    popularItems: ["Pram", "Car Seat", "Crib", "Stroller", "High Chair", "Baby Monitor", "Play Gym", "Baby Carrier", "Baby Swing", "Kids Bicycle"],
    rates: [
      { name: "Pram", dailyRate: 20, avgDaysPerMonth: 14, keywords: ["pram", "pushchair", "baby pram", "stroller pram"] },
      { name: "Stroller", dailyRate: 18, avgDaysPerMonth: 14, keywords: ["stroller", "buggy", "baby buggy", "travel system"] },
      { name: "Car Seat", dailyRate: 15, avgDaysPerMonth: 12, keywords: ["car seat", "baby car seat", "child seat", "infant seat"] },
      { name: "Crib", dailyRate: 20, avgDaysPerMonth: 18, keywords: ["crib", "cot", "baby cot", "moses basket", "bassinet"] },
      { name: "High Chair", dailyRate: 10, avgDaysPerMonth: 20, keywords: ["high chair", "highchair", "feeding chair", "booster seat"] },
      { name: "Baby Monitor", dailyRate: 12, avgDaysPerMonth: 16, keywords: ["baby monitor", "monitor", "video monitor", "baby cam"] },
      { name: "Play Gym", dailyRate: 10, avgDaysPerMonth: 14, keywords: ["play gym", "activity gym", "baby gym", "play mat"] },
      { name: "Baby Carrier", dailyRate: 12, avgDaysPerMonth: 12, keywords: ["carrier", "baby carrier", "sling", "wrap", "ergobaby"] },
      { name: "Baby Swing", dailyRate: 12, avgDaysPerMonth: 14, keywords: ["swing", "baby swing", "rocker", "bouncer"] },
      { name: "Kids Bicycle", dailyRate: 10, avgDaysPerMonth: 12, keywords: ["kids bike", "children bike", "balance bike", "kids bicycle"] },
    ],
    defaultRate: { name: "Average Baby Item", dailyRate: 14, avgDaysPerMonth: 14, keywords: [] },
    trendingTicker: [
      "A parent in Dubai listed a pram and earned their first $280.",
      "A user in London listed a car seat and received 6 booking requests this week.",
      "A parent in Nairobi listed a crib and earned $360 this month.",
      "A user in New York listed a stroller and earned $252 last month.",
      "A parent in Sydney listed a high chair and earned $200 this month.",
    ],
    outlinks: [
      { anchor: "Child safety standards and guidelines from UNICEF", url: "https://www.unicef.org/child-safety" },
      { anchor: "Child health and safety recommendations from the AAP", url: "https://www.aap.org/" },
      { anchor: "Baby product safety ratings from Consumer Reports", url: "https://www.consumerreports.org/babies-kids/" },
    ],
    seoKeywords: ["baby gear rental income calculator", "how much can I earn renting my pram", "passive income from baby equipment", "stroller rental income estimator 2026", "rent out my crib"],
    image: `${IMG}/baby-kids-owner.jpg`,
  },
]

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

/** Get calculator category by ID */
export function getCalculatorCategory(id: string): CategoryCalculatorData | undefined {
  return calculatorCategories.find((c) => c.id === id)
}

/** Get calculator category by slug */
export function getCalculatorCategoryBySlug(slug: string): CategoryCalculatorData | undefined {
  return calculatorCategories.find((c) => c.slug === slug)
}

/**
 * Match user input to the best item rate using keyword matching
 * Falls back to category default rate if no match found
 */
export function matchItemRate(input: string, category: CategoryCalculatorData): ItemRate {
  const lower = input.toLowerCase().trim()
  if (!lower) return category.defaultRate

  // Try to find a matching rate by keywords
  for (const rate of category.rates) {
    if (rate.keywords.some((kw) => lower.includes(kw) || kw.includes(lower))) {
      return rate
    }
  }

  // Try partial name match
  for (const rate of category.rates) {
    if (rate.name.toLowerCase().includes(lower) || lower.includes(rate.name.toLowerCase())) {
      return rate
    }
  }

  return category.defaultRate
}

/**
 * Calculate monthly and yearly earnings in USD
 */
export function calculateEarnings(rate: ItemRate): {
  daily: number
  weekly: number
  monthly: number
  yearly: number
  weeklyROI: number // vs $5/week plan
  monthlyROI: number // vs $10/month plan
} {
  const monthly = rate.dailyRate * rate.avgDaysPerMonth
  const yearly = monthly * 12
  const daily = rate.dailyRate
  const weekly = rate.dailyRate * 7

  return {
    daily,
    weekly,
    monthly,
    yearly,
    weeklyROI: Math.round((monthly / 5) * 100), // % ROI vs $5/week
    monthlyROI: Math.round((monthly / 10) * 100), // % ROI vs $10/month
  }
}

/**
 * Format a USD amount into the selected currency
 * Rates are fetched from Supabase and passed in
 */
export function formatInCurrency(
  usdAmount: number,
  currency: CurrencyConfig,
  rate: number
): string {
  const converted = usdAmount * rate
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(converted)
  return `${currency.symbol}${formatted}`
}