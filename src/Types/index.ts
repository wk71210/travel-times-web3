export interface Hotel {
  id: string;
  name: string;
  location: string;
  country: string;
  images: string[];
  originalPrice: number;
  discountedPrice: number;
  currency: string;
  rating: number;
  reviews: number;
  discount: number;
  amenities: string[];
  coordinates: { lat: number; lng: number };
  ownerWallet: string;
}

export interface User {
  wallet: string;
  username: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  rank: number;
  boost: number;
  suitcases: any[];
  badges: any[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'essential' | 'team' | 'social' | 'special';
  xp: number;
  bonusXp: number;
  completed: boolean;
  order: number;
  steps: any[];
}

export interface Event {
  id: string;
  name: string;
  type: 'conference' | 'bootcamp' | 'coliving' | 'pop-up';
  location: string;
  country: string;
  startDate: string;
  endDate: string;
  image: string;
  category: 'solana' | 'crypto' | 'pop-ups';
}

export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  usdcAmount: number;
  xpEarned: number;
  status: string;
  createdAt: string;
}

export interface AdminConfig {
  adminWallet: string;
  xpRates: { booking: number; review: number; referral: number; quest: number };
  quests: Quest[];
  events: Event[];
  hotels: Hotel[];
}