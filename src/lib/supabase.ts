import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./constants";

// Check if valid supabase URL is provided (not the placeholder)
const isValidUrl =
  SUPABASE_URL &&
  !SUPABASE_URL.includes("your-project-ref") &&
  SUPABASE_URL.startsWith("http");

export const supabase = isValidUrl
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};
