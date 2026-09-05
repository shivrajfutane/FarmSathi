import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { USE_MOCK } from "@/lib/constants";
import { mockNotifications } from "@/mock/data";
import type { Notification } from "@/types";

let localNotifications: Notification[] = [...mockNotifications];

export const notificationsService = {
  async getNotifications(userId?: string): Promise<Notification[]> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      let query = supabase.from("notifications").select("*").order("created_at", { ascending: false });
      if (userId) query = query.eq("user_id", userId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
    return localNotifications;
  },

  async markAsRead(id: string): Promise<void> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      await supabase.from("notifications").update({ is_read: true }).eq("id", id);
      return;
    }
    const notif = localNotifications.find((n) => n.id === id);
    if (notif) notif.isRead = true;
  },

  async markAllAsRead(): Promise<void> {
    if (!USE_MOCK && isSupabaseConfigured() && supabase) {
      await supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
      return;
    }
    localNotifications.forEach((n) => (n.isRead = true));
  },
};
