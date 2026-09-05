import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { USE_MOCK } from "@/lib/constants";
import { mockDisputes } from "@/mock/data";
import type { Dispute, DisputeStatus } from "@/types";

let localDisputes: Dispute[] = [...mockDisputes];

export const disputesService = {
  async getDisputes(userId?: string): Promise<Dispute[]> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      let query = supabase.from("disputes").select("*").order("created_at", { ascending: false });
      if (userId) query = query.eq("user_id", userId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
    return localDisputes;
  },

  async createDispute(disputeData: Omit<Dispute, "id" | "createdAt" | "updatedAt" | "status">): Promise<Dispute> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("disputes")
        .insert({ ...disputeData, status: "open", created_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const newDispute: Dispute = {
      ...disputeData,
      id: `d_${Date.now()}`,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localDisputes.unshift(newDispute);
    return newDispute;
  },

  async updateDisputeStatus(id: string, status: DisputeStatus, resolution?: string): Promise<Dispute> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("disputes")
        .update({ status, resolution, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const dispute = localDisputes.find((d) => d.id === id);
    if (dispute) {
      dispute.status = status;
      if (resolution) dispute.resolution = resolution;
      dispute.updatedAt = new Date().toISOString();
      return dispute;
    }
    throw new Error("Dispute not found");
  },
};
