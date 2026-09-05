import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { USE_MOCK } from "@/lib/constants";
import { mockLots } from "@/mock/data";
import type { ProduceLot } from "@/types";

let localLots: ProduceLot[] = [...mockLots];

export const lotsService = {
  async getLots(filters?: {
    crop?: string;
    grade?: string;
    district?: string;
    status?: string;
  }): Promise<ProduceLot[]> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      let query = supabase.from("produce_lots").select("*, farmer:farmers(*)");
      if (filters?.crop) query = query.eq("crop", filters.crop);
      if (filters?.grade) query = query.eq("grade", filters.grade);
      if (filters?.status) query = query.eq("status", filters.status);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    let results = [...localLots];
    if (filters?.crop) results = results.filter((l) => l.crop.toLowerCase().includes(filters.crop!.toLowerCase()));
    if (filters?.grade) results = results.filter((l) => l.grade === filters.grade);
    if (filters?.district) results = results.filter((l) => l.locationDistrict.toLowerCase().includes(filters.district!.toLowerCase()));
    if (filters?.status) results = results.filter((l) => l.status === filters.status);
    return results;
  },

  async getLotById(id: string): Promise<ProduceLot | null> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("produce_lots")
        .select("*, farmer:farmers(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    }
    return localLots.find((l) => l.id === id) || null;
  },

  async createLot(lotData: Omit<ProduceLot, "id" | "createdAt" | "expiresAt" | "status">): Promise<ProduceLot> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("produce_lots")
        .insert({
          ...lotData,
          status: "published",
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const newLot: ProduceLot = {
      ...lotData,
      id: `l_${Date.now()}`,
      status: "published",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 10 * 86400000).toISOString(),
    };
    localLots.unshift(newLot);
    return newLot;
  },

  async updateLotStatus(id: string, status: ProduceLot["status"]): Promise<ProduceLot> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("produce_lots")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const idx = localLots.findIndex((l) => l.id === id);
    if (idx !== -1) {
      localLots[idx].status = status;
      return localLots[idx];
    }
    throw new Error("Lot not found");
  },
};
