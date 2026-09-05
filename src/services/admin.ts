import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { USE_MOCK } from "@/lib/constants";
import {
  mockAdminStats,
  mockFarmer,
  mockBuyer,
  mockAnalyticsTransactions,
  mockCropDemand,
} from "@/mock/data";
import type { AdminStats, VerificationStatus } from "@/types";

export interface PendingVerificationItem {
  id: string;
  userId: string;
  name: string;
  role: "farmer" | "fpo" | "buyer";
  entityName: string;
  state: string;
  district: string;
  documentType: string;
  documentNumber: string;
  status: VerificationStatus;
  submittedAt: string;
}

let mockPendingVerifications: PendingVerificationItem[] = [
  {
    id: "pv1",
    userId: "u1",
    name: mockFarmer.user.fullName,
    role: "farmer",
    entityName: mockFarmer.farmName,
    state: mockFarmer.state,
    district: mockFarmer.district,
    documentType: "Aadhaar Card + 7/12 Land Record",
    documentNumber: "XXXX-XXXX-4921",
    status: "pending",
    submittedAt: "2026-09-04T11:20:00Z",
  },
  {
    id: "pv2",
    userId: "u2",
    name: mockBuyer.user.fullName,
    role: "buyer",
    entityName: mockBuyer.companyName,
    state: mockBuyer.state,
    district: mockBuyer.district,
    documentType: "GST Certificate + FSSAI License",
    documentNumber: "27AAABC1234A1Z1",
    status: "under_review",
    submittedAt: "2026-09-03T14:45:00Z",
  },
  {
    id: "pv3",
    userId: "u7",
    name: "Suresh Patil",
    role: "fpo",
    entityName: "Sahyadri Farmers Producer Co.",
    state: "Maharashtra",
    district: "Nashik",
    documentType: "FPO Registration Certificate",
    documentNumber: "FPO/MH/2023/8892",
    status: "pending",
    submittedAt: "2026-09-05T08:15:00Z",
  },
];

export const adminService = {
  async getDashboardStats(): Promise<AdminStats> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      // Supabase analytics query / view
      const { data, error } = await supabase.from("admin_stats").select("*").single();
      if (!error && data) return data;
    }
    return mockAdminStats;
  },

  async getPendingVerifications(): Promise<PendingVerificationItem[]> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from("verifications").select("*");
      if (error) throw error;
      return data || [];
    }
    return mockPendingVerifications;
  },

  async updateVerification(id: string, status: VerificationStatus, remarks?: string): Promise<void> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      await supabase.from("verifications").update({ status, remarks }).eq("id", id);
      return;
    }
    const item = mockPendingVerifications.find((v) => v.id === id);
    if (item) {
      item.status = status;
    }
  },

  async getTransactionAnalytics() {
    return mockAnalyticsTransactions;
  },

  async getCropDemandAnalytics() {
    return mockCropDemand;
  },
};
