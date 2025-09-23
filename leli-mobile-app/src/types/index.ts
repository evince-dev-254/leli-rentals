// Type definitions for the mobile app
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  location?: string;
  bio?: string;
  website?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  amenities: string[];
  available: boolean;
  category: string;
  owner: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
    phone?: string;
  };
  fullDescription: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Booking {
  id: string;
  listingId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  listingId?: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
}

export interface Location {
  id: string;
  name: string;
  county: string;
  region: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  population?: number;
  popular: boolean;
}

export interface UserSettings {
  uid: string;
  profile: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    bio?: string;
    website?: string;
    avatar?: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    bookingUpdates: boolean;
    paymentReminders: boolean;
    securityAlerts: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowMessages: boolean;
    showOnlineStatus: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
  };
}
