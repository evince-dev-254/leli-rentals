import {
  Car,
  Home,
  Wrench,
  Smartphone,
  Shirt,
  Music,
  PartyPopper,
  Camera,
  Dumbbell,
  Baby,
  Briefcase,
  Bike,
} from "lucide-react"

export interface Subcategory {
  name: string
  image: string
}

export const categories = [
  {
    id: "vehicles",
    name: "Vehicles",
    description: "Cars, motorcycles, trucks, and more for your transportation needs",
    longDescription:
      "Find the perfect vehicle for any occasion. From luxury cars for special events to practical trucks for moving, we have it all.",
    count: 1800,
    icon: Car,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    color: "from-orange-500/20 to-orange-600/10",
    featured: true,
    subcategories: [
      { name: "Sedans", image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop" },
      { name: "SUVs", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop" },
      {
        name: "Luxury Cars",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop",
      },
      { name: "Sports Cars", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop" },
      { name: "Motorcycles", image: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=400&h=300&fit=crop" },
      { name: "Trucks", image: "https://images.unsplash.com/photo-1566008885218-90abf9200ddb?w=400&h=300&fit=crop" },
      { name: "Vans", image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop" },
      { name: "Buses", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop" },
      { name: "Boats", image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400&h=300&fit=crop" },
      { name: "Pickups", image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=300&fit=crop" },
      {
        name: "Electric Vehicles",
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop",
      },
      {
        name: "Classic Cars",
        image: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=400&h=300&fit=crop",
      },
      { name: "Private jets", image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=300&fit=crop" },
      { name: "Helicopters", image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=300&fit=crop" }
    ],
  },
  {
    id: "living",
    name: "Living Spaces",
    description: "Homes, apartments, and vacation stays",
    longDescription:
      "Discover comfortable stays for your trips. From cozy apartments to luxurious vacation homes and coliving spaces.",
    count: 2500,
    icon: Home,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    color: "from-blue-500/20 to-blue-600/10",
    featured: true,
    subcategories: [
      { name: "Apartments", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop" },
      { name: "Studio Flats", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop" },
      { name: "Penthouses", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop" },
      { name: "Duplexes", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop" },
      { name: "Single-family Homes", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop" },
      { name: "Townhouses", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop" },
      { name: "Luxury Villas", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop" },
      { name: "Bungalows", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop" },
      { name: "Coliving Spaces", image: "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=400&h=300&fit=crop" },
      { name: "Student Hostels", image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop" },
      { name: "Cottages", image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&h=300&fit=crop" },
      { name: "Cabins", image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop" },
      { name: "Beach Houses", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop" },
      { name: "Farmhouses", image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=400&h=300&fit=crop" }
    ],
  },
  {
    id: "equipment",
    name: "Equipment & Tools",
    description: "Professional tools and machinery for any project",
    longDescription:
      "Access professional-grade equipment without the purchase cost. Perfect for construction, landscaping, and DIY projects.",
    count: 3200,
    icon: Wrench,
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&q=80",
    color: "from-green-500/20 to-green-600/10",
    featured: true,
    subcategories: [
      {
        name: "Power Tools",
        image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop",
      },
      {
        name: "Hand Tools",
        image: "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?w=400&h=300&fit=crop",
      },
      {
        name: "Construction",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop",
      },
      { name: "Landscaping", image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400&h=300&fit=crop" },
      { name: "Cleaning", image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop" },
      {
        name: "Industrial",
        image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=300&fit=crop",
      },
      {
        name: "Generators",
        image: "https://images.unsplash.com/photo-1621905252472-943afaa20e20?w=400&h=300&fit=crop",
      },
      {
        name: "Compressors",
        image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=300&fit=crop",
      },
      { name: "Welding", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop" },
      { name: "Painting", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop" },
      { name: "Plumbing", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop" },
      {
        name: "Electrical",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
      },
      {
        name: "Party Rentals",
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
      },
      {
        name: "Outdoor Gear",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: "electronics",
    name: "Electronics",
    description: "Gadgets, cameras, and tech gear for rent",
    longDescription:
      "Rent the latest technology without the full investment. Perfect for events, projects, or trying before buying.",
    count: 950,
    icon: Smartphone,
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80",
    color: "from-purple-500/20 to-purple-600/10",
    featured: false,
    subcategories: [
      { name: "Cameras", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop" },
      { name: "Laptops", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop" },
      {
        name: "Audio Equipment",
        image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop",
      },
      {
        name: "Gaming Consoles",
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop",
      },
      { name: "Drones", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop" },
      {
        name: "Projectors",
        image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop",
      },
      { name: "Tablets", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop" },
      {
        name: "VR Headsets",
        image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=300&fit=crop",
      },
      { name: "Smart TVs", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop" },
      { name: "Speakers", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop" },
      {
        name: "Microphones",
        image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop",
      },
      {
        name: "Lighting Equipment",
        image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: "fashion",
    name: "Fashion & Accessories",
    description: "Designer clothing, accessories, and jewelry",
    longDescription:
      "Look stunning for special occasions without buying. Rent designer pieces and accessories for any event.",
    count: 1200,
    icon: Shirt,
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
    color: "from-pink-500/20 to-pink-600/10",
    featured: false,
    subcategories: [
      {
        name: "Evening Dresses",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=300&fit=crop",
      },
      {
        name: "Wedding Gowns",
        image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400&h=300&fit=crop",
      },
      { name: "Suits", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop" },
      { name: "Tuxedos", image: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=400&h=300&fit=crop" },
      { name: "Jewelry", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop" },
      { name: "Handbags", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop" },
      { name: "Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" },
      {
        name: "Traditional Wear",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop",
      },
      { name: "Costumes", image: "https://images.unsplash.com/photo-1509783236416-c9ad59bae472?w=400&h=300&fit=crop" },
      { name: "Watches", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop" },
      {
        name: "Sunglasses",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
      },
      {
        name: "Accessories",
        image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    description: "Music instruments, gaming, and party equipment",
    longDescription:
      "Everything you need for entertainment. From musical instruments to party supplies and gaming setups.",
    count: 850,
    icon: Music,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    color: "from-yellow-500/20 to-yellow-600/10",
    featured: false,
    subcategories: [
      {
        name: "Musical Instruments",
        image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=300&fit=crop",
      },
      {
        name: "DJ Equipment",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      },
      {
        name: "Gaming Consoles",
        image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=400&h=300&fit=crop",
      },
      {
        name: "Karaoke Systems",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
      },
      {
        name: "Board Games",
        image: "https://images.unsplash.com/photo-1611891487122-207579d67d98?w=400&h=300&fit=crop",
      },
      {
        name: "Party Supplies",
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
      },
      {
        name: "Bouncy Castles",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      },
      {
        name: "Photo Booths",
        image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&h=300&fit=crop",
      },
      {
        name: "Sound Systems",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop",
      },
      {
        name: "Stage Lighting",
        image: "https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=400&h=300&fit=crop",
      },
      {
        name: "Fog Machines",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop",
      },
      {
        name: "Arcade Games",
        image: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: "utility",
    name: "Utility Spaces",
    description: "Venues and spaces for all occasions",
    longDescription:
      "Find the perfect venue for weddings, conferences, parties, and more. Various sizes and styles available.",
    count: 600,
    icon: PartyPopper,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    color: "from-teal-500/20 to-teal-600/10",
    featured: true,
    subcategories: [
      { name: "Banquet Halls", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop" },
      { name: "Conference Rooms", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=300&fit=crop" },
      { name: "Wedding Venues", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop" },
      { name: "Rooftop Terraces", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=300&fit=crop" },
      { name: "Art Galleries", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
      { name: "Creative Studios", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
      { name: "Self-storage Units", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
      { name: "Parking Spaces", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
      { name: "Shipping Containers", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" }
    ],
  },
  {
    id: "business",
    name: "Business Spaces",
    description: "Professional spaces for businesses and entrepreneurs",
    longDescription: "Find the perfect venue for your business needs, from private offices to warehouses.",
    count: 1200,
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    color: "from-gray-500/20 to-gray-600/10",
    featured: false,
    subcategories: [
      { name: "Private offices", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
      { name: "Coworking desks", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
      { name: "Executive suites", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
      { name: "Shop fronts", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
      { name: "Showrooms", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
      { name: "Pop-up shops", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
      { name: "Kiosks", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
      { name: "Warehouses", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
      { name: "Cold storage", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
      { name: "Workshops", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" }
    ],
  },
  {
    id: "photography",
    name: "Photography",
    description: "Cameras, lighting, and studio equipment",
    longDescription: "Professional photography gear for your shoots. From cameras to lighting setups and backdrops.",
    count: 450,
    icon: Camera,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    color: "from-indigo-500/20 to-indigo-600/10",
    featured: false,
    subcategories: [
      {
        name: "DSLR Cameras",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
      },
      {
        name: "Mirrorless Cameras",
        image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&h=300&fit=crop",
      },
      { name: "Lenses", image: "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=400&h=300&fit=crop" },
      {
        name: "Studio Lighting",
        image: "https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?w=400&h=300&fit=crop",
      },
      { name: "Backdrops", image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=300&fit=crop" },
      { name: "Tripods", image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop" },
      { name: "Gimbals", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop" },
      {
        name: "Reflectors",
        image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop",
      },
      {
        name: "Light Stands",
        image: "https://images.unsplash.com/photo-1574717025058-2f8737d2e2b7?w=400&h=300&fit=crop",
      },
      { name: "Softboxes", image: "https://images.unsplash.com/photo-1603539947678-cd3954ed515d?w=400&h=300&fit=crop" },
      {
        name: "Flash Units",
        image: "https://images.unsplash.com/photo-1617575521317-d2974f3b56d2?w=400&h=300&fit=crop",
      },
      {
        name: "Video Cameras",
        image: "https://images.unsplash.com/photo-1598743400863-0201c7e1445b?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: "fitness",
    name: "Fitness & Sports",
    description: "Gym equipment and sports gear",
    longDescription: "Stay active with rental fitness equipment. Perfect for home workouts or sports activities.",
    count: 380,
    icon: Dumbbell,
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80",
    color: "from-red-500/20 to-red-600/10",
    featured: false,
    subcategories: [
      {
        name: "Treadmills",
        image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=300&fit=crop",
      },
      {
        name: "Exercise Bikes",
        image: "https://images.unsplash.com/photo-1591291621164-2c6367723315?w=400&h=300&fit=crop",
      },
      {
        name: "Weight Sets",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
      },
      {
        name: "Yoga Equipment",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      },
      { name: "Tennis Gear", image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop" },
      {
        name: "Golf Clubs",
        image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=300&fit=crop",
      },
      {
        name: "Camping Gear",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop",
      },
      {
        name: "Hiking Equipment",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
      },
      {
        name: "Swimming Gear",
        image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400&h=300&fit=crop",
      },
      {
        name: "Football Equipment",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop",
      },
      {
        name: "Basketball Gear",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
      },
      {
        name: "Water Sports",
        image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: "baby",
    name: "Baby & Kids",
    description: "Strollers, cribs, and children's items",
    longDescription: "Quality baby gear for traveling families. Rent instead of carrying heavy equipment on trips.",
    count: 290,
    icon: Baby,
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80",
    color: "from-sky-500/20 to-sky-600/10",
    featured: false,
    subcategories: [
      { name: "Strollers", image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop" },
      { name: "Cribs", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop" },
      { name: "Car Seats", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=300&fit=crop" },
      { name: "High Chairs", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop" },
      { name: "Playpens", image: "https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=400&h=300&fit=crop" },
      {
        name: "Baby Monitors",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop",
      },
      { name: "Toys", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop" },
      { name: "Swings", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop" },
      {
        name: "Baby Carriers",
        image: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=400&h=300&fit=crop",
      },
      {
        name: "Booster Seats",
        image: "https://images.unsplash.com/photo-1590698933947-a202b069a861?w=400&h=300&fit=crop",
      },
      {
        name: "Changing Tables",
        image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&h=300&fit=crop",
      },
      {
        name: "Baby Walkers",
        image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: "office",
    name: "Office & Business",
    description: "Office furniture and business equipment",
    longDescription: "Professional office setups for temporary workspaces, events, or expanding businesses.",
    count: 520,
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    color: "from-slate-500/20 to-slate-600/10",
    featured: false,
    subcategories: [
      { name: "Desks", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop" },
      {
        name: "Office Chairs",
        image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=300&fit=crop",
      },
      {
        name: "Conference Tables",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
      },
      { name: "Computers", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop" },
      {
        name: "Projectors",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&h=300&fit=crop",
      },
      { name: "Printers", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop" },
      { name: "Scanners", image: "https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=400&h=300&fit=crop" },
      {
        name: "Whiteboards",
        image: "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=400&h=300&fit=crop",
      },
      {
        name: "Filing Cabinets",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      },
      {
        name: "Reception Furniture",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop",
      },
      {
        name: "Partitions",
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop",
      },
      {
        name: "Standing Desks",
        image: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: "bikes",
    name: "Bikes & Scooters",
    description: "Bicycles, e-bikes, and electric scooters",
    longDescription: "Eco-friendly transportation options. Perfect for exploring cities or daily commuting.",
    count: 340,
    icon: Bike,
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80",
    color: "from-emerald-500/20 to-emerald-600/10",
    featured: false,
    subcategories: [
      {
        name: "Mountain Bikes",
        image: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=400&h=300&fit=crop",
      },
      {
        name: "Road Bikes",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop",
      },
      { name: "E-Bikes", image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop" },
      {
        name: "Electric Scooters",
        image: "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=400&h=300&fit=crop",
      },
      {
        name: "Kids Bikes",
        image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop",
      },
      { name: "BMX Bikes", image: "https://images.unsplash.com/photo-1583467875263-d50dec37a88c?w=400&h=300&fit=crop" },
      {
        name: "Folding Bikes",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      },
      {
        name: "Tandem Bikes",
        image: "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=400&h=300&fit=crop",
      },
      {
        name: "Cargo Bikes",
        image: "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400&h=300&fit=crop",
      },
      {
        name: "Cruiser Bikes",
        image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&h=300&fit=crop",
      },
      {
        name: "Hybrid Bikes",
        image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=300&fit=crop",
      },
      { name: "Tricycles", image: "https://images.unsplash.com/photo-1565803974275-dccd2f933cbb?w=400&h=300&fit=crop" },
    ],
  },
]

export const getCategoryById = (id: string) => categories.find((cat) => cat.id === id)
export const getFeaturedCategories = () => categories.filter((cat) => cat.featured)
export const getAllSubcategories = () => {
  const allSubs: string[] = []
  categories.forEach((cat) => {
    cat.subcategories.forEach((sub) => {
      if (!allSubs.includes(sub.name)) allSubs.push(sub.name)
    })
  })
  return allSubs.sort()
}
