import { Hotel } from '@/Types';

export const hotels: Hotel[] = [
  {
    id: '1',
    name: 'Westotel Taverny - Paris',
    location: 'Taverny, France',
    country: 'FR',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    originalPrice: 164,
    discountedPrice: 90,
    currency: 'USDC',
    rating: 4.5,
    reviews: 234,
    discount: 45,
    amenities: ['wifi', 'pool', 'gym', 'parking'],
    coordinates: { lat: 49.0333, lng: 2.2167 },
    ownerWallet: '8MxYBmi2zrcDnnoexv6m3h8YPpk937PxnAwh3gY9Ddwu',
  },
  {
    id: '2',
    name: 'Crown Suites',
    location: 'Baku, Azerbaijan',
    country: 'AZ',
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    originalPrice: 60,
    discountedPrice: 36,
    currency: 'USDC',
    rating: 4.8,
    reviews: 189,
    discount: 40,
    amenities: ['wifi', 'spa', 'gym', 'parking'],
    coordinates: { lat: 40.4093, lng: 49.8671 },
    ownerWallet: '8MxYBmi2zrcDnnoexv6m3h8YPpk937PxnAwh3gY9Ddwu',
  },
  {
    id: '3',
    name: 'Monument Hotel',
    location: 'Zaandam, Netherlands',
    country: 'NL',
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    originalPrice: 144,
    discountedPrice: 89,
    currency: 'USDC',
    rating: 4.4,
    reviews: 312,
    discount: 38,
    amenities: ['wifi', 'restaurant', 'parking'],
    coordinates: { lat: 52.442, lng: 4.8292 },
    ownerWallet: '8MxYBmi2zrcDnnoexv6m3h8YPpk937PxnAwh3gY9Ddwu',
  },
  {
    id: '4',
    name: 'Dubai Marina Hotel',
    location: 'Dubai, UAE',
    country: 'AE',
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
    originalPrice: 300,
    discountedPrice: 150,
    currency: 'USDC',
    rating: 4.9,
    reviews: 567,
    discount: 50,
    amenities: ['wifi', 'pool', 'spa', 'gym', 'parking', 'beach'],
    coordinates: { lat: 25.2048, lng: 55.2708 },
    ownerWallet: '8MxYBmi2zrcDnnoexv6m3h8YPpk937PxnAwh3gY9Ddwu',
  },
  {
    id: '5',
    name: 'Singapore Grand',
    location: 'Singapore',
    country: 'SG',
    images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
    originalPrice: 250,
    discountedPrice: 125,
    currency: 'USDC',
    rating: 4.7,
    reviews: 423,
    discount: 50,
    amenities: ['wifi', 'pool', 'gym', 'spa', 'parking'],
    coordinates: { lat: 1.3521, lng: 103.8198 },
    ownerWallet: '8MxYBmi2zrcDnnoexv6m3h8YPpk937PxnAwh3gY9Ddwu',
  },
  {
    id: '6',
    name: 'Miami Beach Resort',
    location: 'Miami, USA',
    country: 'US',
    images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
    originalPrice: 400,
    discountedPrice: 200,
    currency: 'USDC',
    rating: 4.6,
    reviews: 892,
    discount: 50,
    amenities: ['wifi', 'pool', 'beach', 'gym', 'spa', 'parking'],
    coordinates: { lat: 25.7907, lng: -80.1300 },
    ownerWallet: '8MxYBmi2zrcDnnoexv6m3h8YPpk937PxnAwh3gY9Ddwu',
  },
];

export const filterHotels = (hotels: Hotel[], filters: any): Hotel[] => {
  return hotels.filter((hotel) => {
    if (filters.location && !hotel.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.minPrice && hotel.discountedPrice < filters.minPrice) return false;
    if (filters.maxPrice && hotel.discountedPrice > filters.maxPrice) return false;
    if (filters.rating && hotel.rating < filters.rating) return false;
    return true;
  });
};
