import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { USE_MOCK } from "@/lib/constants";
import { mockOffers } from "@/mock/data";
import type { Offer, OfferStatus } from "@/types";

let localOffers: Offer[] = [...mockOffers];

export const offersService = {
  async getOffers(filters?: { farmerId?: string; buyerId?: string; lotId?: string; status?: OfferStatus }): Promise<Offer[]> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      let query = supabase.from("offers").select("*, lot:produce_lots(*), buyer:buyers(*)");
      if (filters?.farmerId) query = query.eq("farmer_id", filters.farmerId);
      if (filters?.buyerId) query = query.eq("buyer_id", filters.buyerId);
      if (filters?.lotId) query = query.eq("lot_id", filters.lotId);
      if (filters?.status) query = query.eq("status", filters.status);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    let results = [...localOffers];
    if (filters?.status) results = results.filter((o) => o.status === filters.status);
    if (filters?.lotId) results = results.filter((o) => o.lotId === filters.lotId);
    return results;
  },

  async createOffer(offerData: Omit<Offer, "id" | "createdAt" | "updatedAt" | "status">): Promise<Offer> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("offers")
        .insert({ ...offerData, status: "pending", created_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const newOffer: Offer = {
      ...offerData,
      id: `o_${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      matchScore: 90,
      matchDetails: {
        crop: true,
        quantity: true,
        quality: true,
        location: "good",
        price: "excellent",
        overall: 90,
      },
    };
    localOffers.unshift(newOffer);
    return newOffer;
  },

  async respondToOffer(offerId: string, action: "accept" | "reject" | "counter", counterPrice?: number): Promise<Offer> {
    const newStatus: OfferStatus = action === "accept" ? "accepted" : action === "reject" ? "rejected" : "countered";
    
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const updatePayload: Record<string, unknown> = { status: newStatus, updated_at: new Date().toISOString() };
      if (counterPrice) updatePayload.offered_price = counterPrice;
      const { data, error } = await supabase
        .from("offers")
        .update(updatePayload)
        .eq("id", offerId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const idx = localOffers.findIndex((o) => o.id === offerId);
    if (idx !== -1) {
      localOffers[idx].status = newStatus;
      if (counterPrice) localOffers[idx].offeredPrice = counterPrice;
      localOffers[idx].updatedAt = new Date().toISOString();
      return localOffers[idx];
    }
    throw new Error("Offer not found");
  },
};
