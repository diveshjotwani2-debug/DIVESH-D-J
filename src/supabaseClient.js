import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if credentials are empty, placeholders, or missing
export const isOfflineMode = !supabaseUrl || 
                             !supabaseAnonKey || 
                             supabaseUrl.includes('placeholder') || 
                             supabaseUrl.includes('PASTE_YOUR_') ||
                             supabaseAnonKey.includes('placeholder');

if (isOfflineMode) {
  console.warn(
    'Supabase credentials missing or invalid. Cockpit operating in secure offline fallback mode.'
  );
}

export const supabase = isOfflineMode 
  ? null 
  : createClient(supabaseUrl, supabaseAnonKey);
