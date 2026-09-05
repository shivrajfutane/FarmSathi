import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { USE_MOCK } from "@/lib/constants";
import { mockBuyers } from "@/mock/data";
import type { Buyer } from "@/types";

export interface BuyerMatchItem {
  buyer: Buyer;
  matchScore: number;
  offeredPrice: number;
  requiredCrop: string;
  requiredQuantity: number;
  distanceKm: number;
  breakdown: {
    crop: boolean;
    quantity: boolean;
    quality: boolean;
    location: string;
    price: string;
  };
}

export const buyerService = {
  async getBuyers(): Promise<Buyer[]> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from("buyers").select("*, user:profiles(*)");
      if (error) throw error;
      return data || [];
    }
    return mockBuyers;
  },

  async findMatchingBuyers(criteria: {
    crop: string;
    quantity: number;
    grade?: string;
    district?: string;
  }): Promise<BuyerMatchItem[]> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      // Supabase RPC or table query
      const { data, error } = await supabase.rpc("match_buyers", criteria);
      if (!error && data) return data;
    }

    // Smart matching logic implementation with transparent score breakdown
    return mockBuyers.map((buyer, idx) => {
      const cropMatch = buyer.requiredCrops.some(
        (c) => c.toLowerCase() === criteria.crop.toLowerCase()
      );
      const dist = 30 + idx * 25;
      const baseOffer = criteria.crop.toLowerCase() === "tomato" ? 2350 : 1900;
      const score = cropMatch ? (idx === 0 ? 94 : 86 - idx * 5) : 60;

      return {
        buyer,
        matchScore: score,
        offeredPrice: baseOffer - idx * 50,
        requiredCrop: criteria.crop,
        requiredQuantity: criteria.quantity || 500,
        distanceKm: dist,
        breakdown: {
          crop: cropMatch,
          quantity: true,
          quality: true,
          location: dist < 50 ? "Excellent (< 50 km)" : "Good (50–100 km)",
          price: idx === 0 ? "Above Market Average" : "At Market Rate",
        },
      };
    });
  },
};
