import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Booking, Quest, Event, Hotel, AdminConfig } from '@/types/index';
import { ADMIN_WALLET } from '@/lib/solana/config';
import { hotels as defaultHotels } from '@/lib/data/hotels';

const DEFAULT_CONFIG: AdminConfig = {
  adminWallet: ADMIN_WALLET,
  xpRates: { booking: 500, review: 100, referral: 200, quest: 100 },
  quests: [],
  events: [],
  hotels: defaultHotels,
};

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  adminConfig: AdminConfig;
  updateAdminConfig: (config: Partial<AdminConfig>) => void;
  hotels: Hotel[];
  setHotels: (hotels: Hotel[]) => void;
  quests: Quest[];
  setQuests: (quests: Quest[]) => void;
  events: Event[];
  setEvents: (events: Event[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      
      bookings: [],
      addBooking: (booking) => {
        set((state) => ({ bookings: [booking, ...state.bookings] }));
        const { user } = get();
        if (user) {
          set({
            user: { ...user, xp: user.xp + booking.xpEarned }
          });
        }
      },
      
      isAdmin: false,
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      
      adminConfig: DEFAULT_CONFIG,
      updateAdminConfig: (config) => {
        set((state) => ({
          adminConfig: { ...state.adminConfig, ...config }
        }));
      },
      
      hotels: defaultHotels,
      setHotels: (hotels) => set({ hotels }),
      
      quests: [],
      setQuests: (quests) => set({ quests }),
      
      events: [],
      setEvents: (events) => set({ events }),
    }),
    {
      name: 'travel-times-storage',
    }
  )
);
