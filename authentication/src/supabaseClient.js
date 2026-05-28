import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are valid and not the default placeholders
const isConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your-supabase-project-url' && 
  supabaseAnonKey !== 'your-supabase-anon-key' &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== '';

export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const checkSupabaseConnection = () => {
  return {
    isConfigured,
    supabaseUrl,
    supabaseAnonKey,
  };
};
