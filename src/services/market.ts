import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { USE_MOCK } from "@/lib/constants";
import {
  mockMarkets,
  mockPrices,
  mockPriceTrend,
  mockNearbyMarkets,
  mockRecommendation,
} from "@/mock/data";
import type {
  Market,
  MarketPrice,
  PriceTrend,
  PriceComparison,
  SaleWindowRecommendation,
} from "@/types";

export const marketService = {
  async getMarkets(): Promise<Market[]> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from("markets").select("*");
      if (error) throw error;
      return data || [];
    }
    return mockMarkets;
  },

  async getMarketPrices(crop?: string, marketId?: string): Promise<MarketPrice[]> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      let query = supabase.from("market_prices").select("*, market:markets(*)");
      if (crop) query = query.eq("crop", crop);
      if (marketId) query = query.eq("market_id", marketId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
    let res = [...mockPrices];
    if (crop) res = res.filter((p) => p.crop.toLowerCase() === crop.toLowerCase());
    if (marketId) res = res.filter((p) => p.market.id === marketId);
    return res;
  },

  async getPriceTrend(crop: string, days = 14): Promise<PriceTrend[]> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("price_trends")
        .select("*")
        .eq("crop", crop)
        .order("date", { ascending: true })
        .limit(days);
      if (error) throw error;
      return data || [];
    }
    return mockPriceTrend;
  },

  async getNearbyComparisons(crop: string, district?: string): Promise<PriceComparison[]> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("price_comparisons")
        .select("*, market:markets(*)")
        .eq("crop", crop);
      if (error) throw error;
      return data || [];
    }
    return mockNearbyMarkets;
  },

  async getSaleWindowRecommendation(crop: string): Promise<SaleWindowRecommendation> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("recommendations")
        .select("*")
        .eq("crop", crop)
        .single();
      if (error) throw error;
      return data;
    }
    return {
      ...mockRecommendation,
      crop: crop || "Tomato",
    };
  },
};
