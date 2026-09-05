import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { USE_MOCK } from "@/lib/constants";
import { mockOrder, mockLogistics, mockOffers } from "@/mock/data";
import type { Order, Logistics, OrderStatus } from "@/types";

let localOrder: Order = { ...mockOrder, offer: mockOffers[0], logistics: mockLogistics };
let localLogistics: Logistics = { ...mockLogistics };

export const ordersService = {
  async getOrders(): Promise<Order[]> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from("orders").select("*, offer:offers(*), logistics(*), payment(*)");
      if (error) throw error;
      return data || [];
    }
    return [localOrder];
  },

  async getOrderById(id: string): Promise<Order | null> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("orders")
        .select("*, offer:offers(*), logistics(*), payment(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    }
    return localOrder.id === id ? localOrder : null;
  },

  async getLogisticsByOrderId(orderId: string): Promise<Logistics | null> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from("logistics").select("*").eq("order_id", orderId).single();
      if (error) throw error;
      return data;
    }
    return localLogistics;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", orderId).select().single();
      if (error) throw error;
      return data;
    }
    localOrder.status = status;
    localLogistics.currentStatus = status;
    localLogistics.trackingEvents.push({
      status,
      timestamp: new Date().toISOString(),
      note: `Status updated to ${status.replace(/_/g, " ")}`,
    });
    return localOrder;
  },
};
