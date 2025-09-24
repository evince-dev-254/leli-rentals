export interface Category {
  id: string;
  name: string;
  description: string;
  count: string;
  image: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  features: string[];
  popular: boolean;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  location: string;
  images: string[];
  owner: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  rating: number;
  reviews: number;
  features: string[];
  availability: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  listingId: string;
  listing: Listing;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  accountType: 'renter' | 'owner';
  phone?: string;
  location?: string;
  bio?: string;
  rating?: number;
  reviews?: number;
  joinedDate: string;
}
