import { createClient } from "@supabase/supabase-js";

// These are public client credentials only. Never place a service-role key in a mobile app.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://vtmfbsipbqmkodiiwdrg.supabase.co";
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_5d11dhnctO7BmjCWqgUjDA_fpw07Lc_";

export const supabase = createClient(url, key);
