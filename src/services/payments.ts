import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { USE_MOCK } from "@/lib/constants";
import { mockPayment } from "@/mock/data";
import type { Payment, PaymentStatus } from "@/types";

let localPayment: Payment = { ...mockPayment };

export const paymentsService = {
  async getPayments(): Promise<Payment[]> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from("payments").select("*");
      if (error) throw error;
      return data || [];
    }
    return [localPayment];
  },

  async getPaymentByOrderId(orderId: string): Promise<Payment | null> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from("payments").select("*").eq("order_id", orderId).single();
      if (error) throw error;
      return data;
    }
    return localPayment.orderId === orderId ? localPayment : null;
  },

  async releasePayment(paymentId: string): Promise<Payment> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("payments")
        .update({ status: "paid", paid_at: new Date().toISOString(), utr_number: `UTR${Date.now()}` })
        .eq("id", paymentId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    localPayment.status = "paid";
    localPayment.paidAt = new Date().toISOString();
    localPayment.utrNumber = `UTR${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    return localPayment;
  },
};
